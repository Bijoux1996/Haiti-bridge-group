import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { usePropertyList } from "../helpers/usePropertyList";
import { PropertyCard } from "../components/PropertyCard";
import { Input } from "../components/Input";
import { Button } from "../components/Button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/Select";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "../components/Pagination";
import { Skeleton } from "../components/Skeleton";
import { useScrollReveal } from "../helpers/useScrollReveal";
import { useAuth } from "../helpers/useAuth";
import { useCheckFavorites, useToggleFavorite } from "../helpers/useFavorites";
import styles from "./properties.module.css";

export default function PropertiesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const observeReveal = useScrollReveal();

  const [filters, setFilters] = useState({
    category: searchParams.get("category") || "__empty",
    city: searchParams.get("city") || "",
    minPrice: searchParams.get("minPrice") || "",
    maxPrice: searchParams.get("maxPrice") || "",
    bedrooms: searchParams.get("bedrooms") || "__empty"
  });

  useEffect(() => {
    setFilters({
      category: searchParams.get("category") || "__empty",
      city: searchParams.get("city") || "",
      minPrice: searchParams.get("minPrice") || "",
      maxPrice: searchParams.get("maxPrice") || "",
      bedrooms: searchParams.get("bedrooms") || "__empty"
    });
  }, [searchParams]);

  const queryParams: Record<string, any> = { page: Number(searchParams.get("page")) || 1 };
  if (searchParams.get("category")) queryParams.category = searchParams.get("category");
  if (searchParams.get("city")) queryParams.city = searchParams.get("city");
  if (searchParams.get("minPrice")) queryParams.minPrice = Number(searchParams.get("minPrice"));
  if (searchParams.get("maxPrice")) queryParams.maxPrice = Number(searchParams.get("maxPrice"));
  if (searchParams.get("bedrooms")) queryParams.bedrooms = Number(searchParams.get("bedrooms"));

  const { data, isLoading } = usePropertyList(queryParams as any);

  const propertyIds = data?.properties.map((p) => p.id) || [];
  const { data: favoritedSet = new Set<number>() } = useCheckFavorites(propertyIds);
  const toggleMutation = useToggleFavorite();
  const { authState } = useAuth();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const newParams = new URLSearchParams();
    if (filters.category !== "__empty") newParams.set("category", filters.category);
    if (filters.city) newParams.set("city", filters.city);
    if (filters.minPrice) newParams.set("minPrice", filters.minPrice);
    if (filters.maxPrice) newParams.set("maxPrice", filters.maxPrice);
    if (filters.bedrooms !== "__empty") newParams.set("bedrooms", filters.bedrooms);
    setSearchParams(newParams);
  };

  const handlePageChange = (newPage: number) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set("page", String(newPage));
    setSearchParams(newParams);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderPagination = () => {
    if (!data || data.totalPages <= 1) return null;
    const page = data.page;
    const total = data.totalPages;

    return (
      <Pagination className={styles.pagination}>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious 
              onClick={() => handlePageChange(Math.max(1, page - 1))}
              style={{ pointerEvents: page === 1 ? 'none' : 'auto', opacity: page === 1 ? 0.5 : 1 }}
            />
          </PaginationItem>
          {Array.from({ length: total }, (_, i) => i + 1).map(p => (
            <PaginationItem key={p}>
              <PaginationLink isActive={p === page} onClick={() => handlePageChange(p)}>
                {p}
              </PaginationLink>
            </PaginationItem>
          ))}
          <PaginationItem>
            <PaginationNext 
              onClick={() => handlePageChange(Math.min(total, page + 1))}
              style={{ pointerEvents: page === total ? 'none' : 'auto', opacity: page === total ? 0.5 : 1 }}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    );
  };

  return (
    <div className={styles.container}>
      <aside className={styles.sidebar}>
        <form className={styles.filterForm} onSubmit={handleSearch}>
          <h2 className={styles.filterTitle}>Filtres</h2>
          
          <div className={styles.filterGroup}>
            <label>Catégorie</label>
            <Select value={filters.category} onValueChange={v => setFilters(f => ({ ...f, category: v }))}>
               <SelectTrigger>
                 <SelectValue placeholder="Toutes catégories" />
               </SelectTrigger>
               <SelectContent>
                 <SelectItem value="__empty">Toutes catégories</SelectItem>
                 <SelectItem value="house_sale">Maison à vendre</SelectItem>
                 <SelectItem value="house_rent">Maison à louer</SelectItem>
                 <SelectItem value="apartment">Appartement</SelectItem>
                 <SelectItem value="land_sale">Terrain</SelectItem>
                 <SelectItem value="commercial">Commercial</SelectItem>
               </SelectContent>
            </Select>
          </div>
          
          <div className={styles.filterGroup}>
            <label>Ville</label>
            <Input value={filters.city} onChange={e => setFilters(f => ({ ...f, city: e.target.value }))} placeholder="Ex: Pétion-Ville" />
          </div>
          
          <div className={styles.filterGroup}>
            <label>Prix Min ($)</label>
            <Input type="number" min="0" value={filters.minPrice} onChange={e => setFilters(f => ({ ...f, minPrice: e.target.value }))} placeholder="0" />
          </div>
          
          <div className={styles.filterGroup}>
            <label>Prix Max ($)</label>
            <Input type="number" min="0" value={filters.maxPrice} onChange={e => setFilters(f => ({ ...f, maxPrice: e.target.value }))} placeholder="Illimité" />
          </div>
          
          <div className={styles.filterGroup}>
            <label>Chambres</label>
            <Select value={filters.bedrooms} onValueChange={v => setFilters(f => ({ ...f, bedrooms: v }))}>
               <SelectTrigger>
                 <SelectValue placeholder="Peu importe" />
               </SelectTrigger>
               <SelectContent>
                 <SelectItem value="__empty">Peu importe</SelectItem>
                 <SelectItem value="1">1+</SelectItem>
                 <SelectItem value="2">2+</SelectItem>
                 <SelectItem value="3">3+</SelectItem>
                 <SelectItem value="4">4+</SelectItem>
                 <SelectItem value="5">5+</SelectItem>
               </SelectContent>
            </Select>
          </div>
          
          <Button type="submit" className={styles.filterBtn}>Appliquer les filtres</Button>
          
          <Button 
            type="button" 
            variant="ghost" 
            className={styles.resetBtn} 
            onClick={() => { 
              setFilters({ category: "__empty", city: "", minPrice: "", maxPrice: "", bedrooms: "__empty" }); 
              setSearchParams(new URLSearchParams()); 
            }}
          >
            Réinitialiser
          </Button>
        </form>
      </aside>

      <div className={styles.mainContent}>
        <div className={styles.resultsHeader}>
          <h1 className={styles.pageTitle}>Propriétés</h1>
          {data && <p className={styles.resultCount}>{data.totalCount} résultats trouvés</p>}
        </div>

        {isLoading ? (
          <div className={styles.grid}>
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className={styles.skeletonCard} />
            ))}
          </div>
        ) : data?.properties.length === 0 ? (
          <div className={styles.emptyState}>
            <h3>Aucun résultat trouvé</h3>
            <p>Essayez de modifier vos critères de recherche pour trouver la propriété idéale.</p>
          </div>
        ) : (
          <>
            <div className={styles.grid}>
              {data?.properties.map((prop, i) => (
                <div 
                  key={prop.id} 
                  ref={observeReveal}
                  className={styles.revealCard}
                  style={{ transitionDelay: `${(i % 6) * 80}ms` }}
                >
                  <PropertyCard 
                    property={prop}
                    isFavorited={favoritedSet.has(prop.id)}
                    onToggleFavorite={
                      authState.type === "authenticated"
                        ? () => toggleMutation.mutate({ propertyId: prop.id })
                        : undefined
                    }
                  />
                </div>
              ))}
            </div>
            {renderPagination()}
          </>
        )}
      </div>
    </div>
  );
}
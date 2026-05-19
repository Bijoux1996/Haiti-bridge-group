import React from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Heart } from "lucide-react";
import { useFavoritesList, useToggleFavorite } from "../helpers/useFavorites";
import { PropertyCard } from "../components/PropertyCard";
import { FavoriteButton } from "../components/FavoriteButton";
import { Button } from "../components/Button";
import { Skeleton } from "../components/Skeleton";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../components/Pagination";
import styles from "./favorites.module.css";

export default function FavoritesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const pageParam = Number(searchParams.get("page")) || 1;

  const { data, isLoading } = useFavoritesList({ page: pageParam, limit: 12 });
  const { mutate: toggleFavorite } = useToggleFavorite();

  const handlePageChange = (newPage: number) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set("page", String(newPage));
    setSearchParams(newParams);
    window.scrollTo({ top: 0, behavior: "smooth" });
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
              style={{
                pointerEvents: page === 1 ? "none" : "auto",
                opacity: page === 1 ? 0.5 : 1,
              }}
            />
          </PaginationItem>
          {Array.from({ length: total }, (_, i) => i + 1).map((p) => (
            <PaginationItem key={p}>
              <PaginationLink
                isActive={p === page}
                onClick={() => handlePageChange(p)}
              >
                {p}
              </PaginationLink>
            </PaginationItem>
          ))}
          <PaginationItem>
            <PaginationNext
              onClick={() => handlePageChange(Math.min(total, page + 1))}
              style={{
                pointerEvents: page === total ? "none" : "auto",
                opacity: page === total ? 0.5 : 1,
              }}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    );
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>
          ❤️ Mes Favoris
        </h1>
        <p className={styles.subtitle}>Vos propriétés sauvegardées</p>
      </div>

      {isLoading ? (
        <div className={styles.grid}>
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className={styles.skeletonCard} />
          ))}
        </div>
      ) : data?.properties.length === 0 ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyIconWrapper}>
            <Heart size={48} className={styles.emptyIcon} />
          </div>
          <h3 className={styles.emptyTitle}>
            Vous n'avez pas encore de favoris
          </h3>
          <p className={styles.emptyText}>
            Parcourez nos listes et sauvegardez les propriétés qui vous intéressent pour y revenir plus tard.
          </p>
          <Button asChild className={styles.emptyButton}>
            <Link to="/properties">Découvrir des propriétés</Link>
          </Button>
        </div>
      ) : (
        <>
          <div className={styles.grid}>
            {data?.properties.map((property) => (
              <div key={property.id} className={styles.cardWrapper}>
                <PropertyCard property={property} />
                <FavoriteButton
                  propertyId={property.id}
                  isFavorited={true}
                  onToggle={() => toggleFavorite({ propertyId: property.id })}
                  className={styles.favoriteButton}
                />
              </div>
            ))}
          </div>
          {renderPagination()}
        </>
      )}
    </div>
  );
}
import React from "react";
import { useParams, Link } from "react-router-dom";
import { usePropertyDetail } from "../helpers/usePropertyDetail";
import { MapPin, Bed, Bath, Square, Phone, ArrowLeft, User } from "lucide-react";
import { Badge } from "../components/Badge";
import { Button } from "../components/Button";
import { Skeleton } from "../components/Skeleton";
import { PropertyGallery } from "../components/PropertyGallery";
import { WhatsAppButton } from "../components/WhatsAppButton";
import { AppointmentBookingForm } from "../components/AppointmentBookingForm";
import { FavoriteButton } from "../components/FavoriteButton";
import { useCheckFavorites, useToggleFavorite } from "../helpers/useFavorites";
import { useAuth } from "../helpers/useAuth";
import { AgentReviews } from "../components/AgentReviews";
import { ReportListingDialog } from "../components/ReportListingDialog";
import styles from "./properties.$propertyId.module.css";

const categoryLabels: Record<string, string> = {
  apartment: "Appartement",
  commercial: "Commercial",
  house_rent: "À Louer",
  house_sale: "À Vendre",
  land_sale: "Terrain"
};

export default function PropertyDetail() {
  const { propertyId } = useParams();
  const { data: property, isLoading, error } = usePropertyDetail({ id: Number(propertyId) }, { enabled: !!propertyId });
  const { authState } = useAuth();
  
  const propertyIds = property ? [property.id] : [];
  const { data: favoritesSet } = useCheckFavorites(propertyIds);
  const isFavorited = property ? (favoritesSet?.has(property.id) ?? false) : false;

  const toggleFavoriteMutation = useToggleFavorite();
  
  const handleToggleFavorite = () => {
    if (property) {
      toggleFavoriteMutation.mutate({ propertyId: property.id });
    }
  };

  if (isLoading) {
    return (
      <div className={styles.container}>
        <Skeleton className={styles.skeletonHeader} />
        <Skeleton className={styles.skeletonGallery} />
        <div className={styles.contentGrid}>
          <Skeleton className={styles.skeletonMain} />
          <Skeleton className={styles.skeletonSidebar} />
        </div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className={styles.errorContainer}>
        <h2>Propriété non trouvée</h2>
        <p>La propriété que vous recherchez n'existe pas ou n'est plus disponible.</p>
        <Button asChild><Link to="/properties">Retour aux annonces</Link></Button>
      </div>
    );
  }

  const priceFormatted = new Intl.NumberFormat('fr-HT', { 
    style: 'currency', 
    currency: 'USD', 
    maximumFractionDigits: 0 
  }).format(Number(property.price));

  return (
    <div className={styles.container}>
      <Link to="/properties" className={styles.backLink}>
        <ArrowLeft size={16} /> Retour aux résultats
      </Link>
      
      <div className={styles.header}>
        <div className={styles.headerLeft}>
           <div className={styles.badges}>
             {property.isFeatured && <Badge variant="secondary">Populaire</Badge>}
             <Badge variant="primary">{categoryLabels[property.category] || property.category}</Badge>
           </div>
           <h1 className={styles.title}>{property.title}</h1>
           <p className={styles.location}>
             <MapPin size={18} /> 
             {property.address ? `${property.address}, ` : ""}{property.city}
           </p>
        </div>
        <div className={styles.headerRight}>
           <div className={styles.price}>{priceFormatted}</div>
           {property && (
             <FavoriteButton
               propertyId={property.id}
               isFavorited={isFavorited}
               onToggle={handleToggleFavorite}
               size="md"
             />
           )}
        </div>
      </div>

      <PropertyGallery images={property.images} />

      <div className={styles.contentGrid}>
        <div className={styles.mainContent}>
          <div className={styles.features}>
            {property.bedrooms != null && (
              <div className={styles.featureItem}>
                <Bed size={24} />
                <div className={styles.featureText}>
                  <span className={styles.featureValue}>{property.bedrooms}</span>
                  <span className={styles.featureLabel}>Chambres</span>
                </div>
              </div>
            )}
            {property.bathrooms != null && (
              <div className={styles.featureItem}>
                <Bath size={24} />
                <div className={styles.featureText}>
                  <span className={styles.featureValue}>{property.bathrooms}</span>
                  <span className={styles.featureLabel}>Salles de bain</span>
                </div>
              </div>
            )}
            {property.areaSqft != null && (
              <div className={styles.featureItem}>
                <Square size={24} />
                <div className={styles.featureText}>
                  <span className={styles.featureValue}>{property.areaSqft} m²</span>
                  <span className={styles.featureLabel}>Surface</span>
                </div>
              </div>
            )}
          </div>

          <div className={styles.section}>
            <h2>Description</h2>
            <div className={styles.description}>
              {property.description ? (
                property.description.split('\n').map((paragraph, i) => <p key={i}>{paragraph}</p>)
              ) : (
                <p>Aucune description disponible.</p>
              )}
            </div>
          </div>
          
          {property.agentId && (
            <div className={`${styles.section} ${styles.reviewsSection}`}>
              <AgentReviews 
                agentId={property.agentId}
                agentName={property.agent?.displayName || "Agent"}
                propertyId={property.id}
              />
            </div>
          )}

          <div className={styles.reportSection}>
            <ReportListingDialog propertyId={property.id} propertyTitle={property.title} />
          </div>
        </div>

        <div className={styles.sidebar}>
          <div className={styles.contactCard}>
            <h3>Contacter l'agent</h3>
            <div className={styles.agentInfo}>
              {property.agent?.avatarUrl ? (
                <img src={property.agent.avatarUrl} alt={property.agent.displayName} className={styles.agentAvatar} />
              ) : (
                <div className={styles.agentAvatarPlaceholder}><User size={24} /></div>
              )}
              <div className={styles.agentDetails}>
                <span className={styles.agentName}>{property.agent?.displayName || "Agent"}</span>
                <span className={styles.agentRole}>Agent Immobilier</span>
              </div>
            </div>

            <div className={styles.contactActions}>
              {property.phone && (
                <Button variant="outline" className={styles.actionButton} asChild>
                  <a href={`tel:${property.phone}`}><Phone size={16} /> Appeler</a>
                </Button>
              )}
              {property.whatsapp && (
                <WhatsAppButton
                  className={styles.actionButton}
                  phone={property.whatsapp}
                  propertyId={property.id}
                  agentId={property.agentId || 0}
                  propertyTitle={property.title}
                  propertyPrice={property.price}
                  propertyCity={property.city}
                  variant="full"
                />
              )}
              {!property.phone && !property.whatsapp && (
                <p className={styles.noContact}>Aucun moyen de contact disponible.</p>
              )}
            </div>
          </div>
          
          <AppointmentBookingForm 
            propertyId={property.id} 
            agentName={property.agent?.displayName || "Agent"} 
          />
        </div>
      </div>
    </div>
  );
}
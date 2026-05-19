import React from "react";
import { useParams, Link } from "react-router-dom";
import { useAgentProfile } from "../helpers/useAgentProfile";
import { Avatar, AvatarImage, AvatarFallback } from "../components/Avatar";
import { Badge } from "../components/Badge";
import { Button } from "../components/Button";
import { Skeleton } from "../components/Skeleton";
import { 
  BadgeCheck, 
  Phone, 
  Mail, 
  Star, 
  MapPin, 
  BedDouble, 
  Bath, 
  Square, 
  Facebook, 
  Link as LinkIcon, 
  MessageCircle,
  Home
} from "lucide-react";
import { toast } from "sonner";
import styles from "./agent.$agentSlug.module.css";

const CATEGORY_LABELS: Record<string, string> = {
  apartment: "Appartement",
  commercial: "Commercial",
  house_rent: "Maison à louer",
  house_sale: "Maison à vendre",
  land_sale: "Terrain"
};

export default function AgentProfilePage() {
  const { agentSlug } = useParams<{ agentSlug: string }>();
  
  const { data, isLoading, isError } = useAgentProfile(agentSlug || "");

  if (isLoading) {
    return <AgentProfileSkeleton />;
  }

  if (isError || !data) {
    return (
      <div className={styles.container}>
        <div className={styles.notFound}>
          <h1 className={styles.notFoundTitle}>Agent introuvable</h1>
          <p className={styles.notFoundText}>Nous n'avons pas pu trouver le profil de cet agent.</p>
          <Button asChild size="lg">
            <Link to="/properties">Parcourir les propriétés</Link>
          </Button>
        </div>
      </div>
    );
  }

  const { agent, properties, stats } = data;

  const initials = agent.displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Lien copié !");
  };

  const currentUrl = encodeURIComponent(window.location.href);
  const shareMessage = encodeURIComponent(`Découvrez le profil de ${agent.displayName} sur Haiti Bridge Group !`);

  return (
    <div className={styles.container}>
      <header className={styles.profileHeader}>
        <Avatar className={styles.avatar}>
          {agent.avatarUrl ? <AvatarImage src={agent.avatarUrl} alt={agent.displayName} /> : null}
          <AvatarFallback className={styles.avatarFallback}>{initials}</AvatarFallback>
        </Avatar>
        
        <div className={styles.info}>
          <div className={styles.nameRow}>
            <h1 className={styles.name}>{agent.displayName}</h1>
            {agent.verificationStatus === "verified" && (
              <BadgeCheck className={styles.verifiedBadge} size={32} />
            )}
          </div>
          
          <div className={styles.statsRow}>
            <div className={styles.statItem}>
              <Home size={18} />
              <span>{stats.totalProperties} propriétés</span>
            </div>
            {stats.totalReviews > 0 && (
              <div className={styles.statItem}>
                <Star className={styles.starIcon} size={18} />
                <span>{stats.averageRating ? stats.averageRating.toFixed(1) : "0"} ({stats.totalReviews} avis)</span>
              </div>
            )}
          </div>
          
          {agent.bio && <p className={styles.bio}>{agent.bio}</p>}
          
          <div className={styles.contactActions}>
            {agent.phone && (
              <Button variant="outline" asChild>
                <a href={`tel:${agent.phone}`}>
                  <Phone size={18} />
                  {agent.phone}
                </a>
              </Button>
            )}
            
            {agent.whatsapp && (
              <Button className={styles.whatsappButton} asChild>
                <a href={`https://wa.me/${agent.whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer">
                  <MessageCircle size={18} />
                  WhatsApp
                </a>
              </Button>
            )}
            
            {agent.email && (
              <Button variant="outline" asChild>
                <a href={`mailto:${agent.email}`}>
                  <Mail size={18} />
                  Email
                </a>
              </Button>
            )}
          </div>
        </div>
      </header>

      <section>
        <h2 className={styles.sectionTitle}>Propriétés disponibles</h2>
        {properties.length > 0 ? (
          <div className={styles.propertiesGrid}>
            {properties.map((prop) => (
              <Link key={prop.id} to={`/properties/${prop.id}`} className={styles.propertyCard}>
                <div className={styles.propertyImageContainer}>
                  {prop.imageUrl ? (
                    <img src={prop.imageUrl} alt={prop.title} className={styles.propertyImage} />
                  ) : (
                    <div className={styles.placeholderImage}>
                      <Home size={48} className={styles.placeholderIcon} />
                    </div>
                  )}
                  <Badge className={styles.propertyBadge} variant="secondary">
                    {CATEGORY_LABELS[prop.category] || prop.category}
                  </Badge>
                </div>
                
                <div className={styles.propertyContent}>
                  <h3 className={styles.propertyPrice}>
                    {new Intl.NumberFormat("fr-HT", { style: "currency", currency: "HTG", maximumFractionDigits: 0 }).format(Number(prop.price))}
                  </h3>
                  <h4 className={styles.propertyTitle}>{prop.title}</h4>
                  <div className={styles.propertyLocation}>
                    <MapPin size={16} />
                    {prop.city}
                  </div>
                  
                  <div className={styles.propertySpecs}>
                    {prop.bedrooms != null && (
                      <div className={styles.specItem}>
                        <BedDouble size={16} />
                        {prop.bedrooms}
                      </div>
                    )}
                    {prop.bathrooms != null && (
                      <div className={styles.specItem}>
                        <Bath size={16} />
                        {prop.bathrooms}
                      </div>
                    )}
                    {prop.areaSqft != null && (
                      <div className={styles.specItem}>
                        <Square size={16} />
                        {prop.areaSqft} m²
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className={styles.emptyState}>Cet agent n'a actuellement aucune propriété disponible.</p>
        )}
      </section>

      <section className={styles.socialSection}>
        <h2 className={styles.sectionTitle}>Partagez ce profil</h2>
        <div className={styles.socialButtons}>
          <Button variant="outline" asChild>
            <a href={`https://www.facebook.com/sharer/sharer.php?u=${currentUrl}`} target="_blank" rel="noopener noreferrer">
              <Facebook size={18} />
              Facebook
            </a>
          </Button>
          <Button variant="outline" asChild>
            <a href={`https://wa.me/?text=${shareMessage}%20${currentUrl}`} target="_blank" rel="noopener noreferrer">
              <MessageCircle size={18} />
              WhatsApp
            </a>
          </Button>
          <Button variant="outline" onClick={handleCopyLink}>
            <LinkIcon size={18} />
            Copier le lien
          </Button>
        </div>
      </section>
    </div>
  );
}

function AgentProfileSkeleton() {
  return (
    <div className={styles.container}>
      <header className={styles.profileHeader}>
        <Skeleton className={styles.avatar} style={{ borderRadius: 'var(--radius-full)' }} />
        <div className={styles.info} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
          <Skeleton style={{ height: '3rem', width: '300px' }} />
          <Skeleton style={{ height: '1.5rem', width: '200px' }} />
          <Skeleton style={{ height: '4rem', width: '100%' }} />
          <div style={{ display: 'flex', gap: 'var(--spacing-4)' }}>
            <Skeleton style={{ height: '2.5rem', width: '120px' }} />
            <Skeleton style={{ height: '2.5rem', width: '120px' }} />
          </div>
        </div>
      </header>
      <section>
        <Skeleton style={{ height: '2.5rem', width: '250px', marginBottom: 'var(--spacing-6)' }} />
        <div className={styles.propertiesGrid}>
          {[1, 2, 3].map(i => (
            <Skeleton key={i} style={{ height: '350px', borderRadius: 'var(--radius-md)' }} />
          ))}
        </div>
      </section>
    </div>
  );
}
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../helpers/useAuth";
import { Button } from "../components/Button";
import { ShieldCheck, Zap, MessageCircle, Phone, Mail } from "lucide-react";
import styles from "./_index.module.css";

export default function LandingPage() {
  const { authState, logout } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className={styles.page}>
      <header className={`${styles.header} ${isScrolled ? styles.headerScrolled : ""}`}>
        <div className={styles.headerContainer}>
          <Link to="/" className={styles.logo}>
            Haiti<span>Bridge</span> Group
          </Link>
          
          <div className={styles.authButtons}>
            {authState.type === "authenticated" ? (
              <div className={styles.userMenu}>
                
                {(authState.user.role === "agent" || authState.user.role === "admin") && (
                  <Button variant={isScrolled ? "outline" : "ghost"} className={!isScrolled ? styles.whiteBtn : ""} size="sm" asChild>
                    <Link to="/dashboard">Tableau de Bord</Link>
                  </Button>
                )}
                <Button variant={isScrolled ? "ghost" : "ghost"} className={!isScrolled ? styles.whiteBtn : ""} size="sm" onClick={() => logout()}>
                  Déconnexion
                </Button>
              </div>
            ) : authState.type !== "loading" ? (
              <div className={styles.guestMenu}>
                <Button asChild variant={isScrolled ? "primary" : "outline"} className={!isScrolled ? styles.whiteOutlineBtn : ""} size="sm">
                  <Link to="/login">S'inscrire</Link>
                </Button>
              </div>
            ) : null}
          </div>
        </div>
      </header>

      <main className={styles.main}>
        {/* Hero Section */}
        <section className={styles.heroSection}>
          <div className={styles.heroBackground}></div>
          <div className={styles.heroOverlay}></div>
          <div className={styles.heroContent}>
            <h1 className={styles.heroTitle}>Trouvez la Propriété de Vos Rêves en Haïti</h1>
            <p className={styles.heroSubtitle}>La plateforme immobilière de référence en Haïti</p>
            
            <div className={styles.heroActions}>
              {authState.type === "authenticated" ? (
                <>
                  <Button variant="outline" size="lg" className={styles.heroOutlineBtn} asChild>
                    <Link to="/properties">Voir les Propriétés</Link>
                  </Button>
                  {(authState.user.role === "agent" || authState.user.role === "admin") && (
                    <Button size="lg" asChild>
                      <Link to="/dashboard">Tableau de Bord</Link>
                    </Button>
                  )}
                </>
              ) : (
                <Button variant="outline" size="lg" className={styles.heroOutlineBtn} asChild>
                  <Link to="/login">S'inscrire Gratuitement</Link>
                </Button>
              )}
            </div>
          </div>
        </section>

        {/* Why Choose Us Section */}
        <section className={styles.whyUsSection}>
          <div className={styles.container}>
            <h2 className={styles.sectionTitle}>Pourquoi Haiti Bridge Group ?</h2>
            <div className={styles.featuresGrid}>
              <div className={styles.featureCard}>
                <div className={styles.featureIcon}><ShieldCheck size={40} /></div>
                <h3>Agents Vérifiés</h3>
                <p>Tous nos agents sont vérifiés pour votre sécurité</p>
              </div>
              <div className={styles.featureCard}>
                <div className={styles.featureIcon}><Zap size={40} /></div>
                <h3>Recherche Facile</h3>
                <p>Trouvez rapidement la propriété idéale</p>
              </div>
              <div className={styles.featureCard}>
                <div className={styles.featureIcon}><MessageCircle size={40} /></div>
                <h3>Support WhatsApp</h3>
                <p>Contactez les agents directement via WhatsApp</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className={styles.ctaSection}>
          <div className={styles.ctaBackground}></div>
          <div className={styles.ctaOverlay}></div>
          <div className={styles.ctaContent}>
            {authState.type === "authenticated" ? (
              (authState.user.role === "agent" || authState.user.role === "admin") ? (
                <>
                  <h2>Gérez vos annonces</h2>
                  <p>Accédez à votre tableau de bord pour ajouter de nouvelles propriétés ou suivre vos demandes.</p>
                  <Button size="lg" className={styles.ctaButton} asChild>
                    <Link to="/dashboard">Tableau de Bord</Link>
                  </Button>
                </>
              ) : (
                <>
                  <h2>Prêt à trouver votre propriété idéale ?</h2>
                  <p>Explorez notre vaste catalogue de propriétés à travers tout Haïti et trouvez celle qui vous correspond.</p>
                  <Button size="lg" className={styles.ctaButton} asChild>
                    <Link to="/properties">Voir les Propriétés</Link>
                  </Button>
                </>
              )
            ) : (
              <>
                <h2>Vous êtes agent immobilier ?</h2>
                <p>Inscrivez-vous gratuitement et publiez vos propriétés pour toucher plus de clients.</p>
                <Button size="lg" className={styles.ctaButton} asChild>
                  <Link to="/login">Créer un Compte Agent</Link>
                </Button>
              </>
            )}
          </div>
        </section>
      </main>

      <footer className={styles.footer}>
        <div className={styles.footerContainer}>
          <div className={styles.footerBrand}>
            <div className={styles.footerLogo}>
              Haiti<span>Bridge</span> Group
            </div>
            <p>La plateforme immobilière de référence en Haïti</p>
            <div className={styles.footerContact}>
              <a href="tel:+50934731511" className={styles.contactLink}>
                <Phone size={16} />
                +509 3473-1511
              </a>
              <a href="mailto:Haitibridgegroup@gmail.com" className={styles.contactLink}>
                <Mail size={16} />
                Haitibridgegroup@gmail.com
              </a>
            </div>
          </div>
          <div className={styles.footerBottom}>
            <p>© {new Date().getFullYear()} Haiti Bridge Group. Tous droits réservés.</p>
            <p>Port-au-Prince, Haïti</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
import React, { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../components/Tabs";
import { DashboardProperties } from "../components/DashboardProperties";
import { DashboardAddProperty } from "../components/DashboardAddProperty";
import { DashboardProfile } from "../components/DashboardProfile";
import { DashboardAppointments } from "../components/DashboardAppointments";
import { Home, Plus, User, CreditCard, CalendarDays } from "lucide-react";
import { useMySubscription } from "../helpers/useSubscription";
import { Badge } from "../components/Badge";
import { Button } from "../components/Button";
import { Skeleton } from "../components/Skeleton";
import { Link } from "react-router-dom";
import styles from "./dashboard.module.css";

function DashboardSubscription() {
  const { data: subscription, isLoading, error } = useMySubscription();

  if (isLoading) {
    return (
      <div className={styles.subscriptionCard}>
        <Skeleton style={{ width: "200px", height: "1.5rem", marginBottom: "1rem" }} />
        <Skeleton style={{ width: "100%", height: "1rem", marginBottom: "0.5rem" }} />
        <Skeleton style={{ width: "100%", height: "1rem" }} />
      </div>
    );
  }

  if (error) {
    return <div className={styles.error}>Erreur lors du chargement de l'abonnement.</div>;
  }

  if (!subscription) {
    return (
      <div className={styles.subscriptionCard}>
        <h3>Aucun abonnement actif</h3>
        <p>Vous n'avez pas d'abonnement pour le moment.</p>
        <Button asChild className={styles.pricingButton}>
          <Link to="/pricing">Voir tous les plans</Link>
        </Button>
      </div>
    );
  }

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "active": return "success";
      case "pending": return "warning";
      case "expired": 
      case "cancelled": return "destructive";
      default: return "primary";
    }
  };

  return (
    <div className={styles.subscriptionCard}>
      <h3>Mon Abonnement</h3>
      <div className={styles.subscriptionDetails}>
        <div className={styles.detailRow}>
          <span className={styles.detailLabel}>Plan :</span>
          <span className={styles.detailValue}>{subscription.plan.name}</span>
        </div>
        <div className={styles.detailRow}>
          <span className={styles.detailLabel}>Statut :</span>
          <Badge variant={getStatusVariant(subscription.status) as any}>{subscription.status}</Badge>
        </div>
        {subscription.expiresAt && (
          <div className={styles.detailRow}>
            <span className={styles.detailLabel}>Expire le :</span>
            <span className={styles.detailValue}>{new Date(subscription.expiresAt).toLocaleDateString()}</span>
          </div>
        )}
      </div>
      <Button asChild className={styles.pricingButton}>
        <Link to="/pricing">Voir tous les plans</Link>
      </Button>
    </div>
  );
}

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("properties");

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.title}>Tableau de Bord Agent</h1>
          <p className={styles.subtitle}>
            Gérez vos annonces immobilières et votre profil
          </p>
        </div>
      </div>

      <div className={styles.content}>
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className={styles.tabs}
        >
          <TabsList className={styles.tabsList}>
            <TabsTrigger value="properties" className={styles.tabsTrigger}>
              <Home size={16} />
              Mes Propriétés
            </TabsTrigger>
            <TabsTrigger value="add" className={styles.tabsTrigger}>
              <Plus size={16} />
              Ajouter Propriété
            </TabsTrigger>
            <TabsTrigger value="profile" className={styles.tabsTrigger}>
              <User size={16} />
              Mon Profil
            </TabsTrigger>
            <TabsTrigger value="appointments" className={styles.tabsTrigger}>
              <CalendarDays size={16} />
              Rendez-vous
            </TabsTrigger>
            <TabsTrigger value="subscription" className={styles.tabsTrigger}>
              <CreditCard size={16} />
              Abonnement
            </TabsTrigger>
          </TabsList>

          <TabsContent value="properties" className={styles.tabsContent}>
            <DashboardProperties onAddClick={() => setActiveTab("add")} />
          </TabsContent>
          <TabsContent value="add" className={styles.tabsContent}>
            <DashboardAddProperty
              onPropertyAdded={() => setActiveTab("properties")}
            />
          </TabsContent>
          <TabsContent value="profile" className={styles.tabsContent}>
            <DashboardProfile />
          </TabsContent>
          <TabsContent value="appointments" className={styles.tabsContent}>
            <DashboardAppointments />
          </TabsContent>
          <TabsContent value="subscription" className={styles.tabsContent}>
            <DashboardSubscription />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
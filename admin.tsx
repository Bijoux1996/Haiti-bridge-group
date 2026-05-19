import React, { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../components/Tabs";
import { AdminStats } from "../components/AdminStats";
import { AdminUsersList } from "../components/AdminUsersList";
import { AdminPropertiesList } from "../components/AdminPropertiesList";
import { AdminSubscriptionsList } from "../components/AdminSubscriptionsList";
import { AdminReportsList } from "../components/AdminReportsList";
import { BarChart3, Users, Building, CreditCard, FileWarning } from "lucide-react";
import styles from "./admin.module.css";

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.title}>Administration</h1>
          <p className={styles.subtitle}>
            Gérez les utilisateurs, propriétés et abonnements
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
            <TabsTrigger value="overview" className={styles.tabsTrigger}>
              <BarChart3 size={16} />
              Aperçu
            </TabsTrigger>
            <TabsTrigger value="users" className={styles.tabsTrigger}>
              <Users size={16} />
              Utilisateurs
            </TabsTrigger>
            <TabsTrigger value="properties" className={styles.tabsTrigger}>
              <Building size={16} />
              Propriétés
            </TabsTrigger>
            <TabsTrigger value="subscriptions" className={styles.tabsTrigger}>
              <CreditCard size={16} />
              Abonnements
            </TabsTrigger>
            <TabsTrigger value="reports" className={styles.tabsTrigger}>
              <FileWarning size={16} />
              Signalements
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className={styles.tabsContent}>
            <AdminStats />
          </TabsContent>
          <TabsContent value="users" className={styles.tabsContent}>
            <AdminUsersList />
          </TabsContent>
          <TabsContent value="properties" className={styles.tabsContent}>
            <AdminPropertiesList />
          </TabsContent>
          <TabsContent value="subscriptions" className={styles.tabsContent}>
            <AdminSubscriptionsList />
          </TabsContent>
          <TabsContent value="reports" className={styles.tabsContent}>
            <AdminReportsList />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
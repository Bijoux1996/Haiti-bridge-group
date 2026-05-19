import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/Tabs";
import { PasswordLoginForm } from "../components/PasswordLoginForm";
import { PasswordRegisterForm } from "../components/PasswordRegisterForm";
import { AgentRegisterForm } from "../components/AgentRegisterForm";
import { Home, Briefcase, ArrowLeft } from "lucide-react";
import styles from "./login.module.css";

export default function LoginPage() {
  const [tab, setTab] = useState("login");
  const [registerRole, setRegisterRole] = useState<"user" | "agent" | null>(null);

  const handleTabChange = (value: string) => {
    setTab(value);
    if (value === "login") {
      setRegisterRole(null);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <Link to="/" className={styles.logo}>
            Haiti<span>Bridge</span> Group
          </Link>
          <h1 className={styles.title}>Bienvenue</h1>
          <p className={styles.subtitle}>Connectez-vous ou créez un compte</p>
        </div>
        
        <Tabs value={tab} onValueChange={handleTabChange} className={styles.tabs}>
          <TabsList className={styles.tabsList}>
            <TabsTrigger value="login" className={styles.tabTrigger}>Connexion</TabsTrigger>
            <TabsTrigger value="register" className={styles.tabTrigger}>Inscription</TabsTrigger>
          </TabsList>
          
          <TabsContent value="login" className={styles.tabContent}>
            <PasswordLoginForm />
          </TabsContent>
          
          <TabsContent value="register" className={styles.tabContent}>
            {!registerRole ? (
              <div className={styles.roleSelection}>
                <h3 className={styles.roleSelectionTitle}>Comment souhaitez-vous utiliser la plateforme ?</h3>
                <div className={styles.roleCards}>
                  <button className={styles.roleCard} onClick={() => setRegisterRole("user")}>
                    <Home className={styles.roleIcon} />
                    <div className={styles.roleText}>
                      <span className={styles.roleTitle}>Acheteur / Locataire</span>
                      <span className={styles.roleSubtitle}>Je cherche une propriété à acheter ou louer</span>
                    </div>
                  </button>
                  <button className={styles.roleCard} onClick={() => setRegisterRole("agent")}>
                    <Briefcase className={styles.roleIcon} />
                    <div className={styles.roleText}>
                      <span className={styles.roleTitle}>Agent Immobilier</span>
                      <span className={styles.roleSubtitle}>Je veux publier et gérer mes propriétés</span>
                    </div>
                  </button>
                </div>
              </div>
            ) : (
              <div className={styles.formContainer}>
                <button 
                  className={styles.backButton}
                  onClick={() => setRegisterRole(null)}
                >
                  <ArrowLeft size={16} /> Retour
                </button>
                {registerRole === "user" ? (
                  <PasswordRegisterForm />
                ) : (
                  <AgentRegisterForm />
                )}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
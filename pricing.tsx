import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Selectable } from "kysely";

import { useAuth } from "../helpers/useAuth";
import {
  useSubscriptionPlans,
  useMySubscription,
  useSubscribe,
} from "../helpers/useSubscription";
import type { SubscriptionPlans as SubscriptionPlansDB } from "../helpers/schema";

import { SubscriptionPlans } from "../components/SubscriptionPlans";
import { Button } from "../components/Button";
import { Input } from "../components/Input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../components/Dialog";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../components/Select";

import styles from "./pricing.module.css";

export default function PricingPage() {
  const navigate = useNavigate();
  const { authState } = useAuth();

  const { data: plans = [], isLoading: isLoadingPlans } = useSubscriptionPlans();
  const { data: currentSubscription, isLoading: isLoadingSub } = useMySubscription();
  const { mutate: subscribe, isPending: isSubscribing } = useSubscribe();

  // Payment Modal State
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<Selectable<SubscriptionPlansDB> | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<"moncash" | "natcash">("moncash");
  const [paymentRef, setPaymentRef] = useState("");
  const [isPaymentSubmitted, setIsPaymentSubmitted] = useState(false);

  const isLoading = isLoadingPlans || isLoadingSub;

  const handleSelectPlan = (planId: number) => {
    if (authState.type !== "authenticated") {
      navigate("/login");
      return;
    }

    if (authState.user.role !== "agent" && authState.user.role !== "admin") {
      toast.error("Seuls les agents peuvent souscrire à un plan.");
      return;
    }

    const plan = plans.find((p) => p.id === planId);
    if (!plan) return;

    const price = Number(plan.priceHtg);
    const isFree = isNaN(price) || price === 0;

    if (isFree) {
      subscribe(
        { planId: plan.id },
        {
          onSuccess: () => toast.success("Plan gratuit activé avec succès."),
          onError: (err) => toast.error(err.message),
        }
      );
    } else {
      setSelectedPlan(plan);
      setPaymentMethod("moncash");
      setPaymentRef("");
      setIsPaymentSubmitted(false);
      setPaymentModalOpen(true);
    }
  };

  const handlePaymentSubmit = () => {
    if (!selectedPlan) return;
    if (!paymentRef.trim()) {
      toast.error("Veuillez entrer la référence de transaction.");
      return;
    }

    subscribe(
      {
        planId: selectedPlan.id,
        paymentMethod,
        paymentReference: paymentRef.trim(),
      },
      {
        onSuccess: () => {
          setIsPaymentSubmitted(true);
        },
        onError: (err) => toast.error(err.message),
      }
    );
  };

  const currentPlanSlug = currentSubscription?.plan?.slug;
  const isSubscribingId =
    isSubscribing && selectedPlan ? selectedPlan.id : isSubscribing ? plans.find(p => p.slug === 'free')?.id : null;

  const generateWhatsAppLink = () => {
    if (authState.type !== "authenticated" || !selectedPlan) return "";
    const { user } = authState;
    const message = `Bonjour, je souhaite activer mon abonnement Haiti Bridge Group.

Nom: ${user.displayName}
Email: ${user.email}
Plan: ${selectedPlan.name}
Méthode: ${paymentMethod === "moncash" ? "MonCash" : "NatCash"}
Référence: ${paymentRef}

Veuillez trouver ci-joint la capture de mon paiement.`;

    return `https://wa.me/50941149821?text=${encodeURIComponent(message)}`;
  };

  const handleModalOpenChange = (open: boolean) => {
    setPaymentModalOpen(open);
    if (!open) {
      // Reset state when closing, wait for animation
      setTimeout(() => {
        setIsPaymentSubmitted(false);
        setSelectedPlan(null);
        setPaymentRef("");
      }, 300);
    }
  };

  return (
    <div className={styles.page}>
      <section className={styles.heroSection}>
        <div className={styles.heroContainer}>
          <h1 className={styles.heroTitle}>Nos Plans d'Abonnement</h1>
          <p className={styles.heroSubtitle}>
            Choisissez le plan qui correspond à vos besoins et propulsez votre activité immobilière.
          </p>
        </div>
      </section>

      <section className={styles.plansSection}>
        <div className={styles.plansContainer}>
          <SubscriptionPlans
            plans={plans}
            currentPlanSlug={currentPlanSlug}
            isLoading={isLoading}
            onSelectPlan={handleSelectPlan}
            isSubscribingId={isSubscribingId}
          />
        </div>
      </section>

      {/* Payment Dialog */}
      <Dialog open={paymentModalOpen} onOpenChange={handleModalOpenChange}>
        <DialogContent>
          {!isPaymentSubmitted ? (
            <>
              <DialogHeader>
                <DialogTitle>Paiement pour {selectedPlan?.name}</DialogTitle>
                <DialogDescription>
                  Afin de finaliser votre souscription, veuillez procéder au paiement
                  via MonCash ou NatCash.
                </DialogDescription>
              </DialogHeader>

              <div className={styles.modalBody}>
                <div className={styles.fieldGroup}>
                  <label className={styles.fieldLabel}>Méthode de paiement</label>
                  <Select
                    value={paymentMethod}
                    onValueChange={(val: "moncash" | "natcash") => setPaymentMethod(val)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionnez une méthode" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="moncash">MonCash</SelectItem>
                      <SelectItem value="natcash">NatCash</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className={styles.instructionsBox}>
                  <p>
                    Envoyez <strong>{selectedPlan && new Intl.NumberFormat("fr-HT").format(Number(selectedPlan.priceHtg))} HTG</strong> au
                    numéro <strong>{paymentMethod === "moncash" ? "3473 1511" : "4114 9821"}</strong> via{" "}
                    <span className={styles.highlightMethod}>
                      {paymentMethod === "moncash" ? "MonCash" : "NatCash"}
                    </span>{" "}
                    et entrez la référence de transaction ci-dessous.
                  </p>
                </div>

                <div className={styles.fieldGroup}>
                  <label htmlFor="paymentRef" className={styles.fieldLabel}>
                    Référence de transaction
                  </label>
                  <Input
                    id="paymentRef"
                    placeholder="Ex: 1234567890"
                    value={paymentRef}
                    onChange={(e) => setPaymentRef(e.target.value)}
                  />
                </div>
              </div>

              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => handleModalOpenChange(false)}
                  disabled={isSubscribing}
                >
                  Annuler
                </Button>
                <Button onClick={handlePaymentSubmit} disabled={isSubscribing}>
                  {isSubscribing ? "Traitement..." : "Confirmer le paiement"}
                </Button>
              </DialogFooter>
            </>
          ) : (
            <>
              <DialogHeader>
                <DialogTitle className={styles.successTitle}>
                  Votre demande d'abonnement a été enregistrée !
                </DialogTitle>
              </DialogHeader>
              <div className={styles.successBody}>
                <p className={styles.successText}>
                  Pour finaliser votre activation, envoyez la capture d'écran de votre paiement via WhatsApp
                </p>
                <Button
                  className={styles.whatsappButton}
                  onClick={() => window.open(generateWhatsAppLink(), "_blank")}
                >
                  Envoyer sur WhatsApp
                </Button>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => handleModalOpenChange(false)}>
                  Fermer
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
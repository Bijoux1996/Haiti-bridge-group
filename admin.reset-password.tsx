import React, { useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { useResetPassword } from "../helpers/useResetPassword";
import { useMutation } from "@tanstack/react-query";
import { postForgotPassword, schema as forgotSchema } from "../endpoints/auth/forgot-password_POST.schema";
import { z } from "zod";
import { Form, FormItem, FormLabel, FormControl, FormMessage, useForm } from "../components/Form";
import { Input } from "../components/Input";
import { Button } from "../components/Button";
import styles from "./admin.reset-password.module.css";

const resetSchema = z.object({
  newPassword: z.string()
    .min(8, "Le mot de passe doit faire au moins 8 caractères")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Le mot de passe doit contenir au moins une majuscule, une minuscule et un chiffre"
    ),
  confirmPassword: z.string()
}).refine(data => data.newPassword === data.confirmPassword, {
  message: "Les mots de passe ne correspondent pas",
  path: ["confirmPassword"]
});

type ResetFormValues = z.infer<typeof resetSchema>;
type ForgotFormValues = z.infer<typeof forgotSchema>;

export default function AdminResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  
  const [showForgotForm, setShowForgotForm] = useState(!token);

  const resetMutation = useResetPassword();
  const forgotMutation = useMutation({ mutationFn: postForgotPassword });

  const resetForm = useForm({
    defaultValues: {
      newPassword: "",
      confirmPassword: ""
    },
    schema: resetSchema
  });

  const forgotForm = useForm({
    defaultValues: {
      email: ""
    },
    schema: forgotSchema
  });

  const onResetSubmit = (values: ResetFormValues) => {
    if (!token) return;
    resetMutation.mutate({
      token,
      newPassword: values.newPassword
    });
  };

  const onForgotSubmit = (values: ForgotFormValues) => {
    forgotMutation.mutate(values);
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <Link to="/" className={styles.logo}>
            Haiti<span>Bridge</span> Group
          </Link>
          <h1 className={styles.title}>Réinitialisation Admin</h1>
          <p className={styles.subtitle}>
            {showForgotForm 
              ? "Demander un nouveau lien de réinitialisation" 
              : "Créez un nouveau mot de passe"}
          </p>
        </div>

        {showForgotForm ? (
          forgotMutation.isSuccess ? (
            <div className={styles.successAlert}>
              <p className={styles.successText}>{forgotMutation.data.message}</p>
              <Button asChild className={styles.fullWidth}>
                <Link to="/login">Se Connecter</Link>
              </Button>
            </div>
          ) : (
            <div className={styles.forgotContainer}>
              <p className={styles.instructionText}>
                Entrez votre adresse email administrateur pour recevoir un nouveau lien de réinitialisation.
              </p>
              
              <Form {...forgotForm}>
                <form onSubmit={forgotForm.handleSubmit(onForgotSubmit)} className={styles.form}>
                  {forgotMutation.isError && (
                    <div className={styles.errorAlert}>
                      <p className={styles.errorDescription}>
                        {forgotMutation.error instanceof Error ? forgotMutation.error.message : "Une erreur est survenue."}
                      </p>
                    </div>
                  )}
                  
                  <FormItem name="email">
                    <FormLabel>Adresse email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="Entrez votre adresse email"
                        value={forgotForm.values.email}
                        onChange={(e) =>
                          forgotForm.setValues((prev) => ({ ...prev, email: e.target.value }))
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>

                  <Button 
                    type="submit" 
                    className={styles.submitButton}
                    disabled={forgotMutation.isPending}
                  >
                    {forgotMutation.isPending ? "Envoi..." : "Envoyer le lien"}
                  </Button>

                  <div className={styles.footerLinks}>
                    <Link to="/login" className={styles.link}>
                      Retour à la connexion
                    </Link>
                  </div>
                </form>
              </Form>
            </div>
          )
        ) : (
          resetMutation.isSuccess ? (
            <div className={styles.successAlert}>
              <p className={styles.successText}>Votre mot de passe a été réinitialisé avec succès !</p>
              <Button asChild className={styles.fullWidth}>
                <Link to="/login">Se Connecter</Link>
              </Button>
            </div>
          ) : (
            <Form {...resetForm}>
              <form onSubmit={resetForm.handleSubmit(onResetSubmit)} className={styles.form}>
                {resetMutation.isError && (
                  <div className={styles.errorAlert}>
                    <p className={styles.errorTitle}>
                      {resetMutation.error instanceof Error ? resetMutation.error.message : "Ce lien est expiré ou invalide"}
                    </p>
                    <Button 
                      variant="outline" 
                      onClick={() => setShowForgotForm(true)}
                      className={styles.fullWidth}
                      type="button"
                    >
                      Demander un nouveau lien
                    </Button>
                  </div>
                )}
                
                <FormItem name="newPassword">
                  <FormLabel>Nouveau mot de passe</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Entrez votre nouveau mot de passe"
                      value={resetForm.values.newPassword}
                      onChange={(e) =>
                        resetForm.setValues((prev) => ({ ...prev, newPassword: e.target.value }))
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>

                <FormItem name="confirmPassword">
                  <FormLabel>Confirmer le mot de passe</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Confirmez le mot de passe"
                      value={resetForm.values.confirmPassword}
                      onChange={(e) =>
                        resetForm.setValues((prev) => ({ ...prev, confirmPassword: e.target.value }))
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>

                <Button 
                  type="submit" 
                  className={styles.submitButton}
                  disabled={resetMutation.isPending}
                >
                  {resetMutation.isPending ? "Réinitialisation..." : "Réinitialiser le mot de passe"}
                </Button>
              </form>
            </Form>
          )
        )}
      </div>
    </div>
  );
}
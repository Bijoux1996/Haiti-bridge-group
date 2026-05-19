import React, { useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { useResetPassword } from "../helpers/useResetPassword";
import { useForgotPasswordSms, useVerifySmsCode } from "../helpers/useAuthSms";
import { z } from "zod";
import { Form, FormItem, FormLabel, FormControl, FormMessage, useForm } from "../components/Form";
import { Input } from "../components/Input";
import { Button } from "../components/Button";
import styles from "./reset-password.module.css";

const phoneSchema = z.object({
  phone: z.string().min(1, "Le numéro de téléphone est requis"),
});

const codeSchema = z.object({
  code: z.string().length(6, "Le code doit comporter exactement 6 chiffres"),
});

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

type PhoneFormValues = z.infer<typeof phoneSchema>;
type CodeFormValues = z.infer<typeof codeSchema>;
type ResetFormValues = z.infer<typeof resetSchema>;

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const urlToken = searchParams.get("token");
  
  const [step, setStep] = useState<"phone" | "code" | "reset">(urlToken ? "reset" : "phone");
  const [phone, setPhone] = useState("");
  const [activeToken, setActiveToken] = useState(urlToken || "");

  const forgotMutation = useForgotPasswordSms();
  const verifyMutation = useVerifySmsCode();
  const resetMutation = useResetPassword();

  const phoneForm = useForm({
    defaultValues: { phone: "" },
    schema: phoneSchema
  });

  const codeForm = useForm({
    defaultValues: { code: "" },
    schema: codeSchema
  });

  const resetForm = useForm({
    defaultValues: { newPassword: "", confirmPassword: "" },
    schema: resetSchema
  });

  const onPhoneSubmit = (values: PhoneFormValues) => {
    setPhone(values.phone);
    forgotMutation.mutate({ phone: values.phone }, {
      onSuccess: () => setStep("code")
    });
  };

  const onCodeSubmit = (values: CodeFormValues) => {
    verifyMutation.mutate({ phone, code: values.code }, {
      onSuccess: (data) => {
        setActiveToken(data.token);
        setStep("reset");
      }
    });
  };

  const onResetSubmit = (values: ResetFormValues) => {
    resetMutation.mutate({
      token: activeToken,
      newPassword: values.newPassword
    });
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <Link to="/" className={styles.logo}>
            Haiti<span>Bridge</span> Group
          </Link>
          <h1 className={styles.title}>Réinitialiser</h1>
          <p className={styles.subtitle}>
            {step === "phone" && "Demander un code de réinitialisation"}
            {step === "code" && "Vérification du code"}
            {step === "reset" && "Créez un nouveau mot de passe"}
          </p>
        </div>

        {step === "phone" && (
          <div className={styles.forgotContainer}>
            {!urlToken && (
              <p className={styles.instructionText}>
                Entrez votre numéro de téléphone pour recevoir un code par SMS.
              </p>
            )}
            
            <Form {...phoneForm}>
              <form onSubmit={phoneForm.handleSubmit(onPhoneSubmit)} className={styles.form}>
                {forgotMutation.isError && (
                  <div className={styles.errorAlert}>
                    <p className={styles.errorDescription}>
                      {forgotMutation.error instanceof Error ? forgotMutation.error.message : "Une erreur est survenue."}
                    </p>
                  </div>
                )}
                
                <FormItem name="phone">
                  <FormLabel>Numéro de téléphone</FormLabel>
                  <FormControl>
                    <Input
                      type="tel"
                      placeholder="+509 XXXX XXXX"
                      value={phoneForm.values.phone}
                      onChange={(e) =>
                        phoneForm.setValues((prev) => ({ ...prev, phone: e.target.value }))
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
                  {forgotMutation.isPending ? "Envoi..." : "Envoyer le code"}
                </Button>

                <div className={styles.footerLinks}>
                  <Link to="/login" className={styles.link}>
                    Retour à la connexion
                  </Link>
                </div>
              </form>
            </Form>
          </div>
        )}

        {step === "code" && (
          <div className={styles.forgotContainer}>
            <p className={styles.instructionText}>
              Entrez le code à 6 chiffres envoyé au {phone}.
            </p>
            
            <Form {...codeForm}>
              <form onSubmit={codeForm.handleSubmit(onCodeSubmit)} className={styles.form}>
                {verifyMutation.isError && (
                  <div className={styles.errorAlert}>
                    <p className={styles.errorDescription}>
                      {verifyMutation.error instanceof Error ? verifyMutation.error.message : "Code invalide."}
                    </p>
                  </div>
                )}
                
                <FormItem name="code">
                  <FormLabel>Code de vérification</FormLabel>
                  <FormControl>
                    <Input
                      className={styles.codeInput}
                      type="text"
                      maxLength={6}
                      placeholder="000000"
                      value={codeForm.values.code}
                      onChange={(e) =>
                        codeForm.setValues((prev) => ({ ...prev, code: e.target.value }))
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>

                <Button 
                  type="submit" 
                  className={styles.submitButton}
                  disabled={verifyMutation.isPending}
                >
                  {verifyMutation.isPending ? "Vérification..." : "Vérifier le code"}
                </Button>

                <div className={styles.footerLinks} style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-2)", marginTop: "var(--spacing-4)" }}>
                  <Button 
                    type="button" 
                    variant="link"
                    onClick={() => forgotMutation.mutate({ phone })}
                    disabled={forgotMutation.isPending}
                  >
                    {forgotMutation.isPending ? "Envoi..." : "Renvoyer le code"}
                  </Button>
                  <Button type="button" variant="link" onClick={() => setStep("phone")}>
                    Changer de numéro
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        )}

        {step === "reset" && (
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
                      onClick={() => setStep("phone")}
                      className={styles.fullWidth}
                      type="button"
                    >
                      Demander un nouveau code
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
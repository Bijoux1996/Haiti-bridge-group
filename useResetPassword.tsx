import { useMutation } from "@tanstack/react-query";
import { postResetPassword } from "../endpoints/auth/reset-password_POST.schema";

export function useResetPassword() {
  return useMutation({
    mutationFn: postResetPassword,
  });
}
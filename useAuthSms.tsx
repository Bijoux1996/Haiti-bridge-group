import { useMutation } from "@tanstack/react-query";
import { postForgotPasswordSms } from "../endpoints/auth/forgot-password-sms_POST.schema";
import { postVerifySmsCode } from "../endpoints/auth/verify-sms-code_POST.schema";

export const useForgotPasswordSms = () => {
  return useMutation({
    mutationFn: postForgotPasswordSms,
  });
};

export const useVerifySmsCode = () => {
  return useMutation({
    mutationFn: postVerifySmsCode,
  });
};
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getSubscriptionPlans } from "../endpoints/subscription/plans_GET.schema";
import { getMySubscription } from "../endpoints/subscription/my-subscription_GET.schema";
import { postSubscribe, InputType as SubscribeInput } from "../endpoints/subscription/subscribe_POST.schema";
import { useAuth } from "./useAuth";

export const SUBSCRIPTION_PLANS_QUERY_KEY = ["subscription", "plans"] as const;
export const MY_SUBSCRIPTION_QUERY_KEY = ["subscription", "my"] as const;

export function useSubscriptionPlans() {
  return useQuery({
    queryKey: SUBSCRIPTION_PLANS_QUERY_KEY,
    queryFn: async () => {
      const result = await getSubscriptionPlans();
      return result.plans;
    },
  });
}

export function useMySubscription() {
  const { authState } = useAuth();
  const isAuthenticated = authState.type === "authenticated";

  return useQuery({
    queryKey: MY_SUBSCRIPTION_QUERY_KEY,
    queryFn: async () => {
      const result = await getMySubscription();
      return result.subscription;
    },
    enabled: isAuthenticated,
  });
}

export function useSubscribe() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: SubscribeInput) => {
      return postSubscribe(input);
    },
    onSuccess: (data) => {
      queryClient.setQueryData(MY_SUBSCRIPTION_QUERY_KEY, data.subscription);
      queryClient.invalidateQueries({ queryKey: MY_SUBSCRIPTION_QUERY_KEY });
    },
  });
}
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAdminStats } from "../endpoints/admin/stats_GET.schema";
import { getAdminUsers, InputType as UsersInput } from "../endpoints/admin/users_GET.schema";
import { postAdminUpdateUser, InputType as UpdateUserInput } from "../endpoints/admin/user/update_POST.schema";
import { getAdminProperties, InputType as PropertiesInput } from "../endpoints/admin/properties_GET.schema";
import { postAdminUpdateProperty, InputType as UpdatePropertyInput } from "../endpoints/admin/property/update_POST.schema";
import { getAdminSubscriptions, InputType as SubscriptionsInput } from "../endpoints/admin/subscriptions_GET.schema";
import { postAdminUpdateSubscription, InputType as UpdateSubscriptionInput } from "../endpoints/admin/subscription/update_POST.schema";

export function useAdminStats() {
  return useQuery({
    queryKey: ["admin", "stats"],
    queryFn: () => getAdminStats(),
  });
}

export function useAdminUsers(params: UsersInput) {
  return useQuery({
    queryKey: ["admin", "users", params],
    queryFn: () => getAdminUsers(params),
    placeholderData: (prev) => prev,
  });
}

export function useAdminUpdateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: UpdateUserInput) => postAdminUpdateUser(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "stats"] });
    },
  });
}

export function useAdminProperties(params: PropertiesInput) {
  return useQuery({
    queryKey: ["admin", "properties", params],
    queryFn: () => getAdminProperties(params),
    placeholderData: (prev) => prev,
  });
}

export function useAdminUpdateProperty() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: UpdatePropertyInput) => postAdminUpdateProperty(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "properties"] });
    },
  });
}

export function useAdminSubscriptions(params: SubscriptionsInput) {
  return useQuery({
    queryKey: ["admin", "subscriptions", params],
    queryFn: () => getAdminSubscriptions(params),
    placeholderData: (prev) => prev,
  });
}

export function useAdminUpdateSubscription() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: UpdateSubscriptionInput) => postAdminUpdateSubscription(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "subscriptions"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "stats"] });
    },
  });
}
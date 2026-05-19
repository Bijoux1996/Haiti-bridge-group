import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  postCreateReview,
  InputType as CreateReviewInput,
} from "../endpoints/reviews/create_POST.schema";
import {
  getAgentReviews,
  InputType as AgentReviewsInput,
} from "../endpoints/reviews/agent_GET.schema";
import {
  postCheckReview,
  InputType as CheckReviewInput,
} from "../endpoints/reviews/check_POST.schema";
import { toast } from "sonner";

export const useCreateReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateReviewInput) => postCreateReview(data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["reviews", "agent", variables.agentId] });
      queryClient.invalidateQueries({ queryKey: ["reviewCheck", variables.agentId] });
      toast.success("Votre avis a été soumis avec succès.");
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Erreur lors de la soumission de l'avis");
    },
  });
};

export const useAgentReviews = (params: AgentReviewsInput) => {
  return useQuery({
    queryKey: ["reviews", "agent", params.agentId, params.page, params.limit],
    queryFn: () => getAgentReviews(params),
    placeholderData: (previousData) => previousData,
  });
};

export const useCheckReview = (
  params: CheckReviewInput,
  options?: { enabled?: boolean }
) => {
  return useQuery({
    queryKey: ["reviewCheck", params.agentId, params.propertyId],
    queryFn: () => postCheckReview(params),
    enabled: options?.enabled ?? false,
  });
};
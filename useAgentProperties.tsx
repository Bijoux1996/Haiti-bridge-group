import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getMyListings, OutputType as MyListingsOutput } from "../endpoints/property/my-listings_GET.schema";
import { postCreateProperty, InputType as CreateInput } from "../endpoints/property/create_POST.schema";
import { postUpdateProperty, InputType as UpdateInput } from "../endpoints/property/update_POST.schema";
import { postDeleteProperty, InputType as DeleteInput } from "../endpoints/property/delete_POST.schema";

export const AGENT_PROPERTIES_QUERY_KEY = ["agent-properties"];

export const useMyListings = () => {
  return useQuery({
    queryKey: AGENT_PROPERTIES_QUERY_KEY,
    queryFn: () => getMyListings(),
  });
};

export const useCreateProperty = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateInput) => postCreateProperty(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: AGENT_PROPERTIES_QUERY_KEY });
    },
  });
};

export const useUpdateProperty = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateInput) => postUpdateProperty(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: AGENT_PROPERTIES_QUERY_KEY });
    },
  });
};

export const useDeleteProperty = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: DeleteInput) => postDeleteProperty(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: AGENT_PROPERTIES_QUERY_KEY });
    },
  });
};
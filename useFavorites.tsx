import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { postToggleFavorite } from "../endpoints/favorites/toggle_POST.schema";
import {
  getFavoritesList,
  InputType as ListInputType,
} from "../endpoints/favorites/list_GET.schema";
import { postCheckFavorites } from "../endpoints/favorites/check_POST.schema";
import { useAuth } from "./useAuth";

export const useToggleFavorite = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: postToggleFavorite,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["favorites"] });
      queryClient.invalidateQueries({ queryKey: ["favoritesCheck"] });
    },
  });
};

export const useFavoritesList = (params: ListInputType) => {
  const { authState } = useAuth();

  return useQuery({
    queryKey: ["favorites", "list", params],
    queryFn: () => getFavoritesList(params),
    enabled: authState.type === "authenticated",
    placeholderData: (prev) => prev,
  });
};

export const useCheckFavorites = (propertyIds: number[]) => {
  const { authState } = useAuth();

  return useQuery({
    queryKey: ["favoritesCheck", propertyIds],
    queryFn: () => postCheckFavorites({ propertyIds }),
    enabled: authState.type === "authenticated" && propertyIds.length > 0,
    select: (data) => new Set(data.favoritedIds),
  });
};
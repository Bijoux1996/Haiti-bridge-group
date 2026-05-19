import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postUpdateAvatar, InputType } from "../endpoints/agent/avatar/update_POST.schema";
import { AUTH_QUERY_KEY } from "./useAuth";
import { toast } from "sonner";

export function useUpdateAvatar() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: InputType) => postUpdateAvatar(input),
    onSuccess: () => {
      // Invalidate the session query to refresh the user data in AuthContext across the application
      queryClient.invalidateQueries({ queryKey: AUTH_QUERY_KEY });
      toast.success("Profile photo updated successfully!");
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Failed to update profile photo");
    }
  });
}
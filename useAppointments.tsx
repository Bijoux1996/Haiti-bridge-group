import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { postBookAppointment, InputType as BookInput } from "../endpoints/appointment/book_POST.schema";
import { getMyAppointments, InputType as MyAppointmentsInput } from "../endpoints/appointment/my-appointments_GET.schema";
import { postUpdateAppointment, InputType as UpdateInput } from "../endpoints/appointment/update_POST.schema";

export const useBookAppointment = () => {
  return useMutation({
    mutationFn: (input: BookInput) => postBookAppointment(input),
  });
};

export const useMyAppointments = (input: MyAppointmentsInput, options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: ["appointments", "my", input],
    queryFn: () => getMyAppointments(input),
    enabled: options?.enabled ?? true,
    placeholderData: (previousData) => previousData,
  });
};

export const useUpdateAppointment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: UpdateInput) => postUpdateAppointment(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
    },
  });
};
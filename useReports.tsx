import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import { postReportCreate, InputType as CreateReportInput } from "../endpoints/report/create_POST.schema";
import { getAdminReports, InputType as AdminReportsInput } from "../endpoints/admin/reports_GET.schema";
import { postAdminReportUpdate, InputType as AdminUpdateReportInput } from "../endpoints/admin/report/update_POST.schema";

export const useCreateReport = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateReportInput) => postReportCreate(data),
    onSuccess: () => {
      // Refresh admin dashboard stats/reports if an admin happens to be submitting
      // Mostly just for data consistency
      queryClient.invalidateQueries({ queryKey: ["admin", "reports"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "stats"] });
    },
  });
};

export const useAdminReports = (params: AdminReportsInput) => {
  return useQuery({
    queryKey: ["admin", "reports", params],
    queryFn: () => getAdminReports(params),
    placeholderData: (previousData) => previousData,
  });
};

export const useAdminUpdateReport = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: AdminUpdateReportInput) => postAdminReportUpdate(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "reports"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "stats"] });
    },
  });
};
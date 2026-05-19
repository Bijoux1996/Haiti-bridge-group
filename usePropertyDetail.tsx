import { useQuery } from "@tanstack/react-query";
import { getPropertyDetail, InputType, PropertyDetailOutput } from "../endpoints/property/detail_GET.schema";

export const usePropertyDetail = (input: InputType, options?: { enabled?: boolean }) => {
  return useQuery<PropertyDetailOutput, Error>({
    queryKey: ["propertyDetail", input.id],
    queryFn: () => getPropertyDetail(input),
    enabled: options?.enabled ?? true,
  });
};
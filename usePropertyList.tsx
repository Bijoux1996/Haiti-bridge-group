import { useQuery } from "@tanstack/react-query";
import { getPropertyList, InputType, OutputType } from "../endpoints/property/list_GET.schema";

export const usePropertyList = (input: InputType, options?: { enabled?: boolean }) => {
  return useQuery<OutputType, Error>({
    queryKey: ["propertyList", input],
    queryFn: () => getPropertyList(input),
    enabled: options?.enabled ?? true,
  });
};
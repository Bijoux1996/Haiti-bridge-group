import { useQuery } from "@tanstack/react-query";
import { getAgentProfile } from "../endpoints/agent/profile_GET.schema";

export function useAgentProfile(slug: string) {
  return useQuery({
    queryKey: ["agentProfile", slug],
    queryFn: () => getAgentProfile({ slug }),
    enabled: Boolean(slug),
  });
}
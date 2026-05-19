import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { postLog } from "../endpoints/whatsapp/log_POST.schema";
import {
  getAgentStats,
  InputType as AgentStatsInput,
} from "../endpoints/whatsapp/agent-stats_GET.schema";

export const WHATSAPP_STATS_QUERY_KEY = "whatsappStats";

/**
 * Mutation hook to log a WhatsApp contact attempt.
 */
export function useLogWhatsAppContact() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: postLog,
    onSuccess: () => {
      // Invalidate agent stats query so the dashboard reflects the new numbers
      queryClient.invalidateQueries({
        queryKey: [WHATSAPP_STATS_QUERY_KEY],
      });
    },
  });
}

/**
 * Query hook to fetch agent stats for a given period.
 */
export function useWhatsAppAgentStats(params: AgentStatsInput) {
  return useQuery({
    queryKey: [WHATSAPP_STATS_QUERY_KEY, params.period],
    queryFn: () => getAgentStats(params),
    placeholderData: (previousData) => previousData,
  });
}

/**
 * Utility function to generate the final wa.me URL with a pre-filled message.
 */
export function getWhatsAppUrl(phone: string, message: string): string {
  const cleanPhone = phone.replace(/\D/g, "");
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
}

/**
 * Utility function to generate a standard French property inquiry message.
 */
export function generatePropertyMessage(property: {
  title: string;
  price: string | number;
  city: string;
  id: number;
}): string {
  const formatter = new Intl.NumberFormat("fr-HT", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });

  const numericPrice =
    typeof property.price === "string"
      ? parseFloat(property.price)
      : property.price;

  const formattedPrice = isNaN(numericPrice)
    ? property.price
    : formatter.format(numericPrice);

  const origin =
    typeof window !== "undefined"
      ? window.location.origin
      : "https://haitibridgegroup.com";
  
  const propertyUrl = `${origin}/properties/${property.id}`;

  return `Bonjour ! Je suis intéressé(e) par votre propriété "${property.title}" à ${property.city} (${formattedPrice}). Pourriez-vous me donner plus d'informations ? Lien : ${propertyUrl}`;
}
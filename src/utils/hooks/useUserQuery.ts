import { useQuery } from "@tanstack/react-query";
import { getUser } from "../../pages/login/services/api";

export function useUserQuery(userId: string) {
  return useQuery({
    queryKey: ["user", userId],
    queryFn: () => getUser(userId),
    enabled: !!userId,
    staleTime: 1000 * 60 * 5, // 5 minutos
  });
}

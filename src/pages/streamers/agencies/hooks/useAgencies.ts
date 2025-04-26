import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AgencyService } from "../services/agency.service";

export const useAgencies = () => {
  const queryClient = useQueryClient();

  const agenciesQueryKey = ["agencies", "affiliated"];
  const requestsQueryKey = ["agencies", "requests", "pending"];

  const {
    data: affiliatedAgencies = [],
    isLoading: isLoadingAgencies,
    error: agenciesError,
  } = useQuery({
    queryKey: agenciesQueryKey,
    queryFn: AgencyService.getAffiliatedAgencies,
  });

  const {
    data: pendingRequests = [],
    isLoading: isLoadingRequests,
    error: requestsError,
  } = useQuery({
    queryKey: requestsQueryKey,
    queryFn: AgencyService.getPendingRequests,
  });

  const acceptRequestMutation = useMutation({
    mutationFn: AgencyService.acceptRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: agenciesQueryKey });
      queryClient.invalidateQueries({ queryKey: requestsQueryKey });
    },
  });

  const rejectRequestMutation = useMutation({
    mutationFn: AgencyService.rejectRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: requestsQueryKey });
    },
  });

  const isLoading = isLoadingAgencies || isLoadingRequests;

  const error =
    agenciesError || requestsError
      ? "Error al cargar los datos. Por favor, inténtalo de nuevo."
      : null;

  return {
    affiliatedAgencies,
    pendingRequests,
    isLoading,
    error,
    acceptRequest: async (requestId: string) =>
      acceptRequestMutation.mutate(requestId),
    rejectRequest: async (requestId: string) =>
      rejectRequestMutation.mutate(requestId),
    refreshData: async () => {
      queryClient.invalidateQueries({ queryKey: agenciesQueryKey });
      queryClient.invalidateQueries({ queryKey: requestsQueryKey });
    },
  };
};

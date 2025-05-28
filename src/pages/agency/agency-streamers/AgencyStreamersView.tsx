import { useDisclosure, Button, Chip, Spinner } from "@heroui/react";
import { useState, useMemo } from "react";
import { FaUserPlus, FaExclamationTriangle } from "react-icons/fa";
import { SearchBar } from "../../../components/SearchBar";
import { AddStreamerModal } from "./components/AddStreamerModal";
import { AffiliatedStreamerCard } from "./components/AffiliatedStreamerCard";
import { TokenExpirationAlert } from "./components/TokenExpirationAlert";
import {
  useManagerAgencies,
  useInvalidateOnAgencyChange,
} from "../store/agencyStore";
import { useQuery } from "@tanstack/react-query";
import {
  fetchAgencyStreamers,
  fetchAgencyPendingStreamers,
  removeStreamerFromAgency,
} from "../services/agencyService";
import { useAgencyTokenStatus } from "../hooks/useAgencyTokenStatus";

const AgencyStreamersView = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [filterQuery, setFilterQuery] = useState("");
  const [loadingRemove, setLoadingRemove] = useState(false);

  const { selectedAgency } = useManagerAgencies();

  const { agencyDependentKey, agencyId } = useInvalidateOnAgencyChange([
    "streamers",
  ]);

  // Token status hook for real-time token verification
  const { 
    hasExpiredTokens, 
    getPlatformTokenStatus,
    isLoading: isLoadingTokens 
  } = useAgencyTokenStatus(agencyId);

  const {
    data: affiliatedStreamersData = [],
    isLoading: isLoadingStreamers,
    error: streamersError,
    refetch: refetchStreamers,
  } = useQuery({
    queryKey: agencyDependentKey,
    queryFn: () =>
      agencyId ? fetchAgencyStreamers(agencyId) : Promise.resolve([]),
    enabled: !!agencyId,
    staleTime: 30000,
  });

  const {
    data: pendingStreamersData = [],
    isLoading: isLoadingPending,
    refetch: refetchPendingStreamers,
  } = useQuery({
    queryKey: [...agencyDependentKey, "pending"],
    queryFn: () =>
      agencyId ? fetchAgencyPendingStreamers(agencyId) : Promise.resolve([]),
    enabled: !!agencyId,
    staleTime: 30000,
  });

  const handleRemoveStreamer = async (streamerId: string) => {
    // Check if streamer has expired tokens before allowing removal
    if (hasExpiredTokens(streamerId)) {
      alert("No se puede eliminar el streamer porque tiene tokens de redes sociales expirados. Por favor, pídele que renueve sus conexiones primero.");
      return;
    }

    if (agencyId) {
      setLoadingRemove(true);
      try {
        await removeStreamerFromAgency(agencyId, streamerId);
        await refetchStreamers();
      } catch (error) {
        console.error("Error removing streamer:", error);
        alert("Error al eliminar el streamer. Inténtalo de nuevo.");
      } finally {
        setLoadingRemove(false);
      }
    }
  };

  // Enhanced streamers data with token status
  const enhancedStreamersData = useMemo(() => {
    return affiliatedStreamersData.map((streamer: any) => {
      const enhanced = { ...streamer };
      
      // Add token status to connectedSocials
      if (typeof enhanced.connectedSocials === 'object' && enhanced.connectedSocials) {
        const socialNetworks = ['instagram', 'tiktok', 'youtube'] as const;
        
        socialNetworks.forEach(platform => {
          const currentConnection = enhanced.connectedSocials[platform];
          if (currentConnection) {
            const tokenInfo = getPlatformTokenStatus(streamer.id, platform);
            
            if (typeof currentConnection === 'string') {
              // Convert string to object with token status
              enhanced.connectedSocials[platform] = {
                username: currentConnection,
                connected: true,
                tokenExpired: tokenInfo ? (tokenInfo.tokenStatus.isExpiring || tokenInfo.tokenStatus.needsRefresh) : false
              };
            } else if (typeof currentConnection === 'object') {
              // Update existing object with token status
              enhanced.connectedSocials[platform] = {
                ...currentConnection,
                tokenExpired: tokenInfo ? (tokenInfo.tokenStatus.isExpiring || tokenInfo.tokenStatus.needsRefresh) : false
              };
            }
          }
        });
      }
      
      return enhanced;
    });
  }, [affiliatedStreamersData, getPlatformTokenStatus]);

  const filteredStreamers = useMemo(() => {
    if (!filterQuery) return enhancedStreamersData;
    return enhancedStreamersData.filter((s: any) =>
      s.name.toLowerCase().includes(filterQuery.toLowerCase())
    );
  }, [filterQuery, enhancedStreamersData]);

  // Count streamers with expired tokens
  const streamersWithExpiredTokens = useMemo(() => {
    return enhancedStreamersData.filter((streamer: any) => hasExpiredTokens(streamer.id)).length;
  }, [enhancedStreamersData, hasExpiredTokens]);

  const isLoading = isLoadingStreamers || isLoadingPending;

  return (
    <div className="w-full max-w-6xl space-y-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <h2 className="text-2xl font-semibold text-slate-100 flex items-center">
          Gestión de Streamers
          {isLoading ? (
            <Spinner size="sm" color="primary" className="ml-3" />
          ) : streamersError ? (
            <Chip
              size="sm"
              className="ml-3 bg-red-700/30 text-red-300 border border-red-700/50"
            >
              Error al cargar datos
            </Chip>
          ) : selectedAgency ? (
            <Chip
              size="sm"
              className="ml-3 bg-sky-700/30 text-sky-300 border border-sky-700/50"
            >
              {selectedAgency.name}
            </Chip>
          ) : null}
          {streamersWithExpiredTokens > 0 && (
            <Chip
              size="sm"
              startContent={<FaExclamationTriangle size={12} />}
              className="ml-3 bg-yellow-600/20 text-yellow-300 border border-yellow-600/40"
            >
              {streamersWithExpiredTokens} con tokens expirados
            </Chip>
          )}
        </h2>
      </div>

      {isLoadingTokens && (
        <div className="text-center text-slate-400 text-sm py-2 bg-slate-800/30 rounded-lg">
          Verificando estado de tokens de streamers...
        </div>
      )}

      {streamersWithExpiredTokens > 0 && (
        <TokenExpirationAlert
          message={`${streamersWithExpiredTokens} streamer(s) tienen tokens expirados. No se pueden realizar ciertas acciones hasta que renueven sus conexiones.`}
          type="warning"
        />
      )}

      <div className="flex flex-col sm:flex-row items-center gap-4 w-full">
        <SearchBar
          placeholder="Filtrar streamers..."
          onSearchChange={setFilterQuery}
        />
        <Button
          color="primary"
          size="lg"
          onPress={onOpen}
          className="bg-sky-600 hover:bg-sky-700 text-white"
          isDisabled={!selectedAgency || isLoading}
        >
          <div className="flex items-center gap-2">
            <FaUserPlus size={20} />
            <span>Agregar Streamer</span>
          </div>
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Spinner size="lg" color="primary" />
        </div>
      ) : (
        <div className="space-y-4">
          {filteredStreamers.length > 0 ? (
            filteredStreamers.map((streamer: any) => (
              <AffiliatedStreamerCard
                key={streamer.id}
                streamer={streamer}
                onRemove={handleRemoveStreamer}
                loadingRemove={loadingRemove}
              />
            ))
          ) : (
            <p className="text-center text-slate-400 text-sm py-6">
              {filterQuery
                ? "No se encontraron streamers con ese nombre."
                : `Aún no tienes streamers en ${
                    selectedAgency?.name || "tu agencia"
                  }.`}
            </p>
          )}
        </div>
      )}

      <AddStreamerModal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        pendingStreamersFromProps={pendingStreamersData}
        refetchPendingStreamers={refetchPendingStreamers}
      />
    </div>
  );
};

export default AgencyStreamersView;

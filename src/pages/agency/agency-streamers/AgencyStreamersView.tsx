import { useDisclosure, Button, Chip, Spinner } from "@heroui/react";
import { useState, useMemo } from "react";
import { FaUserPlus } from "react-icons/fa";
import { SearchBar } from "../../../components/SearchBar";
import { AddStreamerModal } from "./components/AddStreamerModal";
import { AffiliatedStreamerCard } from "./components/AffiliatedStreamerCard";
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

const AgencyStreamersView = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [filterQuery, setFilterQuery] = useState("");
  const [loadingRemove, setLoadingRemove] = useState(false);

  const { selectedAgency } = useManagerAgencies();

  const { agencyDependentKey, agencyId } = useInvalidateOnAgencyChange([
    "streamers",
  ]);

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
    if (agencyId) {
      setLoadingRemove(true);
      await removeStreamerFromAgency(agencyId, streamerId).then(() => {
        refetchStreamers().finally(() => {
          setLoadingRemove(false);
        });
      });
    }
  };

  const filteredStreamers = useMemo(() => {
    if (!filterQuery) return affiliatedStreamersData;
    return affiliatedStreamersData.filter((s) =>
      s.name.toLowerCase().includes(filterQuery.toLowerCase())
    );
  }, [filterQuery, affiliatedStreamersData]);

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
        </h2>
      </div>

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
            filteredStreamers.map((streamer) => (
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

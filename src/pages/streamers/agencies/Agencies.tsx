import { useDisclosure } from "@heroui/react";
import { useState } from "react";
import { AgencyRequest } from "./interface/agency_request.interface";
import { AgencyInfoModal } from "./components/AgencyInfoModal";
import { AffiliatedAgencyCard } from "./components/AffiliatedAgencyCard";
import { AgencyRequestCard } from "./components/AgencyRequestCard";
import { AgencySection } from "./components/AgencySection";
import { useAgencies } from "./hooks/useAgencies";

export const Agencies = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [selectedRequest, setSelectedRequest] = useState<AgencyRequest | null>(
    null
  );
  const {
    affiliatedAgencies,
    pendingRequests,
    isLoading,
    error,
    acceptRequest,
    rejectRequest,
    refreshData,
  } = useAgencies();

  const handleAcceptRequest = async (requestId: string) => {
    await acceptRequest(requestId).then(() => {
      refreshData();
    });
  };

  const handleRejectRequest = async (requestId: string) => {
    await rejectRequest(requestId);
  };

  const handleOpenInfoModal = (request: AgencyRequest) => {
    setSelectedRequest(request);
    onOpen();
  };

  if (isLoading) {
    return (
      <div className="w-full max-w-4xl flex justify-center items-center py-12">
        <div className="animate-pulse text-center">
          <p className="text-slate-500">Cargando información de agencias...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-4xl bg-red-50 border border-red-200 rounded-lg p-4 text-center">
        <p className="text-red-600">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl space-y-8 flex flex-col items-center">
      <AgencySection title="Mis Agencias">
        {affiliatedAgencies.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {affiliatedAgencies.map((agency) => (
              <AffiliatedAgencyCard key={agency.id} agency={agency} />
            ))}
          </div>
        ) : (
          <p className="text-center text-slate-400 text-sm py-4">
            Aún no perteneces a ninguna agencia.
          </p>
        )}
      </AgencySection>

      <AgencySection title="Solicitudes Pendientes">
        {pendingRequests.length > 0 ? (
          <div className="space-y-4">
            {pendingRequests.map((request) => (
              <AgencyRequestCard
                key={request.id}
                request={request}
                onAccept={handleAcceptRequest}
                onReject={handleRejectRequest}
                onInfo={handleOpenInfoModal}
              />
            ))}
          </div>
        ) : (
          <p className="text-center text-slate-400 text-sm py-4">
            No tienes solicitudes pendientes.
          </p>
        )}
      </AgencySection>

      <AgencyInfoModal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        request={selectedRequest}
      />
    </div>
  );
};

import { useDisclosure } from "@heroui/react";
import { useState } from "react";
import { AgencyRequest } from "./interface/agency_request.interface";
import { Agency } from "./interface/agency.interface";
import { AgencyInfoModal } from "./components/AgencyInfoModal";
import { AffiliatedAgencyCard } from "./components/AffiliatedAgencyCard";
import { AgencyRequestCard } from "./components/AgencyRequestCard";
import { AgencySection } from "./components/AgencySection";

export const Agencies = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [selectedRequest, setSelectedRequest] = useState<AgencyRequest | null>(
    null
  );

  const affiliatedAgencies: Agency[] = [
    {
      id: "a1",
      name: "Gaming Masters",
      imageUrl: "https://placehold.co/100x100/7F00FF/FFFFFF?text=GM",
    },
    {
      id: "a2",
      name: "StreamPro Connect",
      imageUrl: "https://placehold.co/100x100/1E40AF/FFFFFF?text=SC",
    },
  ];
  const pendingRequests: AgencyRequest[] = [
    {
      id: "r1",
      agency: {
        id: "a3",
        name: "Epic Streamers Hub",
        imageUrl: "https://placehold.co/100x100/D97706/FFFFFF?text=ESH",
      },
      contractEndDate: "2026-12-31",
      comments:
        "¡Nos encantaría tenerte en nuestro equipo! Ofrecemos excelentes condiciones y apoyo constante para tu crecimiento.",
      status: "pending",
    },
    {
      id: "r2",
      agency: {
        id: "a4",
        name: "Nexus Talents",
        imageUrl: "https://placehold.co/100x100/059669/FFFFFF?text=NT",
      },
      contractEndDate: "2025-08-15",
      comments: "Propuesta de colaboración para campañas exclusivas.",
      status: "pending",
    },
  ];

  const handleAcceptRequest = (requestId: string) => {
    console.log(`Aceptar solicitud: ${requestId}`);
    alert(`Aceptar solicitud ${requestId} (Lógica no implementada)`);
  };
  const handleRejectRequest = (requestId: string) => {
    console.log(`Rechazar solicitud: ${requestId}`);
    alert(`Rechazar solicitud ${requestId} (Lógica no implementada)`);
  };
  const handleOpenInfoModal = (request: AgencyRequest) => {
    setSelectedRequest(request);
    onOpen();
  };

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

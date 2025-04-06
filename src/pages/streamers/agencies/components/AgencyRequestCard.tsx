import { Avatar, Button } from "@heroui/react";
import { FaBuilding } from "react-icons/fa";
import {
  IoCheckmarkCircleOutline,
  IoCloseCircleOutline,
  IoInformationCircleOutline,
} from "react-icons/io5";
import { AgencyRequest } from "../interface/agency_request.interface";

export const AgencyRequestCard = ({
  request,
  onAccept,
  onReject,
  onInfo,
}: {
  request: AgencyRequest;
  onAccept: (id: string) => void;
  onReject: (id: string) => void;
  onInfo: (request: AgencyRequest) => void;
}) => (
  <div
    key={request.id}
    className="flex flex-col sm:flex-row items-center justify-between p-3 bg-slate-800/50 rounded-lg gap-4"
  >
    <div className="flex items-center gap-3 flex-grow">
      <Avatar
        src={request.agency.imageUrl}
        icon={<FaBuilding className="text-slate-400" />}
        size="md"
      />
      <span className="font-medium text-slate-200">{request.agency.name}</span>
    </div>
    <div className="flex gap-2 flex-shrink-0">
      <Button
        size="sm"
        variant="flat"
        color="success"
        startContent={<IoCheckmarkCircleOutline size={16} />}
        onPress={() => onAccept(request.id)}
        className="bg-green-600/10 hover:bg-green-600/20 text-green-400 border border-green-600/30"
      >
        Aceptar
      </Button>
      <Button
        size="sm"
        variant="flat"
        color="danger"
        startContent={<IoCloseCircleOutline size={16} />}
        onPress={() => onReject(request.id)}
        className="bg-red-600/10 hover:bg-red-600/20 text-red-400 border border-red-600/30"
      >
        Rechazar
      </Button>
      <Button
        isIconOnly
        size="sm"
        variant="flat"
        aria-label="Más Información"
        onPress={() => onInfo(request)}
        className="text-slate-400 hover:text-slate-200 bg-slate-700/50 hover:bg-slate-600/50"
      >
        <IoInformationCircleOutline size={18} />
      </Button>
    </div>
  </div>
);

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Avatar,
  Divider,
  ModalFooter,
  Button,
} from "@heroui/react";
import { FaBuilding } from "react-icons/fa";
import { AgencyRequest } from "../interface/agency_request.interface";

export const AgencyInfoModal = ({
  isOpen,
  onOpenChange,
  request,
}: {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  request: AgencyRequest | null;
}) => (
  <Modal
    isOpen={isOpen}
    onOpenChange={onOpenChange}
    backdrop="blur"
    placement="center"
    className="bg-slate-900 border border-slate-700 rounded-xl"
  >
    <ModalContent>
      {(onClose) => (
        <>
          <ModalHeader className="flex flex-col gap-1 text-slate-100 border-b border-slate-700">
            Detalles de la Solicitud
          </ModalHeader>
          <ModalBody className="py-4">
            {request ? (
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Avatar
                    icon={<FaBuilding className="text-slate-400" />}
                    size="lg"
                  />
                  <p className="font-semibold text-lg text-primary-400">
                    {request.agency.name}
                  </p>
                </div>
                <Divider className="my-2 bg-slate-700" />
                <div>
                  <p className="text-sm font-medium text-slate-400">
                    Fecha Fin de Contrato:
                  </p>
                  <p className="text-md text-slate-200">
                    {request.endDate || "No especificada"}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-400">
                    Comentarios:
                  </p>
                  <p className="text-md text-slate-200 whitespace-pre-wrap">
                    {request.comment || "Sin comentarios adicionales."}
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-slate-400">
                No se pudo cargar la información.
              </p>
            )}
          </ModalBody>
          <ModalFooter>
            <Button
              color="primary"
              variant="light"
              onPress={onClose}
              className="text-slate-400 hover:text-slate-200"
            >
              Cerrar
            </Button>
          </ModalFooter>
        </>
      )}
    </ModalContent>
  </Modal>
);

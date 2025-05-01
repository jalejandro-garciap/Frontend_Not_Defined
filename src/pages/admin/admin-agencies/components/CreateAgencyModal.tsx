import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Button,
} from "@heroui/react";
import { IoClose } from "react-icons/io5";
import { CreateAgencyForm } from "./CreateAgencyForm";
import {
  AdminAgency,
  AgencyFormData,
} from "../interfaces/admin_agency.interface";

interface CreateAgencyModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: AgencyFormData) => void;
  isLoading: boolean;
  agencyToEdit?: AdminAgency;
}

export const CreateAgencyModal = ({
  isOpen,
  onOpenChange,
  onSubmit,
  isLoading,
  agencyToEdit,
}: CreateAgencyModalProps) => {
  // Determine if we're in edit mode
  const isEditMode = !!agencyToEdit;

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      hideCloseButton
      backdrop="blur"
      size="lg"
      placement="center"
      className="bg-slate-900 border border-slate-700 rounded-xl"
    >
      <ModalContent>
        {(onCloseCallback) => (
          <>
            <ModalHeader className="flex items-center justify-between text-slate-100 border-b border-slate-700">
              {isEditMode ? "Editar Agencia" : "Crear Nueva Agencia"}
              <Button
                isIconOnly
                variant="light"
                size="sm"
                onPress={onCloseCallback}
                className="text-slate-400 hover:text-slate-100 -mr-2"
                isDisabled={isLoading}
              >
                <IoClose size={20} />
              </Button>
            </ModalHeader>
            <ModalBody className="py-4">
              <CreateAgencyForm
                onSubmit={onSubmit}
                isLoading={isLoading}
                initialData={agencyToEdit}
              />
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

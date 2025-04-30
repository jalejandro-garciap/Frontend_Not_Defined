import React, { useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Select,
  SelectItem,
} from "@heroui/react";
import { AdminAgency } from "../../admin-agencies/interfaces/admin_agency.interface";
import { AdminUser } from "../interfaces/admin_user.interface";

interface AssignAgencyModalProps {
  isOpen: boolean;
  onOpenChange: () => void;
  onSubmit: (agencyId: string) => void; // Removed role parameter since we only use manager
  isLoading: boolean;
  agencies: AdminAgency[];
  user: AdminUser;
}

// Define a type for the form data fields - removed role since we only use manager
type FormFields = {
  agencyId: string;
};

export const AssignAgencyModal: React.FC<AssignAgencyModalProps> = ({
  isOpen,
  onOpenChange,
  onSubmit,
  isLoading,
  agencies,
  user,
}) => {
  const [formData, setFormData] = useState<FormFields>({
    agencyId: "",
  });
  const [errors, setErrors] = useState<Record<keyof FormFields, string>>({
    agencyId: "",
  });

  // Filter out agencies that are already assigned to this user
  const availableAgencies = agencies.filter((agency) => {
    const isAlreadyManager = user.managerOnSponsors?.some(
      (assignment) => assignment.sponsorId === agency.id
    );
    return !isAlreadyManager && agency.active;
  });

  const handleChange = (key: keyof FormFields, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));

    if (errors[key]) {
      setErrors((prev) => ({
        ...prev,
        [key]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {
      agencyId: formData.agencyId ? "" : "Debe seleccionar una agencia",
    };

    setErrors(newErrors);
    return !Object.values(newErrors).some((error) => error);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      onSubmit(formData.agencyId); // Removed second parameter since we only use manager role
      resetForm();
    }
  };

  const resetForm = () => {
    setFormData({
      agencyId: "",
    });
    setErrors({
      agencyId: "",
    });
  };

  const handleCancel = () => {
    resetForm();
    onOpenChange();
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent className="bg-slate-800 text-white border border-slate-700">
        <form onSubmit={handleFormSubmit}>
          <ModalHeader className="border-b border-slate-700">
            Asignar Agencia como Manager a {user.first_name}{" "}
            {user.last_name || user.username}
          </ModalHeader>
          <ModalBody className="py-4">
            <div className="space-y-4">
              <Select
                label="Agencia"
                placeholder="Seleccione una agencia"
                selectedKeys={formData.agencyId ? [formData.agencyId] : []}
                onSelectionChange={(keys) => {
                  const selected = Array.from(keys)[0]?.toString() || "";
                  handleChange("agencyId", selected);
                }}
                errorMessage={errors.agencyId}
                isDisabled={isLoading || availableAgencies.length === 0}
                className="text-white"
              >
                {availableAgencies.length > 0 ? (
                  availableAgencies.map((agency) => (
                    <SelectItem key={agency.id}>{agency.name}</SelectItem>
                  ))
                ) : (
                  <SelectItem key="no-agency">
                    No hay agencias disponibles para asignar
                  </SelectItem>
                )}
              </Select>
            </div>
          </ModalBody>
          <ModalFooter className="border-t border-slate-700">
            <Button
              type="button"
              variant="flat"
              color="danger"
              onPress={handleCancel}
              isDisabled={isLoading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              color="primary"
              isLoading={isLoading}
              isDisabled={isLoading || availableAgencies.length === 0}
              className="bg-sky-600 hover:bg-sky-700 text-white"
            >
              Asignar como Manager
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
};

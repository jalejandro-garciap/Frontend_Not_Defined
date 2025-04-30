import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Avatar,
  Select,
  SelectItem,
  Checkbox,
  Divider,
  Chip,
  Tooltip,
} from "@heroui/react";
import { AdminAgency } from "../../admin-agencies/interfaces/admin_agency.interface";
import { AdminUser } from "../interfaces/admin_user.interface";
import { FaUserCog, FaSave, FaExclamationTriangle } from "react-icons/fa";

interface UserDetailsModalProps {
  isOpen: boolean;
  onOpenChange: () => void;
  onSave: (userData: UserUpdateData) => void;
  isLoading: boolean;
  agencies: AdminAgency[];
  user: AdminUser | null;
}

export interface UserUpdateData {
  id: string;
  role: string;
  agencyIds: string[];
}

const AVAILABLE_ROLES = [
  { key: "ADMINISTRATOR", label: "Administrador" },
  { key: "MANAGER", label: "Manager" },
  { key: "STREAMER", label: "Streamer" },
  { key: "USER", label: "Usuario" },
];

export const UserDetailsModal: React.FC<UserDetailsModalProps> = ({
  isOpen,
  onOpenChange,
  onSave,
  isLoading,
  agencies,
  user,
}) => {
  const [selectedRole, setSelectedRole] = useState<string>("");
  const [selectedAgencyIds, setSelectedAgencyIds] = useState<Set<string>>(
    new Set()
  );
  const [hasChanges, setHasChanges] = useState(false);

  // Initialize form data when user changes
  useEffect(() => {
    if (user) {
      setSelectedRole(user.role || "");

      // Get IDs of agencies where user is a manager
      const managerAgencyIds = new Set(
        user.managerOnSponsors?.map((a) => a.sponsorId) || []
      );
      setSelectedAgencyIds(managerAgencyIds);
      setHasChanges(false);
    }
  }, [user]);

  const handleRoleChange = (role: string) => {
    setSelectedRole(role);
    setHasChanges(true);
  };

  const handleAgencyToggle = (agencyId: string, isSelected: boolean) => {
    const newSelection = new Set(selectedAgencyIds);

    if (isSelected) {
      // If already has an agency selected and trying to add another, show warning but allow it
      if (newSelection.size > 0 && !newSelection.has(agencyId)) {
        // We'll let the backend handle this constraint
        console.warn(
          "Due to database constraints, only one agency can be assigned to a manager."
        );
      }
      newSelection.add(agencyId);
    } else {
      newSelection.delete(agencyId);
    }

    setSelectedAgencyIds(newSelection);
    setHasChanges(true);
  };

  const handleSave = () => {
    if (!user) return;

    onSave({
      id: user.id,
      role: selectedRole,
      agencyIds: Array.from(selectedAgencyIds),
    });
  };

  if (!user) return null;

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      size="lg"
      scrollBehavior="inside"
    >
      <ModalContent className="bg-slate-800 text-white border border-slate-700">
        <ModalHeader className="border-b border-slate-700 flex items-center gap-3">
          <Avatar
            src={user.profile_img}
            fallback={<FaUserCog />}
            className="bg-slate-700 text-slate-300"
          />
          <div>
            <h3 className="text-lg font-semibold text-slate-100">
              {user.first_name} {user.last_name || user.username}
            </h3>
            <p className="text-sm text-slate-400">{user.email}</p>
          </div>
        </ModalHeader>

        <ModalBody className="py-4">
          <div className="space-y-5">
            {/* Role selection */}
            <div className="space-y-2">
              <h4 className="text-md font-medium text-slate-300">
                Rol del usuario
              </h4>
              <Select
                label="Rol"
                selectedKeys={[selectedRole]}
                onChange={(e) => handleRoleChange(e.target.value)}
                className="text-white bg-slate-900/50"
              >
                {AVAILABLE_ROLES.map((role) => (
                  <SelectItem key={role.key}>
                    {role.label}
                  </SelectItem>
                ))}
              </Select>
            </div>

            <Divider className="bg-slate-700" />

            {/* Agency assignments */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <h4 className="text-md font-medium text-slate-300">
                  Agencias Asignadas
                </h4>
                <div className="flex items-center gap-2">
                  {selectedAgencyIds.size > 1 && (
                    <Tooltip
                      content="Debido a restricciones del sistema, solo se aplicará la primera agencia seleccionada"
                      color="warning"
                    >
                      <div className="flex items-center">
                        <FaExclamationTriangle className="text-amber-500" />
                      </div>
                    </Tooltip>
                  )}
                  <Chip size="sm" className="bg-slate-700 text-slate-300">
                    {selectedAgencyIds.size} seleccionadas
                  </Chip>
                </div>
              </div>

              {agencies.length === 0 ? (
                <p className="text-slate-400 text-sm">
                  No hay agencias disponibles
                </p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2 max-h-64 overflow-y-auto p-2">
                  {agencies
                    .filter((agency) => agency.active)
                    .map((agency) => {
                      // Check if this agency already has a manager that isn't the current user
                      const hasOtherManager =
                        agency.managerUserId &&
                        agency.managerUserId !== user.id;

                      const isSelected = selectedAgencyIds.has(agency.id);

                      return (
                        <div key={agency.id} className="relative">
                          <Checkbox
                            isSelected={isSelected}
                            onValueChange={(checked) =>
                              handleAgencyToggle(agency.id, checked)
                            }
                            isDisabled={hasOtherManager ? true : false}
                            className={`text-white bg-slate-900/30 p-2 rounded border border-slate-700 
                                      ${hasOtherManager ? "opacity-60" : ""}`}
                          >
                            <div className="ml-2 flex items-center gap-2">
                              <span>{agency.name}</span>
                              {hasOtherManager && (
                                <Tooltip content="Esta agencia ya tiene un manager asignado">
                                  <FaExclamationTriangle className="text-amber-500 text-sm" />
                                </Tooltip>
                              )}
                            </div>
                          </Checkbox>
                        </div>
                      );
                    })}
                </div>
              )}

              <div className="mt-2 p-3 bg-amber-900/20 border border-amber-800/50 rounded-md">
                <div className="flex gap-2 items-start">
                  <FaExclamationTriangle className="text-amber-500 mt-0.5" />
                  <div className="text-xs text-amber-200">
                    <p className="font-medium">Restricciones del sistema:</p>
                    <ul className="list-disc ml-4 mt-1">
                      <li>Un usuario solo puede ser manager de una agencia</li>
                      <li>Una agencia solo puede tener un manager</li>
                    </ul>
                    <p className="mt-1">
                      Si selecciona múltiples agencias, solo se aplicará la
                      primera disponible.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ModalBody>

        <ModalFooter className="border-t border-slate-700">
          <Button
            type="button"
            variant="flat"
            color="danger"
            onPress={onOpenChange}
            isDisabled={isLoading}
          >
            Cancelar
          </Button>
          <Button
            type="button"
            color="primary"
            onPress={handleSave}
            isLoading={isLoading}
            isDisabled={isLoading || !hasChanges}
            startContent={<FaSave />}
            className="bg-sky-600 hover:bg-sky-700 text-white"
          >
            Guardar Cambios
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

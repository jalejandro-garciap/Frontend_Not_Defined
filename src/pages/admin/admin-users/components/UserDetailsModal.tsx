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
  { key: "ADMIN", label: "Administrador" },
  { key: "MANAGER", label: "Manager" },
  { key: "STREAMER", label: "Streamer" },
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

  useEffect(() => {
    if (user) {
      setSelectedRole(user.role || "");

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
      className="sm:p-0 p-1"
      placement="center"
    >
      <ModalContent className="bg-slate-800 text-white border border-slate-700 w-full max-w-lg sm:max-w-2xl mx-auto rounded-lg">
        <ModalHeader className="border-b border-slate-700 flex items-center gap-3 px-2 sm:px-6 py-3">
          <Avatar
            src={user.profile_img}
            fallback={<FaUserCog />}
            className="bg-slate-700 text-slate-300 w-10 h-10 sm:w-14 sm:h-14"
          />
          <div>
            <h3 className="text-base sm:text-lg font-semibold text-slate-100">
              {user.first_name} {user.last_name || user.username}
            </h3>
            <p className="text-xs sm:text-sm text-slate-400">{user.email}</p>
          </div>
        </ModalHeader>

        <ModalBody className="py-3 sm:py-4 px-2 sm:px-6">
          <div className="space-y-4 sm:space-y-5">
            <div className="space-y-1 sm:space-y-2">
              <h4 className="text-sm sm:text-md font-medium text-slate-300">
                Rol del usuario
              </h4>
              <Select
                label="Rol"
                selectedKeys={[selectedRole]}
                onChange={(e) => handleRoleChange(e.target.value)}
                classNames={{
                  base: "min-w-[120px] sm:min-w-[180px]",
                  trigger:
                    "bg-slate-900/50 data-[hover=true]:bg-slate-700 transition-all focus:outline-none h-8 sm:h-10 text-sm sm:text-base",
                  popoverContent: "bg-slate-900",
                }}
              >
                {AVAILABLE_ROLES.map((role) => (
                  <SelectItem key={role.key}>{role.label}</SelectItem>
                ))}
              </Select>
            </div>

            <Divider className="bg-slate-700" />

            {/* Agency assignments */}
            <div className="space-y-2 sm:space-y-3">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <h4 className="text-sm sm:text-md font-medium text-slate-300">
                  Agencias Asignadas
                </h4>
                <div className="flex items-center gap-2">
                  <Chip size="sm" className="bg-slate-700 text-slate-300">
                    {selectedAgencyIds.size} seleccionadas
                  </Chip>
                </div>
              </div>

              {agencies.length === 0 ? (
                <p className="text-slate-400 text-xs sm:text-sm">
                  No hay agencias disponibles
                </p>
              ) : (
                <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-2 gap-2 sm:gap-3 mt-2 max-h-48 sm:max-h-64 overflow-y-auto p-1">
                  {agencies
                    .filter((agency) => agency.active)
                    .map((agency) => {
                      const hasOtherManager =
                        agency.managerUserId &&
                        agency.managerUserId !== user.id;

                      const isSelected = selectedAgencyIds.has(agency.id);

                      return (
                        <div
                          key={agency.id}
                          className="bg-slate-900/60 border border-slate-700 rounded-lg px-5 sm:px-5 py-2 flex items-center min-h-[40px] sm:min-h-[48px]"
                        >
                          <Checkbox
                            isSelected={isSelected}
                            onValueChange={(checked) =>
                              handleAgencyToggle(agency.id, checked)
                            }
                            isDisabled={hasOtherManager ? true : false}
                            className={`text-white p-0 ${
                              hasOtherManager ? "opacity-60" : ""
                            }`}
                          >
                            <div className="ml-2 flex items-center gap-2">
                              <span className="truncate text-xs sm:text-base">
                                {agency.name}
                              </span>
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
            </div>
          </div>
        </ModalBody>

        <ModalFooter className="border-t border-slate-700 flex flex-col sm:flex-row gap-2 sm:gap-4 px-2 sm:px-6 py-3">
          <Button
            type="button"
            variant="flat"
            color="danger"
            onPress={onOpenChange}
            isDisabled={isLoading}
            className="w-full sm:w-auto"
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
            className="bg-sky-600 hover:bg-sky-700 text-white w-full sm:w-auto"
          >
            Guardar Cambios
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

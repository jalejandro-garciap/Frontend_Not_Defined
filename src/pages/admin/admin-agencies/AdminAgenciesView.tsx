import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Button,
  Spinner,
  Card,
  CardHeader,
  CardBody,
  Avatar,
  useDisclosure,
  Chip,
  Tooltip,
} from "@heroui/react";
import {
  FaPlus,
  FaBuilding,
  FaEdit,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";
import {
  fetchAllAgencies,
  createAgency,
  updateAgency,
} from "./services/adminAgencyService";
import { CreateAgencyModal } from "./components/CreateAgencyModal";
import {
  CreateAgencyDto,
  AdminAgency,
  AgencyFormData, // Import the shared type
} from "./interfaces/admin_agency.interface";
import { useState } from "react"; // Import useState
// import { toast } from "react-hot-toast";

const AdminAgenciesView = () => {
  const queryClient = useQueryClient();
  const {
    isOpen: isCreateOpen,
    onOpen: onCreateOpen,
    onOpenChange: onCreateOpenChange,
  } = useDisclosure();

  const {
    isOpen: isEditOpen,
    onOpen: onEditOpen,
    onOpenChange: onEditOpenChange,
  } = useDisclosure();
  const [editingAgency, setEditingAgency] = useState<AdminAgency | null>(null);

  const {
    data: agencies = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["adminAgencies"],
    queryFn: fetchAllAgencies,
    staleTime: 5 * 60 * 1000,
  });

  const { mutate: createAgencyMutate, isPending: isCreating } = useMutation({
    mutationFn: createAgency,
    onSuccess: (newAgency) => {
      queryClient.invalidateQueries({ queryKey: ["adminAgencies"] });
      //   toast.success(`Agencia "${newAgency.name}" creada con éxito.`);
      onCreateOpenChange();
    },
    onError: (err: any) => {
      console.error("Error creating agency:", err);
      //   toast.error(err?.response?.data?.message || "Error al crear la agencia.");
    },
  });

  const { mutate: updateAgencyMutate, isPending: isUpdating } = useMutation({
    // The mutation function expects the ID and the data payload
    mutationFn: (data: AdminAgency) => updateAgency(data.id, data), // Adjust if updateAgency expects different args
    onSuccess: (updatedAgency) => {
      queryClient.invalidateQueries({ queryKey: ["adminAgencies"] });
      //   toast.success(`Agencia "${updatedAgency.name}" actualizada con éxito.`);
      onEditOpenChange();
      setEditingAgency(null);
    },
    onError: (err: any) => {
      console.error("Error updating agency:", err);
      //   toast.error(err?.response?.data?.message || "Error al actualizar la agencia.");
    },
  });

  const handleCreateAgency = (data: AgencyFormData) => {
    const createData: CreateAgencyDto = {
      name: data.name,
      description: data.description,
      active: data.active,
    };
    createAgencyMutate(createData);
  };

  const handleEditClick = (agency: AdminAgency) => {
    setEditingAgency(agency);
    onEditOpen();
  };

  const handleUpdateAgency = (data: AgencyFormData) => {
    if (!editingAgency) return;
    const updateData: AdminAgency = {
      id: editingAgency.id,
      name: data.name,
      description: data.description,
      active: data.active,
    };
    updateAgencyMutate(updateData);
  };

  return (
    <div className="w-full max-w-4xl space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-slate-100">
          Administrar Agencias
        </h2>
        <Button
          color="primary"
          onPress={onCreateOpen}
          startContent={<FaPlus />}
          className="bg-sky-600 hover:bg-sky-700 text-white"
        >
          Crear Agencia
        </Button>
      </div>

      {isLoading && (
        <div className="flex justify-center py-12">
          <Spinner size="lg" color="primary" label="Cargando agencias..." />
        </div>
      )}

      {error && (
        <Card className="bg-red-900/30 border border-red-700">
          <CardBody>
            <p className="text-red-300 text-center">
              Error al cargar las agencias: {error.message}
            </p>
          </CardBody>
        </Card>
      )}

      {!isLoading && !error && (
        <Card className="bg-slate-900/50 border border-slate-700">
          <CardHeader className="border-b border-slate-700">
            <p className="text-md font-semibold text-slate-100">
              Lista de Agencias ({agencies.length})
            </p>
          </CardHeader>
          <CardBody className="p-0">
            {agencies.length > 0 ? (
              <ul className="divide-y divide-slate-700">
                {agencies.map((agency) => (
                  <li
                    key={agency.id}
                    className="flex items-center justify-between p-4 hover:bg-slate-800/50 transition-colors duration-150 gap-4"
                  >
                    <div className="flex items-center gap-3 flex-grow">
                      <Avatar
                        icon={<FaBuilding />}
                        size="sm"
                        className="bg-slate-700 text-slate-400 flex-shrink-0"
                      />
                      <div className="flex-grow min-w-0">
                        <span
                          className="text-slate-200 font-medium block truncate"
                          title={agency.name}
                        >
                          {agency.name}
                        </span>
                        {agency.description && (
                          <span
                            className="text-xs text-slate-400 block truncate"
                            title={agency.description}
                          >
                            {agency.description}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <Chip
                        size="sm"
                        color={agency.active ? "success" : "danger"}
                        variant="flat"
                        startContent={
                          agency.active ? (
                            <FaCheckCircle className="mr-1" />
                          ) : (
                            <FaTimesCircle className="mr-1" />
                          )
                        }
                        classNames={{
                          base: agency.active
                            ? "border-green-700 bg-green-900/30"
                            : "border-red-700 bg-red-900/30",
                          content: agency.active
                            ? "text-green-300"
                            : "text-red-300",
                        }}
                      >
                        {agency.active ? "Activa" : "Inactiva"}
                      </Chip>
                      <Tooltip content="Editar Agencia" placement="top">
                        <Button
                          isIconOnly
                          size="sm"
                          variant="light"
                          onPress={() => handleEditClick(agency)}
                          className="text-slate-400 hover:text-sky-400"
                          aria-label="Editar Agencia"
                        >
                          <FaEdit />
                        </Button>
                      </Tooltip>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-center text-slate-400 text-sm py-6">
                No hay agencias creadas todavía.
              </p>
            )}
          </CardBody>
        </Card>
      )}

      <CreateAgencyModal
        isOpen={isCreateOpen}
        onOpenChange={onCreateOpenChange}
        onSubmit={handleCreateAgency}
        isLoading={isCreating}
      />

      {editingAgency && (
        <CreateAgencyModal
          isOpen={isEditOpen}
          onOpenChange={onEditOpenChange}
          onSubmit={handleUpdateAgency}
          isLoading={isUpdating}
          agencyToEdit={editingAgency}
        />
      )}
    </div>
  );
};

export default AdminAgenciesView;

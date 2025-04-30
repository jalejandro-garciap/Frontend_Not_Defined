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
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@heroui/react";
import { FaUserCog, FaEdit, FaUserEdit } from "react-icons/fa";
import { fetchUsers, updateUserDetails } from "./services/adminUserService";
import { fetchAllAgencies } from "../admin-agencies/services/adminAgencyService";
import {
  UserDetailsModal,
  UserUpdateData,
} from "./components/UserDetailsModal";
import { AdminUser } from "./interfaces/admin_user.interface";
import { useState } from "react";
// import { toast } from "react-hot-toast";

const AdminUsersView = () => {
  const queryClient = useQueryClient();
  const {
    isOpen: isDetailsOpen,
    onOpen: onDetailsOpen,
    onOpenChange: onDetailsOpenChange,
  } = useDisclosure();
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);

  const {
    data: users = [],
    isLoading: isLoadingUsers,
    error: usersError,
  } = useQuery({
    queryKey: ["adminUsers"],
    queryFn: fetchUsers,
    staleTime: 5 * 60 * 1000,
  });

  const {
    data: agencies = [],
    isLoading: isLoadingAgencies,
    error: agenciesError,
  } = useQuery({
    queryKey: ["adminAgencies"],
    queryFn: fetchAllAgencies,
    staleTime: 5 * 60 * 1000,
  });

  const { mutate: updateUserMutate, isPending: isUpdating } = useMutation({
    mutationFn: updateUserDetails,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminUsers"] });
      // toast.success("Usuario actualizado con éxito.");
      onDetailsOpenChange();
      setSelectedUser(null);
    },
    onError: (err: any) => {
      console.error("Error updating user:", err);
      // toast.error(err?.response?.data?.message || "Error al actualizar el usuario.");
    },
  });

  const handleEditUser = (user: AdminUser) => {
    setSelectedUser(user);
    onDetailsOpen();
  };

  const handleSaveUserDetails = (userData: UserUpdateData) => {
    updateUserMutate(userData);
  };

  // Get manager assignments for a user
  const getUserAgencies = (user: AdminUser) => {
    return (
      user.managerOnSponsors?.map((a) => {
        const agency = agencies.find((ag) => ag.id === a.sponsorId);
        return {
          id: a.id,
          agencyId: a.sponsorId,
          agencyName: agency?.name || "Desconocida",
          since: a.since,
        };
      }) || []
    );
  };

  return (
    <div className="w-full max-w-4xl space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-slate-100">
          Administrar Usuarios y Managers
        </h2>
      </div>

      {(isLoadingUsers || isLoadingAgencies) && (
        <div className="flex justify-center py-12">
          <Spinner size="lg" color="primary" label="Cargando datos..." />
        </div>
      )}

      {(usersError || agenciesError) && (
        <Card className="bg-red-900/30 border border-red-700">
          <CardBody>
            <p className="text-red-300 text-center">
              Error al cargar los datos:{" "}
              {usersError?.message || agenciesError?.message}
            </p>
          </CardBody>
        </Card>
      )}

      {!isLoadingUsers && !usersError && (
        <Card className="bg-slate-900/50 border border-slate-700">
          <CardHeader className="border-b border-slate-700">
            <p className="text-md font-semibold text-slate-100">
              Lista de Usuarios ({users.length})
            </p>
          </CardHeader>
          <CardBody>
            <Table aria-label="Lista de usuarios" className="text-white">
              <TableHeader>
                <TableColumn className="text-slate-300 bg-slate-800/60">
                  Usuario
                </TableColumn>
                <TableColumn className="text-slate-300 bg-slate-800/60">
                  Email
                </TableColumn>
                <TableColumn className="text-slate-300 bg-slate-800/60">
                  Rol
                </TableColumn>
                <TableColumn className="text-slate-300 bg-slate-800/60">
                  Agencias
                </TableColumn>
                <TableColumn className="text-slate-300 bg-slate-800/60">
                  Acciones
                </TableColumn>
              </TableHeader>
              <TableBody emptyContent="No hay usuarios disponibles">
                {users.map((user) => (
                  <TableRow key={user.id} className="hover:bg-slate-800/30">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar
                          src={user.profile_img}
                          fallback={<FaUserCog />}
                          size="sm"
                          className="bg-slate-700 text-slate-400"
                        />
                        <span className="text-slate-200">
                          {user.first_name} {user.last_name || user.username}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-slate-300">{user.email}</span>
                    </TableCell>
                    <TableCell>
                      <Chip
                        size="sm"
                        color={user.role === "MANAGER" ? "primary" : "default"}
                        variant="flat"
                        className={
                          user.role === "MANAGER"
                            ? "bg-sky-900/30 border-sky-700 text-sky-300"
                            : "bg-slate-800/50 border-slate-700 text-slate-300"
                        }
                      >
                        {user.role}
                      </Chip>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {getUserAgencies(user).length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {getUserAgencies(user)
                              .slice(0, 2)
                              .map((agency, idx) => (
                                <Chip
                                  key={idx}
                                  size="sm"
                                  color="primary"
                                  variant="flat"
                                  className="bg-sky-900/30 border-sky-700 text-sky-300"
                                >
                                  {agency.agencyName}
                                </Chip>
                              ))}
                            {getUserAgencies(user).length > 2 && (
                              <Chip
                                size="sm"
                                color="default"
                                variant="flat"
                                className="bg-slate-700/50 text-slate-300"
                              >
                                +{getUserAgencies(user).length - 2}
                              </Chip>
                            )}
                          </div>
                        ) : (
                          <span className="text-slate-400 text-sm">
                            Ninguna
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Tooltip content="Editar Usuario" placement="top">
                        <Button
                          size="sm"
                          color="primary"
                          variant="flat"
                          onPress={() => handleEditUser(user)}
                          startContent={<FaUserEdit />}
                          className="bg-sky-900/30 text-sky-300 border border-sky-700 hover:bg-sky-800/40"
                        >
                          Editar
                        </Button>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardBody>
        </Card>
      )}

      <UserDetailsModal
        isOpen={isDetailsOpen}
        onOpenChange={onDetailsOpenChange}
        onSave={handleSaveUserDetails}
        isLoading={isUpdating}
        agencies={agencies}
        user={selectedUser}
      />
    </div>
  );
};

export default AdminUsersView;

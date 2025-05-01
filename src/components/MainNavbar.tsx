import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Button,
  Dropdown,
  DropdownTrigger,
  Avatar,
  DropdownMenu,
  DropdownItem,
  Select,
  SelectItem,
  Spinner,
} from "@heroui/react";
import { IoLogOutOutline } from "react-icons/io5";
import { MdBusinessCenter } from "react-icons/md";
import { useAuth } from "../context/AuthContext";
import { useManagerAgencies } from "../pages/agency/store/agencyStore";
import { useNavigate } from "react-router";

export const MainNavbar = () => {
  const { user, logout } = useAuth();
  const nav = useNavigate();
  const activeSection = window.location.pathname;

  const isManager = user?.role === "MANAGER";
  const isStreamer = user?.role === "STREAMER";
  const isAdmin = user?.role === "ADMIN";

  const { selectedAgency, managedAgencies, selectAgency, isLoading, error } =
    isManager
      ? useManagerAgencies()
      : {
          selectedAgency: null,
          managedAgencies: [],
          selectAgency: () => {},
          isLoading: false,
          error: null,
        };

  const handleNavigate = (section: string) => {
    nav(`/${section}`);
  };

  return (
    <Navbar
      isBordered
      className="bg-slate-900/80 backdrop-blur-sm border-b border-slate-700"
    >
      <NavbarBrand>
        <p className="font-bold text-inherit text-primary-400">StreamerPanel</p>
      </NavbarBrand>

      {isAdmin && (
        <>
          <NavbarItem>
            <Button
              variant="flat"
              onPress={() => handleNavigate("admin/agencias")}
              className={`
              ${
                activeSection === "/admin/agencias"
                  ? "bg-sky-600/20 text-sky-300"
                  : "bg-transparent text-slate-400 hover:bg-slate-700/50 hover:text-slate-200"
              }
              px-4 py-2 rounded-xl text-sm font-medium transition-colors duration-150 ease-in-out
            `}
            >
              Agencias
            </Button>
          </NavbarItem>
          <NavbarItem>
            <Button
              variant="flat"
              onPress={() => handleNavigate("admin/usuarios")}
              className={`
              ${
                activeSection === "/admin/usuarios"
                  ? "bg-sky-600/20 text-sky-300"
                  : "bg-transparent text-slate-400 hover:bg-slate-700/50 hover:text-slate-200"
              }
              px-4 py-2 rounded-xl text-sm font-medium transition-colors duration-150 ease-in-out
            `}
            >
              Usuarios
            </Button>
          </NavbarItem>
        </>
      )}

      {isManager && (
        <>
          <div className="flex items-center ml-4">
            <div className="relative flex items-center gap-2 px-4 py-2 bg-sky-700/20 border border-sky-700/40 rounded-lg">
              <MdBusinessCenter className="text-sky-400" size={18} />

              {isLoading ? (
                <div className="flex items-center gap-2">
                  <Spinner size="sm" color="primary" />
                  <span className="text-sm text-sky-300">
                    Cargando agencias...
                  </span>
                </div>
              ) : error ? (
                <span className="text-sm text-red-400">
                  Error al cargar agencias
                </span>
              ) : (
                <Select
                  size="sm"
                  aria-label="Seleccionar Agencia"
                  selectedKeys={[selectedAgency?.id || ""]}
                  classNames={{
                    base: "min-w-[180px]",
                    trigger:
                      "bg-transparent border-0 focus:outline-none p-0 h-7",
                    value: "text-sky-300 font-medium",
                  }}
                  onChange={(e) => selectAgency(e.target.value)}
                >
                  {managedAgencies.map((agency) => (
                    <SelectItem key={agency.id}>{agency.name}</SelectItem>
                  ))}
                </Select>
              )}
            </div>
          </div>
          <NavbarItem>
            <Button
              variant="flat"
              onPress={() => handleNavigate("streamers")}
              className={`
                ${
                  activeSection === "/streamers"
                    ? "bg-sky-600/20 text-sky-300"
                    : "bg-transparent text-slate-400 hover:bg-slate-700/50 hover:text-slate-200"
                }
                px-4 py-2 rounded-xl text-sm font-medium transition-colors duration-150 ease-in-out
              `}
            >
              Streamers
            </Button>
          </NavbarItem>
          <NavbarItem>
            <Button
              variant="flat"
              onPress={() => handleNavigate("reportes")}
              className={`
                ${
                  activeSection === "/reportes"
                    ? "bg-sky-600/20 text-sky-300"
                    : "bg-transparent text-slate-400 hover:bg-slate-700/50 hover:text-slate-200"
                }
                px-4 py-2 rounded-xl text-sm font-medium transition-colors duration-150 ease-in-out
              `}
            >
              Reportes
            </Button>
          </NavbarItem>
        </>
      )}

      <NavbarContent className="hidden sm:flex gap-2" justify="center">
        {isStreamer && (
          <>
            <NavbarItem>
              <Button
                variant="flat"
                onPress={() => handleNavigate("redes-sociales")}
                className={`
                ${
                  activeSection === "/redes-sociales"
                    ? "bg-sky-600/20 text-sky-300"
                    : "bg-transparent text-slate-400 hover:bg-slate-700/50 hover:text-slate-200"
                }
                px-4 py-2 rounded-xl text-sm font-medium transition-colors duration-150 ease-in-out
              `}
              >
                Redes Sociales
              </Button>
            </NavbarItem>
            <NavbarItem>
              <Button
                variant="flat"
                onPress={() => handleNavigate("agencias")}
                className={`
                ${
                  activeSection === "/agencias"
                    ? "bg-sky-600/20 text-sky-300"
                    : "bg-transparent text-slate-400 hover:bg-slate-700/50 hover:text-slate-200"
                }
                px-4 py-2 rounded-xl text-sm font-medium transition-colors duration-150 ease-in-out
              `}
              >
                Agencias
              </Button>
            </NavbarItem>
          </>
        )}
      </NavbarContent>

      <NavbarContent as="div" justify="end">
        <Dropdown
          placement="bottom-end"
          className="bg-slate-900 border border-slate-700 rounded-xl shadow-lg"
        >
          <DropdownTrigger>
            <Avatar
              isBordered
              as="button"
              className="transition-transform hover:scale-105"
              color="primary"
              size="sm"
              src={user?.profile_img || undefined}
            />
          </DropdownTrigger>
          <DropdownMenu
            aria-label="Profile Actions"
            variant="flat"
            itemClasses={{
              base: "data-[hover=true]:bg-slate-700/50 rounded-lg",
              title: "font-medium text-sm text-slate-200",
            }}
            disabledKeys={["profile_info"]}
          >
            <DropdownItem
              key="profile_info"
              className="h-14 gap-2 opacity-100 cursor-default"
              isReadOnly // Para evitar efectos hover no deseados
            >
              <p className="font-semibold text-xs text-slate-400">
                Sesión iniciada como
              </p>
              <p className="font-semibold text-sm text-primary-400">
                {user?.email || "usuario@ejemplo.com"}
              </p>
            </DropdownItem>
            <DropdownItem
              key="logout"
              color="danger"
              className="text-red-400 data-[hover=true]:bg-red-600/20"
              startContent={<IoLogOutOutline size={18} />}
              onPress={logout}
            >
              Cerrar Sesión
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </NavbarContent>
    </Navbar>
  );
};

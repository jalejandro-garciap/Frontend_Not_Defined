import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Button,
  Badge,
  Dropdown,
  DropdownTrigger,
  Avatar,
  DropdownMenu,
  DropdownItem,
} from "@heroui/react";
import { FaUserCircle } from "react-icons/fa";
import {
  IoNotificationsOutline,
  IoSettingsOutline,
  IoLogOutOutline,
} from "react-icons/io5";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router";

export const MainNavbar = () => {
  const { user, logout } = useAuth();

  const nav = useNavigate();
  const activeSection = window.location.pathname.split("/")[1];

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

      <NavbarContent className="hidden sm:flex gap-2" justify="center">
        <NavbarItem>
          <Button
            variant="flat"
            onPress={() => handleNavigate("redes-sociales")}
            className={`
                ${
                  activeSection === "redes-sociales"
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
                  activeSection === "agencias"
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
            onPress={() => handleNavigate("streamers")}
            className={`
                ${
                  activeSection === "streamers"
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
                  activeSection === "reportes"
                    ? "bg-sky-600/20 text-sky-300"
                    : "bg-transparent text-slate-400 hover:bg-slate-700/50 hover:text-slate-200"
                }
                px-4 py-2 rounded-xl text-sm font-medium transition-colors duration-150 ease-in-out
              `}
          >
            Reportes
          </Button>
        </NavbarItem>
      </NavbarContent>

      <NavbarContent as="div" justify="end">
        <Button
          isIconOnly
          variant="flat"
          aria-label="Notificaciones"
          className="text-slate-400 hover:text-slate-200 bg-slate-800/50 hover:bg-slate-700/50 rounded-full"
        >
          <Badge content="5" color="danger" shape="circle" size="sm">
            <IoNotificationsOutline size={20} />
          </Badge>
        </Button>

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
              src={user?.profile_image || undefined}
              icon={
                !user?.profile_image ? (
                  <FaUserCircle size={20} className="text-slate-400" />
                ) : undefined
              }
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
              key="settings"
              startContent={
                <IoSettingsOutline className="text-slate-400" size={18} />
              }
            >
              Configuración
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

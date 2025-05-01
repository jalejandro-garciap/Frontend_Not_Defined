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
  Divider,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
} from "@heroui/react";
import { IoLogOutOutline } from "react-icons/io5";
import { MdBusinessCenter } from "react-icons/md";
import { useAuth } from "../context/AuthContext";
import { useManagerAgencies } from "../pages/agency/store/agencyStore";
import { useNavigate } from "react-router";
import { FaBars, FaTimes } from "react-icons/fa";
import { useState } from "react";

export const MainNavbar = () => {
  const { user, logout } = useAuth();
  const nav = useNavigate();
  const activeSection = window.location.pathname;
  const [isDrawerOpen, setIsDrawerOpen] = useState(false); // State for drawer

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
    setIsDrawerOpen(false); // Close drawer on navigation
  };

  const renderNavButton = (path: string, label: string) => (
    <Button
      variant="flat"
      onPress={() => handleNavigate(path)}
      className={`
        ${
          activeSection === `/${path}`
            ? "bg-sky-600/20 text-sky-300"
            : "bg-transparent text-slate-400 hover:bg-slate-700/50 hover:text-slate-200"
        }
        w-full justify-start px-4 py-2 rounded-xl text-sm font-medium transition-colors duration-150 ease-in-out
      `}
    >
      {label}
    </Button>
  );

  return (
    <>
      <Navbar
        isBordered
        className="bg-slate-900/80 backdrop-blur-sm border-b border-slate-700 px-2 sm:px-6"
      >
        {/* Hamburger Menu Button - Visible only on small screens */}
        <NavbarContent justify="start" className="sm:hidden">
          <Button
            variant="light"
            isIconOnly
            size="sm"
            onPress={() => setIsDrawerOpen(true)}
            className="text-slate-300"
          >
            <FaBars size={20} />
          </Button>
        </NavbarContent>

        <NavbarBrand className="flex-grow sm:flex-grow-0">
          <p className="font-bold text-inherit text-primary-400 text-base sm:text-lg">
            StreamerPanel
          </p>
        </NavbarBrand>

        {/* Desktop Navigation Items - Hidden on small screens */}
        <NavbarContent className="hidden sm:flex gap-2" justify="end">
          {isAdmin && (
            <>
              <NavbarItem>
                {renderNavButton("admin/agencias", "Agencias")}
              </NavbarItem>
              <NavbarItem>
                {renderNavButton("admin/usuarios", "Usuarios")}
              </NavbarItem>
            </>
          )}

          {isManager && (
            <>
              {/* Agency Selector */}
              <NavbarItem>
                <div className="flex items-center">
                  <div className="relative flex items-center gap-2 px-2 sm:px-4 py-1 bg-sky-700/20 border border-sky-700/40 rounded-lg">
                    <MdBusinessCenter className="text-sky-400" size={18} />
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <Spinner size="sm" color="primary" />
                        <span className="text-xs sm:text-sm text-sky-300">
                          Cargando...
                        </span>
                      </div>
                    ) : error ? (
                      <span className="text-xs sm:text-sm text-red-400">
                        Error
                      </span>
                    ) : (
                      <Select
                        size="sm"
                        aria-label="Seleccionar Agencia"
                        selectedKeys={[selectedAgency?.id || ""]}
                        classNames={{
                          base: "min-w-[120px] sm:min-w-[180px]",
                          trigger:
                            "bg-transparent data-[hover=true]:bg-slate-700/30 transition-all focus:outline-none h-7 text-xs sm:text-sm border-none shadow-none",
                          popoverContent: "bg-slate-900",
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
              </NavbarItem>
              <NavbarItem>
                {renderNavButton("streamers", "Streamers")}
              </NavbarItem>
              <NavbarItem>{renderNavButton("reportes", "Reportes")}</NavbarItem>
            </>
          )}

          {isStreamer && (
            <>
              <NavbarItem>
                {renderNavButton("redes-sociales", "Redes Sociales")}
              </NavbarItem>
              <NavbarItem>{renderNavButton("agencias", "Agencias")}</NavbarItem>
            </>
          )}
        </NavbarContent>

        {/* User Profile Dropdown - Always visible */}
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
                size="sm" // Consistent size
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
                isReadOnly
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

      {/* Mobile Drawer */}
      <Drawer
        isOpen={isDrawerOpen}
        onOpenChange={setIsDrawerOpen}
        placement="left"
        hideCloseButton
      >
        <DrawerContent className="bg-slate-900 text-white border-r border-slate-700 w-72">
          <DrawerHeader className="flex justify-between items-center border-b border-slate-700">
            <p className="font-bold text-inherit text-primary-400">Menú</p>
            <Button
              variant="light"
              isIconOnly
              size="sm"
              onPress={() => setIsDrawerOpen(false)}
              className="text-slate-400 hover:text-white"
            >
              <FaTimes size={20} />
            </Button>
          </DrawerHeader>
          <DrawerBody className="space-y-3 p-4">
            {isAdmin && (
              <>
                {renderNavButton("admin/agencias", "Agencias")}
                {renderNavButton("admin/usuarios", "Usuarios")}
              </>
            )}

            {isManager && (
              <>
                <div className="flex items-center w-full">
                  <div className="relative flex items-center gap-2 px-3 py-2 bg-sky-700/20 border border-sky-700/40 rounded-lg w-full">
                    <MdBusinessCenter className="text-sky-400" size={18} />
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <Spinner size="sm" color="primary" />
                        <span className="text-xs text-sky-300">
                          Cargando...
                        </span>
                      </div>
                    ) : error ? (
                      <span className="text-xs text-red-400">Error</span>
                    ) : (
                      <Select
                        size="sm"
                        aria-label="Seleccionar Agencia"
                        selectedKeys={[selectedAgency?.id || ""]}
                        classNames={{
                          base: "flex-1",
                          trigger:
                            "bg-transparent data-[hover=true]:bg-slate-700/30 transition-all focus:outline-none h-7 text-xs border-none shadow-none",
                          popoverContent: "bg-slate-900",
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
                <Divider className="bg-slate-700" />
                {renderNavButton("streamers", "Streamers")}
                {renderNavButton("reportes", "Reportes")}
              </>
            )}

            {isStreamer && (
              <>
                {renderNavButton("redes-sociales", "Redes Sociales")}
                {renderNavButton("agencias", "Agencias")}
              </>
            )}
          </DrawerBody>
          {/* Optional: Footer for logout or other actions */}
          <DrawerFooter className="border-t border-slate-700">
            <Button
              variant="flat"
              color="danger"
              onPress={logout}
              className="w-full"
            >
              Cerrar Sesión
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
};

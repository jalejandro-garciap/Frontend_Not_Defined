import {
  Card,
  CardBody,
  Avatar,
  Dropdown,
  DropdownTrigger,
  Button,
  DropdownMenu,
  DropdownItem,
  Spinner,
  Tooltip,
} from "@heroui/react";
import {
  FaUserCircle,
  FaInstagram,
  FaTiktok,
  FaYoutube,
  FaEllipsisV,
  FaTrashAlt,
  FaExclamationTriangle,
} from "react-icons/fa";
import { AffiliatedStreamer } from "../interfaces/affiliated_streamer.interface";

export const AffiliatedStreamerCard = ({
  streamer,
  onRemove,
  loadingRemove,
}: {
  streamer: AffiliatedStreamer;
  onRemove: (id: string) => void;
  loadingRemove: boolean;
}) => {
  const getSocialStatus = (social: any) => {
    if (!social) return { connected: false, isExpired: false };

    if (typeof social === "object" && "connected" in social) {
      return {
        connected: social.connected,
        isExpired: social.isTokenExpired || false,
      };
    }

    return { connected: !!social, isExpired: false };
  };

  const instagramStatus = getSocialStatus(streamer.connectedSocials?.instagram);
  const tiktokStatus = getSocialStatus(streamer.connectedSocials?.tiktok);
  const youtubeStatus = getSocialStatus(streamer.connectedSocials?.youtube);

  const hasExpiredTokens =
    instagramStatus.isExpired ||
    tiktokStatus.isExpired ||
    youtubeStatus.isExpired;

  return (
    <Card className="p-4 bg-slate-800/50 border border-slate-700">
      <CardBody className="flex flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Avatar
            src={streamer.imageUrl}
            icon={<FaUserCircle className="text-slate-400" />}
            size="md"
          />
          <span className="font-medium text-slate-200">{streamer.name}</span>
          {hasExpiredTokens && (
            <Tooltip content="Este streamer tiene tokens expirados en una o más redes sociales">
              <FaExclamationTriangle className="text-amber-500" size={16} />
            </Tooltip>
          )}
        </div>
        <div className="flex items-center gap-3">
          {instagramStatus.connected && (
            <Tooltip
              content={
                instagramStatus.isExpired
                  ? "Token de Instagram expirado"
                  : "Instagram conectado"
              }
            >
              <FaInstagram
                size={18}
                className={
                  instagramStatus.isExpired
                    ? "text-amber-500"
                    : "text-slate-400"
                }
              />
            </Tooltip>
          )}
          {tiktokStatus.connected && (
            <Tooltip
              content={
                tiktokStatus.isExpired
                  ? "Token de TikTok expirado"
                  : "TikTok conectado"
              }
            >
              <FaTiktok
                size={18}
                className={
                  tiktokStatus.isExpired ? "text-amber-500" : "text-slate-400"
                }
              />
            </Tooltip>
          )}
          {youtubeStatus.connected && (
            <Tooltip
              content={
                youtubeStatus.isExpired
                  ? "Token de YouTube expirado"
                  : "YouTube conectado"
              }
            >
              <FaYoutube
                size={18}
                className={
                  youtubeStatus.isExpired ? "text-amber-500" : "text-slate-400"
                }
              />
            </Tooltip>
          )}
        </div>
        <Dropdown
          placement="bottom-end"
          className="bg-slate-900 border border-slate-700 rounded-xl shadow-lg"
        >
          <DropdownTrigger>
            <Button
              isIconOnly
              variant="light"
              size="sm"
              className="text-slate-400 hover:text-slate-100"
            >
              <FaEllipsisV />
            </Button>
          </DropdownTrigger>
          <DropdownMenu
            aria-label="Streamer Actions"
            variant="flat"
            itemClasses={{
              base: "data-[hover=true]:bg-slate-700/50 rounded-lg",
              title: "font-medium text-sm text-slate-200",
            }}
            disabledKeys={loadingRemove ? ["remove"] : []}
          >
            <DropdownItem
              key="remove"
              color="danger"
              startContent={
                loadingRemove ? <Spinner size="sm" /> : <FaTrashAlt size={14} />
              }
              onPress={() => onRemove(streamer.id)}
              className="text-red-400 data-[hover=true]:bg-red-600/20"
            >
              {loadingRemove ? "Eliminando..." : "Eliminar Streamer"}
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </CardBody>
    </Card>
  );
};

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
  Chip,
  Tooltip,
} from "@heroui/react";
import {
  FaUserCircle,
  FaInstagram,
  FaTiktok,
  FaYoutube,
  FaEllipsisV,
  FaTrashAlt,
} from "react-icons/fa";
import { FiAlertTriangle, FiCheckCircle, FiXCircle } from "react-icons/fi";
import { AffiliatedStreamer } from "../interfaces/affiliated_streamer.interface";

interface SocialIconProps {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  platform: string;
  isConnected: boolean;
  hasExpiredToken?: boolean;
  username?: string;
}

const SocialIcon = ({ icon: Icon, platform, isConnected, hasExpiredToken, username }: SocialIconProps) => {
  if (!isConnected) {
    return (
      <Tooltip content={`${platform} no conectado`}>
        <div className="relative">
          <Icon size={18} className="text-slate-600" />
          <FiXCircle 
            size={10} 
            className="absolute -top-1 -right-1 text-red-400 bg-slate-800 rounded-full" 
          />
        </div>
      </Tooltip>
    );
  }

  if (hasExpiredToken) {
    return (
      <Tooltip content={`${platform} - Token expirado (${username ? `@${username}` : 'Usuario desconocido'}) - No disponible para reportes`}>
        <div className="relative">
          <Icon size={18} className="text-yellow-400" />
          <FiAlertTriangle 
            size={10} 
            className="absolute -top-1 -right-1 text-yellow-400 bg-slate-800 rounded-full" 
          />
        </div>
      </Tooltip>
    );
  }

  return (
    <Tooltip content={`${platform} conectado${username ? ` - @${username}` : ''} - Disponible para reportes`}>
      <div className="relative">
        <Icon size={18} className="text-green-400" />
        <FiCheckCircle 
          size={10} 
          className="absolute -top-1 -right-1 text-green-400 bg-slate-800 rounded-full" 
        />
      </div>
    </Tooltip>
  );
};

export const AffiliatedStreamerCard = ({
  streamer,
  onRemove,
  loadingRemove,
}: {
  streamer: AffiliatedStreamer;
  onRemove: (id: string) => void;
  loadingRemove: boolean;
}) => {
  // Extract social media status from connectedSocials
  const instagramStatus = streamer.connectedSocials?.instagram;
  const tiktokStatus = streamer.connectedSocials?.tiktok;
  const youtubeStatus = streamer.connectedSocials?.youtube;

  // Count expired tokens (solo para mostrar información)
  const expiredTokensCount = [
    instagramStatus && typeof instagramStatus === 'object' && instagramStatus.tokenExpired,
    tiktokStatus && typeof tiktokStatus === 'object' && tiktokStatus.tokenExpired,
    youtubeStatus && typeof youtubeStatus === 'object' && youtubeStatus.tokenExpired,
  ].filter(Boolean).length;

  return (
    <Card className="p-4 bg-slate-800/50 border border-slate-700">
      <CardBody className="flex flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Avatar
            src={streamer.imageUrl}
            icon={<FaUserCircle className="text-slate-400" />}
            size="md"
          />
          <div className="flex flex-col">
            <span className="font-medium text-slate-200">{streamer.name}</span>
            {expiredTokensCount > 0 && (
              <Chip
                size="sm"
                startContent={<FiAlertTriangle size={12} />}
                className="bg-yellow-600/20 text-yellow-300 border border-yellow-600/40 mt-1"
              >
                {expiredTokensCount} red{expiredTokensCount > 1 ? 'es' : ''} no disponible{expiredTokensCount > 1 ? 's' : ''} para reportes
              </Chip>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <SocialIcon
            icon={FaInstagram}
            platform="Instagram"
            isConnected={!!instagramStatus}
            hasExpiredToken={typeof instagramStatus === 'object' ? instagramStatus.tokenExpired : false}
            username={typeof instagramStatus === 'object' ? instagramStatus.username : undefined}
          />
          <SocialIcon
            icon={FaTiktok}
            platform="TikTok"
            isConnected={!!tiktokStatus}
            hasExpiredToken={typeof tiktokStatus === 'object' ? tiktokStatus.tokenExpired : false}
            username={typeof tiktokStatus === 'object' ? tiktokStatus.username : undefined}
          />
          <SocialIcon
            icon={FaYoutube}
            platform="YouTube"
            isConnected={!!youtubeStatus}
            hasExpiredToken={typeof youtubeStatus === 'object' ? youtubeStatus.tokenExpired : false}
            username={typeof youtubeStatus === 'object' ? youtubeStatus.username : undefined}
          />
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

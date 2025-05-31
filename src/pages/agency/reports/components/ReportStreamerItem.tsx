import { Checkbox, Avatar, Tooltip } from "@heroui/react";
import {
  FaInstagram,
  FaTiktok,
  FaYoutube,
  FaUserCircle,
  FaExclamationTriangle,
} from "react-icons/fa";
import { AffiliatedStreamer } from "../../agency-streamers/interfaces/affiliated_streamer.interface";

export const ReportStreamerItem = ({
  streamer,
  selectedAccounts,
  onAccountToggle,
  onToggleAllStreamerAccounts,
}: {
  streamer: AffiliatedStreamer;
  selectedAccounts: Set<"instagram" | "tiktok" | "youtube">;
  onAccountToggle: (
    streamerId: string,
    network: "instagram" | "tiktok" | "youtube"
  ) => void;
  onToggleAllStreamerAccounts: (streamerId: string, select: boolean) => void;
}) => {
  const getSocialStatus = (social: any) => {
    if (!social) return { connected: false, isExpired: false };

    if (typeof social === "object" && "connected" in social) {
      return {
        connected: social.connected,
        isExpired: social.tokenExpired || false,
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

  const connectedNetworks = Object.entries(streamer.connectedSocials)
    .filter(([network, isConnected]) => {
      if (!isConnected) return false;

      const networkKey = network as "instagram" | "tiktok" | "youtube";
      const status = getSocialStatus(streamer.connectedSocials?.[networkKey]);
      return status.connected && !status.isExpired;
    })
    .map(([network]) => network as "instagram" | "tiktok" | "youtube");

  const allSelected =
    connectedNetworks.length > 0 &&
    connectedNetworks.every((network) => selectedAccounts.has(network));
  const isIndeterminate =
    !allSelected &&
    connectedNetworks.some((network) => selectedAccounts.has(network));

  const handleSelectAllChange = (isSelected: boolean) => {
    if (isSelected) {
      connectedNetworks.forEach((network) => {
        if (!selectedAccounts.has(network)) {
          onAccountToggle(streamer.id, network);
        }
      });
    } else {
      onToggleAllStreamerAccounts(streamer.id, false);
    }
  };

  const getIcon = (network: string, isExpired: boolean = false) => {
    const iconClass = isExpired ? "text-amber-500" : getDefaultIconClass(network);

    switch (network) {
      case "instagram":
        return <FaInstagram size={20} className={iconClass} />;
      case "tiktok":
        return <FaTiktok size={20} className={iconClass} />;
      case "youtube":
        return <FaYoutube size={20} className={iconClass} />;
      default:
        return null;
    }
  };

  const getDefaultIconClass = (network: string) => {
    switch (network) {
      case "instagram":
        return "text-pink-400";
      case "tiktok":
        return "text-white";
      case "youtube":
        return "text-red-500";
      default:
        return "text-slate-400";
    }
  };

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-3 bg-slate-800/50 border border-slate-700 rounded-lg">
      <div className="flex items-center gap-3 flex-grow mb-2 sm:mb-0">
        <Checkbox
          isSelected={allSelected}
          isIndeterminate={isIndeterminate}
          onChange={(e) => handleSelectAllChange(e.target.checked)}
          size="sm"
          aria-label={`Seleccionar todo para ${streamer.name}`}
          classNames={{ wrapper: "mr-2" }}
        />
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

      <div className="flex items-center gap-3 flex-wrap pl-8 sm:pl-0">
        {Object.entries(streamer.connectedSocials).map(
          ([network, isConnected]) => {
            if (!isConnected) return null;

            const networkKey = network as "instagram" | "tiktok" | "youtube";
            const status = getSocialStatus(streamer.connectedSocials?.[networkKey]);
            const isSelected = selectedAccounts.has(networkKey);
            const canSelect = status.connected && !status.isExpired;

            const handleNetworkClick = () => {
              if (!canSelect || status.isExpired) {
                return;
              }
              onAccountToggle(streamer.id, networkKey);
            };

            return (
              <Tooltip
                key={network}
                content={
                  status.isExpired
                    ? `Token de ${network} expirado - No disponible para reportes`
                    : `Seleccionar ${network}`
                }
                placement="top"
                className="bg-slate-800 border border-slate-700 text-slate-200 rounded-md"
              >
                <button
                  type="button"
                  onClick={handleNetworkClick}
                  disabled={!canSelect}
                  className={`p-1.5 rounded-md transition-all duration-150 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-800 ${
                    !canSelect
                      ? "opacity-50 cursor-not-allowed bg-slate-700/30 pointer-events-none"
                      : isSelected
                      ? "bg-sky-600/30 border border-sky-500 scale-105"
                      : "bg-slate-700/50 border border-transparent hover:bg-slate-600/50"
                  }`}
                  aria-pressed={isSelected}
                  aria-disabled={!canSelect}
                >
                  {getIcon(network, status.isExpired)}
                </button>
              </Tooltip>
            );
          }
        )}
        {connectedNetworks.length === 0 && (
          <span className="text-xs text-slate-500 italic">
            {Object.values(streamer.connectedSocials).some(Boolean)
              ? "Todas las redes tienen tokens expirados"
              : "Sin redes conectadas"}
          </span>
        )}
      </div>
    </div>
  );
};

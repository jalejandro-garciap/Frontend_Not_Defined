import { Checkbox, Avatar, Tooltip, Chip } from "@heroui/react";
import { FaInstagram, FaTiktok, FaYoutube, FaUserCircle } from "react-icons/fa";
import { FiAlertTriangle } from "react-icons/fi";
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
  const connectedNetworks = Object.entries(streamer.connectedSocials)
    .filter(([, connection]) => {
      if (typeof connection === 'boolean') return connection;
      if (typeof connection === 'object') return connection.connected;
      return false;
    })
    .map(([network]) => network as "instagram" | "tiktok" | "youtube");

  const expiredTokensCount = Object.entries(streamer.connectedSocials)
    .filter(([, connection]) => {
      if (typeof connection === 'object') return connection.tokenExpired;
      return false;
    }).length;

  const allSelected =
    connectedNetworks.length > 0 &&
    connectedNetworks.every((network) => selectedAccounts.has(network));
  const isIndeterminate =
    !allSelected &&
    connectedNetworks.some((network) => selectedAccounts.has(network));

  const handleSelectAllChange = (isSelected: boolean) => {
    onToggleAllStreamerAccounts(streamer.id, isSelected);
  };

  const getIcon = (network: string, hasExpiredToken: boolean = false) => {
    const baseClasses = hasExpiredToken ? "opacity-50" : "";
    switch (network) {
      case "instagram":
        return <FaInstagram size={20} className={`text-pink-400 ${baseClasses}`} />;
      case "tiktok":
        return <FaTiktok size={20} className={`text-white ${baseClasses}`} />;
      case "youtube":
        return <FaYoutube size={20} className={`text-red-500 ${baseClasses}`} />;
      default:
        return null;
    }
  };

  const isNetworkTokenExpired = (network: string) => {
    const connection = streamer.connectedSocials[network as keyof typeof streamer.connectedSocials];
    return typeof connection === 'object' && connection.tokenExpired;
  };

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-3 bg-slate-800/50 border border-slate-700 rounded-lg">
      {/* Info Streamer */}
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
        <div className="flex flex-col">
          <span className="font-medium text-slate-200">{streamer.name}</span>
          {expiredTokensCount > 0 && (
            <Chip
              size="sm"
              startContent={<FiAlertTriangle size={12} />}
              className="bg-yellow-600/20 text-yellow-300 border border-yellow-600/40 mt-1"
            >
              {expiredTokensCount} token{expiredTokensCount > 1 ? 's' : ''} expirado{expiredTokensCount > 1 ? 's' : ''}
            </Chip>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3 flex-wrap pl-8 sm:pl-0">
        {Object.entries(streamer.connectedSocials).map(
          ([network, connection]) => {
            const isConnected = typeof connection === 'boolean' ? connection : connection.connected;
            if (!isConnected) return null;
            
            const networkKey = network as "instagram" | "tiktok" | "youtube";
            const isSelected = selectedAccounts.has(networkKey);
            const hasExpiredToken = isNetworkTokenExpired(network);
            
            return (
              <Tooltip
                key={network}
                content={hasExpiredToken ? `${network} - Token expirado` : `Seleccionar ${network}`}
                placement="top"
                className="bg-slate-800 border border-slate-700 text-slate-200 rounded-md"
              >
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => onAccountToggle(streamer.id, networkKey)}
                    className={`p-1.5 rounded-md transition-all duration-150 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-800 ${
                      isSelected
                        ? "bg-sky-600/30 border border-sky-500 scale-105"
                        : "bg-slate-700/50 border border-transparent hover:bg-slate-600/50"
                    }`}
                    aria-pressed={isSelected}
                    disabled={hasExpiredToken}
                  >
                    {getIcon(network, hasExpiredToken)}
                  </button>
                  {hasExpiredToken && (
                    <FiAlertTriangle 
                      size={12} 
                      className="absolute -top-1 -right-1 text-yellow-400 bg-slate-800 rounded-full" 
                    />
                  )}
                </div>
              </Tooltip>
            );
          }
        )}
        {connectedNetworks.length === 0 && (
          <span className="text-xs text-slate-500 italic">
            Sin redes conectadas
          </span>
        )}
      </div>
    </div>
  );
};

import { Card, CardHeader, CardBody, Button, Chip } from "@heroui/react";
import { FiLink, FiXCircle, FiAlertTriangle } from "react-icons/fi";
import { FaInstagram, FaTiktok, FaYoutube } from "react-icons/fa";
import { useAuth } from "../../../context/AuthContext";
import { api } from "../../login/services/api";
import { useState } from "react";
import { useTokenStatus } from "../../../utils/hooks/useTokenStatus";

export const SocialMedia = () => {
  const { user, refreshAuth } = useAuth();

  const [loadingDisconnect, setLoadingDisconnect] = useState({
    instagram: false,
    tiktok: false,
    youtube: false,
  });

  const socialMediaStatus =
    user?.social_medias && user.social_medias.length > 0
      ? user.social_medias
      : [];

  const { getSocialMediaDisplayStatus, isLoading: isLoadingTokens } = useTokenStatus(socialMediaStatus);

  const supportedNetworks = [
    { name: "instagram", icon: FaInstagram, color: "text-[#E1306C]" },
    { name: "tiktok", icon: FaTiktok, color: "text-white" },
    { name: "youtube", icon: FaYoutube, color: "text-[#FF0000]" },
  ];

  const getNetworkStatus = (networkName: string) => {
    return socialMediaStatus.find(
      (s) => s.social_media_name.toLowerCase() === networkName.toLowerCase()
    );
  };

  const handleConnect = (networkName: string) => {
    window.open(`/api/auth/login/${networkName}`, "_self");
  };

  const handleDisconnect = async (networkName: string) => {
    setLoadingDisconnect({
      ...loadingDisconnect,
      [networkName]: true,
    });
    await api.delete(`/auth/social-media/${networkName}`).then(() => {
      refreshAuth().finally(() => {
        setLoadingDisconnect({
          ...loadingDisconnect,
          [networkName]: false,
        });
      });
    });
  };

  const renderConnectionStatus = (network: any, status: any) => {
    if (!status?.enabled) {
      return (
        <Button
          size="sm"
          variant="flat"
          color="primary"
          startContent={<FiLink size={16} />}
          onPress={() => handleConnect(network.name)}
          className="bg-sky-600/10 hover:bg-sky-600/20 text-sky-300 border border-sky-600/30"
        >
          Conectar
        </Button>
      );
    }

    const displayStatus = getSocialMediaDisplayStatus(status);
    
    if (displayStatus.status === 'expired') {
      return (
        <div className="flex gap-2">
          <Chip
            size="sm"
            startContent={<FiAlertTriangle size={12} />}
            className="bg-yellow-600/20 text-yellow-300 border border-yellow-600/40"
          >
            Token Expirado
          </Chip>
          <Button
            size="sm"
            variant="flat"
            color="warning"
            startContent={<FiLink size={16} />}
            onPress={() => handleConnect(network.name)}
            className="bg-yellow-600/10 hover:bg-yellow-600/20 text-yellow-300 border border-yellow-600/30"
          >
            Reconectar
          </Button>
        </div>
      );
    }

    return (
      <Button
        size="sm"
        variant="flat"
        color="warning"
        isDisabled={
          loadingDisconnect[
            network.name as keyof typeof loadingDisconnect
          ]
        }
        startContent={
          loadingDisconnect[
            network.name as keyof typeof loadingDisconnect
          ] ? (
            <FiXCircle size={16} className="animate-spin" />
          ) : (
            <FiXCircle size={16} />
          )
        }
        onPress={() => handleDisconnect(network.name)}
        className="bg-red-600/10 hover:bg-red-600/20 text-red-400 border border-red-600/30"
      >
        {loadingDisconnect[
          network.name as keyof typeof loadingDisconnect
        ]
          ? "Desconectando..."
          : "Desconectar"}
      </Button>
    );
  };

  return (
    <Card className="w-full max-w-2xl m-auto bg-slate-900/80 backdrop-blur-sm border border-slate-700 shadow-lg">
      <CardHeader className="flex gap-3 px-4 py-3 border-b border-slate-700">
        <FiLink className="text-sky-400" size={20} />
        <div className="flex flex-col">
          <p className="text-md font-semibold text-slate-100">
            Conectar Redes Sociales
          </p>
          <p className="text-small text-slate-400">
            Vincula tus cuentas para obtener estadísticas.
          </p>
        </div>
      </CardHeader>
      <CardBody className="p-4 space-y-4">
        {isLoadingTokens && (
          <div className="text-center text-slate-400 text-sm py-2">
            Verificando estado de tokens...
          </div>
        )}
        {supportedNetworks.map((network) => {
          const status = getNetworkStatus(network.name);
          const Icon = network.icon;
          const displayStatus = status ? getSocialMediaDisplayStatus(status) : null;
          
          return (
            <div
              key={network.name}
              className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg"
            >
              <div className="flex items-center gap-3">
                <Icon size={24} className={network.color} />
                <span className="font-medium text-slate-200 capitalize">
                  {network.name}
                </span>
                {status?.enabled && status.username && (
                  <span className="text-xs text-slate-400">
                    @{status.username}
                  </span>
                )}
                {displayStatus?.status === 'expired' && (
                  <Chip
                    size="sm"
                    className="bg-yellow-600/20 text-yellow-300 border border-yellow-600/40"
                  >
                    Desconectado
                  </Chip>
                )}
              </div>
              {renderConnectionStatus(network, status)}
            </div>
          );
        })}
      </CardBody>
    </Card>
  );
};

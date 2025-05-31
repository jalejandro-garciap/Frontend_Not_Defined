import { Card, CardHeader, CardBody, Button, Tooltip } from "@heroui/react";
import { FiLink, FiXCircle, FiAlertCircle, FiRefreshCw } from "react-icons/fi";
import { FaInstagram, FaTiktok, FaYoutube } from "react-icons/fa";
import { useAuth } from "../../../context/AuthContext";
import { api } from "../../login/services/api";
import { useState } from "react";

export const SocialMedia = () => {
  const { user, refreshAuth } = useAuth();

  const [loadingDisconnect, setLoadingDisconnect] = useState({
    instagram: false,
    tiktok: false,
    youtube: false,
  });

  const [refreshingTokens, setRefreshingTokens] = useState(false);

  const socialMediaStatus =
    user?.social_medias && user.social_medias.length > 0
      ? user.social_medias
      : [];

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

  const handleRefreshTokens = async () => {
    setRefreshingTokens(true);
    try {
      const response = await api.post("/auth/refresh-tokens");
      console.log("Tokens refreshed:", response.data);

      alert("Tokens renovados exitosamente");

      await refreshAuth();
    } catch (error) {
      console.error("Error refreshing tokens:", error);
      alert(
        "Error al renovar tokens. Por favor, intenta reconectar tus cuentas."
      );
    } finally {
      setRefreshingTokens(false);
    }
  };

  const hasExpiredTokens = socialMediaStatus.some(
    (status) => status.isTokenExpired
  );

  return (
    <Card className="w-full max-w-2xl m-auto bg-slate-900/80 backdrop-blur-sm border border-slate-700 shadow-lg">
      <CardHeader className="flex gap-3 px-4 py-3 border-b border-slate-700">
        <FiLink className="text-sky-400" size={20} />
        <div className="flex flex-col flex-1">
          <p className="text-md font-semibold text-slate-100">
            Conectar Redes Sociales
          </p>
          <p className="text-small text-slate-400">
            Vincula tus cuentas para obtener estadísticas.
          </p>
        </div>
        {hasExpiredTokens && (
          <Button
            size="sm"
            color="primary"
            variant="flat"
            isLoading={refreshingTokens}
            startContent={<FiRefreshCw size={16} />}
            onPress={handleRefreshTokens}
          >
            Renovar Tokens
          </Button>
        )}
      </CardHeader>
      <CardBody className="p-4 space-y-4">
        {supportedNetworks.map((network) => {
          const status = getNetworkStatus(network.name);
          const Icon = network.icon;
          const isExpired = status?.isTokenExpired === true;

          return (
            <div
              key={network.name}
              className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg"
            >
              <div className="flex items-center gap-3">
                <Icon size={24} className={network.color} />
                <div className="flex flex-col">
                  <span className="font-medium text-slate-200 capitalize">
                    {network.name}
                  </span>
                  {status?.enabled && status.username && (
                    <span className="text-xs text-slate-400">
                      @{status.username}
                    </span>
                  )}
                  {isExpired && (
                    <Tooltip content="Tu sesión ha expirado. Por favor, reconecta tu cuenta.">
                      <div className="flex items-center gap-1 text-amber-500">
                        <FiAlertCircle size={16} />
                        <span className="text-xs">Token expirado</span>
                      </div>
                    </Tooltip>
                  )}
                </div>
              </div>
              {status?.enabled && !isExpired ? (
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
              ) : (
                <Button
                  size="sm"
                  variant={isExpired ? "solid" : "flat"}
                  color={isExpired ? "warning" : "primary"}
                  startContent={<FiLink size={16} />}
                  onPress={() => handleConnect(network.name)}
                  className={
                    isExpired
                      ? "bg-amber-600 hover:bg-amber-700 text-white"
                      : "bg-sky-600/10 hover:bg-sky-600/20 text-sky-300 border border-sky-600/30"
                  }
                >
                  {isExpired ? "Reconectar" : "Conectar"}
                </Button>
              )}
            </div>
          );
        })}
      </CardBody>
    </Card>
  );
};

import { Card, CardHeader, CardBody, Button } from "@heroui/react";
import { FiLink, FiXCircle } from "react-icons/fi";
import { FaInstagram, FaTiktok, FaYoutube } from "react-icons/fa";
import { useAuth } from "../../../context/AuthContext";

export const SocialMedia = () => {
  const { user } = useAuth();

  const simulatedSocialMedia = [
    {
      social_media_name: "instagram",
      enabled: true,
      username: "streamer_insta",
    },
    { social_media_name: "tiktok", enabled: false, username: null },
    {
      social_media_name: "youtube",
      enabled: false,
      username: null,
    },
  ];

  const socialMediaStatus =
    user?.social_medias && user.social_medias.length > 0
      ? user.social_medias
      : simulatedSocialMedia;

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
    console.log(`Intentando conectar: ${networkName}`);
    alert(`Conectar con ${networkName} (Lógica no implementada)`);
  };

  const handleDisconnect = (networkName: string) => {
    console.log(`Intentando desconectar: ${networkName}`);
    alert(`Desconectar ${networkName} (Lógica no implementada)`);
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
        {supportedNetworks.map((network) => {
          const status = getNetworkStatus(network.name);
          const Icon = network.icon;
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
              </div>
              {status?.enabled ? (
                <Button
                  size="sm"
                  variant="flat"
                  color="warning"
                  startContent={<FiXCircle size={16} />}
                  onPress={() => handleDisconnect(network.name)}
                  className="bg-red-600/10 hover:bg-red-600/20 text-red-400 border border-red-600/30"
                >
                  Desconectar
                </Button>
              ) : (
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
              )}
            </div>
          );
        })}
      </CardBody>
    </Card>
  );
};

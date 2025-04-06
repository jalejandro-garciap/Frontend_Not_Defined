import {
  RangeValue,
  CalendarDate,
  Card,
  CardHeader,
  Button,
  CardBody,
} from "@heroui/react";
import { useState } from "react";
import { FaCheckSquare, FaFileAlt } from "react-icons/fa";
import { AgencyStreamer } from "./interface/agency_streamer.interface";
import { ReportFilters } from "./components/ReportFilters";
import { ReportStreamerItem } from "./components/ReportStreamerItem";

type SelectedAccounts = Record<string, Set<"instagram" | "tiktok" | "youtube">>;

const AgencyReportsView = () => {
  const [selectedAccounts, setSelectedAccounts] = useState<SelectedAccounts>(
    {}
  );
  const [dateRange, setDateRange] = useState<RangeValue<CalendarDate> | null>(
    null
  );
  const [hashtags, setHashtags] = useState("");

  const agencyStreamers: AgencyStreamer[] = [
    {
      id: "s1",
      name: "StreamerActivo1",
      imageUrl: "https://placehold.co/100x100/8B5CF6/FFFFFF?text=SA1",
      connectedSocials: { instagram: true, tiktok: true, youtube: false },
    },
    {
      id: "s2",
      name: "StreamerGamer2",
      imageUrl: "https://placehold.co/100x100/EC4899/FFFFFF?text=SG2",
      connectedSocials: { instagram: false, tiktok: true, youtube: true },
    },
    {
      id: "s5",
      name: "StreamerVariado5",
      imageUrl: "https://placehold.co/100x100/F59E0B/FFFFFF?text=SV5",
      connectedSocials: { instagram: true, tiktok: true, youtube: true },
    },
    {
      id: "s6",
      name: "StreamerNuevo6",
      imageUrl: undefined,
      connectedSocials: { instagram: true, tiktok: false, youtube: false },
    },
    {
      id: "s7",
      name: "StreamerSinRedes7",
      imageUrl: "https://placehold.co/100x100/10B981/FFFFFF?text=SSR7",
      connectedSocials: { instagram: false, tiktok: false, youtube: false },
    },
  ];

  const handleAccountToggle = (
    streamerId: string,
    network: "instagram" | "tiktok" | "youtube"
  ) => {
    setSelectedAccounts((prev) => {
      const currentSelection = new Set(prev[streamerId] || []);
      if (currentSelection.has(network)) {
        currentSelection.delete(network);
      } else {
        currentSelection.add(network);
      }
      if (currentSelection.size === 0) {
        const { [streamerId]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [streamerId]: currentSelection };
    });
  };

  const handleToggleAllStreamerAccounts = (
    streamerId: string,
    select: boolean
  ) => {
    const streamer = agencyStreamers.find((s) => s.id === streamerId);
    if (!streamer) return;

    setSelectedAccounts((prev) => {
      const currentSelection = new Set(prev[streamerId] || []);
      const connectedNetworks = Object.entries(streamer.connectedSocials)
        .filter(([, isConnected]) => isConnected)
        .map(([network]) => network as "instagram" | "tiktok" | "youtube");

      if (select) {
        connectedNetworks.forEach((network) => currentSelection.add(network));
      } else {
        connectedNetworks.forEach((network) =>
          currentSelection.delete(network)
        );
      }

      if (currentSelection.size === 0) {
        const { [streamerId]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [streamerId]: currentSelection };
    });
  };

  const handleSelectAllGlobal = (select: boolean) => {
    if (select) {
      const newSelection: SelectedAccounts = {};
      agencyStreamers.forEach((streamer) => {
        const connectedNetworks = Object.entries(streamer.connectedSocials)
          .filter(([, isConnected]) => isConnected)
          .map(([network]) => network as "instagram" | "tiktok" | "youtube");
        if (connectedNetworks.length > 0) {
          newSelection[streamer.id] = new Set(connectedNetworks);
        }
      });
      setSelectedAccounts(newSelection);
    } else {
      setSelectedAccounts({});
    }
  };

  const handleGenerateReport = () => {
    console.log("Generando reporte con:");
    console.log("Streamers/Cuentas Seleccionadas:", selectedAccounts);
    console.log(
      "Rango de Fechas:",
      dateRange
        ? { start: dateRange.start.toString(), end: dateRange.end.toString() }
        : "No especificado"
    );
    console.log("Hashtags:", hashtags || "Ninguno");
    alert(
      "Generando reporte... (Ver consola para detalles - Lógica no implementada)"
    );
  };

  const totalSelectedCount = Object.values(selectedAccounts).reduce(
    (sum, set) => sum + set.size,
    0
  );
  const canGenerateReport = totalSelectedCount > 0;

  return (
    <div className="w-full max-w-5xl space-y-6">
      <h2 className="text-2xl font-semibold text-slate-100 mb-4">
        Generar Reportes
      </h2>

      <ReportFilters
        dateRange={dateRange}
        onDateChange={setDateRange}
        hashtags={hashtags}
        onHashtagChange={setHashtags}
      />

      <Card className="bg-slate-900/50 border border-slate-700 shadow-md">
        <CardHeader className="p-4 border-b border-slate-700 flex justify-between items-center">
          <p className="text-md font-semibold text-slate-100">
            Seleccionar Streamers y Redes
          </p>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="flat"
              onPress={() => handleSelectAllGlobal(true)}
              startContent={<FaCheckSquare />}
            >
              Seleccionar Todo
            </Button>
            <Button
              size="sm"
              variant="bordered"
              onPress={() => handleSelectAllGlobal(false)}
              className="border-slate-600 text-slate-400"
            >
              Deseleccionar Todo
            </Button>
          </div>
        </CardHeader>
        <CardBody className="p-4 space-y-3 max-h-[60vh] overflow-y-auto">
          {agencyStreamers.length > 0 ? (
            agencyStreamers.map((streamer) => (
              <ReportStreamerItem
                key={streamer.id}
                streamer={streamer}
                selectedAccounts={selectedAccounts[streamer.id] || new Set()}
                onAccountToggle={handleAccountToggle}
                onToggleAllStreamerAccounts={handleToggleAllStreamerAccounts}
              />
            ))
          ) : (
            <p className="text-center text-slate-400 text-sm py-6">
              No hay streamers en tu agencia para generar reportes.
            </p>
          )}
        </CardBody>
      </Card>

      <div className="flex justify-end pt-4">
        <Button
          color="primary"
          size="lg"
          startContent={<FaFileAlt />}
          className="bg-sky-600 hover:bg-sky-700 text-white font-medium"
          onPress={handleGenerateReport}
          isDisabled={!canGenerateReport}
        >
          Generar Reporte ({totalSelectedCount}{" "}
          {totalSelectedCount === 1 ? "cuenta sel." : "cuentas sel."})
        </Button>
      </div>
    </div>
  );
};
export default AgencyReportsView;

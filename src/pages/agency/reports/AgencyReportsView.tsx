import {
  RangeValue,
  CalendarDate,
  Card,
  CardHeader,
  Button,
  CardBody,
  Chip,
  Spinner,
  ButtonGroup,
} from "@heroui/react";
import { useEffect, useState } from "react";
import { FaCheckSquare, FaFileAlt, FaRegSquare } from "react-icons/fa";
import { ReportFilters } from "./components/ReportFilters";
import { ReportStreamerItem } from "./components/ReportStreamerItem";
import {
  useManagerAgencies,
  useInvalidateOnAgencyChange,
} from "../store/agencyStore";
import { useQuery } from "@tanstack/react-query";
import {
  fetchAgencyStreamers,
  generateReport,
} from "../services/agencyService";
import { AffiliatedStreamer } from "../agency-streamers/interfaces/affiliated_streamer.interface";

type Network = "instagram" | "tiktok" | "youtube";
type SelectedAccounts = Partial<Record<Network, string[]>>;
type ReportFormat = "pdf" | "csv";

const AgencyReportsView = () => {
  const [selectedAccounts, setSelectedAccounts] = useState<SelectedAccounts>(
    {}
  );
  const [dateRange, setDateRange] = useState<RangeValue<CalendarDate> | null>(
    null
  );
  const [hashtags, setHashtags] = useState("");
  const [reportFormat, setReportFormat] = useState<ReportFormat>("pdf");
  const { selectedAgency } = useManagerAgencies();

  const { agencyDependentKey, agencyId } = useInvalidateOnAgencyChange([
    "reportStreamers",
  ]);

  const [loadingDownalods, setLoadingDownloads] = useState(false);

  const {
    data: agencyStreamers = [],
    isLoading,
    error,
  } = useQuery<AffiliatedStreamer[]>({
    queryKey: agencyDependentKey,
    queryFn: () =>
      agencyId ? fetchAgencyStreamers(agencyId) : Promise.resolve([]),
    enabled: !!agencyId,
    staleTime: 60000,
  });

  useEffect(() => {
    setSelectedAccounts({});
  }, [agencyId]);

  const getSelectedNetworksForStreamer = (streamerId: string): Set<Network> => {
    const selected = new Set<Network>();
    (Object.keys(selectedAccounts) as Network[]).forEach((network) => {
      if (selectedAccounts[network]?.includes(streamerId)) {
        selected.add(network);
      }
    });
    return selected;
  };

  // Helper function to check if a network token is expired for a streamer
  const isNetworkTokenExpired = (streamerId: string, network: Network): boolean => {
    const streamer = agencyStreamers.find(s => s.id === streamerId);
    if (!streamer) return false;
    
    const connection = streamer.connectedSocials[network];
    if (typeof connection === 'object') {
      return connection.tokenExpired || !connection.tokenExpiresAt;
    }
    return false;
  };

  // Helper function to check if a network is connected and has valid token
  const isNetworkAvailableForReports = (streamerId: string, network: Network): boolean => {
    const streamer = agencyStreamers.find(s => s.id === streamerId);
    if (!streamer) return false;
    
    const connection = streamer.connectedSocials[network];
    if (typeof connection === 'boolean') {
      return connection; // Legacy format
    }
    if (typeof connection === 'object') {
      return connection.connected && !connection.tokenExpired && connection.tokenExpiresAt;
    }
    return false;
  };

  const handleAccountToggle = (streamerId: string, network: Network) => {
    // Validate that the network is available for reports (not expired)
    if (!isNetworkAvailableForReports(streamerId, network)) {
      console.warn(`Cannot select ${network} for streamer ${streamerId}: token expired or not available`);
      return;
    }

    setSelectedAccounts((prev) => {
      const newState = { ...prev };
      const currentNetworkList = newState[network] || [];
      const streamerIndex = currentNetworkList.indexOf(streamerId);

      if (streamerIndex > -1) {
        const updatedList = [
          ...currentNetworkList.slice(0, streamerIndex),
          ...currentNetworkList.slice(streamerIndex + 1),
        ];
        if (updatedList.length === 0) {
          delete newState[network];
        } else {
          newState[network] = updatedList;
        }
      } else {
        newState[network] = [...currentNetworkList, streamerId];
      }
      return newState;
    });
  };

  const handleToggleAllStreamerAccounts = (
    streamerId: string,
    select: boolean
  ) => {
    const streamer = agencyStreamers.find((s) => s.id === streamerId);
    if (!streamer) return;

    // Only include networks that are available for reports (not expired)
    const availableNetworks = Object.entries(streamer.connectedSocials)
      .filter(([network]) => isNetworkAvailableForReports(streamerId, network as Network))
      .map(([network]) => network) as Network[];

    setSelectedAccounts((prev) => {
      const newState = { ...prev };
      availableNetworks.forEach((network) => {
        const currentNetworkList = newState[network] || [];
        const streamerIndex = currentNetworkList.indexOf(streamerId);

        if (select) {
          if (streamerIndex === -1) {
            newState[network] = [...currentNetworkList, streamerId];
          }
        } else {
          if (streamerIndex > -1) {
            const updatedList = [
              ...currentNetworkList.slice(0, streamerIndex),
              ...currentNetworkList.slice(streamerIndex + 1),
            ];
            if (updatedList.length === 0) {
              delete newState[network];
            } else {
              newState[network] = updatedList;
            }
          }
        }
      });
      return newState;
    });
  };

  const handleSelectAllGlobal = (select: boolean) => {
    if (select) {
      const newSelection: SelectedAccounts = {};
      agencyStreamers.forEach((streamer) => {
        // Only include networks that are available for reports (not expired)
        const availableNetworks = Object.entries(streamer.connectedSocials)
          .filter(([network]) => isNetworkAvailableForReports(streamer.id, network as Network))
          .map(([network]) => network) as Network[];

        availableNetworks.forEach((network) => {
          if (!newSelection[network]) {
            newSelection[network] = [];
          }
          if (!newSelection[network]?.includes(streamer.id)) {
            newSelection[network]?.push(streamer.id);
          }
        });
      });
      setSelectedAccounts(newSelection);
    } else {
      setSelectedAccounts({});
    }
  };

  const handleGenerateReport = async () => {
    if (!agencyId) return;
    setLoadingDownloads(true);

    const processedHashtags = hashtags
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag !== "");

    try {
      if (selectedAccounts.instagram) {
        try {
          const blob = await generateReport("instagram", reportFormat, {
            startDate: dateRange?.start.toString() || "",
            endDate: dateRange?.end.toString() || "",
            hashtags: processedHashtags,
            streamerIds: selectedAccounts.instagram,
          });

          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = `report_${agencyId}_instagram.${reportFormat}`;
          a.click();
          URL.revokeObjectURL(url);
        } catch (error) {
          console.error("Error generating Instagram report:", error);
        }
      }

      if (selectedAccounts.tiktok) {
        try {
          const blob = await generateReport("tiktok", reportFormat, {
            startDate: dateRange?.start.toString() || "",
            endDate: dateRange?.end.toString() || "",
            hashtags: processedHashtags,
            streamerIds: selectedAccounts.tiktok,
          });

          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = `report_${agencyId}_tiktok.${reportFormat}`;
          a.click();
          URL.revokeObjectURL(url);
        } catch (error) {
          console.error("Error generating TikTok report:", error);
        }
      }

      if (selectedAccounts.youtube) {
        try {
          const blob = await generateReport("youtube", reportFormat, {
            startDate: dateRange?.start.toString() || "",
            endDate: dateRange?.end.toString() || "",
            hashtags: processedHashtags,
            streamerIds: selectedAccounts.youtube,
          });

          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = `report_${agencyId}_youtube.${reportFormat}`;
          a.click();
          URL.revokeObjectURL(url);
        } catch (error) {
          console.error("Error generating YouTube report:", error);
        }
      }
    } finally {
      setLoadingDownloads(false);
    }
  };

  const totalSelectedCount = (
    Object.values(selectedAccounts) as string[][]
  ).reduce((sum, list) => sum + list.length, 0);

  const totalPossibleAccounts = agencyStreamers.reduce((count, streamer) => {
    // Only count networks that are available for reports (not expired)
    const availableCount = Object.entries(streamer.connectedSocials).filter(
      ([network]) => isNetworkAvailableForReports(streamer.id, network as Network)
    ).length;
    return count + availableCount;
  }, 0);

  const isAllSelected =
    totalPossibleAccounts > 0 && totalSelectedCount === totalPossibleAccounts;

  const canGenerateReport = totalSelectedCount > 0;

  return (
    <div className="w-full max-w-5xl space-y-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <h2 className="text-2xl font-semibold text-slate-100 flex items-center">
          Generar Reportes
          {isLoading ? (
            <Spinner size="sm" color="primary" className="ml-3" />
          ) : error ? (
            <Chip
              size="sm"
              className="ml-3 bg-red-700/30 text-red-300 border border-red-700/50"
            >
              Error al cargar datos
            </Chip>
          ) : selectedAgency ? (
            <Chip
              size="sm"
              className="ml-3 bg-sky-700/30 text-sky-300 border border-sky-700/50"
            >
              {selectedAgency.name}
            </Chip>
          ) : null}
        </h2>
      </div>

      <ReportFilters
        dateRange={dateRange}
        onDateChange={setDateRange}
        hashtags={hashtags}
        onHashtagChange={setHashtags}
      />

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Spinner size="lg" color="primary" />
        </div>
      ) : (
        <Card className="bg-slate-900/50 border border-slate-700 shadow-md">
          <CardHeader className="p-4 border-b border-slate-700 flex justify-between items-center">
            <p className="text-md font-semibold text-slate-100">
              Seleccionar Streamers y Redes
            </p>
            <Button
              size="sm"
              variant={isAllSelected ? "bordered" : "flat"}
              onPress={() => handleSelectAllGlobal(!isAllSelected)}
              startContent={isAllSelected ? <FaRegSquare /> : <FaCheckSquare />}
              isDisabled={totalPossibleAccounts === 0}
              className={
                isAllSelected
                  ? "border-slate-600 text-slate-400"
                  : "bg-sky-600/20 text-sky-300 border border-sky-600/50"
              }
            >
              {isAllSelected ? "Deseleccionar Todo" : "Seleccionar Todo"} (
              {totalPossibleAccounts})
            </Button>
          </CardHeader>
          <CardBody className="p-4 space-y-3 max-h-[60vh] overflow-y-auto">
            {agencyStreamers.length > 0 ? (
              agencyStreamers.map((streamer) => (
                <ReportStreamerItem
                  key={streamer.id}
                  streamer={streamer}
                  selectedAccounts={getSelectedNetworksForStreamer(streamer.id)}
                  onAccountToggle={handleAccountToggle}
                  onToggleAllStreamerAccounts={handleToggleAllStreamerAccounts}
                />
              ))
            ) : (
              <p className="text-center text-slate-400 text-sm py-6">
                No hay streamers en {selectedAgency?.name || "tu agencia"} para
                generar reportes.
              </p>
            )}
          </CardBody>
        </Card>
      )}

      <div className="flex flex-col sm:flex-row justify-end items-center gap-4 pt-4">
        <div className="flex items-center gap-2">
          <span className="text-sm text-slate-400">Formato:</span>
          <ButtonGroup isDisabled={loadingDownalods} size="sm">
            <Button
              variant={reportFormat === "pdf" ? "solid" : "bordered"}
              color={reportFormat === "pdf" ? "primary" : "default"}
              onPress={() => setReportFormat("pdf")}
              className={
                reportFormat !== "pdf" ? "border-slate-600 text-slate-400" : ""
              }
            >
              PDF
            </Button>
            <Button
              variant={reportFormat === "csv" ? "solid" : "bordered"}
              color={reportFormat === "csv" ? "primary" : "default"}
              onPress={() => setReportFormat("csv")}
              className={
                reportFormat !== "csv" ? "border-slate-600 text-slate-400" : ""
              }
            >
              CSV
            </Button>
          </ButtonGroup>
        </div>

        <Button
          color="primary"
          size="lg"
          isLoading={loadingDownalods}
          startContent={!loadingDownalods && <FaFileAlt />}
          className="bg-sky-600 hover:bg-sky-700 text-white font-medium w-full sm:w-auto"
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

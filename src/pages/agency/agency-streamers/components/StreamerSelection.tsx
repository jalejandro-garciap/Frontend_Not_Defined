import { Avatar, Button, Divider, Spinner } from "@heroui/react";
import { FaUserCircle, FaPaperPlane } from "react-icons/fa";
import { SearchBar } from "../../../../components/SearchBar";
import { PendingStreamer } from "../interfaces/pending_streamer.interface";
import { SearchResultStreamer } from "../interfaces/search_result_streamer.interface";

export const StreamerSelection = ({
  pendingStreamers,
  onSearch,
  searchResults,
  onSelectForRequest,
  isLoadingSearch,
  searchQuery,
}: {
  pendingStreamers: PendingStreamer[];
  onSearch: (query: string) => void;
  searchResults: SearchResultStreamer[];
  onSelectForRequest: (streamer: SearchResultStreamer) => void;
  isLoadingSearch: boolean;
  searchQuery: string;
}) => (
  <div className="space-y-4">
    <SearchBar
      placeholder="Buscar por nombre de usuario (Google, social)..."
      onSearchChange={onSearch}
    />

    <div className="min-h-[100px]">
      <div className="flex items-center gap-2 mb-2">
        <h4 className="text-sm font-semibold text-slate-300">
          Resultados de búsqueda:
        </h4>
        {isLoadingSearch && <Spinner size="sm" color="current" />}
      </div>
      {!isLoadingSearch && searchResults.length > 0 && (
        <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
          {searchResults.map((streamer) => (
            <div
              key={streamer.id}
              className="flex items-center justify-between p-2 bg-slate-700/50 rounded-lg"
            >
              <div className="flex items-center gap-2">
                <Avatar
                  src={streamer.imageUrl}
                  size="sm"
                  icon={<FaUserCircle />}
                />
                <span className="text-sm text-slate-200">{streamer.name}</span>
              </div>
              <Button
                size="sm"
                variant="flat"
                color="primary"
                onPress={() => onSelectForRequest(streamer)}
                startContent={<FaPaperPlane size={12} />}
                className="bg-sky-600/10 hover:bg-sky-600/20 text-sky-300 border border-sky-600/30"
                isDisabled={streamer.isPending}
              >
                {streamer.isPending ? "Pendiente" : "Solicitar"}
              </Button>
            </div>
          ))}
        </div>
      )}
      {!isLoadingSearch && searchResults.length === 0 && searchQuery && (
        <p className="text-slate-500 text-xs px-2">
          No se encontraron streamers para "{searchQuery}".
        </p>
      )}
      {!isLoadingSearch && searchResults.length === 0 && !searchQuery && (
        <p className="text-slate-500 text-xs px-2">
          Ingresa un término para buscar streamers.
        </p>
      )}
    </div>

    <Divider className="my-4 bg-slate-700" />

    {/* Streamers con Solicitudes Pendientes */}
    <div>
      <h4 className="text-sm font-semibold text-slate-300 mb-2">
        Solicitudes pendientes enviadas:
      </h4>
      {pendingStreamers.length > 0 ? (
        <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
          {pendingStreamers.map((streamer) => (
            <div
              key={streamer.id}
              className="flex items-center gap-2 p-2 bg-slate-700/50 rounded-lg opacity-70"
            >
              <Avatar
                src={streamer.imageUrl}
                size="sm"
                icon={<FaUserCircle />}
              />
              <span className="text-sm text-slate-400">{streamer.name}</span>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-slate-500 text-xs px-2">
          No has enviado solicitudes pendientes.
        </p>
      )}
    </div>
  </div>
);

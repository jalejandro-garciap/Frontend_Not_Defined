import { useDisclosure, Button } from "@heroui/react";
import { useState, useMemo } from "react";
import { FaUserPlus } from "react-icons/fa";
import { SearchBar } from "../../../components/SearchBar";
import { AddStreamerModal } from "./components/AddStreamerModal";
import { AffiliatedStreamerCard } from "./components/AffiliatedStreamerCard";
import { AffiliatedStreamer } from "./interfaces/affiliated_streamer.interface";
import { PendingStreamer } from "./interfaces/pending_streamer.interface";

const AgencyStreamersView = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [filterQuery, setFilterQuery] = useState("");

  const affiliatedStreamersData: AffiliatedStreamer[] = [
    {
      id: "s1",
      name: "StreamerAfiliado1",
      imageUrl: "https://placehold.co/100x100/8B5CF6/FFFFFF?text=SA1",
      socialLinks: { instagram: "user1", tiktok: "user1" },
    },
    {
      id: "s2",
      name: "StreamerAfiliado2",
      imageUrl: "https://placehold.co/100x100/EC4899/FFFFFF?text=SA2",
      socialLinks: { youtube: "user2" },
    },
    {
      id: "s5",
      name: "Otro Streamer",
      imageUrl: "https://placehold.co/100x100/F59E0B/FFFFFF?text=OS",
      socialLinks: { instagram: "user5", youtube: "user5" },
    },
  ];
  const pendingStreamersData: PendingStreamer[] = [
    {
      id: "s3",
      name: "StreamerPendiente1",
      imageUrl: "https://placehold.co/100x100/3B82F6/FFFFFF?text=SP1",
    },
  ];

  const handleRemoveStreamer = (streamerId: string) => {
    console.log(`Remover streamer: ${streamerId}`);
    alert(`Remover streamer ${streamerId} (Lógica no implementada)`);
  };

  const filteredStreamers = useMemo(() => {
    if (!filterQuery) return affiliatedStreamersData;
    return affiliatedStreamersData.filter((s) =>
      s.name.toLowerCase().includes(filterQuery.toLowerCase())
    );
  }, [filterQuery, affiliatedStreamersData]);

  return (
    <div className="w-full max-w-6xl space-y-6">
      <h2 className="text-2xl font-semibold text-slate-100">
        Gestión de Streamers
      </h2>
      <div className="flex flex-col sm:flex-row items-center gap-4 w-full">
        <SearchBar
          placeholder="Filtrar streamers..."
          onSearchChange={setFilterQuery}
        />
        <Button
          color="primary"
          size="lg"
          onPress={onOpen}
          className="bg-sky-600 hover:bg-sky-700 text-white"
        >
          <div className="flex items-center gap-2">
            <FaUserPlus size={20} />
            <span>Agregar Streamer</span>
          </div>
        </Button>
      </div>

      <div className="space-y-4">
        {filteredStreamers.length > 0 ? (
          filteredStreamers.map((streamer) => (
            <AffiliatedStreamerCard
              key={streamer.id}
              streamer={streamer}
              onRemove={handleRemoveStreamer}
            />
          ))
        ) : (
          <p className="text-center text-slate-400 text-sm py-6">
            {filterQuery
              ? "No se encontraron streamers con ese nombre."
              : "Aún no tienes streamers en tu agencia."}
          </p>
        )}
      </div>

      <AddStreamerModal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        pendingStreamersFromProps={pendingStreamersData}
      />
    </div>
  );
};

export default AgencyStreamersView;

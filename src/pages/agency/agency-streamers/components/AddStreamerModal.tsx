import {
  Modal,
  ModalContent,
  ModalHeader,
  Button,
  ModalBody,
} from "@heroui/react";
import { FC, useCallback, useEffect, useState } from "react";
import { IoClose } from "react-icons/io5";
import { StreamerRequestForm } from "./StreamerRequestForm";
import { StreamerSelection } from "./StreamerSelection";
import { PendingStreamer } from "../interfaces/pending_streamer.interface";
import { RequestFormData } from "../interfaces/request_form_data.interface";
import { SearchResultStreamer } from "../interfaces/search_result_streamer.interface";
import { createRequest, searchStreamer } from "../../services/agencyService";
import { useAgencyStore } from "../../store/agencyStore";
import { QueryObserverResult } from "@tanstack/react-query";

interface AddStreamerModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  pendingStreamersFromProps?: PendingStreamer[];
  refetchPendingStreamers: () => Promise<
    QueryObserverResult<PendingStreamer[], Error>
  >;
}

export const AddStreamerModal: FC<AddStreamerModalProps> = ({
  isOpen,
  onOpenChange,
  pendingStreamersFromProps = [],
  refetchPendingStreamers,
}) => {
  const [modalPhase, setModalPhase] = useState<"selection" | "form">(
    "selection"
  );
  const [streamerToRequest, setStreamerToRequest] =
    useState<SearchResultStreamer | null>(null);
  const [searchResults, setSearchResults] = useState<SearchResultStreamer[]>(
    []
  );
  const [isLoadingSearch, setIsLoadingSearch] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false); // Estado para envío
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 500); // Debounce de 500ms

  const { selectedAgency } = useAgencyStore();

  // --- Búsqueda Debounced ---
  const executeSearch = useCallback(
    async (query: string) => {
      if (!query.trim()) {
        setSearchResults([]);
        setIsLoadingSearch(false);
        return;
      }

      if (!selectedAgency) return;

      setIsLoadingSearch(true);

      const results: SearchResultStreamer[] = await searchStreamer(
        selectedAgency.id,
        query
      );

      setSearchResults(results);
      setIsLoadingSearch(false);
    },
    [pendingStreamersFromProps]
  );

  useEffect(() => {
    executeSearch(debouncedSearchQuery);
  }, [debouncedSearchQuery, executeSearch]);

  const handleSelectForRequest = (streamer: SearchResultStreamer) => {
    setStreamerToRequest(streamer);
    setModalPhase("form");
  };

  const handleSubmitRequest = async (formData: RequestFormData) => {
    setIsSubmitting(true);

    await createRequest(
      streamerToRequest?.id || "",
      selectedAgency?.id || "",
      formData
    );

    await refetchPendingStreamers();

    setIsSubmitting(false);
    setSearchResults([]);
    setModalPhase("selection");
    setStreamerToRequest(null);
    onOpenChange(false);
  };

  const handleBackToSelection = () => {
    setModalPhase("selection");
    setStreamerToRequest(null);
  };

  const resetInternalState = () => {
    setModalPhase("selection");
    setStreamerToRequest(null);
    setSearchResults([]);
    setSearchQuery("");
    setIsLoadingSearch(false);
    setIsSubmitting(false);
  };

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      onClose={resetInternalState}
      hideCloseButton
      backdrop="blur"
      placement="center"
      size={modalPhase === "form" ? "xl" : "lg"}
      className="bg-slate-900 border border-slate-700 rounded-xl"
    >
      <ModalContent>
        {(onCloseCallback) => (
          <>
            <ModalHeader className="flex items-center justify-between text-slate-100 border-b border-slate-700">
              {modalPhase === "selection"
                ? "Agregar Streamer"
                : `Enviar Solicitud a ${streamerToRequest?.name}`}
              <Button
                isIconOnly
                variant="light"
                size="sm"
                onPress={onCloseCallback}
                className="text-slate-400 hover:text-slate-100 -mr-2"
              >
                <IoClose size={20} />
              </Button>
            </ModalHeader>
            <ModalBody className="py-4">
              {modalPhase === "selection" ? (
                <StreamerSelection
                  pendingStreamers={pendingStreamersFromProps}
                  onSearch={setSearchQuery}
                  searchResults={searchResults}
                  onSelectForRequest={handleSelectForRequest}
                  isLoadingSearch={isLoadingSearch}
                  searchQuery={searchQuery}
                />
              ) : streamerToRequest ? (
                <StreamerRequestForm
                  streamerToRequest={streamerToRequest}
                  onSubmitRequest={handleSubmitRequest}
                  onBack={handleBackToSelection}
                  isSubmitting={isSubmitting}
                />
              ) : null}
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

function useDebounce(value: string, delay: number): string {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useQuery } from "@tanstack/react-query";
import { fetchManagerAgencies } from "../services/agencyService";
import { useAuth } from "../../../context/AuthContext";

export interface Agency {
  id: string;
  name: string;
  logo?: string;
}

interface AgencyState {
  selectedAgency: Agency | null;
  setSelectedAgency: (agency: Agency) => void;
}

export const useAgencyStore = create<AgencyState>()(
  persist(
    (set) => ({
      selectedAgency: null,
      setSelectedAgency: (agency: Agency) => set({ selectedAgency: agency }),
    }),
    {
      name: "agency-storage",
    }
  )
);

export const useManagerAgencies = () => {
  const { user } = useAuth();
  const { selectedAgency, setSelectedAgency } = useAgencyStore();

  const {
    data: managedAgencies = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["agencies", user?.id],
    queryFn: () => (user ? fetchManagerAgencies() : Promise.resolve([])),
    enabled: !!user?.id && user?.role === "MANAGER",
    staleTime: 5 * 60 * 1000,
  });

  if (managedAgencies.length > 0 && !selectedAgency) {
    setSelectedAgency(managedAgencies[0]);
  }

  const selectAgency = (agencyId: string) => {
    const agency = managedAgencies.find((a) => a.id === agencyId);
    if (agency && (!selectedAgency || agency.id !== selectedAgency.id)) {
      setSelectedAgency(agency);
    }
  };

  return {
    selectedAgency,
    managedAgencies,
    selectAgency,
    isLoading,
    error,
  };
};

export const useInvalidateOnAgencyChange = (queryKey: string[]) => {
  const { selectedAgency } = useAgencyStore();
  return {
    agencyDependentKey: [`agency-${selectedAgency?.id || "none"}`, ...queryKey],
    agencyId: selectedAgency?.id,
  };
};

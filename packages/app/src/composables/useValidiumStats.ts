/* eslint-disable prettier/prettier */
import { ref } from "vue";

import axios from "axios";

import useContext from "./useContext";
interface ValidiumStats {
  lastSealedBatch: number;
  lastVerifiedBatch: number;
  lastSealedBlock: number;
  lastVerifiedBlock: number;
  totalTransactions: number;
  totalActiveAccounts: number;
}

export default function useValidiumStats(context = useContext()) {
  const stats = ref<ValidiumStats | null>(null);
  const pending = ref(false);
  const error = ref<string | null>(null);

  const fetchStats = async () => {
    pending.value = true;
    error.value = null;
    try {
      const statsUrl = `${context.currentNetwork.value.apiUrl}/stats`;
      const response = await axios.get(statsUrl);
      stats.value = response.data;
    } catch (e) {
      error.value = "Failed to fetch stats";
      console.error("Error fetching Validium stats:", e);
    } finally {
      pending.value = false;
    }
  };

  return {
    stats,
    pending,
    error,
    fetchStats,
  };
}

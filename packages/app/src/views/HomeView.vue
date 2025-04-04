<template>
  <div class="home">
    <h1 class="title">{{ t("blockExplorer.title") }}</h1>
    <div class="subtitle">{{ t("blockExplorer.subtitle") }}</div>
    <SearchForm class="search-form" />
    <div class="stats-section">
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-content">
            <p class="stat-value">{{ validiumStats?.totalActiveAccounts?.toLocaleString() || "--" }}</p>
            <p class="stat-label">Total Active Accounts</p>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-content">
            <p class="stat-value">{{ validiumStats?.totalTransactions?.toLocaleString() || "--" }}</p>
            <p class="stat-label">Total Transactions</p>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-content">
            <p class="stat-value">{{ validiumStats?.lastSealedBlock?.toLocaleString() || "--" }}</p>
            <p class="stat-label">Last Sealed Block</p>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-content">
            <p class="stat-value">{{ validiumStats?.lastVerifiedBlock?.toLocaleString() || "--" }}</p>
            <p class="stat-label">Last Verified Block</p>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-content">
            <p class="stat-value">{{ validiumStats?.lastSealedBatch?.toLocaleString() || "--" }}</p>
            <p class="stat-label">Last Sealed Batch</p>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-content">
            <p class="stat-value">{{ validiumStats?.lastVerifiedBatch?.toLocaleString() || "--" }}</p>
            <p class="stat-label">Last Verified Batch</p>
          </div>
        </div>
      </div>
    </div>
    <div class="section">
      <NetworkStats
        v-if="networkStats || networkStatsPending"
        :loading="networkStatsPending"
        :committed="networkStats?.lastSealedBlock"
        :verified="networkStats?.lastVerifiedBlock"
        :transactions="networkStats?.totalTransactions"
        class="network-stats"
      />
    </div>
    <div class="latest-blocks-transactions">
      <div>
        <div class="batches-label-container">
          <p>{{ t("blockExplorer.batches") }}</p>
          <InfoTooltip class="batches-tooltip">{{ t("batches.tooltipInfo") }}</InfoTooltip>
        </div>
        <TableBatches
          v-if="(isBatchesPending || batches) && !isBatchesFailed"
          :data-testid="$testId.latestBatchesTable"
          :loading="isBatchesPending"
          :batches="displayedBatches"
          :columns="['status', 'size', 'txnBatch', 'age']"
        >
          <template #not-found>
            <p class="not-found">{{ t("batches.table.notFoundHomePage") }}</p>
          </template>
        </TableBatches>
        <span v-else-if="isBatchesFailed" class="error-message">
          {{ t("failedRequest") }}
        </span>
      </div>
      <div>
        <p>{{ t("blockExplorer.latestTransactions") }}</p>
        <TransactionsTable
          class="transactions-table"
          :columns="['status', 'transactionHash', 'age']"
          :pagination="false"
          :data-testid="$testId.latestTransactionsTable"
        >
          <template #not-found>
            <TableBodyColumn>
              <p class="not-found">{{ t("transactions.table.notFoundHomePage") }}</p>
            </TableBodyColumn>
          </template>
        </TransactionsTable>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed, onMounted } from "vue";
import { useI18n } from "vue-i18n";

import NetworkStats from "@/components/NetworkStats.vue";
import SearchForm from "@/components/SearchForm.vue";
import TableBatches from "@/components/batches/Table.vue";
import InfoTooltip from "@/components/common/InfoTooltip.vue";
import TableBodyColumn from "@/components/common/table/TableBodyColumn.vue";
import TransactionsTable from "@/components/transactions/Table.vue";

import useBatches from "@/composables/useBatches";
import useNetworkStats from "@/composables/useNetworkStats";
import useValidiumStats from "@/composables/useValidiumStats";

const { t } = useI18n();
const { fetch: fetchNetworkStats, pending: networkStatsPending, item: networkStats } = useNetworkStats();
const { load: getBatches, pending: isBatchesPending, failed: isBatchesFailed, data: batches } = useBatches();
const { stats: validiumStats, fetchStats } = useValidiumStats();

const displayedBatches = computed(() => {
  return batches.value ? batches.value : [];
});

onMounted(() => {
  fetchNetworkStats();
  fetchStats();
  getBatches(1, new Date());
});
</script>

<style lang="scss" scoped>
.home {
  @apply mt-4;

  .title {
    @apply text-4xl font-bold text-white;
  }
  .subtitle {
    @apply mt-2 text-base text-white sm:text-2xl;
  }

  .section {
    @apply block justify-between gap-x-4 pt-9 lg:pt-14;
    .network-stats {
      @apply mb-5 lg:mb-0;
    }
  }

  .search-form {
    @apply mt-6 max-w-xl sm:mt-14 lg:mt-9;
  }

  .latest-blocks-transactions {
    @apply mb-0.5 mt-9 block gap-x-5 lg:flex;
    > div:first-child {
      @apply mb-9 lg:mb-0;
    }
    > div {
      @apply flex w-full flex-col;
    }
    p {
      @apply mb-3 text-2xl font-bold text-neutral-700;
    }
    .error-message {
      @apply h-full;
    }
    .batches-label-container {
      @apply flex items-center gap-x-1;
      .batches-tooltip {
        @apply mb-3;
      }
    }
  }

  .error-message {
    @apply mb-5 flex w-full items-center justify-center rounded-lg border border-rose-600 p-5 text-center text-lg text-rose-600 lg:mb-0;
  }

  .pending {
    @apply mb-5 flex min-h-[calc(100vh-484px)] w-full items-center justify-center lg:mb-0 lg:min-h-0;
  }
  .not-found {
    @apply whitespace-normal py-8 text-center text-neutral-400;
  }
}

.stats-section {
  @apply mt-8 mb-4;

  .stats-grid {
    @apply grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5;
  }

  .stat-card {
    @apply bg-gradient-to-br from-white to-gray-50 rounded-2xl p-5;
    @apply border border-gray-100 shadow-md lg:shadow-sm hover:shadow-md transition-all duration-300;

    .stat-content {
      @apply flex flex-col items-center text-center;

      .stat-value {
        @apply text-3xl font-bold text-gray-900 mb-1;
      }

      .stat-label {
        @apply text-sm text-gray-500 font-medium;
      }
    }
  }
}
</style>

<script setup lang="ts">
import { computed, ref } from 'vue'

type QueueStatus = 'Overdue' | 'Today' | 'Waiting' | 'Upcoming'

type QueueItem = {
  id: number
  client: string
  initials: string
  project: string
  value: string
  status: QueueStatus
  due: string
  note: string
}

const filters = ['All', 'Overdue', 'Today', 'Waiting', 'Upcoming'] as const
type Filter = (typeof filters)[number]

const activeFilter = ref<Filter>('All')

const queue = ref<QueueItem[]>([
  {
    id: 1,
    client: 'North Studio',
    initials: 'NO',
    project: 'Website Redesign',
    value: '€4,800',
    status: 'Overdue',
    due: '2 days late',
    note: 'Viewed twice · no reply for 6 days',
  },
  {
    id: 2,
    client: 'Aura Labs',
    initials: 'AU',
    project: 'Product UI System',
    value: '€6,200',
    status: 'Today',
    due: '14:30',
    note: 'Second follow-up scheduled',
  },
  {
    id: 3,
    client: 'Marea',
    initials: 'MA',
    project: 'Campaign Microsite',
    value: '€2,900',
    status: 'Today',
    due: '16:00',
    note: 'Proposal sent 3 days ago',
  },
  {
    id: 4,
    client: 'Verde Café',
    initials: 'VE',
    project: 'Brand Identity',
    value: '€2,300',
    status: 'Waiting',
    due: '3 days',
    note: 'Client viewed proposal yesterday',
  },
  {
    id: 5,
    client: 'Field Office',
    initials: 'FI',
    project: 'Studio Portfolio',
    value: '€3,600',
    status: 'Upcoming',
    due: 'Sep 18',
    note: 'First follow-up',
  },
  {
    id: 6,
    client: 'Nord & Form',
    initials: 'NF',
    project: 'Landing Page',
    value: '€1,800',
    status: 'Upcoming',
    due: 'Sep 19',
    note: 'Proposal delivered this morning',
  },
])

const completedCount = ref(0)

const filteredQueue = computed(() => {
  if (activeFilter.value === 'All') return queue.value
  return queue.value.filter((item) => item.status === activeFilter.value)
})

const overdueCount = computed(
  () => queue.value.filter((item) => item.status === 'Overdue').length,
)

const todayCount = computed(
  () => queue.value.filter((item) => item.status === 'Today').length,
)

function markComplete(id: number) {
  queue.value = queue.value.filter((item) => item.id !== id)
  completedCount.value += 1
}
</script>

<template>
  <section class="queue-page">
    <div class="queue-hero">
      <div class="queue-hero-copy">
        <span class="eyebrow">ACTION WORKSPACE</span>

        <h1>
          Know exactly
          <em>who needs you next.</em>
        </h1>

        <p>
          One prioritized queue for every proposal that deserves
          a response, reminder or decision.
        </p>
      </div>

      <div class="queue-signal">
        <span>QUEUE STATUS</span>
        <strong>{{ queue.length }}</strong>
        <small>open follow-ups</small>
        <div class="signal-meta">
          {{ completedCount }} completed this session
        </div>
      </div>
    </div>

    <section class="queue-metrics">
      <article>
        <span>Overdue</span>
        <strong>{{ overdueCount }}</strong>
        <small>Need immediate attention</small>
      </article>

      <article>
        <span>Due today</span>
        <strong>{{ todayCount }}</strong>
        <small>Scheduled follow-ups</small>
      </article>

      <article class="metric-dark">
        <span>Open actions</span>
        <strong>{{ queue.length }}</strong>
        <small>Across active proposals</small>
      </article>

      <article>
        <span>Completed</span>
        <strong>{{ completedCount }}</strong>
        <small>This session</small>
      </article>
    </section>

    <div class="filter-bar">
      <button
        v-for="filter in filters"
        :key="filter"
        :class="{ active: activeFilter === filter }"
        @click="activeFilter = filter"
      >
        {{ filter }}
      </button>
    </div>

    <article class="queue-panel">
      <div class="queue-head">
        <span>CLIENT / PROPOSAL</span>
        <span>SIGNAL</span>
        <span>VALUE</span>
        <span>STATUS</span>
        <span>ACTION</span>
      </div>

      <div v-if="filteredQueue.length" class="queue-items">
        <div
          v-for="item in filteredQueue"
          :key="item.id"
          class="queue-item"
        >
          <div class="queue-client">
            <div class="client-avatar">
              {{ item.initials }}
            </div>

            <div>
              <strong>{{ item.client }}</strong>
              <span>{{ item.project }}</span>
            </div>
          </div>

          <div class="queue-signal-copy">
            <strong>{{ item.note }}</strong>
            <span>{{ item.due }}</span>
          </div>

          <div class="queue-price">
            {{ item.value }}
          </div>

          <span
            :class="[
              'queue-status',
              item.status.toLowerCase()
            ]"
          >
            {{ item.status }}
          </span>

          <div class="queue-actions">
            <button class="open-button">
              Open
            </button>

            <button
              class="done-button"
              @click="markComplete(item.id)"
            >
              Done ✓
            </button>
          </div>
        </div>
      </div>

      <div v-else class="empty-state">
        <span>✓</span>
        <strong>No follow-ups here.</strong>
        <p>This view is clear for now.</p>
      </div>
    </article>
  </section>
</template>

<style scoped>
.queue-page {
  padding: 40px 32px 60px;
  max-width: 1560px;
  margin: 0 auto;
}

.queue-hero {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 60px;
  padding: 10px 2px 36px;
}

.queue-hero-copy {
  min-width: 0;
}

.queue-hero h1 {
  font-size: clamp(50px, 4.5vw, 78px);
  line-height: 0.95;
  margin: 14px 0 20px;
  letter-spacing: -4px;
  max-width: 900px;
}

.queue-hero h1 em {
  font-family: 'Instrument Serif', serif;
  font-weight: 400;
  color: #ff7656;
}

.queue-hero p {
  max-width: 650px;
  color: #6f696c;
  line-height: 1.6;
  font-size: 15px;
}

.queue-signal {
  min-width: 220px;
  padding-left: 24px;
  border-left: 1px solid #cfc6bc;
}

.queue-signal > span {
  display: block;
  font-size: 10px;
  letter-spacing: 1.4px;
  color: #928a88;
}

.queue-signal strong {
  display: block;
  font-family: 'Instrument Serif', serif;
  font-size: 54px;
  font-weight: 400;
  line-height: 1;
  margin-top: 8px;
}

.queue-signal small {
  display: block;
  margin-top: 6px;
  color: #777174;
}

.signal-meta {
  font-size: 10px;
  color: #999095;
  margin-top: 12px;
}

.queue-metrics {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
}

.queue-metrics article {
  min-width: 0;
  min-height: 128px;
  padding: 18px;
  background: #faf8f4;
  border: 1px solid #ddd6cd;
  border-radius: 15px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.queue-metrics article > span {
  font-size: 11px;
  color: #817a7e;
}

.queue-metrics article > strong {
  font-size: 32px;
}

.queue-metrics article > small {
  font-size: 10px;
  color: #938b8e;
}

.queue-metrics .metric-dark {
  background: #15161c;
  border-color: #15161c;
  color: white;
}

.queue-metrics .metric-dark span,
.queue-metrics .metric-dark small {
  color: #a6a3ad;
}

.filter-bar {
  display: flex;
  gap: 8px;
  margin: 18px 0 14px;
  flex-wrap: wrap;
}

.filter-bar button {
  border: 1px solid #d9d1c7;
  background: #faf8f4;
  color: #736c70;
  padding: 9px 15px;
  border-radius: 999px;
  cursor: pointer;
  transition: 0.2s ease;
}

.filter-bar button:hover {
  background: #efebe5;
}

.filter-bar button.active {
  color: white;
  background: #15161c;
  border-color: #15161c;
}

.queue-panel {
  background: #faf8f4;
  border: 1px solid #ddd6cd;
  border-radius: 16px;
  overflow: hidden;
}

.queue-head,
.queue-item {
  display: grid;
  grid-template-columns: 1.3fr 1.55fr 0.55fr 0.6fr 0.8fr;
  align-items: center;
  gap: 18px;
}

.queue-head {
  padding: 15px 20px;
  border-bottom: 1px solid #e1dad2;
  color: #938b8e;
  font-size: 9px;
  letter-spacing: 1.2px;
}

.queue-item {
  padding: 18px 20px;
  border-bottom: 1px solid #e3ddd5;
  transition: 0.2s ease;
}

.queue-item:last-child {
  border-bottom: 0;
}

.queue-item:hover {
  background: #f5f1eb;
}

.queue-client {
  display: flex;
  align-items: center;
  gap: 11px;
  min-width: 0;
}

.client-avatar {
  flex: 0 0 38px;
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background: #ece6de;
  display: grid;
  place-items: center;
  font-size: 10px;
  font-weight: 700;
}

.queue-client strong,
.queue-client span,
.queue-signal-copy strong,
.queue-signal-copy span {
  display: block;
}

.queue-client strong {
  font-size: 12px;
}

.queue-client span {
  color: #858086;
  font-size: 10px;
  margin-top: 3px;
}

.queue-signal-copy {
  min-width: 0;
}

.queue-signal-copy strong {
  font-size: 11px;
  font-weight: 500;
}

.queue-signal-copy span {
  margin-top: 4px;
  color: #928a8d;
  font-size: 10px;
}

.queue-price {
  font-weight: 700;
  font-size: 13px;
}

.queue-status {
  display: inline-flex;
  justify-content: center;
  width: fit-content;
  min-width: 80px;
  padding: 6px 10px;
  border-radius: 999px;
  font-size: 9px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.4px;
}

.queue-status.overdue {
  color: #bd4533;
  background: #ffe0d8;
}

.queue-status.today {
  color: #a46c14;
  background: #fff0c9;
}

.queue-status.waiting {
  color: #6751bd;
  background: #e9e4ff;
}

.queue-status.upcoming {
  color: #657078;
  background: #e8edf0;
}

.queue-actions {
  display: flex;
  justify-content: flex-end;
  gap: 7px;
}

.queue-actions button {
  padding: 8px 11px;
  border-radius: 9px;
  cursor: pointer;
  transition: 0.2s ease;
}

.open-button {
  background: #ffffff;
  color: #514b4f;
  border: 1px solid #d8d0c7;
}

.done-button {
  background: #15161c;
  color: white;
  border: 1px solid #15161c;
}

.empty-state {
  padding: 70px 20px;
  text-align: center;
}

.empty-state > span {
  display: grid;
  place-items: center;
  width: 42px;
  height: 42px;
  margin: 0 auto 15px;
  background: #dff7ec;
  color: #25865f;
  border-radius: 50%;
}

.empty-state strong {
  display: block;
  font-size: 18px;
}

.empty-state p {
  color: #8b8387;
  font-size: 11px;
  margin-top: 6px;
}

@media (max-width: 1250px) {
  .queue-head,
  .queue-item {
    grid-template-columns: 1.2fr 1.3fr 0.55fr 0.55fr 0.75fr;
    gap: 10px;
  }
}

/* ===== Mobile ===== */

@media (max-width: 760px) {
  .queue-page {
    width: 100%;
    max-width: none;
    padding: 26px 16px 42px;
    overflow: hidden;
  }

  .queue-hero {
    display: block;
    padding: 4px 0 28px;
  }

  .queue-hero h1 {
    max-width: none;
    margin: 12px 0 16px;
    font-size: 46px;
    line-height: 0.94;
    letter-spacing: -2.5px;
  }

  .queue-hero h1 em {
    display: block;
  }

  .queue-hero p {
    max-width: none;
    font-size: 13px;
    line-height: 1.55;
  }

  .queue-signal {
    width: 100%;
    min-width: 0;
    margin-top: 24px;
    padding: 16px 0 0;
    border-left: 0;
    border-top: 1px solid #cfc6bc;
  }

  .queue-signal strong {
    font-size: 42px;
  }

  .queue-metrics {
    grid-template-columns: 1fr 1fr;
    gap: 10px;
  }

  .queue-metrics article {
    min-height: 112px;
    padding: 15px;
  }

  .queue-metrics article > strong {
    font-size: 28px;
  }

  .filter-bar {
    flex-wrap: nowrap;
    overflow-x: auto;
    padding-bottom: 4px;
    margin: 16px -2px 12px;
    scrollbar-width: none;
  }

  .filter-bar::-webkit-scrollbar {
    display: none;
  }

  .filter-bar button {
    flex: 0 0 auto;
  }

  .queue-panel {
    overflow: visible;
    background: transparent;
    border: 0;
    border-radius: 0;
  }

  .queue-head {
    display: none;
  }

  .queue-items {
    display: grid;
    gap: 10px;
  }

  .queue-item {
    display: grid;
    grid-template-columns: 1fr auto;
    grid-template-areas:
      "client status"
      "signal signal"
      "price actions";
    gap: 12px;
    padding: 16px;
    background: #faf8f4;
    border: 1px solid #ddd6cd;
    border-radius: 14px;
  }

  .queue-item:last-child {
    border-bottom: 1px solid #ddd6cd;
  }

  .queue-client {
    grid-area: client;
  }

  .queue-signal-copy {
    grid-area: signal;
    padding-top: 2px;
    border-top: 1px solid #e7e0d8;
  }

  .queue-signal-copy strong {
    margin-top: 10px;
  }

  .queue-price {
    grid-area: price;
    align-self: center;
    font-size: 15px;
  }

  .queue-status {
    grid-area: status;
    justify-self: end;
    min-width: 0;
  }

  .queue-actions {
    grid-area: actions;
    justify-content: flex-end;
  }

  .queue-actions button {
    padding: 8px 10px;
  }

  .empty-state {
    background: #faf8f4;
    border: 1px solid #ddd6cd;
    border-radius: 14px;
  }
}

@media (max-width: 430px) {
  .queue-hero h1 {
    font-size: 42px;
  }

  .queue-metrics {
    grid-template-columns: 1fr 1fr;
  }

  .queue-actions .open-button {
    display: none;
  }
}
</style>

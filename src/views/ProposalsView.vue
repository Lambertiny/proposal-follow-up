<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'

type ProposalStatus =
  | 'Waiting'
  | 'Viewed'
  | 'Negotiation'
  | 'Won'
  | 'At risk'

type TimelineState = 'done' | 'current' | 'pending'

type Proposal = {
  id: string
  client: string
  initials: string
  project: string
  value: number
  status: ProposalStatus
  sent: string
  lastSignal: string
  nextAction: string
  email: string
  timeline: {
    label: string
    date: string
    state: TimelineState
  }[]
}

const route = useRoute()

const search = ref(
  typeof route.query.q === 'string'
    ? route.query.q
    : '',
)

const activeStatus = ref('All')
const selectedProposal = ref<Proposal | null>(null)
const customProposals = ref<Proposal[]>([])

const statuses = [
  'All',
  'Waiting',
  'Viewed',
  'Negotiation',
  'Won',
  'At risk',
]

const baseProposals: Proposal[] = [
  {
    id: 'PF-019',
    client: 'North Studio',
    initials: 'NO',
    project: 'Website Redesign',
    value: 4800,
    status: 'At risk',
    sent: 'Sep 08',
    lastSignal: 'Viewed 6 days ago',
    nextAction: 'Follow up now',
    email: 'hello@northstudio.example',
    timeline: [
      { label: 'Proposal sent', date: 'Sep 08 · 09:20', state: 'done' },
      { label: 'Client viewed', date: 'Sep 09 · 14:12', state: 'done' },
      { label: 'Viewed again', date: 'Sep 10 · 11:46', state: 'done' },
      { label: 'Follow-up overdue', date: 'Sep 15', state: 'current' },
      { label: 'Client response', date: 'Waiting', state: 'pending' },
    ],
  },
  {
    id: 'PF-020',
    client: 'Aura Labs',
    initials: 'AU',
    project: 'Product UI System',
    value: 6200,
    status: 'Viewed',
    sent: 'Sep 11',
    lastSignal: 'Viewed yesterday',
    nextAction: 'Follow up 14:30',
    email: 'team@auralabs.example',
    timeline: [
      { label: 'Proposal sent', date: 'Sep 11 · 10:05', state: 'done' },
      { label: 'Client viewed', date: 'Sep 14 · 16:18', state: 'done' },
      { label: 'Follow-up scheduled', date: 'Today · 14:30', state: 'current' },
      { label: 'Client response', date: 'Waiting', state: 'pending' },
    ],
  },
  {
    id: 'PF-021',
    client: 'Verde Café',
    initials: 'VE',
    project: 'Brand Identity',
    value: 2300,
    status: 'Negotiation',
    sent: 'Sep 10',
    lastSignal: 'Client replied',
    nextAction: 'Review scope',
    email: 'studio@verdecafe.example',
    timeline: [
      { label: 'Proposal sent', date: 'Sep 10 · 13:40', state: 'done' },
      { label: 'Client viewed', date: 'Sep 11 · 08:33', state: 'done' },
      { label: 'Client replied', date: 'Sep 14 · 17:02', state: 'done' },
      { label: 'Scope review', date: 'Today', state: 'current' },
      { label: 'Decision', date: 'Pending', state: 'pending' },
    ],
  },
  {
    id: 'PF-022',
    client: 'Field Office',
    initials: 'FI',
    project: 'Studio Portfolio',
    value: 3600,
    status: 'Waiting',
    sent: 'Sep 14',
    lastSignal: 'Proposal sent',
    nextAction: 'Sep 18',
    email: 'contact@fieldoffice.example',
    timeline: [
      { label: 'Proposal sent', date: 'Sep 14 · 11:24', state: 'done' },
      { label: 'Waiting for view', date: 'Current', state: 'current' },
      { label: 'Follow-up', date: 'Sep 18', state: 'pending' },
    ],
  },
  {
    id: 'PF-023',
    client: 'Casa Clara',
    initials: 'CC',
    project: 'E-commerce UX',
    value: 5400,
    status: 'Won',
    sent: 'Sep 04',
    lastSignal: 'Accepted Sep 13',
    nextAction: 'Closed',
    email: 'hello@casaclara.example',
    timeline: [
      { label: 'Proposal sent', date: 'Sep 04 · 09:02', state: 'done' },
      { label: 'Client viewed', date: 'Sep 05 · 13:46', state: 'done' },
      { label: 'Negotiation', date: 'Sep 09', state: 'done' },
      { label: 'Proposal accepted', date: 'Sep 13 · 15:20', state: 'done' },
    ],
  },
  {
    id: 'PF-024',
    client: 'Nord & Form',
    initials: 'NF',
    project: 'Landing Page',
    value: 1800,
    status: 'Waiting',
    sent: 'Sep 15',
    lastSignal: 'Proposal sent today',
    nextAction: 'Sep 19',
    email: 'hello@nordform.example',
    timeline: [
      { label: 'Proposal sent', date: 'Today · 08:48', state: 'done' },
      { label: 'Waiting for view', date: 'Current', state: 'current' },
      { label: 'First follow-up', date: 'Sep 19', state: 'pending' },
    ],
  },
]

function loadCustomProposals() {
  const raw = localStorage.getItem('followup-custom-proposals')

  if (!raw) {
    customProposals.value = []
    return
  }

  try {
    customProposals.value = JSON.parse(raw)
  } catch {
    customProposals.value = []
  }
}

loadCustomProposals()

const proposals = computed(() => [
  ...customProposals.value,
  ...baseProposals,
])

const filteredProposals = computed(() => {
  const query = search.value.toLowerCase().trim()

  return proposals.value.filter((proposal) => {
    const matchesSearch =
      !query ||
      proposal.client.toLowerCase().includes(query) ||
      proposal.project.toLowerCase().includes(query) ||
      proposal.id.toLowerCase().includes(query)

    const matchesStatus =
      activeStatus.value === 'All' ||
      proposal.status === activeStatus.value

    return matchesSearch && matchesStatus
  })
})

const totalValue = computed(() => {
  return proposals.value.reduce(
    (total, proposal) => total + proposal.value,
    0,
  )
})

const openValue = computed(() => {
  return proposals.value
    .filter((proposal) => proposal.status !== 'Won')
    .reduce(
      (total, proposal) => total + proposal.value,
      0,
    )
})

watch(
  () => route.query.q,
  (query) => {
    search.value =
      typeof query === 'string'
        ? query
        : ''
  },
)

watch(
  () => route.query.refresh,
  () => {
    loadCustomProposals()
    search.value = ''
    activeStatus.value = 'All'
  },
)

function openProposal(proposal: Proposal) {
  selectedProposal.value = proposal
}

function closeProposal() {
  selectedProposal.value = null
}
</script>

<template>
  <section class="proposals-page">
    <div class="proposals-hero">
      <div>
        <span class="eyebrow">COMMERCIAL MEMORY</span>

        <h1>
          Every proposal has
          <em>a story.</em>
        </h1>

        <p>
          Search, filter and inspect the complete state of every
          commercial conversation.
        </p>
      </div>

      <div class="proposal-signal">
        <span>PORTFOLIO VALUE</span>

        <strong>
          €{{ totalValue.toLocaleString('en-US') }}
        </strong>

        <small>
          €{{ openValue.toLocaleString('en-US') }} still open
        </small>
      </div>
    </div>

    <section class="proposal-metrics">
      <article>
        <span>All proposals</span>
        <strong>{{ proposals.length }}</strong>
        <small>Current proposal history</small>
      </article>

      <article>
        <span>Waiting</span>
        <strong>
          {{
            proposals.filter(
              (proposal) => proposal.status === 'Waiting'
            ).length
          }}
        </strong>
        <small>Awaiting client movement</small>
      </article>

      <article class="metric-dark">
        <span>Negotiation</span>
        <strong>
          {{
            proposals.filter(
              (proposal) => proposal.status === 'Negotiation'
            ).length
          }}
        </strong>
        <small>Active commercial conversations</small>
      </article>

      <article>
        <span>Won</span>
        <strong>
          {{
            proposals.filter(
              (proposal) => proposal.status === 'Won'
            ).length
          }}
        </strong>
        <small>Accepted proposals</small>
      </article>
    </section>

    <div class="proposal-toolbar">
      <div class="proposal-search">
        <span>⌕</span>

        <input
          v-model="search"
          type="text"
          placeholder="Search client, project or proposal ID"
        />
      </div>

      <div class="proposal-filters">
        <button
          v-for="status in statuses"
          :key="status"
          :class="{ active: activeStatus === status }"
          @click="activeStatus = status"
        >
          {{ status }}
        </button>
      </div>
    </div>

    <article class="proposal-table">
      <div class="proposal-head">
        <span>PROPOSAL</span>
        <span>VALUE</span>
        <span>STATUS</span>
        <span>SENT</span>
        <span>LAST SIGNAL</span>
        <span>NEXT ACTION</span>
      </div>

      <button
        v-for="proposal in filteredProposals"
        :key="proposal.id"
        class="proposal-row"
        @click="openProposal(proposal)"
      >
        <span class="proposal-client">
          <span class="proposal-avatar">
            {{ proposal.initials }}
          </span>

          <span>
            <small>{{ proposal.id }}</small>
            <strong>{{ proposal.client }}</strong>
            <em>{{ proposal.project }}</em>
          </span>
        </span>

        <strong class="proposal-value">
          €{{ proposal.value.toLocaleString('en-US') }}
        </strong>

        <span
          :class="[
            'proposal-status',
            proposal.status
              .toLowerCase()
              .replace(' ', '-')
          ]"
        >
          {{ proposal.status }}
        </span>

        <span class="proposal-meta">
          {{ proposal.sent }}
        </span>

        <span class="proposal-meta">
          {{ proposal.lastSignal }}
        </span>

        <span class="proposal-action">
          {{ proposal.nextAction }} ↗
        </span>
      </button>

      <div
        v-if="!filteredProposals.length"
        class="empty-state"
      >
        <span>⌕</span>
        <strong>No proposals found.</strong>
        <p>Try another search or filter.</p>
      </div>
    </article>

    <div
      v-if="selectedProposal"
      class="drawer-backdrop"
      @click.self="closeProposal"
    >
      <aside class="proposal-drawer">
        <button
          class="drawer-close"
          @click="closeProposal"
        >
          ×
        </button>

        <span class="drawer-eyebrow">
          {{ selectedProposal.id }}
        </span>

        <h2>
          {{ selectedProposal.client }}
        </h2>

        <p class="drawer-project">
          {{ selectedProposal.project }}
        </p>

        <div class="drawer-price">
          €{{ selectedProposal.value.toLocaleString('en-US') }}
        </div>

        <span
          :class="[
            'drawer-status',
            selectedProposal.status
              .toLowerCase()
              .replace(' ', '-')
          ]"
        >
          {{ selectedProposal.status }}
        </span>

        <div class="drawer-meta-grid">
          <div>
            <span>Sent</span>
            <strong>{{ selectedProposal.sent }}</strong>
          </div>

          <div>
            <span>Last signal</span>
            <strong>{{ selectedProposal.lastSignal }}</strong>
          </div>

          <div>
            <span>Next action</span>
            <strong>{{ selectedProposal.nextAction }}</strong>
          </div>

          <div>
            <span>Contact</span>
            <strong>{{ selectedProposal.email }}</strong>
          </div>
        </div>

        <div class="drawer-section-title">
          PROPOSAL TIMELINE
        </div>

        <div class="proposal-timeline">
          <div
            v-for="step in selectedProposal.timeline"
            :key="step.label"
            :class="[
              'timeline-step',
              step.state
            ]"
          >
            <span class="timeline-dot"></span>

            <div>
              <strong>{{ step.label }}</strong>
              <small>{{ step.date }}</small>
            </div>
          </div>
        </div>

        <div class="drawer-actions">
          <button class="drawer-secondary">
            Open proposal
          </button>

          <RouterLink
            to="/queue"
            class="drawer-primary"
          >
            Create follow-up →
          </RouterLink>
        </div>
      </aside>
    </div>
  </section>
</template>

<style scoped>
.proposals-page {
  padding: 40px 32px 60px;
  max-width: 1560px;
  margin: 0 auto;
}

.proposals-hero {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 60px;
  padding: 10px 2px 36px;
}

.proposals-hero h1 {
  font-size: clamp(50px, 4.5vw, 78px);
  line-height: 0.95;
  margin: 14px 0 20px;
  letter-spacing: -4px;
}

.proposals-hero h1 em {
  font-family: 'Instrument Serif', serif;
  font-weight: 400;
  color: #ff7656;
}

.proposals-hero p {
  max-width: 650px;
  color: #6f696c;
  line-height: 1.6;
  font-size: 15px;
}

.proposal-signal {
  min-width: 240px;
  padding-left: 24px;
  border-left: 1px solid #cfc6bc;
}

.proposal-signal > span {
  display: block;
  font-size: 10px;
  letter-spacing: 1.4px;
  color: #928a88;
}

.proposal-signal strong {
  display: block;
  font-family: 'Instrument Serif', serif;
  font-size: 42px;
  font-weight: 400;
  margin-top: 8px;
}

.proposal-signal small {
  color: #777174;
}

.proposal-metrics {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
}

.proposal-metrics article {
  min-height: 128px;
  padding: 18px;
  background: #faf8f4;
  border: 1px solid #ddd6cd;
  border-radius: 15px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.proposal-metrics article > span {
  color: #817a7e;
  font-size: 11px;
}

.proposal-metrics article > strong {
  font-size: 32px;
}

.proposal-metrics article > small {
  color: #938b8e;
  font-size: 10px;
}

.proposal-metrics .metric-dark {
  background: #15161c;
  border-color: #15161c;
  color: white;
}

.proposal-metrics .metric-dark span,
.proposal-metrics .metric-dark small {
  color: #aaa6ae;
}

.proposal-toolbar {
  margin: 18px 0 14px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
}

.proposal-search {
  width: 360px;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 13px;
  background: #faf8f4;
  border: 1px solid #d9d1c7;
  border-radius: 11px;
}

.proposal-search span {
  color: #8c8589;
}

.proposal-search input {
  border: 0;
  outline: none;
  background: transparent;
  width: 100%;
  padding: 11px 0;
}

.proposal-filters {
  display: flex;
  gap: 7px;
  flex-wrap: wrap;
  justify-content: flex-end;
}

.proposal-filters button {
  border: 1px solid #d9d1c7;
  background: #faf8f4;
  color: #716a6e;
  border-radius: 999px;
  padding: 9px 13px;
  cursor: pointer;
}

.proposal-filters button.active {
  background: #15161c;
  border-color: #15161c;
  color: white;
}

.proposal-table {
  background: #faf8f4;
  border: 1px solid #ddd6cd;
  border-radius: 16px;
  overflow: hidden;
}

.proposal-head,
.proposal-row {
  display: grid;
  grid-template-columns:
    1.35fr
    0.55fr
    0.7fr
    0.55fr
    1fr
    1fr;
  gap: 15px;
  align-items: center;
}

.proposal-head {
  padding: 15px 20px;
  color: #938b8e;
  font-size: 9px;
  letter-spacing: 1.2px;
  border-bottom: 1px solid #e3ddd5;
}

.proposal-row {
  width: 100%;
  padding: 16px 20px;
  border: 0;
  border-bottom: 1px solid #e3ddd5;
  background: transparent;
  text-align: left;
  color: #242126;
  cursor: pointer;
  transition: 0.2s ease;
}

.proposal-row:hover {
  background: #f3eee8;
}

.proposal-row:last-of-type {
  border-bottom: 0;
}

.proposal-client {
  display: flex;
  align-items: center;
  gap: 11px;
}

.proposal-avatar {
  width: 38px;
  height: 38px;
  flex: 0 0 38px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  background: #ece6de;
  font-size: 10px;
  font-weight: 700;
}

.proposal-client small,
.proposal-client strong,
.proposal-client em {
  display: block;
  font-style: normal;
}

.proposal-client small {
  color: #9b9397;
  font-size: 9px;
}

.proposal-client strong {
  margin-top: 2px;
  font-size: 12px;
}

.proposal-client em {
  color: #858086;
  font-size: 10px;
  margin-top: 2px;
}

.proposal-value {
  font-size: 13px;
}

.proposal-status {
  width: fit-content;
  min-width: 78px;
  text-align: center;
  padding: 6px 9px;
  border-radius: 999px;
  font-size: 9px;
  font-weight: 700;
}

.proposal-status.waiting,
.drawer-status.waiting {
  background: #e8edf0;
  color: #657078;
}

.proposal-status.viewed,
.drawer-status.viewed {
  background: #fff0c9;
  color: #a46c14;
}

.proposal-status.negotiation,
.drawer-status.negotiation {
  background: #e9e4ff;
  color: #6751bd;
}

.proposal-status.won,
.drawer-status.won {
  background: #dff7ec;
  color: #25865f;
}

.proposal-status.at-risk,
.drawer-status.at-risk {
  background: #ffe0d8;
  color: #bd4533;
}

.proposal-meta {
  color: #777174;
  font-size: 10px;
}

.proposal-action {
  font-size: 10px;
  color: #39343a;
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
  border-radius: 50%;
  background: #ece6de;
}

.empty-state strong {
  display: block;
}

.empty-state p {
  color: #8b8387;
  font-size: 11px;
}

.drawer-backdrop {
  position: fixed;
  inset: 0;
  z-index: 90;
  background: rgba(10, 10, 14, 0.32);
  backdrop-filter: blur(4px);
}

.proposal-drawer {
  position: absolute;
  right: 0;
  top: 0;
  width: 410px;
  height: 100%;
  background: #111218;
  color: #f7f4ef;
  padding: 34px;
  overflow-y: auto;
  box-shadow: -30px 0 80px rgba(0, 0, 0, 0.2);
  animation: drawerIn 0.25s ease;
}

@keyframes drawerIn {
  from {
    transform: translateX(30px);
    opacity: 0;
  }

  to {
    transform: translateX(0);
    opacity: 1;
  }
}

.drawer-close {
  position: absolute;
  right: 20px;
  top: 20px;
  width: 36px;
  height: 36px;
  border: 0;
  border-radius: 50%;
  background: #23242c;
  color: white;
  font-size: 20px;
  cursor: pointer;
}

.drawer-eyebrow {
  color: #7d7f8b;
  font-size: 10px;
  letter-spacing: 1.4px;
}

.proposal-drawer h2 {
  margin: 12px 0 0;
  font-family: 'Instrument Serif', serif;
  font-size: 46px;
  font-weight: 400;
}

.drawer-project {
  margin-top: 4px;
  color: #9899a5;
}

.drawer-price {
  margin: 28px 0 12px;
  font-size: 34px;
  font-weight: 700;
}

.drawer-status {
  display: inline-block;
  padding: 7px 10px;
  border-radius: 999px;
  font-size: 9px;
  font-weight: 700;
}

.drawer-meta-grid {
  margin-top: 26px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

.drawer-meta-grid > div {
  padding: 13px;
  border: 1px solid #2b2c35;
  background: #191a21;
  border-radius: 11px;
}

.drawer-meta-grid span,
.drawer-meta-grid strong {
  display: block;
}

.drawer-meta-grid span {
  color: #777985;
  font-size: 9px;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.drawer-meta-grid strong {
  margin-top: 6px;
  font-size: 10px;
  line-height: 1.4;
  word-break: break-word;
}

.drawer-section-title {
  margin-top: 32px;
  color: #777985;
  font-size: 9px;
  letter-spacing: 1.3px;
}

.proposal-timeline {
  margin-top: 18px;
  display: grid;
  gap: 20px;
}

.timeline-step {
  position: relative;
  display: grid;
  grid-template-columns: 14px 1fr;
  gap: 12px;
}

.timeline-step::after {
  content: '';
  position: absolute;
  left: 5px;
  top: 15px;
  width: 1px;
  height: 31px;
  background: #30313a;
}

.timeline-step:last-child::after {
  display: none;
}

.timeline-dot {
  margin-top: 4px;
  width: 11px;
  height: 11px;
  border-radius: 50%;
  background: #41434d;
}

.timeline-step.done .timeline-dot {
  background: #59d39b;
}

.timeline-step.current .timeline-dot {
  background: #ff805f;
  box-shadow: 0 0 14px rgba(255, 128, 95, 0.8);
}

.timeline-step strong,
.timeline-step small {
  display: block;
}

.timeline-step strong {
  font-size: 11px;
}

.timeline-step small {
  margin-top: 4px;
  color: #777985;
  font-size: 9px;
}

.timeline-step.pending {
  color: #666873;
}

.drawer-actions {
  margin-top: 32px;
  display: grid;
  grid-template-columns: 1fr 1.25fr;
  gap: 8px;
}

.drawer-secondary,
.drawer-primary {
  border-radius: 10px;
  padding: 12px;
  text-align: center;
  text-decoration: none;
  cursor: pointer;
}

.drawer-secondary {
  color: #dedee3;
  border: 1px solid #33343d;
  background: #1a1b22;
}

.drawer-primary {
  color: #111218;
  background: #ff805f;
  border: 1px solid #ff805f;
  font-weight: 700;
}

@media (max-width: 1250px) {
  .proposal-head,
  .proposal-row {
    grid-template-columns:
      1.25fr
      0.55fr
      0.65fr
      0.5fr
      0.85fr
      0.9fr;
    gap: 10px;
  }

  .proposal-toolbar {
    align-items: flex-start;
    flex-direction: column;
  }
}

/* ===== Mobile ===== */

@media (max-width: 760px) {
  .proposals-page {
    width: 100%;
    max-width: none;
    padding: 26px 16px 42px;
    overflow: hidden;
  }

  .proposals-hero {
    display: block;
    padding: 4px 0 28px;
  }

  .proposals-hero h1 {
    margin: 12px 0 16px;
    font-size: 46px;
    line-height: 0.94;
    letter-spacing: -2.5px;
    max-width: 100%;
  }

  .proposals-hero h1 em {
    display: block;
  }

  .proposals-hero p {
    max-width: none;
    font-size: 13px;
    line-height: 1.55;
  }

  .proposal-signal {
    width: 100%;
    min-width: 0;
    margin-top: 24px;
    padding: 16px 0 0;
    border-left: 0;
    border-top: 1px solid #cfc6bc;
  }

  .proposal-signal strong {
    font-size: 38px;
    line-height: 1;
    overflow-wrap: anywhere;
  }

  .proposal-signal small {
    display: block;
    margin-top: 6px;
  }

  .proposal-metrics {
    grid-template-columns: 1fr 1fr;
    gap: 10px;
  }

  .proposal-metrics article {
    min-width: 0;
    min-height: 112px;
    padding: 15px;
  }

  .proposal-metrics article > strong {
    font-size: 28px;
  }

  .proposal-toolbar {
    display: block;
    margin: 16px 0 12px;
  }

  .proposal-search {
    width: 100%;
    min-width: 0;
  }

  .proposal-filters {
    margin-top: 12px;
    display: flex;
    flex-wrap: nowrap;
    justify-content: flex-start;
    gap: 8px;
    overflow-x: auto;
    padding-bottom: 4px;
    scrollbar-width: none;
  }

  .proposal-filters::-webkit-scrollbar {
    display: none;
  }

  .proposal-filters button {
    flex: 0 0 auto;
  }

  .proposal-table {
    overflow: visible;
    background: transparent;
    border: 0;
    border-radius: 0;
  }

  .proposal-head {
    display: none;
  }

  .proposal-row {
    display: grid;
    grid-template-columns: 1fr auto;
    grid-template-areas:
      "client status"
      "value meta"
      "signal action";
    gap: 12px 10px;
    width: 100%;
    margin-bottom: 10px;
    padding: 16px;
    border: 1px solid #ddd6cd;
    border-radius: 14px;
    background: #faf8f4;
  }

  .proposal-row:last-of-type {
    border-bottom: 1px solid #ddd6cd;
  }

  .proposal-client {
    grid-area: client;
    min-width: 0;
  }

  .proposal-client > span:last-child {
    min-width: 0;
  }

  .proposal-client strong,
  .proposal-client em,
  .proposal-client small {
    overflow-wrap: anywhere;
  }

  .proposal-value {
    grid-area: value;
    align-self: center;
    font-size: 15px;
  }

  .proposal-status {
    grid-area: status;
    justify-self: end;
    min-width: 0;
  }

  .proposal-meta {
    grid-area: meta;
    justify-self: end;
    text-align: right;
  }

  .proposal-meta:nth-of-type(2) {
    grid-area: signal;
    justify-self: start;
    text-align: left;
    padding-top: 10px;
    border-top: 1px solid #e7e0d8;
    width: 100%;
  }

  .proposal-action {
    grid-area: action;
    justify-self: end;
    text-align: right;
    padding-top: 10px;
    border-top: 1px solid #e7e0d8;
  }

  .drawer-backdrop {
    z-index: 120;
  }

  .proposal-drawer {
    width: 100%;
    max-width: 100%;
    padding: 28px 20px 24px;
  }

  .drawer-meta-grid {
    grid-template-columns: 1fr;
  }

  .drawer-actions {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 430px) {
  .proposals-hero h1 {
    font-size: 42px;
  }

  .proposal-metrics {
    grid-template-columns: 1fr 1fr;
  }

  .proposal-signal strong {
    font-size: 36px;
  }

  .proposal-row {
    grid-template-columns: 1fr auto;
  }
}

</style>

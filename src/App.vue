<script setup lang="ts">
import { computed, ref } from 'vue'
import { RouterLink, RouterView, useRoute, useRouter } from 'vue-router'

type StoredProposal = {
  id: string
  client: string
  initials: string
  project: string
  value: number
  status: 'Waiting'
  sent: string
  lastSignal: string
  nextAction: string
  email: string
  timeline: {
    label: string
    date: string
    state: 'done' | 'current' | 'pending'
  }[]
}

const route = useRoute()
const router = useRouter()

const navigation = [
  { label: 'Overview', path: '/' },
  { label: 'Follow Up Queue', path: '/queue' },
  { label: 'Proposals', path: '/proposals' },
  { label: 'Automation Rules', path: '/automations' },
  { label: 'Insights', path: '/insights' },
]

const pageTitle = computed(() => {
  switch (route.name) {
    case 'queue':
      return 'Follow Up Queue'
    case 'proposals':
      return 'Proposals'
    case 'automations':
      return 'Automation Rules'
    case 'insights':
      return 'Insights'
    default:
      return 'Overview'
  }
})

const pageEyebrow = computed(() => {
  switch (route.name) {
    case 'queue':
      return 'FOLLOW//UP / QUEUE'
    case 'proposals':
      return 'FOLLOW//UP / PROPOSALS'
    case 'automations':
      return 'FOLLOW//UP / AUTOMATIONS'
    case 'insights':
      return 'FOLLOW//UP / INSIGHTS'
    default:
      return 'FOLLOW//UP / OVERVIEW'
  }
})

const mobileMenuOpen = ref(false)
const searchOpen = ref(false)
const searchTerm = ref('')

const newProposalOpen = ref(false)
const client = ref('')
const project = ref('')
const value = ref('')
const email = ref('')

function closeMobileMenu() {
  mobileMenuOpen.value = false
}

function submitSearch() {
  const query = searchTerm.value.trim()

  if (!query) {
    router.push('/proposals')
  } else {
    router.push({
      path: '/proposals',
      query: { q: query },
    })
  }

  searchOpen.value = false
  mobileMenuOpen.value = false
}

function openNewProposal() {
  client.value = ''
  project.value = ''
  value.value = ''
  email.value = ''
  newProposalOpen.value = true
}

function buildInitials(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join('')
}

function createProposal() {
  if (!client.value.trim() || !project.value.trim()) return

  const raw = localStorage.getItem('followup-custom-proposals')
  const saved: StoredProposal[] = raw ? JSON.parse(raw) : []

  const numericValue =
    Number(value.value.replace(/[^\d.,]/g, '').replace(',', '.')) || 0

  const proposalNumber = 25 + saved.length

  const proposal: StoredProposal = {
    id: `PF-${String(proposalNumber).padStart(3, '0')}`,
    client: client.value.trim(),
    initials: buildInitials(client.value),
    project: project.value.trim(),
    value: numericValue,
    status: 'Waiting',
    sent: 'Today',
    lastSignal: 'Created now',
    nextAction: 'Follow up in 3 days',
    email: email.value.trim() || 'No email added',
    timeline: [
      {
        label: 'Proposal created',
        date: 'Now',
        state: 'done',
      },
      {
        label: 'Waiting for client',
        date: 'Current',
        state: 'current',
      },
      {
        label: 'First follow-up',
        date: 'In 3 days',
        state: 'pending',
      },
    ],
  }

  localStorage.setItem(
    'followup-custom-proposals',
    JSON.stringify([proposal, ...saved]),
  )

  newProposalOpen.value = false

  router.push({
    path: '/proposals',
    query: { refresh: Date.now().toString() },
  })
}
</script>

<template>
  <div class="app-shell">
    <div
      v-if="mobileMenuOpen"
      class="sidebar-backdrop"
      @click="closeMobileMenu"
    ></div>

    <aside :class="['sidebar', { open: mobileMenuOpen }]">
      <div>
        <div class="brand">
          <div class="brand-mark">F//</div>

          <div class="brand-copy">
            <strong>FOLLOW//UP</strong>
            <span>Proposal Operations</span>
          </div>

          <button
            class="sidebar-close"
            aria-label="Close navigation"
            @click="closeMobileMenu"
          >
            ×
          </button>
        </div>

        <nav class="navigation">
          <RouterLink
            v-for="item in navigation"
            :key="item.path"
            :to="item.path"
            class="navigation-link"
            @click="closeMobileMenu"
          >
            <span class="nav-dot"></span>
            {{ item.label }}
          </RouterLink>
        </nav>
      </div>

      <div class="sidebar-bottom">
        <div class="automation-status">
          <span class="status-light"></span>

          <div>
            <strong>Automation active</strong>
            <small>4 rules running</small>
          </div>
        </div>

        <div class="profile">
          <div class="avatar">JN</div>

          <div>
            <strong>Juliana</strong>
            <span>Creative Studio</span>
          </div>

          <button>•••</button>
        </div>
      </div>
    </aside>

    <main class="workspace">
      <header class="topbar">
        <div class="topbar-left">
          <button
            class="mobile-menu-button"
            aria-label="Open navigation"
            @click="mobileMenuOpen = true"
          >
            ☰
          </button>

          <div class="topbar-copy">
            <span class="eyebrow">{{ pageEyebrow }}</span>
            <strong>{{ pageTitle }}</strong>
          </div>
        </div>

        <div class="top-actions">
          <form
            v-if="searchOpen"
            class="top-search-form"
            @submit.prevent="submitSearch"
          >
            <input
              v-model="searchTerm"
              autofocus
              type="text"
              placeholder="Search client or proposal"
            />

            <button type="submit">
              Search
            </button>

            <button
              type="button"
              class="search-cancel"
              @click="searchOpen = false"
            >
              ×
            </button>
          </form>

          <button
            v-else
            class="search"
            aria-label="Search proposals"
            @click="searchOpen = true"
          >
            ⌕ &nbsp; Search
          </button>

          <RouterLink
            to="/automations"
            class="secondary top-link"
          >
            Automations
          </RouterLink>

          <button
            class="primary"
            aria-label="Create new proposal"
            @click="openNewProposal"
          >
            + New proposal
          </button>
        </div>
      </header>

      <RouterView />
    </main>

    <div
      v-if="newProposalOpen"
      class="proposal-modal-backdrop"
      @click.self="newProposalOpen = false"
    >
      <section class="proposal-modal">
        <button
          class="proposal-modal-close"
          @click="newProposalOpen = false"
        >
          ×
        </button>

        <span class="eyebrow">NEW RECORD</span>
        <h2>Create a proposal</h2>

        <p>
          Add a new commercial opportunity to the FOLLOW//UP workspace.
        </p>

        <div class="proposal-modal-fields">
          <label>
            Client
            <input
              v-model="client"
              type="text"
              placeholder="Client name"
            />
          </label>

          <label>
            Project
            <input
              v-model="project"
              type="text"
              placeholder="Project name"
            />
          </label>

          <label>
            Value
            <input
              v-model="value"
              type="text"
              placeholder="€ 0.00"
            />
          </label>

          <label>
            Email
            <input
              v-model="email"
              type="email"
              placeholder="client@example.com"
            />
          </label>
        </div>

        <button
          class="proposal-modal-primary"
          @click="createProposal"
        >
          Create proposal →
        </button>
      </section>
    </div>
  </div>
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Instrument+Serif:ital@0;1&display=swap');

:root {
  font-family: 'DM Sans', sans-serif;
  color: #17171c;
  background: #f2eee7;
  font-synthesis: none;
  text-rendering: optimizeLegibility;
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  min-width: 1180px;
  min-height: 100vh;
  background: #f2eee7;
}

button {
  font: inherit;
}

.app-shell {
  display: grid;
  grid-template-columns: 250px 1fr;
  min-height: 100vh;
}

.sidebar {
  background: #0d0e13;
  color: #f7f4ef;
  padding: 24px 18px 18px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: fixed;
  width: 250px;
  height: 100vh;
}

.brand {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 0 8px 24px;
  border-bottom: 1px solid #25262d;
}

.brand-mark {
  width: 42px;
  height: 42px;
  border-radius: 12px;
  display: grid;
  place-items: center;
  background: #1b1c23;
  border: 1px solid #2d2e36;
  color: #ff805f;
  font-weight: 700;
  letter-spacing: -1px;
}

.brand strong,
.brand span {
  display: block;
}

.brand strong {
  font-size: 13px;
  letter-spacing: 1.4px;
}

.brand span {
  margin-top: 3px;
  font-size: 11px;
  color: #858795;
}

.navigation {
  margin-top: 30px;
  display: grid;
  gap: 5px;
}

.navigation-link {
  border: 0;
  text-decoration: none;
  color: #999ba8;
  background: transparent;
  padding: 13px 12px;
  border-radius: 10px;
  text-align: left;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px;
  transition: 0.2s ease;
}

.navigation-link:hover {
  background: #17181f;
  color: white;
}

.navigation-link.router-link-exact-active {
  background: #1c1d25;
  color: white;
  box-shadow: inset 0 0 0 1px #33343e;
}

.nav-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #4f515e;
}

.navigation-link.router-link-exact-active .nav-dot {
  background: #ff805f;
  box-shadow: 0 0 12px rgba(255, 128, 95, 0.7);
}

.automation-status {
  padding: 16px 10px;
  border-top: 1px solid #25262d;
  border-bottom: 1px solid #25262d;
  display: flex;
  align-items: center;
  gap: 10px;
}

.status-light {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #59d39b;
  box-shadow: 0 0 14px #59d39b;
}

.automation-status strong,
.automation-status small {
  display: block;
}

.automation-status strong {
  font-size: 12px;
}

.automation-status small {
  font-size: 10px;
  color: #80828e;
  margin-top: 3px;
}

.profile {
  margin-top: 16px;
  display: grid;
  grid-template-columns: 36px 1fr auto;
  gap: 10px;
  align-items: center;
  padding: 10px;
  background: #17181f;
  border-radius: 12px;
}

.avatar {
  width: 36px;
  height: 36px;
  display: grid;
  place-items: center;
  background: #f0e9de;
  color: #16171c;
  border-radius: 50%;
  font-size: 11px;
  font-weight: 700;
}

.profile strong,
.profile span {
  display: block;
}

.profile strong {
  font-size: 12px;
}

.profile span {
  color: #777987;
  font-size: 10px;
  margin-top: 2px;
}

.profile button {
  border: 0;
  color: #72747e;
  background: transparent;
}

.workspace {
  grid-column: 2;
}

.topbar {
  min-height: 82px;
  padding: 20px 32px;
  background: rgba(247, 244, 239, 0.94);
  border-bottom: 1px solid #ddd6cc;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: sticky;
  top: 0;
  z-index: 10;
  backdrop-filter: blur(12px);
}

.topbar > div:first-child strong {
  display: block;
  margin-top: 5px;
  font-size: 17px;
}

.eyebrow {
  font-size: 10px;
  font-weight: 600;
  color: #89838a;
  letter-spacing: 1.6px;
}

.top-actions {
  display: flex;
  gap: 8px;
}

.top-link {
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.top-actions button,
.top-actions .top-link,
.panel-header button {
  border: 1px solid #d9d1c7;
  background: #fbf9f6;
  color: #5f5b61;
  border-radius: 10px;
  padding: 10px 13px;
  cursor: pointer;
}

.top-actions .primary {
  background: #13141a;
  color: white;
  border-color: #13141a;
}

.content {
  padding: 40px 32px 60px;
  max-width: 1560px;
  margin: 0 auto;
}

.hero {
  display: flex;
  justify-content: space-between;
  align-items: end;
  gap: 60px;
  padding: 10px 2px 36px;
}

.hero h1 {
  font-size: clamp(50px, 4.5vw, 78px);
  line-height: 0.95;
  margin: 14px 0 20px;
  letter-spacing: -4px;
  max-width: 850px;
}

.hero h1 em {
  font-family: 'Instrument Serif', serif;
  font-weight: 400;
  color: #ff7656;
}

.hero p {
  max-width: 680px;
  color: #6f696c;
  line-height: 1.6;
  font-size: 15px;
}

.hero-signal {
  min-width: 235px;
  padding-left: 22px;
  border-left: 1px solid #cfc6bc;
}

.hero-signal span,
.hero-signal strong,
.hero-signal small {
  display: block;
}

.hero-signal span {
  font-size: 10px;
  letter-spacing: 1.4px;
  color: #928a88;
}

.hero-signal strong {
  font-family: 'Instrument Serif', serif;
  font-weight: 400;
  font-size: 42px;
  margin: 5px 0;
}

.hero-signal small {
  color: #777174;
}

.metrics {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
}

.metrics article {
  background: #faf8f4;
  border: 1px solid #ddd6cd;
  border-radius: 15px;
  padding: 18px;
  min-height: 140px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.metrics .highlight-card {
  color: white;
  background:
    radial-gradient(circle at top right, rgba(255, 128, 95, 0.17), transparent 44%),
    #15161c;
  border-color: #15161c;
}

.metric-label {
  font-size: 12px;
  color: #777178;
  display: flex;
  justify-content: space-between;
}

.highlight-card .metric-label,
.highlight-card small {
  color: #a9a5ae;
}

.metrics strong {
  font-size: 32px;
  letter-spacing: -1.5px;
}

.metrics small {
  font-size: 11px;
  color: #898186;
}

.dashboard-grid {
  margin-top: 14px;
  display: grid;
  grid-template-columns: 1.55fr 0.85fr;
  gap: 14px;
}

.panel {
  background: #faf8f4;
  border: 1px solid #ddd6cd;
  border-radius: 16px;
  overflow: hidden;
}

.panel-header {
  padding: 18px 20px;
  min-height: 76px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #e2dbd2;
}

.panel-header h2 {
  font-size: 17px;
  margin: 4px 0 0;
}

.panel-header button {
  padding: 8px 10px;
  font-size: 11px;
}

.queue-list {
  padding: 0 20px 12px;
}

.queue-row {
  display: grid;
  grid-template-columns: 1.1fr 1.5fr 0.65fr 0.55fr auto;
  align-items: center;
  gap: 16px;
  padding: 17px 0;
  border-bottom: 1px solid #e3ddd5;
}

.queue-row:last-child {
  border-bottom: 0;
}

.client {
  display: flex;
  align-items: center;
  gap: 10px;
}

.client-avatar {
  width: 35px;
  height: 35px;
  background: #ece6de;
  border-radius: 50%;
  display: grid;
  place-items: center;
  font-size: 10px;
  font-weight: 700;
}

.client strong,
.client span,
.queue-value strong,
.queue-value span {
  display: block;
}

.client strong {
  font-size: 12px;
}

.client span {
  margin-top: 3px;
  font-size: 10px;
  color: #858086;
}

.queue-note {
  font-size: 11px;
  color: #777174;
}

.queue-value {
  text-align: right;
}

.queue-value strong {
  font-size: 13px;
}

.queue-value span {
  margin-top: 3px;
  color: #8c8587;
  font-size: 10px;
}

.pill {
  font-size: 9px;
  letter-spacing: 0.6px;
  font-weight: 700;
  border-radius: 999px;
  padding: 6px 8px;
  text-align: center;
}

.pill.danger {
  color: #bd4533;
  background: #ffe0d8;
}

.pill.warning {
  color: #a46c14;
  background: #fff0c9;
}

.pill.violet {
  color: #6751bd;
  background: #e9e4ff;
}

.pill.neutral {
  color: #657078;
  background: #e8edf0;
}

.row-action {
  border: 0;
  background: transparent;
  color: #39343a;
  font-size: 11px;
  cursor: pointer;
}

.intelligence {
  background:
    linear-gradient(145deg, rgba(143, 124, 255, 0.07), transparent 55%),
    #faf8f4;
}

.live {
  color: #2a9569;
  background: #dff7ec;
  border: 1px solid #bcebd6;
  border-radius: 999px;
  font-size: 9px;
  padding: 5px 8px;
}

.insight {
  margin: 0 20px;
  padding: 19px 0;
  display: grid;
  grid-template-columns: 32px 1fr;
  gap: 12px;
  border-bottom: 1px solid #e0d9d1;
}

.insight:last-child {
  border-bottom: 0;
}

.insight > span {
  color: #7868d7;
  background: #ece8ff;
  border-radius: 8px;
  height: 26px;
  display: grid;
  place-items: center;
  font-size: 9px;
  font-weight: 700;
}

.insight strong {
  font-size: 12px;
}

.insight p {
  margin: 5px 0 0;
  color: #817a7e;
  font-size: 10px;
  line-height: 1.5;
}

.automation-panel {
  min-height: 215px;
}

.automation-flow {
  display: grid;
  grid-template-columns: 1fr auto 1fr auto 1fr auto 1fr;
  gap: 10px;
  align-items: center;
  padding: 28px 20px 34px;
}

.automation-flow > div {
  min-height: 95px;
  background: #f2eee8;
  border: 1px solid #dfd7ce;
  border-radius: 12px;
  padding: 13px;
}

.automation-flow > div.success-step {
  background: #e9f7ef;
}

.automation-flow div span,
.automation-flow div strong,
.automation-flow div small {
  display: block;
}

.automation-flow div span {
  font-size: 9px;
  color: #928a8d;
}

.automation-flow div strong {
  font-size: 11px;
  margin-top: 17px;
}

.automation-flow div small {
  margin-top: 5px;
  font-size: 9px;
  color: #80797d;
}

.arrow {
  color: #aaa1a1;
}

.activity-list {
  padding: 2px 20px 14px;
}

.activity-list > div {
  display: grid;
  grid-template-columns: 65px 1fr;
  gap: 12px;
  padding: 14px 0;
  border-bottom: 1px solid #e2dbd2;
}

.activity-list > div:last-child {
  border-bottom: 0;
}

.activity-list > div > span {
  color: #948d90;
  font-size: 9px;
}

.activity-list strong {
  font-size: 11px;
}

.activity-list p {
  margin: 4px 0 0;
  color: #878084;
  font-size: 10px;
}

@media (max-width: 1250px) {
  body {
    min-width: 1024px;
  }

  .app-shell {
    grid-template-columns: 220px 1fr;
  }

  .sidebar {
    width: 220px;
  }

  .queue-row {
    grid-template-columns: 1fr 1.25fr 0.6fr 0.5fr;
  }

  .row-action {
    display: none;
  }
}

.top-actions {
  align-items: center;
}

.top-search-form {
  display: flex;
  align-items: center;
  gap: 6px;
}

.top-search-form input {
  width: 240px;
  border: 1px solid #d9d1c7;
  background: #ffffff;
  color: #242126;
  border-radius: 10px;
  padding: 10px 12px;
  outline: none;
}

.top-search-form input:focus {
  border-color: #b9afa5;
  box-shadow: 0 0 0 3px rgba(255, 128, 95, 0.08);
}

.top-search-form button {
  padding: 10px 12px;
}

.search-cancel {
  width: 38px;
  padding: 10px 0 !important;
}

.proposal-modal-backdrop {
  position: fixed;
  inset: 0;
  z-index: 100;
  display: grid;
  place-items: center;
  background: rgba(10, 10, 14, 0.42);
  backdrop-filter: blur(7px);
}

.proposal-modal {
  position: relative;
  width: min(520px, calc(100vw - 40px));
  padding: 30px;
  background: #faf8f4;
  border: 1px solid #ddd6cd;
  border-radius: 18px;
  box-shadow: 0 30px 100px rgba(0, 0, 0, 0.22);
}

.proposal-modal-close {
  position: absolute;
  top: 18px;
  right: 18px;
  width: 36px;
  height: 36px;
  border: 0;
  border-radius: 50%;
  background: #ece7e0;
  color: #5f595d;
  font-size: 20px;
  cursor: pointer;
}

.proposal-modal h2 {
  margin: 10px 0 4px;
  font-family: 'Instrument Serif', serif;
  font-size: 42px;
  font-weight: 400;
  letter-spacing: -1px;
}

.proposal-modal > p {
  margin: 0;
  color: #7a7377;
  font-size: 12px;
  line-height: 1.5;
}

.proposal-modal-fields {
  display: grid;
  gap: 12px;
  margin-top: 24px;
}

.proposal-modal-fields label {
  display: grid;
  gap: 6px;
  color: #777074;
  font-size: 9px;
  letter-spacing: 1px;
  text-transform: uppercase;
}

.proposal-modal-fields input {
  border: 1px solid #d9d1c7;
  background: #ffffff;
  border-radius: 10px;
  padding: 12px;
  color: #242126;
  outline: none;
}

.proposal-modal-fields input:focus {
  border-color: #b9afa5;
}

.proposal-modal-primary {
  width: 100%;
  margin-top: 18px;
  border: 0;
  border-radius: 11px;
  padding: 13px;
  background: #15161c;
  color: #ffffff;
  font-weight: 700;
  cursor: pointer;
}

.proposal-modal-primary:hover {
  background: #ff7656;
  color: #15161c;
}


/* ===== Responsive application shell ===== */

body {
  min-width: 0 !important;
  overflow-x: hidden;
}

.topbar-left {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
}

.topbar-copy {
  min-width: 0;
}

.mobile-menu-button,
.sidebar-close {
  display: none;
}

.sidebar-backdrop {
  display: none;
}

@media (max-width: 1250px) {
  body {
    min-width: 0 !important;
  }
}

@media (max-width: 760px) {
  body {
    min-width: 0 !important;
    overflow-x: hidden;
  }

  .app-shell {
    display: block;
    min-height: 100vh;
  }

  .workspace {
    grid-column: auto;
    width: 100%;
    min-width: 0;
  }

  .sidebar {
    width: min(86vw, 320px);
    height: 100dvh;
    padding: 20px 16px 16px;
    z-index: 100;
    transform: translateX(-105%);
    transition: transform 0.25s ease;
    box-shadow: 20px 0 60px rgba(0, 0, 0, 0.22);
  }

  .sidebar.open {
    transform: translateX(0);
  }

  .sidebar-backdrop {
    display: block;
    position: fixed;
    inset: 0;
    z-index: 90;
    background: rgba(8, 8, 12, 0.48);
    backdrop-filter: blur(4px);
  }

  .brand {
    padding: 0 4px 20px;
  }

  .brand-copy {
    flex: 1;
  }

  .sidebar-close {
    display: grid;
    place-items: center;
    width: 34px;
    height: 34px;
    border: 0;
    border-radius: 50%;
    background: #1b1c23;
    color: #f7f4ef;
    font-size: 20px;
    cursor: pointer;
  }

  .navigation {
    margin-top: 22px;
  }

  .navigation-link {
    padding: 14px 12px;
    font-size: 14px;
  }

  .topbar {
    min-height: 68px;
    padding: 11px 14px;
    gap: 10px;
  }

  .mobile-menu-button {
    display: grid;
    place-items: center;
    flex: 0 0 40px;
    width: 40px;
    height: 40px;
    border: 1px solid #d9d1c7;
    border-radius: 10px;
    background: #fbf9f6;
    color: #222127;
    font-size: 19px;
    cursor: pointer;
  }

  .topbar-copy .eyebrow {
    display: block;
    max-width: 145px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    font-size: 8px;
    letter-spacing: 1.1px;
  }

  .topbar > .topbar-left strong {
    display: block;
    margin-top: 3px;
    max-width: 150px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    font-size: 14px;
  }

  .top-actions {
    margin-left: auto;
    gap: 6px;
  }

  .top-actions .top-link {
    display: none;
  }

  .top-actions .search,
  .top-actions .primary {
    display: grid;
    place-items: center;
    width: 40px;
    height: 40px;
    padding: 0;
    border-radius: 10px;
    font-size: 0;
  }

  .top-actions .search::before {
    content: '⌕';
    font-size: 20px;
    line-height: 1;
  }

  .top-actions .primary::before {
    content: '+';
    font-size: 24px;
    line-height: 1;
  }

  .top-search-form {
    position: absolute;
    top: calc(100% + 8px);
    left: 12px;
    right: 12px;
    z-index: 30;
    padding: 9px;
    border: 1px solid #d9d1c7;
    border-radius: 13px;
    background: #faf8f4;
    box-shadow: 0 18px 45px rgba(30, 25, 22, 0.14);
  }

  .top-search-form input {
    flex: 1;
    width: auto;
    min-width: 0;
  }

  .content {
    padding: 26px 16px 42px;
  }

  .hero {
    display: block;
    padding: 4px 0 28px;
  }

  .hero h1 {
    max-width: none;
    margin: 12px 0 16px;
    font-size: 44px;
    line-height: 0.96;
    letter-spacing: -2.4px;
  }

  .hero p {
    font-size: 13px;
  }

  .hero-signal {
    min-width: 0;
    margin-top: 24px;
    padding: 16px 0 0;
    border-left: 0;
    border-top: 1px solid #cfc6bc;
  }

  .hero-signal strong {
    font-size: 36px;
  }

  .metrics {
    grid-template-columns: 1fr 1fr;
    gap: 10px;
  }

  .metrics article {
    min-height: 120px;
    padding: 15px;
  }

  .metrics strong {
    font-size: 27px;
  }

  .dashboard-grid {
    grid-template-columns: 1fr;
    gap: 12px;
  }

  .queue-row {
    grid-template-columns: 1fr auto;
    gap: 8px 12px;
    padding: 14px 0;
  }

  .queue-note {
    grid-column: 1 / -1;
  }

  .queue-value {
    text-align: left;
  }

  .row-action {
    display: none;
  }

  .automation-flow {
    grid-template-columns: 1fr;
    gap: 8px;
  }

  .automation-flow .arrow {
    text-align: center;
    transform: rotate(90deg);
  }

  .activity-list > div {
    grid-template-columns: 55px 1fr;
  }

  .proposal-modal {
    width: calc(100vw - 24px);
    max-height: calc(100dvh - 24px);
    overflow-y: auto;
    padding: 24px 18px 20px;
  }

  .proposal-modal h2 {
    padding-right: 42px;
    font-size: 36px;
  }
}

@media (max-width: 430px) {
  .topbar-copy .eyebrow {
    max-width: 115px;
  }

  .topbar > .topbar-left strong {
    max-width: 120px;
  }

  .metrics {
    grid-template-columns: 1fr;
  }

  .metrics article {
    min-height: 108px;
  }
}

</style>
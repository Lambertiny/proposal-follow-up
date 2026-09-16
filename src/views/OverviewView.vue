<script setup lang="ts">
type QueueItem = {
  client: string
  project: string
  value: string
  status: string
  statusClass: string
  due: string
  note: string
}

const queue: QueueItem[] = [
  {
    client: 'North Studio',
    project: 'Website Redesign',
    value: '€4,800',
    status: 'OVERDUE',
    statusClass: 'danger',
    due: '2 days late',
    note: 'No reply after proposal view',
  },
  {
    client: 'Aura Labs',
    project: 'Product UI System',
    value: '€6,200',
    status: 'TODAY',
    statusClass: 'warning',
    due: '14:30',
    note: 'Second follow-up scheduled',
  },
  {
    client: 'Verde Café',
    project: 'Brand Identity',
    value: '€2,300',
    status: 'WAITING',
    statusClass: 'violet',
    due: '3 days',
    note: 'Proposal viewed yesterday',
  },
  {
    client: 'Field Office',
    project: 'Studio Portfolio',
    value: '€3,600',
    status: 'UPCOMING',
    statusClass: 'neutral',
    due: 'Sep 18',
    note: 'First follow-up',
  },
]

const activity = [
  {
    time: '10:42',
    title: 'Proposal viewed',
    text: 'North Studio opened proposal #PF-019.',
  },
  {
    time: '09:15',
    title: 'Follow-up sent',
    text: 'Aura Labs received an automatic reminder.',
  },
  {
    time: 'Yesterday',
    title: 'Client replied',
    text: 'Verde Café requested a scope adjustment.',
  },
  {
    time: 'Sep 13',
    title: 'Proposal accepted',
    text: 'Casa Clara moved to Won.',
  },
]
</script>

<template>
  <section class="content">
    <div class="hero">
      <div>
        <span class="eyebrow">MONDAY · SEPTEMBER 15</span>

        <h1>
          Stay close to
          <em>every decision.</em>
        </h1>

        <p>
          Track proposals, follow-ups and client responses without letting
          opportunities disappear in the silence.
        </p>
      </div>

      <div class="hero-signal">
        <span>FOLLOW-UP SIGNAL</span>
        <strong>4 actions</strong>
        <small>need your attention today</small>
      </div>
    </div>

    <section class="metrics">
      <article>
        <div class="metric-label">
          Active proposals <span>↗</span>
        </div>
        <strong>12</strong>
        <small>€42.8k open value</small>
      </article>

      <article>
        <div class="metric-label">
          Waiting response <span>↗</span>
        </div>
        <strong>7</strong>
        <small>58% of active proposals</small>
      </article>

      <article class="highlight-card">
        <div class="metric-label">
          Follow-ups today <span>↗</span>
        </div>
        <strong>4</strong>
        <small>2 are already overdue</small>
      </article>

      <article>
        <div class="metric-label">
          At-risk value <span>↗</span>
        </div>
        <strong>€18.4k</strong>
        <small>No response for 5+ days</small>
      </article>
    </section>

    <section class="dashboard-grid">
      <article class="panel queue-panel">
        <div class="panel-header">
          <div>
            <span class="eyebrow">PRIORITY</span>
            <h2>Follow-up queue</h2>
          </div>

          <RouterLink
            to="/queue"
            class="overview-link"
          >
            View all ↗
          </RouterLink>
        </div>

        <div class="queue-list">
          <div
            v-for="item in queue"
            :key="item.client"
            class="queue-row"
          >
            <div class="client">
              <div class="client-avatar">
                {{ item.client.slice(0, 2).toUpperCase() }}
              </div>

              <div>
                <strong>{{ item.client }}</strong>
                <span>{{ item.project }}</span>
              </div>
            </div>

            <div class="queue-note">
              {{ item.note }}
            </div>

            <div class="queue-value">
              <strong>{{ item.value }}</strong>
              <span>{{ item.due }}</span>
            </div>

            <span :class="['pill', item.statusClass]">
              {{ item.status }}
            </span>

            <RouterLink
              to="/queue"
              class="row-action"
            >
              Follow up ↗
            </RouterLink>
          </div>
        </div>
      </article>

      <article class="panel intelligence">
        <div class="panel-header">
          <div>
            <span class="eyebrow">SIGNAL ENGINE</span>
            <h2>Follow-up intelligence</h2>
          </div>

          <span class="live">LIVE</span>
        </div>

        <div class="insight">
          <span>01</span>

          <div>
            <strong>€11k is waiting on a response.</strong>
            <p>
              Two high-value proposals have crossed the ideal follow-up window.
            </p>
          </div>
        </div>

        <div class="insight">
          <span>02</span>

          <div>
            <strong>North Studio needs attention.</strong>
            <p>
              Proposal viewed twice, but no reply in the last six days.
            </p>
          </div>
        </div>

        <div class="insight">
          <span>03</span>

          <div>
            <strong>Your fastest replies happen within 48h.</strong>
            <p>
              Early follow-ups currently show the strongest response rate.
            </p>
          </div>
        </div>
      </article>

      <article class="panel automation-panel">
        <div class="panel-header">
          <div>
            <span class="eyebrow">AUTOMATION</span>
            <h2>Rules running</h2>
          </div>

          <RouterLink
            to="/automations"
            class="overview-link"
          >
            Manage ↗
          </RouterLink>
        </div>

        <div class="automation-flow">
          <div>
            <span>01</span>
            <strong>Proposal sent</strong>
            <small>Wait 3 days</small>
          </div>

          <span class="arrow">→</span>

          <div>
            <span>02</span>
            <strong>No response</strong>
            <small>Create follow-up</small>
          </div>

          <span class="arrow">→</span>

          <div>
            <span>03</span>
            <strong>Still waiting</strong>
            <small>Mark at risk</small>
          </div>

          <span class="arrow">→</span>

          <div class="success-step">
            <span>04</span>
            <strong>Client replies</strong>
            <small>Stop reminders</small>
          </div>
        </div>
      </article>

      <article class="panel activity-panel">
        <div class="panel-header">
          <div>
            <span class="eyebrow">TIMELINE</span>
            <h2>Recent activity</h2>
          </div>
        </div>

        <div class="activity-list">
          <div
            v-for="item in activity"
            :key="item.time"
          >
            <span>{{ item.time }}</span>

            <div>
              <strong>{{ item.title }}</strong>
              <p>{{ item.text }}</p>
            </div>
          </div>
        </div>
      </article>
    </section>
  </section>
</template>

<style scoped>
.overview-link {
  border: 1px solid #d9d1c7;
  background: #fbf9f6;
  color: #5f5b61;
  border-radius: 10px;
  padding: 8px 10px;
  cursor: pointer;
  text-decoration: none;
  font-size: 11px;
}

.row-action {
  text-decoration: none;
}
</style>
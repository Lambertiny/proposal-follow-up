<script setup lang="ts">
import { computed, ref } from 'vue'

type AutomationRule = {
  id: number
  title: string
  description: string
  trigger: string
  action: string
  active: boolean
  runs: number
  category: 'Follow-up' | 'Risk' | 'Response' | 'Signal'
}

const rules = ref<AutomationRule[]>([
  { id: 1, title: 'First follow-up', description: 'Create the first follow-up when a proposal has been sent and the client has not replied.', trigger: '3 days after proposal sent', action: 'Create follow-up task', active: true, runs: 18, category: 'Follow-up' },
  { id: 2, title: 'At-risk signal', description: 'Flag proposals that remain silent beyond the ideal response window.', trigger: '7 days without reply', action: 'Mark proposal at risk', active: true, runs: 7, category: 'Risk' },
  { id: 3, title: 'Stop reminders on reply', description: 'Prevent unnecessary follow-ups as soon as a client response is detected.', trigger: 'Client response received', action: 'Stop pending reminders', active: true, runs: 24, category: 'Response' },
  { id: 4, title: 'Proposal viewed twice', description: 'Raise the priority of proposals that have been opened more than once.', trigger: '2+ proposal views', action: 'Increase priority score', active: true, runs: 11, category: 'Signal' },
])

const activity = ref([
  { time: '10:42', title: 'Reminder paused', text: 'Verde Café replied to the proposal.' },
  { time: '09:15', title: 'Follow-up created', text: 'Aura Labs reached the 3-day follow-up window.' },
  { time: 'Yesterday', title: 'Priority increased', text: 'North Studio viewed proposal PF-019 again.' },
  { time: 'Sep 14', title: 'Risk flag applied', text: 'North Studio crossed the 7-day threshold.' },
])

const activeCount = computed(() => rules.value.filter((rule) => rule.active).length)
const totalRuns = computed(() => rules.value.reduce((total, rule) => total + rule.runs, 0))
const pausedCount = computed(() => rules.value.filter((rule) => !rule.active).length)
const selectedRule = ref<AutomationRule | null>(null)

function toggleRule(rule: AutomationRule) {
  rule.active = !rule.active
  activity.value.unshift({
    time: 'Now',
    title: rule.active ? 'Rule activated' : 'Rule paused',
    text: `${rule.title} is now ${rule.active ? 'running' : 'paused'}.`,
  })
}

function openRule(rule: AutomationRule) {
  selectedRule.value = rule
}

function closeRule() {
  selectedRule.value = null
}
</script>

<template>
  <section class="automation-page">
    <div class="automation-hero">
      <div class="automation-hero-copy">
        <span class="eyebrow">AUTOMATION ENGINE</span>

        <h1>
          Follow up
          <em>without chasing.</em>
        </h1>

        <p>
          Simple rules keep momentum moving while you stay in control
          of every client touchpoint.
        </p>
      </div>

      <div class="automation-signal">
        <span>AUTOMATION STATUS</span>
        <strong>{{ activeCount }}</strong>
        <small>active rules</small>
        <div class="signal-meta">{{ totalRuns }} automations triggered</div>
      </div>
    </div>

    <section class="automation-metrics">
      <article>
        <span>Active rules</span>
        <strong>{{ activeCount }}</strong>
        <small>Currently running</small>
      </article>

      <article>
        <span>Paused rules</span>
        <strong>{{ pausedCount }}</strong>
        <small>Manual review needed</small>
      </article>

      <article class="metric-dark">
        <span>Total runs</span>
        <strong>{{ totalRuns }}</strong>
        <small>Automations triggered</small>
      </article>

      <article>
        <span>Coverage</span>
        <strong>83%</strong>
        <small>Of active proposals monitored</small>
      </article>
    </section>

    <section class="automation-layout">
      <div class="rules-column">
        <div class="section-heading">
          <div>
            <span class="eyebrow">RULE LIBRARY</span>
            <h2>Automation rules</h2>
          </div>

          <button class="new-rule-button">+ New rule</button>
        </div>

        <div class="rule-grid">
          <article
            v-for="rule in rules"
            :key="rule.id"
            class="rule-card"
          >
            <div class="rule-top">
              <div>
                <span class="rule-index">RULE {{ String(rule.id).padStart(2, '0') }}</span>
                <h3>{{ rule.title }}</h3>
              </div>

              <button
                :class="['switch', { active: rule.active }]"
                :aria-label="`Toggle ${rule.title}`"
                @click="toggleRule(rule)"
              >
                <span></span>
              </button>
            </div>

            <p>{{ rule.description }}</p>

            <div class="rule-flow">
              <div>
                <span>WHEN</span>
                <strong>{{ rule.trigger }}</strong>
              </div>

              <span class="flow-arrow">→</span>

              <div>
                <span>THEN</span>
                <strong>{{ rule.action }}</strong>
              </div>
            </div>

            <div class="rule-footer">
              <div>
                <span :class="['rule-status', { active: rule.active }]">
                  {{ rule.active ? 'Running' : 'Paused' }}
                </span>
                <small>{{ rule.runs }} runs</small>
              </div>

              <button class="edit-rule" @click="openRule(rule)">
                Edit rule ↗
              </button>
            </div>
          </article>
        </div>
      </div>

      <aside class="automation-side">
        <article class="activity-card">
          <div class="side-heading">
            <div>
              <span class="eyebrow">LIVE LOG</span>
              <h2>Automation activity</h2>
            </div>
            <span class="live-dot">LIVE</span>
          </div>

          <div class="activity-list">
            <div
              v-for="item in activity.slice(0, 6)"
              :key="`${item.time}-${item.title}`"
              class="activity-item"
            >
              <span class="activity-time">{{ item.time }}</span>
              <div>
                <strong>{{ item.title }}</strong>
                <p>{{ item.text }}</p>
              </div>
            </div>
          </div>
        </article>

        <article class="logic-card">
          <span class="eyebrow">AUTOMATION LOGIC</span>

          <h2>
            Proposal sent
            <span>→</span>
            silence
            <span>→</span>
            action.
          </h2>

          <p>
            Rules react to proposal behavior so you can focus on
            conversations instead of remembering every next step.
          </p>

          <div class="logic-status">
            <span class="status-light"></span>
            <div>
              <strong>Engine running</strong>
              <small>{{ activeCount }} rules monitoring activity</small>
            </div>
          </div>
        </article>
      </aside>
    </section>

    <div
      v-if="selectedRule"
      class="drawer-backdrop"
      @click.self="closeRule"
    >
      <aside class="rule-drawer">
        <button class="drawer-close" @click="closeRule">×</button>
        <span class="drawer-eyebrow">RULE {{ String(selectedRule.id).padStart(2, '0') }}</span>
        <h2>{{ selectedRule.title }}</h2>
        <p>{{ selectedRule.description }}</p>

        <div class="drawer-rule-block">
          <span>TRIGGER</span>
          <strong>{{ selectedRule.trigger }}</strong>
        </div>

        <div class="drawer-rule-arrow">↓</div>

        <div class="drawer-rule-block">
          <span>ACTION</span>
          <strong>{{ selectedRule.action }}</strong>
        </div>

        <div class="drawer-stats">
          <div>
            <span>Status</span>
            <strong>{{ selectedRule.active ? 'Running' : 'Paused' }}</strong>
          </div>
          <div>
            <span>Runs</span>
            <strong>{{ selectedRule.runs }}</strong>
          </div>
          <div>
            <span>Category</span>
            <strong>{{ selectedRule.category }}</strong>
          </div>
        </div>

        <button class="drawer-toggle" @click="toggleRule(selectedRule)">
          {{ selectedRule.active ? 'Pause automation' : 'Activate automation' }}
        </button>
      </aside>
    </div>
  </section>
</template>

<style scoped>
.automation-page {
  padding: 40px 32px 60px;
  max-width: 1560px;
  margin: 0 auto;
}

.automation-hero {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 60px;
  padding: 10px 2px 36px;
}

.automation-hero-copy {
  min-width: 0;
}

.automation-hero h1 {
  font-size: clamp(50px, 4.5vw, 78px);
  line-height: 0.95;
  margin: 14px 0 20px;
  letter-spacing: -4px;
}

.automation-hero h1 em {
  font-family: 'Instrument Serif', serif;
  font-weight: 400;
  color: #ff7656;
}

.automation-hero p {
  max-width: 650px;
  color: #6f696c;
  line-height: 1.6;
  font-size: 15px;
}

.automation-signal {
  min-width: 230px;
  padding-left: 24px;
  border-left: 1px solid #cfc6bc;
}

.automation-signal > span {
  display: block;
  color: #928a88;
  font-size: 10px;
  letter-spacing: 1.4px;
}

.automation-signal strong {
  display: block;
  font-family: 'Instrument Serif', serif;
  font-size: 54px;
  line-height: 1;
  font-weight: 400;
  margin-top: 8px;
}

.automation-signal small {
  display: block;
  color: #777174;
  margin-top: 5px;
}

.signal-meta {
  color: #999095;
  font-size: 10px;
  margin-top: 12px;
}

.automation-metrics {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
}

.automation-metrics article {
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

.automation-metrics article > span {
  color: #817a7e;
  font-size: 11px;
}

.automation-metrics article > strong {
  font-size: 32px;
}

.automation-metrics article > small {
  color: #938b8e;
  font-size: 10px;
}

.automation-metrics .metric-dark {
  background: #15161c;
  border-color: #15161c;
  color: white;
}

.automation-metrics .metric-dark span,
.automation-metrics .metric-dark small {
  color: #aaa6ae;
}

.automation-layout {
  margin-top: 16px;
  display: grid;
  grid-template-columns: 1.45fr 0.55fr;
  gap: 14px;
}

.rules-column,
.automation-side {
  min-width: 0;
}

.section-heading {
  margin-bottom: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}

.section-heading h2,
.side-heading h2 {
  margin: 5px 0 0;
  font-size: 18px;
}

.new-rule-button {
  flex: 0 0 auto;
  border: 1px solid #15161c;
  background: #15161c;
  color: white;
  border-radius: 10px;
  padding: 10px 13px;
  cursor: pointer;
}

.rule-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.rule-card {
  min-width: 0;
  background: #faf8f4;
  border: 1px solid #ddd6cd;
  border-radius: 16px;
  padding: 20px;
}

.rule-top {
  display: flex;
  justify-content: space-between;
  gap: 18px;
  align-items: flex-start;
}

.rule-top > div {
  min-width: 0;
}

.rule-index {
  color: #928a8d;
  font-size: 9px;
  letter-spacing: 1.2px;
}

.rule-card h3 {
  margin: 6px 0 0;
  font-size: 19px;
  overflow-wrap: anywhere;
}

.rule-card > p {
  margin: 14px 0 0;
  color: #777174;
  line-height: 1.55;
  font-size: 11px;
}

.switch {
  flex: 0 0 46px;
  width: 46px;
  height: 26px;
  border: 0;
  border-radius: 999px;
  padding: 3px;
  background: #d4cec6;
  cursor: pointer;
}

.switch span {
  display: block;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: white;
  transition: 0.2s ease;
}

.switch.active {
  background: #15161c;
}

.switch.active span {
  transform: translateX(20px);
  background: #59d39b;
}

.rule-flow {
  margin-top: 18px;
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: 10px;
  align-items: center;
}

.rule-flow > div {
  min-width: 0;
  padding: 12px;
  background: #f1ede7;
  border-radius: 11px;
}

.rule-flow div span,
.rule-flow div strong {
  display: block;
}

.rule-flow div span {
  color: #91898d;
  font-size: 8px;
  letter-spacing: 1px;
}

.rule-flow div strong {
  margin-top: 8px;
  font-size: 10px;
  line-height: 1.4;
  overflow-wrap: anywhere;
}

.flow-arrow {
  color: #aaa1a1;
}

.rule-footer {
  margin-top: 17px;
  padding-top: 14px;
  border-top: 1px solid #e1dad2;
  display: flex;
  justify-content: space-between;
  gap: 8px;
  align-items: center;
}

.rule-footer > div {
  display: flex;
  gap: 9px;
  align-items: center;
}

.rule-status {
  padding: 5px 8px;
  border-radius: 999px;
  background: #ece6de;
  color: #777174;
  font-size: 8px;
  font-weight: 700;
  text-transform: uppercase;
}

.rule-status.active {
  background: #dff7ec;
  color: #25865f;
}

.rule-footer small {
  color: #928a8d;
  font-size: 9px;
}

.edit-rule {
  border: 0;
  background: transparent;
  color: #4e484c;
  font-size: 10px;
  cursor: pointer;
}

.automation-side {
  display: grid;
  align-content: start;
  gap: 14px;
}

.activity-card,
.logic-card {
  min-width: 0;
  background: #faf8f4;
  border: 1px solid #ddd6cd;
  border-radius: 16px;
  overflow: hidden;
}

.side-heading {
  padding: 18px 20px;
  border-bottom: 1px solid #e1dad2;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
}

.live-dot {
  color: #25865f;
  background: #dff7ec;
  border-radius: 999px;
  padding: 5px 8px;
  font-size: 8px;
}

.activity-list {
  padding: 0 20px 10px;
}

.activity-item {
  display: grid;
  grid-template-columns: 55px 1fr;
  gap: 10px;
  padding: 15px 0;
  border-bottom: 1px solid #e3ddd5;
}

.activity-item:last-child {
  border-bottom: 0;
}

.activity-time {
  color: #938b8e;
  font-size: 9px;
}

.activity-item strong {
  font-size: 10px;
}

.activity-item p {
  margin: 4px 0 0;
  color: #817a7e;
  font-size: 9px;
  line-height: 1.4;
}

.logic-card {
  padding: 22px;
  color: white;
  background:
    radial-gradient(circle at top right, rgba(255, 128, 95, 0.15), transparent 45%),
    #15161c;
  border-color: #15161c;
}

.logic-card .eyebrow {
  color: #858793;
}

.logic-card h2 {
  max-width: 330px;
  margin: 11px 0 12px;
  font-family: 'Instrument Serif', serif;
  font-weight: 400;
  font-size: 34px;
  line-height: 1;
}

.logic-card h2 span {
  color: #ff805f;
}

.logic-card > p {
  color: #a5a2aa;
  font-size: 11px;
  line-height: 1.6;
}

.logic-status {
  margin-top: 22px;
  padding-top: 18px;
  border-top: 1px solid #2a2b33;
  display: flex;
  gap: 10px;
  align-items: center;
}

.logic-status strong,
.logic-status small {
  display: block;
}

.logic-status strong {
  font-size: 10px;
}

.logic-status small {
  color: #777985;
  font-size: 9px;
  margin-top: 3px;
}

.drawer-backdrop {
  position: fixed;
  inset: 0;
  z-index: 90;
  background: rgba(10, 10, 14, 0.32);
  backdrop-filter: blur(4px);
}

.rule-drawer {
  position: absolute;
  right: 0;
  top: 0;
  width: 410px;
  height: 100%;
  padding: 34px;
  background: #111218;
  color: #f7f4ef;
  box-shadow: -30px 0 80px rgba(0, 0, 0, 0.2);
  overflow-y: auto;
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

.rule-drawer h2 {
  margin: 12px 0 0;
  font-family: 'Instrument Serif', serif;
  font-weight: 400;
  font-size: 43px;
}

.rule-drawer > p {
  color: #9899a5;
  font-size: 11px;
  line-height: 1.6;
}

.drawer-rule-block {
  margin-top: 24px;
  padding: 16px;
  background: #1a1b22;
  border: 1px solid #2b2c35;
  border-radius: 12px;
}

.drawer-rule-block span,
.drawer-rule-block strong {
  display: block;
}

.drawer-rule-block span {
  color: #777985;
  font-size: 8px;
  letter-spacing: 1.1px;
}

.drawer-rule-block strong {
  margin-top: 7px;
  font-size: 11px;
}

.drawer-rule-arrow {
  padding: 8px 0;
  text-align: center;
  color: #ff805f;
}

.drawer-stats {
  margin-top: 24px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
}

.drawer-stats > div {
  padding: 12px;
  background: #191a21;
  border: 1px solid #2b2c35;
  border-radius: 11px;
}

.drawer-stats span,
.drawer-stats strong {
  display: block;
}

.drawer-stats span {
  color: #777985;
  font-size: 8px;
}

.drawer-stats strong {
  margin-top: 5px;
  font-size: 10px;
}

.drawer-toggle {
  width: 100%;
  margin-top: 28px;
  padding: 13px;
  border: 0;
  border-radius: 10px;
  background: #ff805f;
  color: #111218;
  font-weight: 700;
  cursor: pointer;
}

@media (max-width: 1250px) {
  .automation-layout {
    grid-template-columns: 1fr;
  }

  .automation-side {
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width: 760px) {
  .automation-page {
    width: 100%;
    max-width: none;
    padding: 26px 16px 42px;
    overflow: hidden;
  }

  .automation-hero {
    display: block;
    padding: 4px 0 28px;
  }

  .automation-hero h1 {
    margin: 12px 0 16px;
    font-size: 46px;
    line-height: 0.94;
    letter-spacing: -2.5px;
  }

  .automation-hero h1 em {
    display: block;
  }

  .automation-hero p {
    max-width: none;
    font-size: 13px;
    line-height: 1.55;
  }

  .automation-signal {
    width: 100%;
    min-width: 0;
    margin-top: 24px;
    padding: 16px 0 0;
    border-left: 0;
    border-top: 1px solid #cfc6bc;
  }

  .automation-signal strong {
    font-size: 42px;
  }

  .automation-metrics {
    grid-template-columns: 1fr 1fr;
    gap: 10px;
  }

  .automation-metrics article {
    min-height: 112px;
    padding: 15px;
  }

  .automation-metrics article > strong {
    font-size: 28px;
  }

  .automation-layout {
    grid-template-columns: 1fr;
    gap: 12px;
  }

  .section-heading {
    align-items: flex-end;
  }

  .new-rule-button {
    padding: 10px 12px;
    font-size: 12px;
  }

  .rule-grid {
    grid-template-columns: 1fr;
  }

  .rule-card {
    padding: 18px;
  }

  .rule-flow {
    grid-template-columns: 1fr;
  }

  .flow-arrow {
    text-align: center;
    transform: rotate(90deg);
  }

  .automation-side {
    grid-template-columns: 1fr;
  }

  .logic-card h2 {
    max-width: none;
    font-size: 32px;
  }

  .rule-drawer {
    width: 100%;
    max-width: 100%;
    padding: 28px 20px 24px;
  }

  .drawer-stats {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 430px) {
  .automation-hero h1 {
    font-size: 42px;
  }

  .automation-metrics {
    grid-template-columns: 1fr 1fr;
  }

  .rule-footer {
    align-items: flex-start;
  }

  .rule-footer > div {
    flex-wrap: wrap;
  }
}
</style>

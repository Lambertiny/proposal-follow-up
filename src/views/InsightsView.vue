<script setup lang="ts">
const responseBars = [
  { label: '< 24h', value: 82 },
  { label: '24–48h', value: 68 },
  { label: '3–5d', value: 44 },
  { label: '6–7d', value: 29 },
  { label: '8d+', value: 16 },
]

const funnel = [
  { label: 'Sent', value: 100, amount: '€42.8k' },
  { label: 'Viewed', value: 76, amount: '€32.5k' },
  { label: 'Replied', value: 54, amount: '€23.1k' },
  { label: 'Negotiation', value: 38, amount: '€16.2k' },
  { label: 'Won', value: 22, amount: '€9.4k' },
]

const opportunities = [
  {
    client: 'North Studio',
    project: 'Website Redesign',
    value: '€4,800',
    signal: 'High risk',
    class: 'danger',
  },
  {
    client: 'Aura Labs',
    project: 'Product UI System',
    value: '€6,200',
    signal: 'Follow-up today',
    class: 'warning',
  },
  {
    client: 'Verde Café',
    project: 'Brand Identity',
    value: '€2,300',
    signal: 'Negotiating',
    class: 'violet',
  },
]
</script>

<template>
  <section class="insights-page">
    <div class="insights-hero">
      <div class="insights-hero-copy">
        <span class="eyebrow">COMMERCIAL SIGNALS</span>

        <h1>
          See where
          <em>momentum lives.</em>
        </h1>

        <p>
          Response timing, conversion and at-risk value translated
          into a clearer decision layer.
        </p>
      </div>

      <div class="insights-signal">
        <span>BEST RESPONSE WINDOW</span>

        <strong>48h</strong>

        <small>
          strongest client response period
        </small>
      </div>
    </div>

    <section class="insight-metrics">
      <article>
        <span>Response rate</span>
        <strong>62%</strong>
        <small>+8% vs last month</small>
      </article>

      <article>
        <span>Average response</span>
        <strong>2.4d</strong>
        <small>0.6 days faster</small>
      </article>

      <article class="metric-dark">
        <span>Won value</span>
        <strong>€26.2k</strong>
        <small>5 accepted proposals</small>
      </article>

      <article>
        <span>At-risk value</span>
        <strong>€18.4k</strong>
        <small>3 proposals need attention</small>
      </article>
    </section>

    <section class="insight-grid">
      <article class="chart-card">
        <div class="card-heading">
          <div>
            <span class="eyebrow">RESPONSE TIMING</span>
            <h2>When clients reply</h2>
          </div>

          <span class="chart-period">
            Last 30 days
          </span>
        </div>

        <div class="bar-chart">
          <div
            v-for="bar in responseBars"
            :key="bar.label"
            class="bar-column"
          >
            <span class="bar-value">
              {{ bar.value }}%
            </span>

            <div class="bar-track">
              <div
                class="bar-fill"
                :style="{ height: `${bar.value}%` }"
              ></div>
            </div>

            <small>
              {{ bar.label }}
            </small>
          </div>
        </div>

        <div class="chart-note">
          <span class="note-dot"></span>

          <p>
            Most client replies happen within the first 48 hours
            after a proposal or follow-up is sent.
          </p>
        </div>
      </article>

      <article class="funnel-card">
        <div class="card-heading">
          <div>
            <span class="eyebrow">PROPOSAL FUNNEL</span>
            <h2>From send to signed</h2>
          </div>
        </div>

        <div class="funnel-list">
          <div
            v-for="stage in funnel"
            :key="stage.label"
            class="funnel-item"
          >
            <div class="funnel-copy">
              <span>{{ stage.label }}</span>

              <div>
                <strong>{{ stage.value }}%</strong>
                <small>{{ stage.amount }}</small>
              </div>
            </div>

            <div class="funnel-track">
              <div
                class="funnel-progress"
                :style="{ width: `${stage.value}%` }"
              ></div>
            </div>
          </div>
        </div>
      </article>

      <article class="opportunity-card">
        <div class="card-heading">
          <div>
            <span class="eyebrow">PRIORITY VALUE</span>
            <h2>Opportunities to watch</h2>
          </div>

          <RouterLink
            to="/queue"
            class="card-link"
          >
            Open queue ↗
          </RouterLink>
        </div>

        <div class="opportunity-list">
          <div
            v-for="item in opportunities"
            :key="item.client"
            class="opportunity-item"
          >
            <div class="opportunity-client">
              <div class="opportunity-avatar">
                {{ item.client.slice(0, 2).toUpperCase() }}
              </div>

              <div>
                <strong>{{ item.client }}</strong>
                <span>{{ item.project }}</span>
              </div>
            </div>

            <strong class="opportunity-value">
              {{ item.value }}
            </strong>

            <span
              :class="[
                'opportunity-signal',
                item.class
              ]"
            >
              {{ item.signal }}
            </span>
          </div>
        </div>
      </article>

      <article class="recommendation-card">
        <span class="eyebrow">
          RECOMMENDATION
        </span>

        <h2>
          Your first
          <em>48 hours</em>
          matter most.
        </h2>

        <p>
          Proposals followed up within two days are currently more
          likely to receive a response. Keep high-value opportunities
          inside that window whenever possible.
        </p>

        <RouterLink
          to="/queue"
          class="recommendation-link"
        >
          Review today's queue →
        </RouterLink>

        <div class="recommendation-signal">
          <span class="status-light"></span>

          <div>
            <strong>Signal engine active</strong>
            <small>
              Watching response timing across active proposals
            </small>
          </div>
        </div>
      </article>
    </section>
  </section>
</template>

<style scoped>
.insights-page {
  padding: 40px 32px 60px;
  max-width: 1560px;
  margin: 0 auto;
}

.insights-hero {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 60px;
  padding: 10px 2px 36px;
}

.insights-hero-copy {
  min-width: 0;
}

.insights-hero h1 {
  font-size: clamp(50px, 4.5vw, 78px);
  line-height: 0.95;
  margin: 14px 0 20px;
  letter-spacing: -4px;
}

.insights-hero h1 em {
  font-family: 'Instrument Serif', serif;
  font-weight: 400;
  color: #ff7656;
}

.insights-hero p {
  max-width: 650px;
  color: #6f696c;
  line-height: 1.6;
  font-size: 15px;
}

.insights-signal {
  min-width: 240px;
  padding-left: 24px;
  border-left: 1px solid #cfc6bc;
}

.insights-signal > span {
  display: block;
  color: #928a88;
  font-size: 10px;
  letter-spacing: 1.4px;
}

.insights-signal strong {
  display: block;
  margin-top: 8px;
  font-family: 'Instrument Serif', serif;
  font-size: 54px;
  line-height: 1;
  font-weight: 400;
}

.insights-signal small {
  display: block;
  margin-top: 6px;
  color: #777174;
}

.insight-metrics {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
}

.insight-metrics article {
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

.insight-metrics article > span {
  color: #817a7e;
  font-size: 11px;
}

.insight-metrics article > strong {
  font-size: 32px;
}

.insight-metrics article > small {
  color: #938b8e;
  font-size: 10px;
}

.insight-metrics .metric-dark {
  background: #15161c;
  border-color: #15161c;
  color: white;
}

.insight-metrics .metric-dark span,
.insight-metrics .metric-dark small {
  color: #aaa6ae;
}

.insight-grid {
  margin-top: 16px;
  display: grid;
  grid-template-columns: 1.25fr 0.75fr;
  gap: 14px;
}

.chart-card,
.funnel-card,
.opportunity-card {
  min-width: 0;
  background: #faf8f4;
  border: 1px solid #ddd6cd;
  border-radius: 16px;
  overflow: hidden;
}

.card-heading {
  min-height: 76px;
  padding: 18px 20px;
  border-bottom: 1px solid #e1dad2;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}

.card-heading h2 {
  margin: 5px 0 0;
  font-size: 18px;
}

.chart-period {
  flex: 0 0 auto;
  color: #8d8589;
  font-size: 10px;
}

.bar-chart {
  height: 285px;
  padding: 30px 35px 22px;
  display: flex;
  align-items: flex-end;
  justify-content: space-around;
  gap: 24px;
}

.bar-column {
  min-width: 0;
  height: 100%;
  flex: 1;
  display: grid;
  grid-template-rows: 22px 1fr 20px;
  gap: 8px;
  text-align: center;
}

.bar-value {
  color: #5f595d;
  font-size: 10px;
  font-weight: 700;
}

.bar-track {
  position: relative;
  overflow: hidden;
  min-height: 175px;
  background: #ece7e0;
  border-radius: 12px 12px 5px 5px;
}

.bar-fill {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(180deg, #ff8f71 0%, #ff7656 100%);
  border-radius: 10px 10px 4px 4px;
}

.bar-column small {
  color: #8b8387;
  font-size: 9px;
}

.chart-note {
  margin: 0 20px 20px;
  padding: 14px;
  border-radius: 11px;
  background: #f1ede7;
  display: flex;
  gap: 10px;
  align-items: flex-start;
}

.note-dot {
  flex: 0 0 8px;
  width: 8px;
  height: 8px;
  margin-top: 5px;
  border-radius: 50%;
  background: #ff805f;
}

.chart-note p {
  margin: 0;
  color: #777174;
  font-size: 10px;
  line-height: 1.5;
}

.funnel-list {
  padding: 24px 20px 30px;
  display: grid;
  gap: 21px;
}

.funnel-copy {
  margin-bottom: 7px;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 12px;
}

.funnel-copy > span {
  font-size: 11px;
}

.funnel-copy > div {
  display: flex;
  gap: 8px;
  align-items: baseline;
}

.funnel-copy strong {
  font-size: 11px;
}

.funnel-copy small {
  color: #91898d;
  font-size: 9px;
}

.funnel-track {
  height: 10px;
  overflow: hidden;
  background: #ece7e0;
  border-radius: 999px;
}

.funnel-progress {
  height: 100%;
  border-radius: 999px;
  background: #15161c;
}

.opportunity-list {
  padding: 0 20px 10px;
}

.opportunity-item {
  display: grid;
  grid-template-columns: 1fr 0.45fr 0.65fr;
  gap: 14px;
  align-items: center;
  padding: 17px 0;
  border-bottom: 1px solid #e3ddd5;
}

.opportunity-item:last-child {
  border-bottom: 0;
}

.opportunity-client {
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
}

.opportunity-avatar {
  flex: 0 0 36px;
  width: 36px;
  height: 36px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  background: #ece6de;
  font-size: 9px;
  font-weight: 700;
}

.opportunity-client strong,
.opportunity-client span {
  display: block;
}

.opportunity-client strong {
  font-size: 11px;
}

.opportunity-client span {
  margin-top: 3px;
  color: #898185;
  font-size: 9px;
}

.opportunity-value {
  font-size: 12px;
}

.opportunity-signal {
  justify-self: end;
  min-width: 90px;
  padding: 6px 9px;
  border-radius: 999px;
  text-align: center;
  font-size: 8px;
  font-weight: 700;
}

.opportunity-signal.danger {
  color: #bd4533;
  background: #ffe0d8;
}

.opportunity-signal.warning {
  color: #a46c14;
  background: #fff0c9;
}

.opportunity-signal.violet {
  color: #6751bd;
  background: #e9e4ff;
}

.card-link {
  flex: 0 0 auto;
  border: 1px solid #d9d1c7;
  background: #fbf9f6;
  color: #5f5b61;
  border-radius: 10px;
  padding: 8px 10px;
  text-decoration: none;
  font-size: 10px;
}

.recommendation-card {
  min-width: 0;
  position: relative;
  overflow: hidden;
  padding: 30px;
  color: white;
  background:
    radial-gradient(circle at 90% 10%, rgba(255, 128, 95, 0.2), transparent 40%),
    #15161c;
  border: 1px solid #15161c;
  border-radius: 16px;
}

.recommendation-card::after {
  content: '';
  position: absolute;
  width: 220px;
  height: 220px;
  right: -90px;
  bottom: -110px;
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.recommendation-card .eyebrow {
  color: #858793;
}

.recommendation-card h2 {
  max-width: 520px;
  margin: 12px 0 13px;
  font-family: 'Instrument Serif', serif;
  font-size: 42px;
  font-weight: 400;
  line-height: 1;
}

.recommendation-card h2 em {
  color: #ff805f;
  font-style: italic;
}

.recommendation-card > p {
  max-width: 700px;
  color: #aaa7ae;
  font-size: 11px;
  line-height: 1.65;
}

.recommendation-link {
  display: inline-block;
  margin-top: 12px;
  color: #ff805f;
  text-decoration: none;
  font-size: 11px;
  font-weight: 700;
}

.recommendation-signal {
  margin-top: 30px;
  padding-top: 18px;
  border-top: 1px solid #2a2b33;
  display: flex;
  gap: 10px;
  align-items: center;
}

.recommendation-signal strong,
.recommendation-signal small {
  display: block;
}

.recommendation-signal strong {
  font-size: 10px;
}

.recommendation-signal small {
  margin-top: 3px;
  color: #777985;
  font-size: 9px;
}

@media (max-width: 1250px) {
  .insight-grid {
    grid-template-columns: 1fr;
  }
}

/* ===== Mobile ===== */

@media (max-width: 760px) {
  .insights-page {
    width: 100%;
    max-width: none;
    padding: 26px 16px 42px;
    overflow: hidden;
  }

  .insights-hero {
    display: block;
    padding: 4px 0 28px;
  }

  .insights-hero h1 {
    margin: 12px 0 16px;
    font-size: 46px;
    line-height: 0.94;
    letter-spacing: -2.5px;
    max-width: 100%;
  }

  .insights-hero h1 em {
    display: block;
  }

  .insights-hero p {
    max-width: none;
    font-size: 13px;
    line-height: 1.55;
  }

  .insights-signal {
    width: 100%;
    min-width: 0;
    margin-top: 24px;
    padding: 16px 0 0;
    border-left: 0;
    border-top: 1px solid #cfc6bc;
  }

  .insights-signal strong {
    font-size: 42px;
  }

  .insight-metrics {
    grid-template-columns: 1fr 1fr;
    gap: 10px;
  }

  .insight-metrics article {
    min-height: 112px;
    padding: 15px;
  }

  .insight-metrics article > strong {
    font-size: 28px;
  }

  .insight-grid {
    grid-template-columns: 1fr;
    gap: 12px;
  }

  .card-heading {
    min-height: 0;
    padding: 16px;
    align-items: flex-start;
  }

  .card-heading h2 {
    font-size: 17px;
  }

  .chart-period {
    font-size: 9px;
  }

  .bar-chart {
    height: 250px;
    padding: 24px 12px 18px;
    gap: 8px;
  }

  .bar-track {
    min-height: 150px;
    border-radius: 9px 9px 4px 4px;
  }

  .bar-value {
    font-size: 9px;
  }

  .bar-column small {
    font-size: 8px;
  }

  .chart-note {
    margin: 0 16px 16px;
  }

  .funnel-list {
    padding: 20px 16px 24px;
  }

  .opportunity-list {
    padding: 0 16px 8px;
  }

  .opportunity-item {
    grid-template-columns: 1fr auto;
    grid-template-areas:
      "client signal"
      "value signal";
    gap: 7px 10px;
    padding: 15px 0;
  }

  .opportunity-client {
    grid-area: client;
  }

  .opportunity-value {
    grid-area: value;
    padding-left: 46px;
  }

  .opportunity-signal {
    grid-area: signal;
    min-width: 82px;
  }

  .recommendation-card {
    padding: 24px 20px;
  }

  .recommendation-card h2 {
    font-size: 34px;
  }

  .recommendation-card > p {
    font-size: 11px;
  }
}

@media (max-width: 430px) {
  .insights-hero h1 {
    font-size: 42px;
  }

  .insight-metrics {
    grid-template-columns: 1fr 1fr;
  }

  .insight-metrics article {
    min-height: 108px;
  }

  .bar-chart {
    padding-left: 8px;
    padding-right: 8px;
    gap: 6px;
  }

  .card-link {
    padding: 7px 8px;
    font-size: 9px;
  }
}
</style>

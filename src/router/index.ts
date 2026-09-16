import { createRouter, createWebHistory } from 'vue-router'

import OverviewView from '../views/OverviewView.vue'
import QueueView from '../views/QueueView.vue'
import ProposalsView from '../views/ProposalsView.vue'
import AutomationView from '../views/AutomationView.vue'
import InsightsView from '../views/InsightsView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),

  routes: [
    {
      path: '/',
      name: 'overview',
      component: OverviewView,
    },
    {
      path: '/queue',
      name: 'queue',
      component: QueueView,
    },
    {
      path: '/proposals',
      name: 'proposals',
      component: ProposalsView,
    },
    {
      path: '/automations',
      name: 'automations',
      component: AutomationView,
    },
    {
      path: '/insights',
      name: 'insights',
      component: InsightsView,
    },
  ],
})

export default router
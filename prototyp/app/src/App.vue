<template>
  <div class="app">
    <DesktopNav @navigate="navigateTo" />

    <main class="view">
      <!-- ─────────────────────────────────────── -->
      <!-- VY: Meny-hub                            -->
      <!-- ─────────────────────────────────────── -->
      <template v-if="currentView === 'menu'">
        <mb-ica-layout-two-columns nosidebar class="menu-layout">
          <mb-ica-page-header
            slot="header"
            heading="Min prototyp"
          ></mb-ica-page-header>

          <div slot="main" class="menu-main">
            <mb-ica-segment heading="VYER">
              <mb-ica-card-row chevron @click="navigateTo('digital-kampanjhantering')">
                <mb-ica-meta heading="Digital kampanjhantering" subheading="DigitalKampanjhanteringView" />
              </mb-ica-card-row>
            </mb-ica-segment>
            <mb-ica-segment heading="MALLAR (DEMO)">
              <mb-ica-card-row chevron @click="navigateTo('master-detail')">
                <mb-ica-meta heading="Master-detail" subheading="MasterDetailView" />
              </mb-ica-card-row>
              <mb-ica-card-row chevron @click="navigateTo('data-table')">
                <mb-ica-meta heading="Datatabell" subheading="DataTableView" />
              </mb-ica-card-row>
              <mb-ica-card-row chevron @click="navigateTo('list-with-create')">
                <mb-ica-meta heading="Lista med skapa-dialog" subheading="ListWithCreateView" />
              </mb-ica-card-row>
            </mb-ica-segment>
          </div>
        </mb-ica-layout-two-columns>
      </template>

      <!-- Mall-vyer (kopiera och döp om till dina riktiga vyer) -->
      <DigitalKampanjhanteringView v-else-if="currentView === 'digital-kampanjhantering'" @navigate="navigateTo" />
      <MasterDetailView v-else-if="currentView === 'master-detail'" @navigate="navigateTo" />
      <DataTableView v-else-if="currentView === 'data-table'" @navigate="navigateTo" />
      <ListWithCreateView v-else-if="currentView === 'list-with-create'" @navigate="navigateTo" />
      <ArticleView v-else-if="currentView === 'article'" :article="currentArticle" @navigate="navigateTo" />
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import DesktopNav from './components/DesktopNav.vue'
import DigitalKampanjhanteringView from './views/DigitalKampanjhanteringView.vue'
import MasterDetailView from './views/_templates/MasterDetailView.vue'
import DataTableView from './views/_templates/DataTableView.vue'
import ListWithCreateView from './views/_templates/ListWithCreateView.vue'
import ArticleView from './views/_templates/ArticleView.vue'

// ─────────────────────────────────────────────────────
// Mock av window.utils — produktionskod från MinButik förväntar sig
// ICAs globala logger på window.utils.getUtils().UtilsLogHelper.logHelper(name).
// Utan den här mocken kraschar kopierade vyer direkt vid första log-anropet.
// Ta bort hela blocket när prototypen lämnas över till utvecklare.
// ─────────────────────────────────────────────────────
window.utils = {
  getUtils: () => ({
    UtilsLogHelper: {
      logHelper: (name) => ({
        error: (...args) => console.error(`[${name}]`, ...args),
        info: (...args) => console.info(`[${name}]`, ...args),
        warn: (...args) => console.warn(`[${name}]`, ...args),
      }),
    },
  }),
}

// ─────────────────────────────────────────────────────
// Navigation — synkron, inga transitions (per aktiva-beslut)
// Stöder valfri payload (t.ex. en artikel) som vyn behöver visa.
// ─────────────────────────────────────────────────────
const currentView = ref('menu')
const currentArticle = ref(null)

function navigateTo(view, payload) {
  if (payload !== undefined) currentArticle.value = payload
  currentView.value = view
}
</script>

<style scoped>
.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: var(--ica-bg-page);
}

.view {
  flex: 1;
  min-height: 0;
  background: var(--ica-bg-page);
}

/* Meny-hub-layout använder samma layout-two-columns som vyerna,
   så den passar in visuellt utan särstilning. */
.menu-layout {
  --IcaLayoutTwoColumns--column-height: calc(100vh - 48px); /* minus DesktopNav */
  display: block;
}

.menu-main {
  background: var(--ica-subtle);
  height: 100%;
  overflow: auto;
}

/* Dialoger och drawers ovanpå allt */
mb-ica-dialog {
  --IcaDialog--z-index: 1000;
}
mb-ica-drawer {
  --IcaDrawer--z-index: 1000;
}
</style>

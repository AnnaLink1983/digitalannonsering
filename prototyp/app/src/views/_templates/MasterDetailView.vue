<template>
  <!--
    MALL: Master-detail med layout-two-columns + filter-drawer.
    Vänster kolumn: lista med sök/filter. Höger kolumn: detalj-vy.
    Kopiera till `views/[DittNamn]View.vue`, byt mockdata och filter-kategorier.
    Notera: i 2-kolumnsläge har layoutens `slot="header"` INGEN content.
    Varje kolumn äger sin egen header inuti sin slot.
  -->
  <mb-ica-layout-two-columns
    class="md-layout"
    :sidebaropen="selectedId !== null"
    @closesidebar="selectedId = null"
  >
    <!-- VÄNSTER KOLUMN: lista med page-header -->
    <div slot="main" class="col col--main">
      <mb-ica-page-header
        heading="Artiklar"
        backlabel="Tillbaka"
        @leftactionclick="$emit('navigate', 'menu')"
      ></mb-ica-page-header>

      <div class="col__bar">
        <mb-ica-filter
          :incard="false"
          :shortcuts='JSON.stringify(shortcuts)'
          :filters='JSON.stringify(activeFilters)'
          @filterbuttonclick="filterOpen = true"
          @shortcutitemclick="onShortcutClick"
          @filteritemdelete="onFilterRemove"
        >
          <mb-ica-input-search
            slot="left"
            label="Sök artikel..."
            :value="searchQuery"
            @input="e => searchQuery = e.target.value"
            @clear="searchQuery = ''"
          ></mb-ica-input-search>
        </mb-ica-filter>
      </div>

      <div class="col__scroll">
        <template v-if="filteredRows.length > 0">
          <mb-ica-card-row
            v-for="row in filteredRows"
            :key="row.id"
            chevron
            :active="selectedId === row.id"
            @click="selectRow(row.id)"
          >
            <mb-ica-media-object>
              <img slot="first" :src="row.image" :alt="row.name" width="40" height="40" class="md-thumb" />
              <mb-ica-meta slot="last" :heading="row.name" :subheading="row.subtitle" />
            </mb-ica-media-object>
          </mb-ica-card-row>
        </template>
        <div v-else class="list-empty">
          <mb-ica-placeholder
            text="Inga artiklar matchar"
            align="center"
          >
            <p slot="content">Försök med en annan sökning eller rensa filter.</p>
            <mb-ica-icon-search />
          </mb-ica-placeholder>
        </div>
      </div>
    </div>

    <!-- HÖGER KOLUMN: detalj-vy med egen header -->
    <div slot="sidebar" class="col col--sidebar">
      <mb-ica-header :heading="sidebarHeading"></mb-ica-header>

      <div class="col__scroll">
        <template v-if="selectedRow">
          <mb-ica-segment heading="DETALJER">
            <mb-ica-card-row noninteractive>
              <mb-ica-meta
                :heading="selectedRow.name"
                :subheading="'Art.nr: ' + selectedRow.articleNr"
                :text="selectedRow.subtitle + ' · ' + selectedRow.status"
              ></mb-ica-meta>
            </mb-ica-card-row>
          </mb-ica-segment>

          <mb-ica-segment heading="LEVERANS">
            <mb-ica-card-row noninteractive>
              <mb-ica-key-value label="Leverantör" :value="selectedRow.supplier" />
            </mb-ica-card-row>
            <mb-ica-card-row noninteractive>
              <mb-ica-key-value label="Senaste leverans" :value="selectedRow.lastDelivery" />
            </mb-ica-card-row>
          </mb-ica-segment>
        </template>
        <template v-else>
          <div class="sidebar-empty">
            <mb-ica-placeholder
              onlytext
              heading="Välj en artikel"
              text="Klicka på en rad i listan till vänster för att se detaljer här."
            ></mb-ica-placeholder>
          </div>
        </template>
      </div>
    </div>
  </mb-ica-layout-two-columns>

  <!--
    Filter-drawer — Teleport ut ur layout-two-columns så stacking context inte
    klippar overlay/backdrop.
    Inline här för enkelhet — bryt ut till `components/FilterDialog.vue` när
    drawern växer eller du vill återanvända den.
  -->
  <Teleport to="body">
    <mb-ica-drawer
      :open="filterOpen"
      @close="filterOpen = false"
      style="--IcaDrawer--header-height: 44px"
    >
      <div slot="head" class="filter-drawer-head">
        <mb-ica-header
          variant="dialog"
          heading="Filter"
          leftaction="close"
          @leftactionclick="filterOpen = false"
        ></mb-ica-header>
        <button class="filter-drawer-head__clear" @click="clearFilters">Rensa</button>
      </div>

      <mb-ica-accordion heading="Avdelning" :expanded="expandedSection === 'avdelning'">
        <mb-ica-card-row v-for="d in departments" :key="d.id" noninteractive truncate>
          <mb-ica-checkbox :checked="d.selected" @change="d.selected = !d.selected">
            <mb-ica-meta :heading="d.name" />
          </mb-ica-checkbox>
        </mb-ica-card-row>
      </mb-ica-accordion>

      <mb-ica-accordion heading="Status" :expanded="expandedSection === 'status'">
        <mb-ica-card-row v-for="s in statuses" :key="s.id" noninteractive truncate>
          <mb-ica-checkbox :checked="s.selected" @change="s.selected = !s.selected">
            <mb-ica-meta :heading="s.name" />
          </mb-ica-checkbox>
        </mb-ica-card-row>
      </mb-ica-accordion>

      <mb-ica-button
        slot="buttons"
        :text="'Visa ' + filteredRows.length + ' resultat'"
        fullwidth
        @click="applyFilters"
      ></mb-ica-button>
      <mb-ica-button
        slot="buttons"
        text="Spara filter"
        variation="secondary"
        fullwidth
        @click="applyFilters"
      ></mb-ica-button>
    </mb-ica-drawer>
  </Teleport>
</template>

<script setup>
import { ref, computed } from 'vue'

// Produktbilder — Vite bundlar och hashar dessa automatiskt vid build.
// Importera nya bilder här när du lägger till artiklar.
import pagenLingongrovaImg from '../../assets/images/products/pagen-lingongrova.webp'
import felixKetchupImg from '../../assets/images/products/felix-tomatketchup.webp'
import cremeFraicheImg from '../../assets/images/products/creme-fraiche.webp'
import olwChipsImg from '../../assets/images/products/olw-chips.webp'
import oxpyttImg from '../../assets/images/products/oxpytt.webp'

defineEmits(['navigate'])

// ── Master-detail state ─────────────────────────────────
const selectedId = ref(null)
const searchQuery = ref('')

// ── Filter state ────────────────────────────────────────
const filterOpen = ref(false)
const expandedSection = ref('')

const shortcuts = [
  { id: 'avdelning', text: 'Avdelning' },
  { id: 'status', text: 'Status' },
]

const departments = ref([
  { id: 'mejeri', name: 'Mejeri', selected: false },
  { id: 'chark', name: 'Chark & Deli', selected: false },
  { id: 'kolonial', name: 'Kolonial', selected: false },
  { id: 'frukt', name: 'Frukt & Grönt', selected: false },
])

const statuses = ref([
  { id: 'aktiv', name: 'Aktiv', selected: false },
  { id: 'utgaende', name: 'Utgående', selected: false },
])

// ── Mock-data — byt mot din egen ────────────────────────
const rows = ref([
  { id: 1, name: 'Pågen Lingongrova',  subtitle: 'Bageri',   articleNr: '7311070060011', status: 'Aktiv',     supplier: 'Pågen', lastDelivery: '2026-04-20', image: pagenLingongrovaImg },
  { id: 2, name: 'Felix Tomatketchup', subtitle: 'Kolonial', articleNr: '7311070060028', status: 'Aktiv',     supplier: 'Felix', lastDelivery: '2026-04-19', image: felixKetchupImg },
  { id: 3, name: 'Arla Crème Fraiche', subtitle: 'Mejeri',   articleNr: '7311070060035', status: 'Aktiv',     supplier: 'Arla',  lastDelivery: '2026-04-18', image: cremeFraicheImg },
  { id: 4, name: 'OLW Chips',          subtitle: 'Kolonial', articleNr: '7311070060042', status: 'Aktiv',     supplier: 'OLW',   lastDelivery: '2026-04-21', image: olwChipsImg },
  { id: 5, name: 'Oxpytt',             subtitle: 'Frys',     articleNr: '7311070060059', status: 'Pågående',  supplier: 'ICA',   lastDelivery: '2026-04-17', image: oxpyttImg },
])

// ── Computed ────────────────────────────────────────────
const activeFilters = computed(() => {
  const filters = []
  departments.value
    .filter(d => d.selected)
    .forEach(d => filters.push({ id: d.id, text: d.name, removable: true }))
  statuses.value
    .filter(s => s.selected)
    .forEach(s => filters.push({ id: s.id, text: s.name, removable: true }))
  return filters
})

const filteredRows = computed(() => {
  let list = [...rows.value]

  // Sökfilter
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    list = list.filter(r =>
      r.name.toLowerCase().includes(q) || r.articleNr.includes(q)
    )
  }

  // Avdelningsfilter (matchar mot row.subtitle)
  const selectedDepts = departments.value.filter(d => d.selected).map(d => d.name)
  if (selectedDepts.length) {
    list = list.filter(r => selectedDepts.includes(r.subtitle))
  }

  // Statusfilter
  const selectedStatuses = statuses.value.filter(s => s.selected).map(s => s.name)
  if (selectedStatuses.length) {
    list = list.filter(r => selectedStatuses.includes(r.status))
  }

  return list
})

const selectedRow = computed(() => rows.value.find(r => r.id === selectedId.value))

const sidebarHeading = computed(() => selectedRow.value?.name ?? 'Detaljer')

// ── Handlers ────────────────────────────────────────────
function selectRow(id) {
  selectedId.value = id
}

function onShortcutClick(e) {
  expandedSection.value = e.detail.id
  filterOpen.value = true
}

function onFilterRemove(e) {
  const id = e.detail.id
  const dept = departments.value.find(d => d.id === id)
  if (dept) { dept.selected = false; return }
  const status = statuses.value.find(s => s.id === id)
  if (status) status.selected = false
}

function clearFilters() {
  departments.value.forEach(d => d.selected = false)
  statuses.value.forEach(s => s.selected = false)
}

function applyFilters() {
  filterOpen.value = false
  expandedSection.value = ''
}
</script>

<style scoped>
.md-layout {
  --IcaLayoutTwoColumns--sidebar-duration: 0.3s;
  --IcaLayoutTwoColumns--column-height: 100vh;
  display: block;
  height: 100vh;
}

.col {
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 0;
}

.col--main {
  background: var(--ica-subtle);
}

.col--sidebar {
  background: var(--ica-bg);
}

.col__bar {
  background: var(--ica-bg);
  border-bottom: 1px solid var(--ica-border);
  flex-shrink: 0;
}

.col__bar mb-ica-filter {
  --IcaFilter--padding: 0;
}

.col__scroll {
  flex: 1;
  min-height: 0;
  overflow: auto;
  display: flex;
  flex-direction: column;
}

/* Tom-state inom listan: visuell centrering — undantag från no-padding-regeln */
.list-empty {
  padding: var(--ica-spacing-xl) var(--ica-spacing-md);
  text-align: center;
}

/* Tom-state i sidebar: visuell centrering — undantag från no-padding-regeln */
.sidebar-empty {
  padding: var(--ica-spacing-xl) var(--ica-spacing-md);
}

.md-thumb {
  display: block;
  width: 40px;
  height: 40px;
  border-radius: 4px;
  object-fit: contain;
  background: var(--ica-bg);
}

/* Filter-drawer-header med "Rensa"-text-action — kräver custom positionering
   eftersom mb-ica-header.actions bara stödjer ikoner, inte text. */
.filter-drawer-head {
  position: relative;
}
.filter-drawer-head__clear {
  position: absolute;
  right: var(--ica-spacing-md);
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: var(--ica-red);
  font-size: 1rem;
  font-family: 'ICATextNy', sans-serif;
  cursor: pointer;
}
</style>

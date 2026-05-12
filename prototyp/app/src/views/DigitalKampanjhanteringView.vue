<template>
  <mb-ica-layout-two-columns
    class="dk-layout"
    :sidebaropen="selectedActivityId !== null"
    @closesidebar="selectedActivityId = null"
    style="--IcaLayoutTwoColumns--sidebar-duration: 0.3s"
  >
    <!-- ─── VÄNSTER: Aktivitetstabell ─── -->
    <div slot="main" class="dk-main">
      <mb-ica-page-header
        heading="Digital kampanjhantering"
        :actions='JSON.stringify([{ icon: "plus-circle", label: "Skapa ny aktivitet", id: "create" }])'
        prioritizeactions
        @rightactionclick="onCreateActivity"
      ></mb-ica-page-header>

      <div class="dk-main__bar">
        <mb-ica-filter
          :incard="false"
          :shortcuts="JSON.stringify(shortcuts)"
          :filters="JSON.stringify(activeFilters)"
          @filterbuttonclick="filterOpen = true"
          @shortcutitemclick="onShortcutClick"
          @filteritemdelete="onFilterRemove"
        >
          <mb-ica-input-search
            slot="left"
            label="Sök"
            :value="searchQuery"
            @input="e => searchQuery = e.target.value"
            @clear="searchQuery = ''"
          ></mb-ica-input-search>
        </mb-ica-filter>
      </div>

      <div class="dk-main__scroll">
        <mb-ica-table
          class="dk-table"
          :style="{ '--IcaTable--header-columns': gridCols }"
          :headeritems="JSON.stringify(headers)"
          @headeritemclick="onHeaderClick"
        >
          <!-- Tom vänster-header-cell (matchar pen-ikon-kolumnen i raderna) -->
          <div slot="left" class="dk-table__left-header"></div>

          <mb-ica-card-row
            v-for="(row, index) in filteredActivities"
            :key="row.id"
            :odd="index % 2 === 0"
            :active="selectedActivityId === row.id"
            :style="{ '--IcaCardRow--grid-template-columns': gridCols }"
            @click="selectActivity(row.id)"
          >
            <button
              slot="left"
              class="dk-edit-btn"
              :aria-label="'Redigera ' + row.name"
              @click.stop="editActivity(row)"
            >
              <mb-ica-icon-edit></mb-ica-icon-edit>
            </button>

            <div class="dk-cell">{{ row.name }}</div>
            <div class="dk-cell">{{ row.kampanjtyp }}</div>
            <div class="dk-cell dk-cell--right">{{ row.startdatum }}</div>
            <div class="dk-cell dk-cell--right">{{ row.slutdatum }}</div>
            <div class="dk-cell">
              <mb-ica-tag
                type="pill"
                :text="row.status"
                :background="statusColor(row.status)"
              ></mb-ica-tag>
            </div>
            <div class="dk-cell">
              <button
                class="dk-feed-btn"
                :aria-label="row.feedStatus === 'Pausa' ? 'Pausa feed' : 'Starta feed'"
                @click.stop="toggleFeed(row)"
              >
                <mb-ica-icon-pause-circle v-if="row.feedStatus === 'Pausa'"></mb-ica-icon-pause-circle>
                <mb-ica-icon-play-circle v-else></mb-ica-icon-play-circle>
                {{ row.feedStatus }}
              </button>
            </div>
            <div class="dk-cell dk-cell--chevron">
              <mb-ica-icon-angle-right></mb-ica-icon-angle-right>
            </div>
          </mb-ica-card-row>
        </mb-ica-table>

        <div v-if="filteredActivities.length === 0" class="dk-empty">
          <mb-ica-placeholder text="Inga aktiviteter matchar" align="center">
            <p slot="content">Försök med en annan sökning eller rensa filter.</p>
            <mb-ica-icon-search />
          </mb-ica-placeholder>
        </div>
      </div>
    </div>

    <!-- ─── HÖGER: Nedslags-lista för vald aktivitet ─── -->
    <div slot="sidebar" class="dk-sidebar">
      <mb-ica-header
        :heading="selectedActivity ? selectedActivity.name + ' - Nedslag' : 'Nedslag'"
        :actions='JSON.stringify([{ icon: "more", label: "Fler alternativ", id: "more" }])'
        @rightactionclick="onMoreActions"
      ></mb-ica-header>

      <div class="dk-sidebar__search">
        <mb-ica-input-search
          label="Sök nedslag"
          :value="nedslagSearch"
          @input="e => nedslagSearch = e.target.value"
          @clear="nedslagSearch = ''"
        ></mb-ica-input-search>
      </div>

      <div class="dk-sidebar__labels">
        <span class="dk-label">AKTIVITETENS NEDSLAG</span>
        <span class="dk-label dk-label--right">STATUS</span>
      </div>

      <div class="dk-sidebar__scroll">
        <template v-if="filteredNedsals.length > 0">
          <mb-ica-card-row
            v-for="nedslag in filteredNedsals"
            :key="nedslag.id"
            chevron
            @click="openNedslag(nedslag)"
          >
            <button
              slot="left"
              class="dk-edit-btn"
              :aria-label="'Redigera ' + nedslag.name"
              @click.stop="editNedslag(nedslag)"
            >
              <mb-ica-icon-edit></mb-ica-icon-edit>
            </button>
            <div class="dk-nedslag-content">
              <mb-ica-meta
                :heading="nedslag.name"
                :subheading="'Datum: ' + (nedslag.datum || '')"
                :text="'Antal butiker: ' + (nedslag.antalButiker || '')"
              ></mb-ica-meta>
              <mb-ica-tag
                type="pill"
                :text="nedslag.status"
                :background="statusColor(nedslag.status)"
              ></mb-ica-tag>
            </div>
          </mb-ica-card-row>
        </template>
        <div v-else-if="nedslagSearch" class="dk-empty">
          <mb-ica-placeholder text="Inga nedslag matchar" align="center" />
        </div>
      </div>
    </div>
  </mb-ica-layout-two-columns>

  <!-- Filter-drawer -->
  <Teleport to="body">
    <mb-ica-drawer :open="filterOpen" @close="filterOpen = false" style="--IcaDrawer--header-height: 44px">
      <div slot="head" class="dk-drawer-head">
        <mb-ica-header
          variant="dialog"
          heading="Filter"
          leftaction="close"
          @leftactionclick="filterOpen = false"
        ></mb-ica-header>
        <button class="dk-drawer-head__clear" @click="clearFilters">Rensa</button>
      </div>

      <mb-ica-accordion heading="Profil" :expanded="expandedSection === 'profil'">
        <mb-ica-card-row v-for="p in profiler" :key="p.id" noninteractive truncate>
          <mb-ica-checkbox :checked="p.selected" @change="p.selected = !p.selected">
            <mb-ica-meta :heading="p.name" />
          </mb-ica-checkbox>
        </mb-ica-card-row>
      </mb-ica-accordion>

      <mb-ica-accordion heading="Status" :expanded="expandedSection === 'status'">
        <mb-ica-card-row v-for="s in statusOptions" :key="s.id" noninteractive truncate>
          <mb-ica-checkbox :checked="s.selected" @change="s.selected = !s.selected">
            <mb-ica-meta :heading="s.name" />
          </mb-ica-checkbox>
        </mb-ica-card-row>
      </mb-ica-accordion>

      <mb-ica-button
        slot="buttons"
        :text="'Visa ' + filteredActivities.length + ' resultat'"
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

defineEmits(['navigate'])

// ── Grid-template — single source of truth för header och rader ──
const gridCols = '3fr 2fr 1.5fr 1.5fr 1.5fr 2fr 1.5rem'

// ── State ────────────────────────────────────────────────────────
const selectedActivityId = ref(1)
const searchQuery = ref('')
const nedslagSearch = ref('')
const filterOpen = ref(false)
const expandedSection = ref('')

// ── Mock-data: Aktiviteter ───────────────────────────────────────
const activities = ref([
  {
    id: 1,
    name: 'Aktivitet 1',
    kampanjtyp: 'Always on',
    startdatum: '2020-02-02',
    slutdatum: '2020-03-02',
    status: 'Aktiv',
    feedStatus: 'Pausa',
  },
  {
    id: 2,
    name: 'Aktivitet 2',
    kampanjtyp: 'Always on',
    startdatum: '2020-02-02',
    slutdatum: '2020-03-02',
    status: 'Planerad',
    feedStatus: 'Pausa',
  },
  {
    id: 3,
    name: 'Aktivitet 3',
    kampanjtyp: 'Kampanjne...',
    startdatum: '2020-02-02',
    slutdatum: '2020-03-02',
    status: 'Planerad',
    feedStatus: 'Pausa',
  },
  {
    id: 4,
    name: 'Aktivitet 4',
    kampanjtyp: 'Always on',
    startdatum: '2020-02-02',
    slutdatum: '2020-03-02',
    status: 'Aktiv',
    feedStatus: 'Pausa',
  },
  {
    id: 5,
    name: 'Aktivitet 5',
    kampanjtyp: 'Always on',
    startdatum: '2020-02-02',
    slutdatum: '2020-03-02',
    status: 'Fel',
    feedStatus: 'Pausa',
  },
  {
    id: 6,
    name: 'Aktivitet 6',
    kampanjtyp: 'Always on',
    startdatum: '2020-02-02',
    slutdatum: '2020-03-02',
    status: 'Planerad',
    feedStatus: 'Starta',
  },
])

// ── Mock-data: Nedslag per aktivitet ─────────────────────────────
const nedsalsByActivity = {
  1: [
    { id: 1, name: 'Nedslag 1', datum: '', antalButiker: '', status: 'Aktiv' },
    { id: 2, name: 'Nedslag 2', datum: '', antalButiker: '', status: 'Fel' },
    { id: 3, name: 'Nedslag 3', datum: '', antalButiker: '', status: 'Planerad' },
    { id: 4, name: 'Nedslag 4', datum: '', antalButiker: '', status: 'Planerad' },
    { id: 5, name: 'Nedslag 5', datum: '', antalButiker: '', status: 'Planerad' },
    { id: 6, name: 'Nedslag 6', datum: '', antalButiker: '', status: 'Planerad' },
    { id: 7, name: 'Nedslag 7', datum: '', antalButiker: '', status: 'Planerad' },
    { id: 8, name: 'Nedslag 8', datum: '', antalButiker: '', status: 'Planerad' },
    { id: 9, name: 'Nedslag 9', datum: '', antalButiker: '', status: 'Planerad' },
  ],
  2: [
    { id: 1, name: 'Nedslag 1', datum: '', antalButiker: '', status: 'Planerad' },
    { id: 2, name: 'Nedslag 2', datum: '', antalButiker: '', status: 'Planerad' },
  ],
  3: [
    { id: 1, name: 'Nedslag 1', datum: '', antalButiker: '', status: 'Planerad' },
  ],
  4: [
    { id: 1, name: 'Nedslag 1', datum: '', antalButiker: '', status: 'Aktiv' },
    { id: 2, name: 'Nedslag 2', datum: '', antalButiker: '', status: 'Planerad' },
  ],
  5: [
    { id: 1, name: 'Nedslag 1', datum: '', antalButiker: '', status: 'Fel' },
  ],
  6: [
    { id: 1, name: 'Nedslag 1', datum: '', antalButiker: '', status: 'Planerad' },
    { id: 2, name: 'Nedslag 2', datum: '', antalButiker: '', status: 'Planerad' },
  ],
}

// ── Filter-data ──────────────────────────────────────────────────
const profiler = ref([
  { id: 'profil1', name: 'Erikslund, Maxi', selected: false },
  { id: 'profil2', name: 'Centrum, Stor', selected: false },
  { id: 'profil3', name: 'Kvantum Nord', selected: false },
])

const statusOptions = ref([
  { id: 'aktiv', name: 'Aktiv', selected: false },
  { id: 'planerad', name: 'Planerad', selected: false },
  { id: 'fel', name: 'Fel', selected: false },
])

const shortcuts = [
  { id: 'profil', text: 'Profil' },
  { id: 'status', text: 'Status' },
]

// ── Tabell-headers ───────────────────────────────────────────────
const headers = ref([
  { label: 'Aktivitet',     column: 1, sortdirection: 'asc',     id: 'name' },
  { label: 'Kampanjtyp',   column: 2, sortdirection: 'default',  id: 'kampanjtyp' },
  { label: 'Startdatum',   column: 3, sortdirection: 'default',  id: 'startdatum' },
  { label: 'Slutdatum',    column: 4, sortdirection: 'default',  id: 'slutdatum' },
  { label: 'Kampanjstatus',column: 5, sortdirection: 'default',  id: 'status' },
  { label: 'Feed',         column: 6, sortdirection: 'default',  id: 'feedStatus' },
])

// ── Computed ─────────────────────────────────────────────────────
const activeFilters = computed(() => {
  const filters = []
  profiler.value.filter(p => p.selected).forEach(p =>
    filters.push({ id: p.id, text: p.name, removable: true })
  )
  statusOptions.value.filter(s => s.selected).forEach(s =>
    filters.push({ id: s.id, text: s.name, removable: true })
  )
  return filters
})

const filteredActivities = computed(() => {
  let list = [...activities.value]

  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    list = list.filter(a => a.name.toLowerCase().includes(q) || a.kampanjtyp.toLowerCase().includes(q))
  }

  const selectedStatuses = statusOptions.value.filter(s => s.selected).map(s => s.name)
  if (selectedStatuses.length) {
    list = list.filter(a => selectedStatuses.includes(a.status))
  }

  const activeHeader = headers.value.find(h => h.sortdirection !== 'default')
  if (activeHeader) {
    const dir = activeHeader.sortdirection === 'desc' ? -1 : 1
    list.sort((a, b) => {
      const av = String(a[activeHeader.id] ?? '')
      const bv = String(b[activeHeader.id] ?? '')
      return av.localeCompare(bv, 'sv') * dir
    })
  }

  return list
})

const selectedActivity = computed(() =>
  activities.value.find(a => a.id === selectedActivityId.value) ?? null
)

const filteredNedsals = computed(() => {
  const nedsals = nedsalsByActivity[selectedActivityId.value] ?? []
  if (!nedslagSearch.value) return nedsals
  const q = nedslagSearch.value.toLowerCase()
  return nedsals.filter(n => n.name.toLowerCase().includes(q))
})

// ── Hjälpfunktioner ──────────────────────────────────────────────
function statusColor(status) {
  if (status === 'Aktiv')    return 'var(--ica-status-aktiv)'
  if (status === 'Fel')      return 'var(--ica-red)'
  return 'var(--ica-text-secondary)'
}

// ── Handlers ─────────────────────────────────────────────────────
function selectActivity(id) {
  selectedActivityId.value = id
  nedslagSearch.value = ''
}

function editActivity(row) {
  console.log('Redigera aktivitet', row.id)
}

function toggleFeed(row) {
  row.feedStatus = row.feedStatus === 'Pausa' ? 'Starta' : 'Pausa'
}

function openNedslag(nedslag) {
  console.log('Öppna nedslag', nedslag.id)
}

function editNedslag(nedslag) {
  console.log('Redigera nedslag', nedslag.id)
}

function onCreateActivity() {
  console.log('Skapa ny aktivitet')
}

function onMoreActions() {
  console.log('Fler alternativ för aktivitet', selectedActivityId.value)
}

function onHeaderClick(e) {
  const { id, sortdirection } = e.detail
  const next = sortdirection === 'default' ? 'desc' : sortdirection === 'desc' ? 'asc' : 'default'
  headers.value = headers.value.map(h => ({
    ...h,
    sortdirection: h.id === id ? next : 'default',
  }))
}

function onShortcutClick(e) {
  expandedSection.value = e.detail.id
  filterOpen.value = true
}

function onFilterRemove(e) {
  const id = e.detail.id
  const p = profiler.value.find(x => x.id === id)
  if (p) { p.selected = false; return }
  const s = statusOptions.value.find(x => x.id === id)
  if (s) s.selected = false
}

function clearFilters() {
  profiler.value.forEach(p => p.selected = false)
  statusOptions.value.forEach(s => s.selected = false)
}

function applyFilters() {
  filterOpen.value = false
  expandedSection.value = ''
}
</script>

<style scoped>
.dk-layout {
  --IcaLayoutTwoColumns--column-height: calc(100vh - 56px);
  display: block;
  height: calc(100vh - 56px);
}

/* ── Main-kolumn ── */
.dk-main {
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 0;
}

.dk-main__bar {
  background: var(--ica-bg);
  border-bottom: 1px solid var(--ica-border);
  flex-shrink: 0;
}

.dk-main__bar mb-ica-filter {
  --IcaFilter--padding: 0;
}

.dk-main__scroll {
  flex: 1;
  min-height: 0;
  overflow: auto;
}

/* ── Tabell ── */
.dk-table {
  width: 100%;
}

/* Tom header-cell för pen-ikon-kolumnen */
.dk-table__left-header {
  width: 56px;
}

/* Pen-ikon-knapp i vänster slot */
.dk-edit-btn {
  background: none;
  border: none;
  border-right: 1px solid var(--ica-border);
  color: var(--ica-red-hover);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 var(--ica-spacing-md);
  height: 100%;
  font-size: 1.25rem;
  flex-shrink: 0;
}

.dk-edit-btn:hover {
  color: var(--ica-red);
}

/* Tabellceller */
.dk-cell {
  display: flex;
  align-items: center;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.dk-cell--right {
  justify-content: flex-end;
}

.dk-cell--chevron {
  justify-content: flex-end;
  color: var(--ica-red-hover);
}

/* Feed-action-knapp */
.dk-feed-btn {
  display: flex;
  align-items: center;
  gap: var(--ica-spacing-xs);
  background: none;
  border: none;
  color: var(--ica-red-hover);
  cursor: pointer;
  font-family: 'ICATextNy', sans-serif;
  font-size: 0.875rem;
  padding: 0;
}

.dk-feed-btn:hover {
  color: var(--ica-red);
}

/* ── Sidebar ── */
.dk-sidebar {
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 0;
  border-left: 1px solid var(--ica-border);
}

.dk-sidebar__search {
  flex-shrink: 0;
  border-bottom: 1px solid var(--ica-border);
}

.dk-sidebar__labels {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--ica-spacing-sm) var(--ica-spacing-md);
  background: var(--ica-subtle);
  border-bottom: 1px solid var(--ica-border);
  flex-shrink: 0;
}

.dk-label {
  font-family: 'ICATextNy', sans-serif;
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--ica-text);
  text-transform: uppercase;
  letter-spacing: 0.03em;
}

.dk-label--right {
  color: var(--ica-text-secondary);
}

.dk-sidebar__scroll {
  flex: 1;
  min-height: 0;
  overflow: auto;
}

/* Nedslag-rad: meta + status-tag sida vid sida */
.dk-nedslag-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  min-width: 0;
  gap: var(--ica-spacing-sm);
}

.dk-nedslag-content mb-ica-meta {
  flex: 1;
  min-width: 0;
}

/* Tom-state */
.dk-empty {
  padding: var(--ica-spacing-xl) var(--ica-spacing-md);
  text-align: center;
}

/* ── Filter-drawer ── */
.dk-drawer-head {
  position: relative;
}

.dk-drawer-head__clear {
  position: absolute;
  right: var(--ica-spacing-md);
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: var(--ica-red);
  font-family: 'ICATextNy', sans-serif;
  font-size: 1rem;
  cursor: pointer;
}
</style>

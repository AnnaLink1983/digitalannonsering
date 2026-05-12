<template>
  <!--
    MALL: Sorterbar/filterbar datatabell i layout-two-columns nosidebar.
    Notera: i nosidebar-läge använder vi layoutens egen `slot="header"`
    för delad page-header.
    KRITISKT: tabellrader är `mb-ica-card-row` med matchande grid —
    INTE custom div+grid eller `<td>`.
  -->
  <mb-ica-layout-two-columns nosidebar class="dt-layout">
    <mb-ica-page-header
      slot="header"
      heading="Tabell"
      backlabel="Tillbaka"
      :actions='JSON.stringify([
        { icon: "plus", label: "Lägg till", id: "add" }
      ])'
      @leftactionclick="$emit('navigate', 'menu')"
      @rightactionclick="onHeaderAction"
    ></mb-ica-page-header>

    <div slot="main" class="dt-main">
      <div class="dt-main__bar">
        <mb-ica-filter
          :incard="false"
          :shortcuts="JSON.stringify(shortcuts)"
          :filters='JSON.stringify(activeFilters)'
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

      <div class="dt-main__scroll">
        <mb-ica-table
          class="dt-table"
          :style="{ '--IcaTable--header-columns': gridCols }"
          :headeritems="JSON.stringify(headers)"
          @headeritemclick="onHeaderClick"
        >
          <mb-ica-checkbox
            slot="left"
            :checked="allSelected"
            @change="toggleAll"
            arialabel="Välj alla"
          ></mb-ica-checkbox>

          <mb-ica-card-row
            v-for="(row, index) in filteredRows"
            :key="row.id"
            :odd="index % 2 === 0"
            :style="{ '--IcaCardRow--grid-template-columns': gridCols }"
            @click="$emit('navigate', 'article', row)"
          >
            <mb-ica-checkbox
              slot="left"
              :checked="row.selected"
              @change="toggleRow(row)"
              @click.stop
              arialabel="Välj rad"
            ></mb-ica-checkbox>

            <div class="dt-cell--title">
              <mb-ica-media-object>
                <img slot="first" :src="row.image" :alt="row.title" class="dt-thumb" />
                <mb-ica-meta slot="last" :heading="row.title" :subheading="row.subtitle"></mb-ica-meta>
              </mb-ica-media-object>
            </div>

            <div>{{ row.articleNr }}</div>
            <div>{{ row.price }}</div>
            <div>{{ row.margin }}</div>
            <div>{{ row.stock }}</div>
            <div>{{ row.supplier }}</div>
            <div>{{ row.lastDelivery }}</div>

            <div class="dt-cell--status">
              <mb-ica-color-indicator
                :theme="statusTheme(row.status)"
                style="display:inline-flex;"
              ></mb-ica-color-indicator>
              <span>{{ row.status }}</span>
            </div>

            <div class="dt-cell--chevron">
              <mb-ica-icon-angle-right></mb-ica-icon-angle-right>
            </div>
          </mb-ica-card-row>
        </mb-ica-table>

        <div v-if="filteredRows.length === 0" class="list-empty">
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
  </mb-ica-layout-two-columns>

  <!--
    Filter-drawer — Teleport ut ur layout-two-columns så stacking context inte
    klippar overlay/backdrop.
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
        <mb-ica-card-row v-for="s in statusList" :key="s.id" noninteractive truncate>
          <mb-ica-checkbox :checked="s.selected" @change="s.selected = !s.selected">
            <mb-ica-meta :heading="s.name" />
          </mb-ica-checkbox>
        </mb-ica-card-row>
      </mb-ica-accordion>

      <mb-ica-accordion heading="Leverantör" :expanded="expandedSection === 'leverantor'">
        <mb-ica-card-row v-for="l in suppliers" :key="l.id" noninteractive truncate>
          <mb-ica-checkbox :checked="l.selected" @change="l.selected = !l.selected">
            <mb-ica-meta :heading="l.name" />
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

  <!--
    Lägg till artiklar-dialog — bred dialog med 2-kolumns layout (Sök / Valda).
    Teleport för att undgå stacking context från layout-two-columns.
    desktopfullheight + desktopfullwidth ger ~full skärm med marginaler.
  -->
  <Teleport to="body">
    <mb-ica-dialog
      :open="addArticleOpen"
      desktopfullheight
      desktopfullwidth
      snaptotop
      @close="closeAddArticle"
    >
      <mb-ica-header
        slot="header"
        variant="dialog"
        heading="Lägg till artiklar"
        leftaction="close"
        @leftactionclick="closeAddArticle"
      ></mb-ica-header>

      <div class="add-article">
        <div class="add-article__cols">
        <!-- VÄNSTER: Sök artiklar -->
        <div class="add-article__col add-article__col--wide">
          <h3 class="add-article__heading">Sök artiklar</h3>

          <mb-ica-card flat nogutters class="add-article__card">
            <div class="add-article__search-bar">
              <!--
                Sök + shortcuts + aktiva filter-chips i SAMMA filter-instans.
                Komponenten hanterar layout (wrap till ny rad om inte plats).
                Att ha en andra mb-ica-filter-instans för chips bara ger en
                extra filter-knapp — komponenten exponerar inget sätt att dölja
                den. Samma mönster som tabell-filtret längre upp i vyn.
              -->
              <mb-ica-filter
                :incard="false"
                :shortcuts='JSON.stringify(addShortcuts)'
                :filters='JSON.stringify(activeAddFilters)'
                @filterbuttonclick="onAddFilterButtonClick"
                @shortcutitemclick="onAddShortcutClick"
                @filteritemdelete="onAddFilterRemove"
              >
                <mb-ica-input-search
                  slot="left"
                  label="Sök"
                  :value="addSearchQuery"
                  @input="e => addSearchQuery = e.target.value"
                  @clear="addSearchQuery = ''"
                ></mb-ica-input-search>
              </mb-ica-filter>
            </div>

            <!-- Master-segment med ALLA ARTIKLAR-checkbox (slot="left" i segment) -->
            <mb-ica-segment heading="ALLA ARTIKLAR">
              <mb-ica-checkbox
                slot="left"
                :checked="allVisibleSelected"
                :disabled="filteredAvailable.length === 0"
                @change="toggleAllVisible"
                arialabel="Markera alla artiklar"
              ></mb-ica-checkbox>
            </mb-ica-segment>

            <template v-if="filteredAvailable.length > 0">
              <!--
                Selectable row-mönstret: card-row noninteractive + checkbox i
                default slot + mb-ica-meta som child av checkboxen.
                Hela raden blir en klickyta som togglar markering.
                Se checkbox/api.md → "Beslutsregel för card-row + checkbox".
              -->
              <mb-ica-card-row
                v-for="article in filteredAvailable"
                :key="article.id"
                noninteractive
              >
                <mb-ica-checkbox
                  :checked="isArticleSelected(article)"
                  @change="toggleArticle(article)"
                >
                  <mb-ica-media-object>
                    <img slot="first" :src="article.image" :alt="article.title" width="40" height="40" class="add-article__thumb" />
                    <mb-ica-meta
                      slot="last"
                      :heading="article.title"
                      :subheading="article.subtitle + ' · ' + article.supplier"
                      :text="article.articleNr"
                    />
                  </mb-ica-media-object>
                </mb-ica-checkbox>
              </mb-ica-card-row>
            </template>
            <div v-else class="add-article__empty">
              <mb-ica-placeholder
                text="Inga artiklar matchar"
                align="center"
              >
                <mb-ica-icon-search />
              </mb-ica-placeholder>
            </div>
          </mb-ica-card>
        </div>

        <!-- Vertikal divider -->
        <div class="add-article__divider"></div>

        <!-- HÖGER: Valda -->
        <div class="add-article__col add-article__col--narrow">
          <h3 class="add-article__heading">Valda</h3>

          <mb-ica-card flat nogutters class="add-article__card">
            <template v-if="selectedArticles.length > 0">
              <!--
                Vald artikel — noninteractive card-row + trash-knapp som äger
                sin egen klickyta. Hela raden gör inget vid klick; bara
                trash-ikonen tar bort. Tydligare UX än hel-rad-klick.
                Mönster: "FLERA klickytor" enligt checkbox/api.md (men här är
                trash-knappen ensam aktiv yta — inget urval, bara ta bort).
              -->
              <mb-ica-card-row
                v-for="article in selectedArticles"
                :key="article.id"
                noninteractive
              >
                <mb-ica-media-object>
                  <img slot="first" :src="article.image" :alt="article.title" width="40" height="40" class="add-article__thumb" />
                  <mb-ica-meta
                    slot="last"
                    :heading="article.title"
                    :subheading="article.subtitle + ' · ' + article.supplier"
                    :text="article.articleNr"
                  />
                </mb-ica-media-object>
                <button
                  class="add-article__remove"
                  :aria-label="'Ta bort ' + article.title"
                  @click="toggleArticle(article)"
                >
                  <mb-ica-icon-trash />
                </button>
              </mb-ica-card-row>
            </template>
            <div v-else class="add-article__empty">
              <mb-ica-placeholder
                text="Det finns inga artiklar valda än"
                align="center"
              >
                <mb-ica-icon-find-item />
              </mb-ica-placeholder>
            </div>
          </mb-ica-card>
        </div>
        </div>

        <!--
          Sticky bottom-bar — INUTI dialog-content, INTE i `slot="buttons"`.
          Anledning: buttons-slot är designad för fullwidth-knappar (mobile-style).
          Desktop-mönstret från Figma har auto-bredd höger-justerade knappar i en
          sticky vit bar — samma princip som i FormView.
        -->
        <div class="add-article__actions">
          <mb-ica-button
            text="Avbryt"
            variation="secondary"
            @click="closeAddArticle"
          ></mb-ica-button>
          <mb-ica-button
            text="Spara"
            variation="primary"
            :disabled="selectedArticles.length === 0 || addSaving"
            :loading="addSaving"
            :hasloader="addSaving"
            @click="saveSelectedArticles"
          ></mb-ica-button>
        </div>
      </div>
    </mb-ica-dialog>
  </Teleport>

  <!--
    Filter-drawer för Lägg till artiklar-dialogen.
    Separat instans från tabellens filter-drawer (annan scope, andra kategorier).
    Avdelning + Leverantör per användarval.

    z-index-override: dialogens default är 500 och drawerns default är lägre.
    Eftersom denna drawer öppnas OVANPÅ en redan öppen dialog måste den ha
    högre z-index än dialogens — sätter 2000 inline (notera: App.vue:s scoped
    z-index-overrides följer inte med Teleportade element ut ur komponenten).
  -->
  <Teleport to="body">
    <mb-ica-drawer
      :open="addFilterOpen"
      @close="addFilterOpen = false"
      style="--IcaDrawer--header-height: 44px; --IcaDrawer--z-index: 2000;"
    >
      <div slot="head" class="filter-drawer-head">
        <mb-ica-header
          variant="dialog"
          heading="Filter"
          leftaction="close"
          @leftactionclick="addFilterOpen = false"
        ></mb-ica-header>
        <button class="filter-drawer-head__clear" @click="clearAddFilters">Rensa</button>
      </div>

      <mb-ica-accordion heading="Avdelning" :expanded="addExpandedSection === 'avdelning'">
        <mb-ica-card-row v-for="d in addDepartments" :key="d.id" noninteractive truncate>
          <mb-ica-checkbox :checked="d.selected" @change="d.selected = !d.selected">
            <mb-ica-meta :heading="d.name" />
          </mb-ica-checkbox>
        </mb-ica-card-row>
      </mb-ica-accordion>

      <mb-ica-accordion heading="Leverantör" :expanded="addExpandedSection === 'leverantor'">
        <mb-ica-card-row v-for="s in addSuppliers" :key="s.id" noninteractive truncate>
          <mb-ica-checkbox :checked="s.selected" @change="s.selected = !s.selected">
            <mb-ica-meta :heading="s.name" />
          </mb-ica-checkbox>
        </mb-ica-card-row>
      </mb-ica-accordion>

      <mb-ica-button
        slot="buttons"
        :text="'Visa ' + filteredAvailable.length + ' resultat'"
        fullwidth
        @click="applyAddFilters"
      ></mb-ica-button>
      <mb-ica-button
        slot="buttons"
        text="Spara filter"
        variation="secondary"
        fullwidth
        @click="applyAddFilters"
      ></mb-ica-button>
    </mb-ica-drawer>
  </Teleport>
</template>

<script setup>
import { ref, computed } from 'vue'

// Produktbilder — Vite bundlar och hashar dessa automatiskt vid build.
// Importera nya bilder här när du lägger till artiklar. Sökväg relativt vy-filen.
import pagenLingongrovaImg from '../../assets/images/products/pagen-lingongrova.webp'
import felixKetchupImg from '../../assets/images/products/felix-tomatketchup.webp'
import cremeFraicheImg from '../../assets/images/products/creme-fraiche.webp'
import olwChipsImg from '../../assets/images/products/olw-chips.webp'
import oxpyttImg from '../../assets/images/products/oxpytt.webp'
import arlaFarskostImg from '../../assets/images/products/arla-farskost-naturell.webp'
import laxfileImg from '../../assets/images/products/laxfile.webp'
import baguetteVallmoImg from '../../assets/images/products/baguette-valmo.png'
import baguetteVeteImg from '../../assets/images/products/Baguettav-vete.png'
import blabarsmuffinImg from '../../assets/images/products/blabarsmuffin.png'
import chokladtartaImg from '../../assets/images/products/chokladtarta.png'
import ciabattaTranbarImg from '../../assets/images/products/ciabattar-tranbar.png'
import kwikorgImg from '../../assets/images/products/Kwikorg.webp'

defineEmits(['navigate'])

// ── Grid-template för både header och rader (single source of truth) ──
const gridCols = '3fr 1fr 1fr 1fr 1fr 1fr 1fr 1.2fr 1.5rem'

// ── Sök/filter-state ────────────────────────────────────
const searchQuery = ref('')
const filterOpen = ref(false)
const expandedSection = ref('')

// ── Lägg till artiklar-state ────────────────────────────
const addArticleOpen = ref(false)
const addSearchQuery = ref('')
const selectedArticles = ref([]) // Artiklar användaren valt att lägga till
const addSaving = ref(false)

// Filter-state för dialogen — separat scope från tabellens egna filter
const addFilterOpen = ref(false)
const addExpandedSection = ref('')

const addDepartments = ref([
  { id: 'mejeri', name: 'Mejeri', selected: false },
  { id: 'chark', name: 'Chark & Deli', selected: false },
  { id: 'kolonial', name: 'Kolonial', selected: false },
  { id: 'frukt', name: 'Frukt & Grönt', selected: false },
  { id: 'frys', name: 'Frys', selected: false },
  { id: 'bageri', name: 'Bageri', selected: false },
])

const addSuppliers = ref([
  { id: 'pagen',   name: 'Pågen',   selected: false },
  { id: 'felix',   name: 'Felix',   selected: false },
  { id: 'arla',    name: 'Arla',    selected: false },
  { id: 'olw',     name: 'OLW',     selected: false },
  { id: 'ica',     name: 'ICA',     selected: false },
  { id: 'bonjour', name: 'Bonjour', selected: false },
])

// Shortcuts som visas i dialog-filtrets sökrad — klick öppnar drawer på rätt sektion
const addShortcuts = [
  { id: 'avdelning', text: 'Avdelning' },
  { id: 'leverantor', text: 'Leverantör' },
]

// Mock-katalog av artiklar man kan välja från. I en riktig prototyp kommer
// dessa från en API-endpoint eller delas med tabellens `availableArticles`.
const availableArticles = ref([
  { id: 100, title: 'Arla Färskost Naturell', subtitle: 'Mejeri',   articleNr: '7311070070010', price: '34,90', margin: '20%', stock: '24 st', supplier: 'Arla',    lastDelivery: '2026-04-22', status: 'Success', image: arlaFarskostImg },
  { id: 101, title: 'Laxfilé',                subtitle: 'Frys',     articleNr: '7311070070027', price: '129,00', margin: '24%', stock: '6 st',  supplier: 'ICA',     lastDelivery: '2026-04-23', status: 'Success', image: laxfileImg },
  { id: 102, title: 'Baguette vallmo',        subtitle: 'Bageri',   articleNr: '7311070080010', price: '28,90', margin: '26%', stock: '14 st', supplier: 'Bonjour', lastDelivery: '2026-04-22', status: 'Success', image: baguetteVallmoImg },
  { id: 103, title: 'Baguette vete',          subtitle: 'Bageri',   articleNr: '7311070080027', price: '24,90', margin: '24%', stock: '20 st', supplier: 'Bonjour', lastDelivery: '2026-04-22', status: 'Success', image: baguetteVeteImg },
  { id: 104, title: 'Blåbärsmuffins',         subtitle: 'Bageri',   articleNr: '7311070080034', price: '36,50', margin: '30%', stock: '8 st',  supplier: 'Bonjour', lastDelivery: '2026-04-23', status: 'Success', image: blabarsmuffinImg },
  { id: 105, title: 'Chokladtårta',           subtitle: 'Bageri',   articleNr: '7311070080041', price: '129,00', margin: '34%', stock: '4 st',  supplier: 'Bonjour', lastDelivery: '2026-04-23', status: 'Success', image: chokladtartaImg },
  { id: 106, title: 'Ciabatta tranbär',       subtitle: 'Bageri',   articleNr: '7311070080058', price: '32,90', margin: '28%', stock: '12 st', supplier: 'Bonjour', lastDelivery: '2026-04-22', status: 'Success', image: ciabattaTranbarImg },
  { id: 107, title: 'Kwikorg',                subtitle: 'Kolonial', articleNr: '7311070070034', price: '49,90', margin: '20%', stock: '32 st', supplier: 'ICA',     lastDelivery: '2026-04-19', status: 'Success', image: kwikorgImg },
])

const shortcuts = [
  { id: 'avdelning', text: 'Avdelning' },
  { id: 'status', text: 'Status' },
  { id: 'leverantor', text: 'Leverantör' },
]

const departments = ref([
  { id: 'mejeri', name: 'Mejeri', selected: false },
  { id: 'chark', name: 'Chark & Deli', selected: false },
  { id: 'kolonial', name: 'Kolonial', selected: false },
  { id: 'frukt', name: 'Frukt & Grönt', selected: false },
  { id: 'frys', name: 'Frys', selected: false },
])

const statusList = ref([
  { id: 'success', name: 'Success', selected: false },
  { id: 'pagaende', name: 'Pågående', selected: false },
  { id: 'fel', name: 'Fel', selected: false },
])

const suppliers = ref([
  { id: 'arla', name: 'Arla', selected: false },
  { id: 'scan', name: 'Scan', selected: false },
  { id: 'ica', name: 'ICA', selected: false },
  { id: 'chiquita', name: 'Chiquita', selected: false },
  { id: 'felix', name: 'Felix', selected: false },
  { id: 'findus', name: 'Findus', selected: false },
])

const headers = ref([
  { label: 'Artikel', column: 1, sortdirection: 'desc', id: 'title' },
  { label: 'Art.nr', column: 2, sortdirection: 'default', id: 'articleNr' },
  { label: 'Pris', column: 3, sortdirection: 'default', id: 'price' },
  { label: 'Marginal', column: 4, sortdirection: 'default', id: 'margin' },
  { label: 'Lager', column: 5, sortdirection: 'default', id: 'stock' },
  { label: 'Leverantör', column: 6, sortdirection: 'default', id: 'supplier' },
  { label: 'Senast', column: 7, sortdirection: 'default', id: 'lastDelivery' },
  { label: 'Status', column: 8, sortdirection: 'default', id: 'status' },
])

const rows = ref([
  { id: 1, title: 'Pågen Lingongrova',  subtitle: 'Bageri',   articleNr: '7311070060011', price: '32,90', margin: '24%', stock: '14 st', supplier: 'Pågen', lastDelivery: '2026-04-20', status: 'Success',  selected: false, image: pagenLingongrovaImg },
  { id: 2, title: 'Felix Tomatketchup', subtitle: 'Kolonial', articleNr: '7311070060028', price: '39,90', margin: '26%', stock: '21 st', supplier: 'Felix', lastDelivery: '2026-04-19', status: 'Success',  selected: false, image: felixKetchupImg },
  { id: 3, title: 'Arla Crème Fraiche', subtitle: 'Mejeri',   articleNr: '7311070060035', price: '24,90', margin: '22%', stock: '18 st', supplier: 'Arla',  lastDelivery: '2026-04-18', status: 'Success',  selected: false, image: cremeFraicheImg },
  { id: 4, title: 'OLW Chips',          subtitle: 'Kolonial', articleNr: '7311070060042', price: '24,50', margin: '32%', stock: '24 st', supplier: 'OLW',   lastDelivery: '2026-04-21', status: 'Success',  selected: false, image: olwChipsImg },
  { id: 5, title: 'Oxpytt',             subtitle: 'Frys',     articleNr: '7311070060059', price: '79,90', margin: '28%', stock: '8 st',  supplier: 'ICA',   lastDelivery: '2026-04-17', status: 'Pågående', selected: false, image: oxpyttImg },
])

// ── Computed ────────────────────────────────────────────
const activeFilters = computed(() => {
  const filters = []
  departments.value
    .filter(d => d.selected)
    .forEach(d => filters.push({ id: d.id, text: d.name, removable: true }))
  statusList.value
    .filter(s => s.selected)
    .forEach(s => filters.push({ id: s.id, text: s.name, removable: true }))
  suppliers.value
    .filter(l => l.selected)
    .forEach(l => filters.push({ id: l.id, text: l.name, removable: true }))
  return filters
})

// Kolumn-typ för sortering. Avgör hur värdet parsas och jämförs.
// När du lägger till en ny kolumn — sätt rätt typ här, annars sorteras den som sträng.
const COLUMN_TYPES = {
  title: 'string',
  articleNr: 'string',
  price: 'currency',          // "42,90" — komma som decimaltecken (svenskt)
  margin: 'percent',          // "28%"
  stock: 'numeric-with-unit', // "12 st" eller "—" (saknat värde)
  supplier: 'string',
  lastDelivery: 'date',       // "2026-04-20"
  status: 'string',
}

function parseSortValue(value, type) {
  if (value == null || value === '—') return null
  if (type === 'currency') return parseFloat(value.replace(',', '.'))
  if (type === 'percent') return parseFloat(value.replace('%', ''))
  if (type === 'numeric-with-unit') {
    const num = parseFloat(value)
    return isNaN(num) ? null : num
  }
  if (type === 'date') {
    const t = new Date(value).getTime()
    return isNaN(t) ? null : t
  }
  return String(value)
}

function compareRows(a, b, headerId, direction) {
  const type = COLUMN_TYPES[headerId] || 'string'
  const av = parseSortValue(a[headerId], type)
  const bv = parseSortValue(b[headerId], type)

  // Saknat värde sorteras alltid sist, oavsett riktning
  if (av === null && bv === null) return 0
  if (av === null) return 1
  if (bv === null) return -1

  let cmp
  if (typeof av === 'string') {
    cmp = av.localeCompare(bv, 'sv')
  } else {
    cmp = av < bv ? -1 : av > bv ? 1 : 0
  }

  return direction === 'desc' ? -cmp : cmp
}

const filteredRows = computed(() => {
  let list = [...rows.value]

  // Sökfilter (matchar title eller articleNr)
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    list = list.filter(r =>
      r.title.toLowerCase().includes(q) || r.articleNr.includes(q)
    )
  }

  // Avdelningsfilter (matchar mot row.subtitle)
  const selectedDepts = departments.value.filter(d => d.selected).map(d => d.name)
  if (selectedDepts.length) {
    list = list.filter(r => selectedDepts.includes(r.subtitle))
  }

  // Statusfilter
  const selectedStatuses = statusList.value.filter(s => s.selected).map(s => s.name)
  if (selectedStatuses.length) {
    list = list.filter(r => selectedStatuses.includes(r.status))
  }

  // Leverantörsfilter
  const selectedSuppliers = suppliers.value.filter(l => l.selected).map(l => l.name)
  if (selectedSuppliers.length) {
    list = list.filter(r => selectedSuppliers.includes(r.supplier))
  }

  // Sortering — single source of truth: headers[].sortdirection
  // onHeaderClick håller bara EN kolumn aktiv åt gången, så vi tar första matchen.
  const activeHeader = headers.value.find(h => h.sortdirection !== 'default')
  if (activeHeader) {
    list.sort((a, b) => compareRows(a, b, activeHeader.id, activeHeader.sortdirection))
  }

  return list
})

const allSelected = computed(() =>
  filteredRows.value.length > 0 && filteredRows.value.every(r => r.selected)
)

// ── Handlers ────────────────────────────────────────────
function toggleAll() {
  const next = !allSelected.value
  // Markera bara de filtrerade raderna — inte hela datasetet
  filteredRows.value.forEach(r => { r.selected = next })
}

function toggleRow(row) {
  row.selected = !row.selected
}

function onHeaderClick(e) {
  // Single source of truth: headers[].sortdirection
  const { id, sortdirection } = e.detail
  const next = sortdirection === 'default' ? 'desc' : sortdirection === 'desc' ? 'asc' : 'default'
  headers.value = headers.value.map(h => ({
    ...h,
    sortdirection: h.id === id ? next : 'default',
  }))
}

function statusTheme(status) {
  if (status === 'Success') return 'success'
  if (status === 'Pågående') return 'notice'
  if (status === 'Fel') return 'failure'
  return 'disabled'
}

function onShortcutClick(e) {
  expandedSection.value = e.detail.id
  filterOpen.value = true
}

function onFilterRemove(e) {
  const id = e.detail.id
  const dept = departments.value.find(d => d.id === id)
  if (dept) { dept.selected = false; return }
  const status = statusList.value.find(s => s.id === id)
  if (status) { status.selected = false; return }
  const supplier = suppliers.value.find(l => l.id === id)
  if (supplier) supplier.selected = false
}

function clearFilters() {
  departments.value.forEach(d => d.selected = false)
  statusList.value.forEach(s => s.selected = false)
  suppliers.value.forEach(l => l.selected = false)
}

function applyFilters() {
  filterOpen.value = false
  expandedSection.value = ''
}

// ── Lägg till artiklar — handlers ───────────────────────
function onHeaderAction(e) {
  if (e.detail.id === 'add') openAddArticle()
}

function openAddArticle() {
  addArticleOpen.value = true
  addSearchQuery.value = ''
  selectedArticles.value = []
  // Nollställ filter när dialogen öppnas
  addDepartments.value.forEach(d => d.selected = false)
  addSuppliers.value.forEach(s => s.selected = false)
}

function closeAddArticle() {
  addArticleOpen.value = false
  selectedArticles.value = []
  addSearchQuery.value = ''
  addFilterOpen.value = false
}

async function saveSelectedArticles() {
  if (selectedArticles.value.length === 0) return
  addSaving.value = true

  // Simulera nätverkscall — byt mot din riktiga submit
  await new Promise(r => setTimeout(r, 400))

  // Lägg till valda artiklar i tabellens rows-array (med selected: false default)
  selectedArticles.value.forEach(a => {
    rows.value.push({ ...a, selected: false })
  })

  addSaving.value = false
  closeAddArticle()
}

// Aktiv filter-chip-array för dialogens filter-rad — kombinerar avdelning + leverantör
const activeAddFilters = computed(() => {
  const filters = []
  addDepartments.value
    .filter(d => d.selected)
    .forEach(d => filters.push({ id: `dept-${d.id}`, text: `Avdelning: ${d.name}`, removable: true }))
  addSuppliers.value
    .filter(s => s.selected)
    .forEach(s => filters.push({ id: `supp-${s.id}`, text: `Leverantör: ${s.name}`, removable: true }))
  return filters
})

// Visa alla tillgängliga artiklar direkt (ej empty by default).
// Filtrera bort de som redan finns i tabellens rows och de som är valda i denna omgång.
// Sökstring + filter-grupper appliceras additivt (AND mellan grupper).
const filteredAvailable = computed(() => {
  let list = availableArticles.value.filter(a =>
    !rows.value.some(r => r.id === a.id)
  )

  // Sökfilter
  const q = addSearchQuery.value.trim().toLowerCase()
  if (q) {
    list = list.filter(a =>
      a.title.toLowerCase().includes(q) || a.articleNr.includes(q)
    )
  }

  // Avdelningsfilter
  const selectedDepts = addDepartments.value.filter(d => d.selected).map(d => d.name)
  if (selectedDepts.length) {
    list = list.filter(a => selectedDepts.includes(a.subtitle))
  }

  // Leverantörsfilter
  const selectedSupps = addSuppliers.value.filter(s => s.selected).map(s => s.name)
  if (selectedSupps.length) {
    list = list.filter(a => selectedSupps.includes(a.supplier))
  }

  return list
})

// True om alla synliga filtrerade artiklar är valda. Master-checkboxen styrs av detta.
const allVisibleSelected = computed(() =>
  filteredAvailable.value.length > 0 &&
  filteredAvailable.value.every(a => isArticleSelected(a))
)

function isArticleSelected(article) {
  return selectedArticles.value.some(s => s.id === article.id)
}

function toggleArticle(article) {
  const idx = selectedArticles.value.findIndex(a => a.id === article.id)
  if (idx >= 0) selectedArticles.value.splice(idx, 1)
  else selectedArticles.value.push(article)
}

function toggleAllVisible() {
  if (allVisibleSelected.value) {
    // Avmarkera alla synliga filtrerade
    const visibleIds = new Set(filteredAvailable.value.map(a => a.id))
    selectedArticles.value = selectedArticles.value.filter(s => !visibleIds.has(s.id))
  } else {
    // Lägg till alla synliga som inte redan är valda
    filteredAvailable.value.forEach(a => {
      if (!isArticleSelected(a)) selectedArticles.value.push(a)
    })
  }
}

function onAddFilterButtonClick() {
  addFilterOpen.value = true
}

function onAddShortcutClick(e) {
  // Mappa shortcut-id till motsvarande accordion-section
  const id = e.detail.id
  if (id === 'avdelning') addExpandedSection.value = 'avdelning'
  else if (id === 'leverantor') addExpandedSection.value = 'leverantor'
  addFilterOpen.value = true
}

function onAddFilterRemove(e) {
  const id = e.detail.id
  // Filter-chip-id är prefixat med "dept-" eller "supp-"
  if (id.startsWith('dept-')) {
    const deptId = id.slice(5)
    const d = addDepartments.value.find(d => d.id === deptId)
    if (d) d.selected = false
  } else if (id.startsWith('supp-')) {
    const suppId = id.slice(5)
    const s = addSuppliers.value.find(s => s.id === suppId)
    if (s) s.selected = false
  }
}

function clearAddFilters() {
  addDepartments.value.forEach(d => d.selected = false)
  addSuppliers.value.forEach(s => s.selected = false)
}

function applyAddFilters() {
  addFilterOpen.value = false
  addExpandedSection.value = ''
}
</script>

<style scoped>
.dt-layout {
  --IcaLayoutTwoColumns--sidebar-duration: 0.3s;
  --IcaLayoutTwoColumns--column-height: 100vh;
  display: block;
  height: 100vh;
}

.dt-main {
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 0;
}

.dt-main__bar {
  background: var(--ica-bg);
  border-bottom: 1px solid var(--ica-border);
  flex-shrink: 0;
}

.dt-main__bar mb-ica-filter {
  --IcaFilter--padding: 0;
}

.dt-main__scroll {
  flex: 1;
  min-height: 0;
  overflow: auto;
}

.dt-cell--title {
  min-width: 0;
}

.dt-thumb {
  display: block;
  width: 48px;
  height: 48px;
  border-radius: 4px;
  flex-shrink: 0;
  object-fit: contain;
  background: var(--ica-bg);
}

/* Thumbnails i Lägg till-dialogen — mindre och rena */
.add-article__thumb {
  display: block;
  width: 40px;
  height: 40px;
  border-radius: 4px;
  object-fit: contain;
  background: var(--ica-bg);
}

/* Trash-knapp i Valda-rader — egen klickyta, hela raden är noninteractive.
   Padding på top/bottom/left behålls för träffyta + avstånd från meta-text;
   right = 0 så ikonen står emot radens högerkant. */
.add-article__remove {
  background: none;
  border: none;
  padding: var(--ica-spacing-md) 0 var(--ica-spacing-md) var(--ica-spacing-md);
  color: var(--ica-red-hover);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
}

.add-article__remove:hover {
  color: var(--ica-red);
}

/* Cellintern layout — undantag från no-padding-regeln */
.dt-cell--status {
  display: flex;
  align-items: center;
  column-gap: var(--ica-spacing-sm);
}

.dt-cell--chevron {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  color: var(--ica-red-hover);
}

/* Tom-state inom listan: visuell centrering — undantag från no-padding-regeln */
.list-empty {
  padding: var(--ica-spacing-xl) var(--ica-spacing-md);
  text-align: center;
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

/* ─────────────────────────────────────────────────────
   Lägg till artiklar — wide dialog med 2-kolumns layout
   ───────────────────────────────────────────────────── */

/* Container — flex column så cols-raden fyller och actions sticky-bar
   pushas till botten via margin-top: auto. Page-bg-tonen syns mellan
   kolumnerna och bakom korten (matchar Figma). */
.add-article {
  display: flex;
  flex-direction: column;
  min-height: 100%;
  background: var(--ica-bg-page);
}

/* Cols-rad — flex grow så att korten fyller all utrymme mellan header
   och sticky actions-bar. Padding ger luft från dialogens kanter. */
.add-article__cols {
  flex: 1;
  display: flex;
  gap: var(--ica-spacing-xl);
  padding: var(--ica-spacing-md) var(--ica-spacing-xl);
  min-height: 0;
}

.add-article__col {
  display: flex;
  flex-direction: column;
  min-height: 0;
}

.add-article__col--wide {
  flex: 1;
  min-width: 0;
}

.add-article__col--narrow {
  width: 25rem; /* ~405px från Figma */
  flex-shrink: 0;
}

/* H3-typografi för "Sök artiklar" / "Valda" — matchar Figma 20px ICARubrik
   medium. Padding ger plats mellan rubrik och kortet under. */
.add-article__heading {
  font-family: 'ICARubrik', sans-serif;
  font-weight: 500;
  font-size: 1.25rem;
  line-height: 1.75rem;
  color: var(--ica-text);
  padding: var(--ica-spacing-md) 0;
  margin: 0;
}

/* Kortet i varje kolumn — fyller resterande höjd, scrollar internt
   när raderna inte ryms. */
.add-article__card {
  flex: 1;
  min-height: 0;
  overflow: auto;
  display: flex;
  flex-direction: column;
}

/* Sökfält + filter-knapp högst upp i sök-kolumnens kort. */
.add-article__search-bar {
  flex-shrink: 0;
  border-bottom: 1px solid var(--ica-border);
}

.add-article__search-bar mb-ica-filter {
  --IcaFilter--padding: 0;
}

/* Aktiv filter-chip-rad — visas under sökfältet när minst ett filter är aktivt.
   "Rensa"-länken är custom HTML eftersom mb-ica-filter inte exponerar
   text-actions — undantag från no-padding-regeln (intern layout). */
.add-article__active-filters {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: var(--ica-spacing-sm);
  padding: 0 var(--ica-spacing-md);
  border-bottom: 1px solid var(--ica-border);
}

.add-article__active-filters mb-ica-filter {
  --IcaFilter--padding: 0;
  flex: 1;
  min-width: 0;
}

.add-article__clear-link {
  flex-shrink: 0;
  background: none;
  border: none;
  color: var(--ica-red);
  font-family: 'ICATextNy', sans-serif;
  font-size: 0.875rem;
  font-weight: 700;
  cursor: pointer;
  padding: var(--ica-spacing-sm) 0;
}

/* Vertikal divider mellan kolumnerna — undantag från no-padding-regeln
   eftersom det är en visuell separator, inte en wrapper. */
.add-article__divider {
  width: 1px;
  background: var(--ica-border);
  flex-shrink: 0;
}

/* Empty state-centrering — undantag från no-padding-regeln. */
.add-article__empty {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--ica-spacing-xl) var(--ica-spacing-md);
}

/* Sticky bottom-bar med Avbryt + Spara — högerjusterade, auto-bredd.
   Vit platta + topp-linje skiljer från innehåll bakom. Samma mönster
   som FormView's sticky-actions. */
.add-article__actions {
  position: sticky;
  bottom: 0;
  z-index: 1;
  display: flex;
  justify-content: flex-end;
  gap: var(--ica-spacing-sm);
  padding: var(--ica-spacing-md);
  background: var(--ica-bg);
  border-top: 1px solid var(--ica-border);
}
</style>

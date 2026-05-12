<template>
  <!--
    MALL: Artikelkort — detaljvy som öppnas vid klick på rad i DataTableView.
    Får artikel-objektet som prop. Mock-värden för fält som inte finns i
    rad-modellen (Senast, Nästa, Marg, Inköp osv).
  -->
  <div class="article-view">
    <!--
      Page-header och tabs ligger ovanför layout-two-columns (som bara används
      för Pris-tabbens master/detail). Page-header får 1336px bredd via
      .article-view__top-wrapper som matchar layout-two-columns max-width.
    -->
    <div class="article-view__top">
      <mb-ica-page-header
        backlabel="Sök"
        @leftactionclick="$emit('navigate', 'data-table')"
      >
        <div slot="heading" class="ah">
          <img
            :src="article?.image"
            :alt="article?.title"
            class="ah__thumb"
          />
          <div class="ah__texts">
            <h1 class="ah__title">{{ article?.title || 'Artikel' }}</h1>
            <p class="ah__subtitle">{{ article?.subtitle }} · {{ article?.supplier }}</p>
            <p class="ah__subtitle">{{ article?.articleNr }}</p>
          </div>
        </div>

        <button slot="left" class="ah__carousel" aria-label="Föregående artikel">
          <mb-ica-icon-angle-left />
        </button>
        <button slot="right" class="ah__carousel" aria-label="Nästa artikel">
          <mb-ica-icon-angle-right />
        </button>
      </mb-ica-page-header>

      <mb-ica-card class="article-view__tabs-card">
        <mb-ica-segmented-control
          fullwidth
          :tabs='JSON.stringify(tabs)'
          :selected="selectedTab"
          @change="onTabClick"
        ></mb-ica-segmented-control>
      </mb-ica-card>
    </div>

    <div class="article-view__main">

      <!-- Innehåll baserat på vald tab -->
      <div v-if="selectedTab === 'oversikt'" class="article-view__body">
        <!-- VÄNSTER: Dashboard-kort -->
        <div class="article-view__left">
        <div class="article-cards">
          <!-- Varuförsörjning-kort -->
          <mb-ica-card nogutters class="article-card">
            <span slot="heading" class="article-card__title">Varuförsörjning</span>
            <a slot="action" href="#" class="article-card__more" @click.prevent>Visa mer</a>

            <div class="article-card__row">
              <div class="article-card__left">
                <div class="article-card__big">
                  <span class="article-card__big-num">{{ stockAmount }}</span>
                  <span class="article-card__big-suffix">st i lager</span>
                </div>
                <div class="article-card__status">
                  <mb-ica-color-indicator theme="success" style="display:inline-flex;" />
                  <span class="article-card__status-text">Automatisk</span>
                </div>
              </div>
              <div class="article-card__keyvalues">
                <mb-ica-key-value keytext="Senast" valuetext="26,55 /st" />
                <mb-ica-key-value keytext="Nästa" valuetext="6,40 / 19,41%" />
              </div>
            </div>
          </mb-ica-card>

          <!-- Pris-kort -->
          <mb-ica-card nogutters class="article-card">
            <span slot="heading" class="article-card__title">Pris</span>
            <a slot="action" href="#" class="article-card__more" @click.prevent>Visa mer</a>

            <div class="article-card__row">
              <div class="article-card__left">
                <div class="article-card__big">
                  <span class="article-card__big-num">{{ priceWhole }}</span>
                  <span class="article-card__big-num article-card__big-num--small">{{ priceDecimal }}</span>
                  <span class="article-card__big-suffix">/st</span>
                </div>
                <div class="article-card__info">
                  <mb-ica-icon-info class="article-card__info-icon" />
                  <span>Lägst pris senaste 30 dagar: <strong>36.60</strong></span>
                </div>
              </div>
              <div class="article-card__keyvalues">
                <mb-ica-key-value keytext="Inköp" valuetext="26,55 /st" />
                <mb-ica-key-value keytext="Marg" valuetext="6,40 / 19,41%" />
              </div>
            </div>
          </mb-ica-card>
        </div>
      </div>

      <!-- HÖGER: Action-grid (7 actions i 2-kolumner) -->
      <div class="article-actions">
        <button class="action-card" @click="onAction('svinn')">
          <mb-ica-icon-trash class="action-card__icon" />
          <span class="action-card__label">Registrera svinn</span>
        </button>
        <button class="action-card" @click="onAction('internkop')">
          <mb-ica-icon-home-delivery class="action-card__icon" />
          <span class="action-card__label">Internköp</span>
        </button>
        <button class="action-card" @click="onAction('datumkontroll')">
          <mb-ica-icon-weekly-plan class="action-card__icon" />
          <span class="action-card__label">Datumkontroll</span>
        </button>
        <button class="action-card" @click="onAction('brytlista')">
          <mb-ica-icon-shopping-list class="action-card__icon" />
          <span class="action-card__label">Brytlista</span>
        </button>
        <button class="action-card" @click="onAction('planogram')">
          <mb-ica-icon-grid-analysis class="action-card__icon" />
          <span class="action-card__label">Planogram</span>
        </button>
        <button class="action-card" @click="onAction('skapa-som')">
          <mb-ica-icon-copy class="action-card__icon" />
          <span class="action-card__label">Skapa som</span>
        </button>
        <button class="action-card action-card--full" @click="onAction('remove')">
          <mb-ica-icon-remove-article class="action-card__icon" />
          <span class="action-card__label">Ta bort artikel</span>
        </button>
      </div>
    </div>

    <!-- PRIS-tab — egen nested layout-two-columns för master/detail -->
    <mb-ica-layout-two-columns v-else-if="selectedTab === 'pris'" class="pris-layout">
      <div slot="main" class="pris-tab__left">
        <!-- ── Butik ─────────────────────────────────────── -->
        <mb-ica-segment heading="Butik">
          <mb-ica-card-row
            class="price-row"
            :active="selectedPriceId === 'butik-ord'"
            chevron
            @click="onPriceRowClick('butik-ord')"
          >
            <div class="price-row__inner">
              <div class="price-row__main">
                <span class="price-row__label">Ordinarie</span>
                <span class="price-row__price"><strong>12.<sup>90</sup></strong><span class="price-row__unit">/st inkl. pant</span></span>
                <span class="price-row__label price-row__label--small">Rek. pris</span>
                <span class="price-row__rec">11,90/st inkl. pant</span>
              </div>
              <div class="price-row__kvs">
                <mb-ica-key-value keytext="Inköp" valuetext="5,12 /st"></mb-ica-key-value>
                <mb-ica-key-value keytext="Marg" valuetext="8,51kr / 68,51%"></mb-ica-key-value>
                <mb-ica-key-value keytext="Inköp" valuetext="5,12 /st"></mb-ica-key-value>
                <mb-ica-key-value keytext="Marg" valuetext="5,51kr / 51,81%"></mb-ica-key-value>
              </div>
              <div class="price-row__indicators">
                <span class="price-row__indicator">
                  <mb-ica-icon-price-basket></mb-ica-icon-price-basket>
                  <span>Superkorgen</span>
                </span>
                <span class="price-row__indicator">
                  <mb-ica-icon-offer></mb-ica-icon-offer>
                  <span>Ingår i 1 erbjudande</span>
                </span>
              </div>
            </div>
          </mb-ica-card-row>

          <mb-ica-card-row
            class="price-row"
            chevron
            @click="onPriceRowClick('butik-erb')"
          >
            <div class="price-row__inner">
              <div class="price-row__main">
                <span class="price-row__label">Erbjudande till 10 mars</span>
                <span class="price-row__price price-row__price--accent"><strong>9:-</strong><span class="price-row__unit">/st inkl. pant</span></span>
                <div class="price-row__tags">
                  <mb-ica-tag text="Stammispris" type="pill" background="#FFD37A"></mb-ica-tag>
                  <span class="price-row__central">Centralt</span>
                </div>
              </div>
              <div class="price-row__kvs">
                <mb-ica-key-value keytext="Inköp" valuetext="5,12 /st"></mb-ica-key-value>
                <mb-ica-key-value keytext="Marg" valuetext="3,88kr / 47,70%"></mb-ica-key-value>
              </div>
            </div>
          </mb-ica-card-row>
        </mb-ica-segment>

        <!-- ── E-handel ──────────────────────────────────── -->
        <mb-ica-segment heading="E-handel">
          <mb-ica-card-row
            class="price-row"
            chevron
            @click="onPriceRowClick('eh-ord')"
          >
            <div class="price-row__inner">
              <div class="price-row__main">
                <span class="price-row__label">Ordinarie</span>
                <span class="price-row__price"><strong>12.<sup>50</sup></strong><span class="price-row__unit">/st inkl. pant</span></span>
              </div>
              <div class="price-row__kvs">
                <mb-ica-key-value keytext="Inköp" valuetext="6,80 /st"></mb-ica-key-value>
                <mb-ica-key-value keytext="Marg" valuetext="5,80kr / 37,53%"></mb-ica-key-value>
              </div>
            </div>
          </mb-ica-card-row>

          <mb-ica-card-row
            class="price-row"
            chevron
            @click="onPriceRowClick('eh-erb')"
          >
            <div class="price-row__inner">
              <div class="price-row__main">
                <span class="price-row__label">Erbjudande till 10 mars</span>
                <span class="price-row__price price-row__price--accent"><strong>11:-</strong><span class="price-row__unit">/st inkl. pant</span></span>
                <div class="price-row__tags">
                  <mb-ica-tag text="Stammispris" type="pill" background="#FFD37A"></mb-ica-tag>
                  <span class="price-row__central">Centralt</span>
                </div>
              </div>
              <div class="price-row__kvs">
                <mb-ica-key-value keytext="Inköp" valuetext="9,02 /st"></mb-ica-key-value>
                <mb-ica-key-value keytext="Marg" valuetext="0,48kr / 21,70%"></mb-ica-key-value>
              </div>
            </div>
          </mb-ica-card-row>
        </mb-ica-segment>

        <!-- ── Pronto ────────────────────────────────────── -->
        <mb-ica-segment heading="Pronto">
          <mb-ica-card-row
            class="price-row"
            chevron
            @click="onPriceRowClick('pronto-ord')"
          >
            <div class="price-row__inner">
              <div class="price-row__main">
                <span class="price-row__label">Ordinarie</span>
                <span class="price-row__price"><strong>15.<sup>95</sup></strong><span class="price-row__unit">/st inkl. pant</span></span>
              </div>
              <div class="price-row__kvs">
                <mb-ica-key-value keytext="Inköp" valuetext="7,80 /st"></mb-ica-key-value>
                <mb-ica-key-value keytext="Marg" valuetext="7,96kr / 65,53%"></mb-ica-key-value>
              </div>
            </div>
          </mb-ica-card-row>
        </mb-ica-segment>

        <!-- ── Erbjudandehantering ───────────────────────── -->
        <mb-ica-segment heading="Erbjudandehantering">
          <mb-ica-card-row accent class="offer-row" @click="onAction('offer-add-existing')">
            <span class="offer-row__inner">
              <mb-ica-icon-plus-circle class="offer-row__icon"></mb-ica-icon-plus-circle>
              <span>Lägg till i befintligt erbjudande</span>
            </span>
          </mb-ica-card-row>
          <mb-ica-card-row accent class="offer-row" @click="onAction('offer-create-new')">
            <span class="offer-row__inner">
              <mb-ica-icon-plus-circle class="offer-row__icon"></mb-ica-icon-plus-circle>
              <span>Skapa nytt erbjudande</span>
            </span>
          </mb-ica-card-row>
        </mb-ica-segment>
      </div>

      <!-- Höger: Redigera pris-panel i layoutens sidebar-slot -->
      <div slot="sidebar" class="edit-panel">
        <mb-ica-header
          variant="panel"
          heading="Redigera pris"
        ></mb-ica-header>

        <div class="edit-panel__moms">
          <mb-ica-icon-shield class="edit-panel__moms-icon"></mb-ica-icon-shield>
          <span class="edit-panel__moms-label">Momspris (start 2026-04-10)</span>
          <span class="edit-panel__moms-value">12.45</span>
          <mb-ica-icon-info class="edit-panel__moms-info"></mb-ica-icon-info>
        </div>

        <mb-ica-card class="edit-panel__card" nogutters>
          <mb-ica-card-row noninteractive class="edit-row">
            <div class="edit-row__inner">
              <div class="edit-row__text">
                <span class="edit-row__title">Ordinarie pris kr</span>
                <span class="edit-row__sub">(aktiverat 2026-02-09)</span>
              </div>
              <mb-ica-input-table
                label="Pris"
                :value="editValues.ordinarie"
                @change="e => editValues.ordinarie = e.target.value"
              ></mb-ica-input-table>
              <button class="edit-row__menu" aria-label="Fler val" @click.stop>
                <mb-ica-icon-more-vertical></mb-ica-icon-more-vertical>
              </button>
            </div>
          </mb-ica-card-row>
          <div class="edit-panel__sub-kv">
            <span>Rek, ordinarie pris kr (start 2025-04-08)</span>
            <span>14.90</span>
          </div>

          <mb-ica-card-row noninteractive class="edit-row">
            <div class="edit-row__inner">
              <div class="edit-row__text">
                <span class="edit-row__title">Inköpspris kr</span>
                <span class="edit-row__sub">(aktiverat 2026-02-09)</span>
              </div>
              <mb-ica-input-table
                label="Inköpspris"
                :value="editValues.inkop"
                @change="e => editValues.inkop = e.target.value"
              ></mb-ica-input-table>
              <button class="edit-row__menu" aria-label="Fler val" @click.stop>
                <mb-ica-icon-more-vertical></mb-ica-icon-more-vertical>
              </button>
            </div>
          </mb-ica-card-row>
          <div class="edit-panel__sub-kv">
            <span>Gällande inköpspris prislista kr (start 2026-04-08)</span>
            <span>14.90</span>
          </div>
        </mb-ica-card>

        <mb-ica-card class="edit-panel__card" nogutters>
          <mb-ica-card-row noninteractive class="edit-row">
            <div class="edit-row__inner">
              <div class="edit-row__text">
                <span class="edit-row__title">Marginal</span>
              </div>
              <span class="edit-row__value">4,07kr / 17,58 %</span>
            </div>
          </mb-ica-card-row>
          <div class="edit-panel__sub-kv">
            <span>Marginal (gällande prislista och rek. ord pris)</span>
            <span>11,11 kr / 36,70%</span>
          </div>
        </mb-ica-card>
      </div>

      <mb-ica-button
        slot="sidebar-buttons"
        text="Aktivera nu"
        variation="secondary"
        fullwidth
        @click="onAction('activate-now')"
      ></mb-ica-button>
      <mb-ica-button
        slot="sidebar-buttons"
        text="Aktivera senare"
        variation="secondary"
        fullwidth
        @click="onAction('activate-later')"
      ></mb-ica-button>
    </mb-ica-layout-two-columns>

    <!-- Andra tabs: placeholder -->
    <div v-else class="article-view__placeholder">
      <mb-ica-placeholder
        :heading="placeholderHeading"
        text="Inte byggd än."
        align="center"
      >
        <mb-ica-icon-info></mb-ica-icon-info>
      </mb-ica-placeholder>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  article: {
    type: Object,
    default: () => null,
  },
})

defineEmits(['navigate'])

// ── Tabs ────────────────────────────────────────────────
const tabs = [
  { id: 'oversikt', title: 'Översikt' },
  { id: 'lonsamhet', title: 'Lönsamhet' },
  { id: 'varuforsorjning', title: 'Varuförsörjning' },
  { id: 'pris', title: 'Pris' },
  { id: 'info', title: 'Info' },
  { id: 'etikett', title: 'Etikett' },
]

const selectedTab = ref('oversikt')

function onTabClick(e) {
  selectedTab.value = e.detail.id
}

const placeholderHeading = computed(() => {
  const tab = tabs.find(t => t.id === selectedTab.value)
  return tab?.title || ''
})

// ── Mock-värden för fält som inte finns i tabellens rad-modell ───
// Lager: läs från article.stock om finns ("14 st" → "14"), annars hardkoda
const stockAmount = computed(() => {
  if (!props.article?.stock) return '50'
  const m = props.article.stock.match(/^(\d+)/)
  return m ? m[1] : '50'
})

// Pris: dela upp på heltal och decimal för stylad rendering
// "32,90" → priceWhole = "32", priceDecimal = ",90"
const priceWhole = computed(() => {
  if (!props.article?.price) return '36'
  const [whole] = props.article.price.split(',')
  return whole
})
const priceDecimal = computed(() => {
  if (!props.article?.price) return ',90'
  const [, decimal] = props.article.price.split(',')
  return decimal ? `,${decimal}` : ''
})

// ── Pris-tab state ──────────────────────────────────────
const selectedPriceId = ref('butik-ord') // första raden förvald per Figma
const editValues = ref({
  ordinarie: '12.90',
  inkop: '9.90',
})

function onPriceRowClick(id) {
  selectedPriceId.value = id
  console.log('[ArticleView] price row clicked:', id)
}

// ── Handlers ────────────────────────────────────────────
function onAction(id) {
  // Hookpunkt — byt mot riktiga actions i en kopia av mallen.
  // T.ex. öppna dialoger för svinn-registrering, skicka API-call för internköp, etc.
  console.log('[ArticleView] action clicked:', id)
}
</script>

<style scoped>
.article-view {
  --IcaLayoutTwoColumns--column-height: 100%;
  display: flex;
  flex-direction: column;
  height: calc(100vh - 48px);
}

/* Page-header + tabs och tab-innehåll centreras till 1336px
   (samma max-bredd som layout-two-columns: 85rem - 24px gutters). */
.article-view__top {
  flex: 0 0 auto;
  max-width: 85rem;
  margin: 0 auto;
  padding: 0 12px;
  width: 100%;
}

.article-view__main {
  flex: 1 1 auto;
  min-height: 0;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  max-width: 85rem;
  margin: 0 auto;
  padding: 0 12px;
  width: 100%;
}

.pris-layout {
  flex: 1 1 auto;
  min-height: 0;
}

.article-view__placeholder {
  flex: 1 1 auto;
  min-height: 0;
  overflow: auto;
}

/* ── Header ─────────────────────────────────────────── */

.ah {
  display: flex;
  align-items: center;
  gap: var(--ica-spacing-md);
  flex: 1;
  min-width: 0;
}

.ah__thumb {
  width: 76px;
  height: 76px;
  flex-shrink: 0;
  border-radius: 4px;
  object-fit: contain;
  background: var(--ica-bg);
}

.ah__texts {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.ah__title {
  font-family: 'ICARubrik', sans-serif;
  font-weight: 700;
  font-size: 2rem;
  line-height: 2rem;
  color: var(--ica-text);
  margin: 0;
}

.ah__subtitle {
  font-family: 'ICATextNy', sans-serif;
  font-size: 1rem;
  line-height: 1.125rem;
  color: var(--ica-text-secondary);
  margin: 0;
}

/* Carousel-knappar i page-headers left/right-slots — runda röda. */
.ah__carousel {
  background: var(--ica-red);
  color: var(--ica-bg);
  border: none;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 1rem;
}
.ah__carousel:hover {
  background: var(--ica-red-hover);
}

/* ── Tabs ───────────────────────────────────────────── */

.article-view__tabs-card {
  display: block;
  margin: 0 0 var(--ica-spacing-md);
}

/* ── Body layout (Översikt-tab) ────────────────────── */

.article-view__body {
  flex: 1 1 auto;
  min-height: 0;
  overflow: auto;
  display: flex;
  gap: var(--ica-spacing-md);
  padding: var(--ica-spacing-md);
}

.article-view__left {
  flex: 1;
  min-width: 0;
}

.article-cards {
  display: flex;
  gap: var(--ica-spacing-md);
}

/* ── Dashboard-kort ─────────────────────────────────── */

.article-card {
  flex: 1;
  min-width: 0;
}

.article-card__title {
  font-family: 'ICATextNy', sans-serif;
  font-weight: 900;
  font-size: 1rem;
  line-height: 1.5rem;
  color: var(--ica-text);
}

.article-card__more {
  font-family: 'ICATextNy', sans-serif;
  font-weight: 700;
  font-size: 1rem;
  line-height: 1.5rem;
  color: var(--ica-red-hover);
  text-decoration: none;
  cursor: pointer;
  white-space: nowrap;
}

.article-card__row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: var(--ica-spacing-md);
  padding: var(--ica-spacing-sm) var(--ica-spacing-md) var(--ica-spacing-md);
}

.article-card__left {
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 0;
}

.article-card__big {
  display: flex;
  align-items: baseline;
  gap: var(--ica-spacing-xs);
}

.article-card__big-num {
  font-family: 'ICARubrik', sans-serif;
  font-weight: 900;
  font-size: 2.5rem;
  line-height: 2.5rem;
  color: var(--ica-text);
}

.article-card__big-num--small {
  font-size: 1.25rem;
  line-height: 1.625rem;
}

.article-card__big-suffix {
  font-family: 'ICATextNy', sans-serif;
  font-weight: 400;
  font-size: 0.875rem;
  line-height: 1.25rem;
  color: var(--ica-text);
}

.article-card__status {
  display: flex;
  align-items: center;
  gap: var(--ica-spacing-xs);
}

.article-card__status-text {
  font-family: 'ICATextNy', sans-serif;
  font-weight: 700;
  font-size: 0.875rem;
  line-height: 1.25rem;
  color: var(--ica-text);
}

.article-card__keyvalues {
  display: flex;
  flex-direction: column;
  gap: 2px;
  flex-shrink: 0;
}

.article-card__info {
  display: flex;
  align-items: flex-start;
  gap: var(--ica-spacing-xs);
  font-family: 'ICATextNy', sans-serif;
  font-size: 0.875rem;
  line-height: 1.25rem;
  color: var(--ica-text);
}

.article-card__info-icon {
  font-size: 1.25rem;
  flex-shrink: 0;
  color: var(--ica-text-secondary);
}

/* ── Action-grid ────────────────────────────────────── */

.article-actions {
  width: 21.25rem; /* ~340px */
  flex-shrink: 0;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--ica-spacing-sm);
}

.action-card {
  background: var(--ica-bg);
  border: 1px solid var(--ica-border);
  border-radius: 4px;
  padding: var(--ica-spacing-md);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--ica-spacing-xs);
  cursor: pointer;
  font-family: inherit;
  transition: background 0.15s ease;
}

.action-card:hover {
  background: var(--ica-subtle);
}

.action-card--full {
  /* "Ta bort artikel" — rad 4 spänner full bredd för symmetri (7 rutor i 2-kol-grid) */
  grid-column: span 2;
}

.action-card__icon {
  font-size: 1.5rem;
  color: var(--ica-red);
}

.action-card__label {
  font-family: 'ICATextNy', sans-serif;
  font-weight: 700;
  font-size: 0.875rem;
  line-height: 1.25rem;
  color: var(--ica-text);
  text-align: center;
}

/* ── Placeholder för icke-byggda tabs ──────────────── */

.article-view__placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--ica-spacing-xl) var(--ica-spacing-md);
  min-height: 20rem;
}

/* ── Pris-tab: vänsterkolumn (höger ligger i layoutens sidebar-slot) ─────────────── */

.pris-tab__left {
  display: flex;
  flex-direction: column;
}

/* ── Prisrad — grid med fyra kolumner: main / kvs / indicators / chevron ── */

.price-row {
  --IcaCardRow--padding: var(--ica-spacing-md);
}

.price-row__inner {
  display: grid;
  grid-template-columns: minmax(180px, 1.4fr) minmax(180px, 1.6fr) auto;
  gap: var(--ica-spacing-md);
  align-items: center;
  width: 100%;
  min-width: 0;
}

.price-row__main {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.price-row__label {
  font-family: 'ICATextNy', sans-serif;
  font-size: 0.875rem;
  line-height: 1.25rem;
  color: var(--ica-text);
}

.price-row__label--small {
  font-size: 0.75rem;
  line-height: 1rem;
  color: var(--ica-text-secondary);
  margin-top: var(--ica-spacing-xs);
}

.price-row__price {
  font-family: 'ICARubrik', sans-serif;
  font-size: 1.5rem;
  line-height: 1.75rem;
  color: var(--ica-text);
  display: inline-flex;
  align-items: baseline;
  gap: 4px;
}

.price-row__price strong {
  font-weight: 900;
  font-size: 2rem;
  line-height: 2rem;
}

.price-row__price strong sup {
  font-size: 1.125rem;
  vertical-align: super;
  font-weight: 900;
}

.price-row__price--accent {
  color: var(--ica-red);
}

.price-row__price--accent strong {
  color: var(--ica-red);
}

.price-row__unit {
  font-family: 'ICATextNy', sans-serif;
  font-size: 0.75rem;
  line-height: 1rem;
  color: var(--ica-text);
  font-weight: 400;
}

.price-row__rec {
  font-family: 'ICATextNy', sans-serif;
  font-size: 0.875rem;
  line-height: 1.25rem;
  color: var(--ica-text);
}

.price-row__tags {
  display: flex;
  align-items: center;
  gap: var(--ica-spacing-sm);
  margin-top: var(--ica-spacing-xs);
}

.price-row__central {
  font-family: 'ICATextNy', sans-serif;
  font-size: 0.875rem;
  color: var(--ica-text);
}

.price-row__kvs {
  display: grid;
  grid-template-columns: auto auto;
  column-gap: var(--ica-spacing-xl);
  row-gap: 4px;
  align-items: start;
  min-width: 0;
}

.price-row__indicators {
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-family: 'ICATextNy', sans-serif;
  font-size: 0.875rem;
  line-height: 1.25rem;
  color: var(--ica-text);
  white-space: nowrap;
}

.price-row__indicator {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.price-row__indicator [class*='mb-ica-icon'],
.price-row__indicator mb-ica-icon-price-basket,
.price-row__indicator mb-ica-icon-offer {
  font-size: 1rem;
  color: var(--ica-text);
}

/* ── Erbjudandehantering-rader ──────────────────────── */

.offer-row {
  --IcaCardRow--padding: var(--ica-spacing-md);
}

.offer-row__inner {
  display: inline-flex;
  align-items: center;
  gap: var(--ica-spacing-sm);
  font-family: 'ICATextNy', sans-serif;
  font-weight: 700;
  font-size: 1rem;
}

.offer-row__icon {
  font-size: 1.25rem;
  color: var(--ica-red);
}

/* ── Höger panel: Redigera pris (i layoutens sidebar-slot) ─────────── */

.edit-panel__moms {
  display: flex;
  align-items: center;
  gap: var(--ica-spacing-sm);
  background: var(--ica-subtle);
  padding: var(--ica-spacing-sm) var(--ica-spacing-md);
  font-family: 'ICATextNy', sans-serif;
  font-size: 0.875rem;
}

.edit-panel__moms-icon {
  font-size: 1rem;
  color: var(--ica-text-secondary);
}

.edit-panel__moms-label {
  flex: 1;
  color: var(--ica-text);
}

.edit-panel__moms-value {
  font-weight: 700;
  color: var(--ica-text);
}

.edit-panel__moms-info {
  font-size: 1rem;
  color: var(--ica-text-secondary);
}

.edit-panel__card {
  margin-top: var(--ica-spacing-md);
}

.edit-row {
  --IcaCardRow--grid-template-columns: 1fr;
}

.edit-row__inner {
  display: flex;
  align-items: center;
  gap: var(--ica-spacing-sm);
  width: 100%;
}

.edit-row__text {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.edit-row__inner mb-ica-input-table {
  margin-left: auto;
  flex: 0 0 auto;
}

.edit-row__title {
  font-family: 'ICATextNy', sans-serif;
  font-weight: 700;
  font-size: 0.875rem;
  line-height: 1.25rem;
  color: var(--ica-text);
}

.edit-row__sub {
  font-family: 'ICATextNy', sans-serif;
  font-size: 0.75rem;
  line-height: 1rem;
  color: var(--ica-text-secondary);
}

.edit-row__value {
  font-family: 'ICATextNy', sans-serif;
  font-weight: 700;
  font-size: 0.875rem;
  color: var(--ica-text);
  white-space: nowrap;
}

.edit-row__menu {
  background: none;
  border: none;
  padding: var(--ica-spacing-xs);
  cursor: pointer;
  color: var(--ica-text-secondary);
  display: flex;
  align-items: center;
}

.edit-panel__sub-kv {
  display: flex;
  justify-content: space-between;
  gap: var(--ica-spacing-sm);
  padding: var(--ica-spacing-sm) var(--ica-spacing-md);
  font-family: 'ICATextNy', sans-serif;
  font-size: 0.75rem;
  line-height: 1rem;
  color: var(--ica-text-secondary);
}

</style>

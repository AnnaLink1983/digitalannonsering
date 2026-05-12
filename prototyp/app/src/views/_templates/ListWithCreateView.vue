<template>
  <!--
    MALL: Lista av sparade items med "Skapa"-action i page-header som öppnar
    en dialog med formulär. Klick på en rad öppnar samma dialog med
    förifyllda värden för redigering. Avbryt lämnar listan oförändrad.

    Single source of truth: `notes`-arrayen. `form` är en kopia som flyttas
    in/ut ur arrayen vid spar.
  -->
  <mb-ica-layout-two-columns nosidebar class="lwc-layout">
    <mb-ica-page-header
      slot="header"
      heading="Anteckningar"
      backlabel="Tillbaka"
      :actions='JSON.stringify([
        { icon: "plus", label: "Skapa", id: "create" }
      ])'
      @leftactionclick="$emit('navigate', 'menu')"
      @rightactionclick="onHeaderAction"
    ></mb-ica-page-header>

    <div slot="main" class="lwc-main">
      <template v-if="notes.length > 0">
        <mb-ica-segment heading="SPARADE ANTECKNINGAR">
          <mb-ica-card-row
            v-for="note in notes"
            :key="note.id"
            chevron
            @click="openEdit(note)"
          >
            <mb-ica-meta
              :heading="note.title"
              :subheading="formatSubheading(note)"
              :text="note.description || '—'"
            />
          </mb-ica-card-row>
        </mb-ica-segment>
      </template>

      <div v-else class="lwc-empty">
        <mb-ica-placeholder
          text="Inga anteckningar än"
          align="center"
        >
          <p slot="content">Klicka på <strong>Skapa</strong> i headern för att lägga till din första anteckning.</p>
          <mb-ica-icon-view-list />
        </mb-ica-placeholder>
      </div>
    </div>
  </mb-ica-layout-two-columns>

  <!--
    Dialog för skapa/redigera. Teleport till body så stacking context
    inte klipper overlay/backdrop.
  -->
  <Teleport to="body">
    <mb-ica-dialog :open="dialogOpen" snaptotop @close="closeDialog">
      <mb-ica-header
        slot="header"
        variant="dialog"
        :heading="isEditing ? 'Redigera anteckning' : 'Ny anteckning'"
        leftaction="close"
        @leftactionclick="closeDialog"
      ></mb-ica-header>

      <mb-ica-segment heading="GRUNDUPPGIFTER">
        <mb-ica-input
          label="Titel"
          :value="form.title"
          @input="e => form.title = e.target.value"
        ></mb-ica-input>

        <mb-ica-input
          label="Beskrivning"
          :value="form.description"
          @input="e => form.description = e.target.value"
        ></mb-ica-input>
      </mb-ica-segment>

      <mb-ica-segment heading="ANSVAR">
        <mb-ica-input
          label="Ansvarig"
          :value="form.assignee"
          @input="e => form.assignee = e.target.value"
        ></mb-ica-input>

        <mb-ica-input
          label="Avdelning"
          :value="form.department"
          @input="e => form.department = e.target.value"
        ></mb-ica-input>
      </mb-ica-segment>

      <mb-ica-segment heading="VAL">
        <mb-ica-card-row noninteractive>
          <mb-ica-checkbox
            :checked="form.notify"
            @change="form.notify = !form.notify"
          >
            <mb-ica-meta heading="Skicka påminnelse" text="Notis när anteckningen blir aktuell" />
          </mb-ica-checkbox>
        </mb-ica-card-row>

        <mb-ica-card-row noninteractive>
          <mb-ica-checkbox
            :checked="form.shareWithTeam"
            @change="form.shareWithTeam = !form.shareWithTeam"
          >
            <mb-ica-meta heading="Dela med teamet" text="Synlig för alla i butiken" />
          </mb-ica-checkbox>
        </mb-ica-card-row>
      </mb-ica-segment>

      <mb-ica-button
        slot="buttons"
        :text="isEditing ? 'Spara ändringar' : 'Spara'"
        variation="primary"
        fullwidth
        :loading="saving"
        :hasloader="saving"
        :disabled="!isValid || saving"
        @click="onSave"
      ></mb-ica-button>
      <mb-ica-button
        slot="buttons"
        text="Avbryt"
        variation="secondary"
        fullwidth
        @click="closeDialog"
      ></mb-ica-button>
    </mb-ica-dialog>
  </Teleport>
</template>

<script setup>
import { ref, computed } from 'vue'

defineEmits(['navigate'])

// ── Sparade anteckningar (single source of truth) ──────
const notes = ref([])

// ── Dialog-state ────────────────────────────────────────
const dialogOpen = ref(false)
const editingId = ref(null) // null = skapa, annars = id på den anteckning som redigeras
const saving = ref(false)

const blankForm = () => ({
  title: '',
  description: '',
  assignee: '',
  department: '',
  notify: true,
  shareWithTeam: false,
})

const form = ref(blankForm())

// ── Computed ────────────────────────────────────────────
const isEditing = computed(() => editingId.value !== null)

const isValid = computed(() => form.value.title.trim().length > 0)

// ── Handlers ────────────────────────────────────────────
function onHeaderAction(e) {
  if (e.detail.id === 'create') openCreate()
}

function openCreate() {
  editingId.value = null
  form.value = blankForm()
  dialogOpen.value = true
}

function openEdit(note) {
  editingId.value = note.id
  // Kopiera så att Avbryt lämnar originalet orört
  form.value = { ...note }
  dialogOpen.value = true
}

function closeDialog() {
  dialogOpen.value = false
  editingId.value = null
}

async function onSave() {
  if (!isValid.value) return
  saving.value = true

  // Simulera nätverkscall — byt mot din riktiga submit
  await new Promise(r => setTimeout(r, 400))

  if (isEditing.value) {
    const idx = notes.value.findIndex(n => n.id === editingId.value)
    if (idx >= 0) {
      notes.value[idx] = { ...form.value, id: editingId.value }
    }
  } else {
    const newId = notes.value.length > 0
      ? Math.max(...notes.value.map(n => n.id)) + 1
      : 1
    notes.value.push({ ...form.value, id: newId })
  }

  saving.value = false
  closeDialog()
}

// ── Utils ───────────────────────────────────────────────
function formatSubheading(note) {
  const parts = []
  if (note.assignee) parts.push(note.assignee)
  if (note.department) parts.push(note.department)
  return parts.join(' · ') || '—'
}
</script>

<style scoped>
.lwc-layout {
  --IcaLayoutTwoColumns--column-height: 100vh;
  display: block;
  height: 100vh;
}

.lwc-main {
  overflow: auto;
  height: 100%;
  /* Ingen egen bakgrund — låt page-bg syna igenom så empty-state-placeholder
     visas mot samma ton som resten av appens helbakgrund. */
}

/* Tom-state — undantag från no-padding-regeln (visuell centrering) */
.lwc-empty {
  padding: var(--ica-spacing-xl) var(--ica-spacing-md);
  text-align: center;
}
</style>

import { createApp } from 'vue'
import './style.css'
import App from './App.vue'

// ─────────────────────────────────────────────────────
// ICA Elements — Web Components
//
// Lägg till fler imports HÄR när en vy använder en ny komponent.
// Slå upp i `design-system/components.md`.
// ─────────────────────────────────────────────────────

// Strukturella
import '@ica-elements/IcaHeader.js'
import '@ica-elements/IcaPageHeader.js'
import '@ica-elements/IcaLayoutTwoColumns.js'
import '@ica-elements/IcaDialog.js'
import '@ica-elements/IcaDrawer.js'
import '@ica-elements/IcaSegment.js'
import '@ica-elements/IcaAccordion.js'

// Listor och rader
import '@ica-elements/IcaCardRow.js'
import '@ica-elements/IcaMediaObject.js'
import '@ica-elements/IcaMeta.js'
import '@ica-elements/IcaKeyValue.js'
import '@ica-elements/IcaTable.js'

// Knappar
import '@ica-elements/IcaButton.js'
import '@ica-elements/IcaButtonIcon.js'

// Formulär och input (mall-vyerna använder dessa)
import '@ica-elements/IcaInput.js'
import '@ica-elements/IcaInputSearch.js'
import '@ica-elements/IcaCheckbox.js'

// Filter (mall-vyerna använder dessa)
import '@ica-elements/IcaFilter.js'

// Feedback och status
import '@ica-elements/IcaPlaceholder.js'
import '@ica-elements/IcaColorIndicator.js'

// Ikoner — DesktopNav använder dessa 6 (outlined)
import '@ica-elements/IcaIconHome.js'
import '@ica-elements/IcaIconViewImage.js'
import '@ica-elements/IcaIconRate.js'
import '@ica-elements/IcaIconAlarm.js'
import '@ica-elements/IcaIconUserInternet.js'
import '@ica-elements/IcaIconPlay.js'

// Övriga ikoner — utöka när vyer kräver fler
import '@ica-elements/IcaIconSearch.js'
import '@ica-elements/IcaIconAngleRight.js'
import '@ica-elements/IcaIconPlus.js'
import '@ica-elements/IcaIconViewList.js'
import '@ica-elements/IcaIconFindItem.js'
import '@ica-elements/IcaIconTrash.js'

// Ikoner för ArticleView (artikelkort)
import '@ica-elements/IcaIconAngleLeft.js'
import '@ica-elements/IcaIconInfo.js'
import '@ica-elements/IcaIconWeeklyPlan.js'
import '@ica-elements/IcaIconCopy.js'
import '@ica-elements/IcaIconGridAnalysis.js'
import '@ica-elements/IcaIconHomeDelivery.js'
import '@ica-elements/IcaIconShoppingList.js'
import '@ica-elements/IcaIconRemoveArticle.js'

// Pris-tab i ArticleView
import '@ica-elements/IcaTag.js'
import '@ica-elements/IcaInputTable.js'
import '@ica-elements/IcaCard.js'
import '@ica-elements/IcaIconPriceBasket.js'
import '@ica-elements/IcaIconOffer.js'
import '@ica-elements/IcaIconPlusCircle.js'
import '@ica-elements/IcaIconMoreVertical.js'
import '@ica-elements/IcaIconShield.js'

// Vy-komponent för segmented-control (tabbar i ArticleView).
// OBS: filen heter IcaSegmentedControl.js (med "-ed-"), inte IcaSegmentControl.js.
// Taggnamn i HTML är därmed mb-ica-segmented-control.
import '@ica-elements/IcaSegmentedControl.js'

// ICA Elements CSS
import '@ica-elements/fonts.css'
import '@ica-elements/variables.css'
import '@ica-elements/typography-base.css'
import '@ica-elements/typography-text.css'

createApp(App).mount('#app')

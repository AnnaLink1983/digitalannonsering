/**
 * Minimal helper för att mocka async API-anrop i prototypen.
 *
 * Syfte: efterlikna produktionens nätverks-fördröjning så att UI-states
 * (loading, disabled, skeleton) hinner synas i en prototyp.
 *
 * Använd direkt i vy-filen första gången ett mönster uppstår. Flytta
 * först ut till en egen fil under `src/utils/` när en andra vy återanvänder
 * samma mock-logik — innan dess är lokala funktioner snabbare att iterera.
 *
 * Exempel (inuti en view):
 *
 *   import { delay } from '@/utils/mockApi'
 *
 *   const deliveries = ref([])
 *   const loading = ref(false)
 *
 *   async function loadDeliveries() {
 *     loading.value = true
 *     await delay(300)
 *     deliveries.value = [{ id: 'LEV-001', supplier: 'Arla' }]
 *     loading.value = false
 *   }
 *
 * I produktion: ersätt delay-anropet med riktigt fetch/axios/tRPC-call.
 * Hela den här filen kan raderas när prototypen lämnas över.
 */

export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

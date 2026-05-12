<!--
  Stub for shared-components TechnicalError.
  Shows an alert message when state.error is truthy.
  In production: use the real shared-components package.
-->
<script setup>
defineProps({
  state: { type: Object, default: null },
});
</script>

<template>
  <mb-ica-alert-message
    v-if="state?.error"
    alarmtype="error"
    persistencetype="persistent"
    :text="state.msg || 'Ett tekniskt fel har inträffat'"
  />
</template>

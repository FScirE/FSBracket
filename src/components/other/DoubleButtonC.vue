<script setup lang="ts">
import { onMounted, ref } from 'vue';

const props = withDefaults(defineProps<{
  text1: string,
  text2: string,
  type?: "left" | "center" | "right",
  color1?: "primary" | "secondary" | "warning" | "danger" | "success" | "info",
  color2?: "primary" | "secondary" | "warning" | "danger" | "success" | "info",
  callback?: () => void
}>(), {
  type: "center",
  color1: "warning",
  color2: "danger",
  callback: () => {}
})

const confirm = ref<boolean>(false)
const style = ref<any>({})

const timeoutId = ref<number | undefined>()

function onFirstClick() {
  confirm.value = true
  clearTimeout(timeoutId.value)
  timeoutId.value = setTimeout(() => confirm.value = false, 3000)
}
function onConfirmClick() {
  confirm.value = false
  props.callback()
}

onMounted(() => {
  if (props.type === "left")
    style.value = { left: "0" }
  else if (props.type === "center")
    style.value = { left: "50%", transform: "translateX(-50%)" }
  else
    style.value = { left: "100%", transform: "translateX(-100%)" }
})
</script>

<template>
<div class="button-holder">
  <button
    type="button"
    class="remove-button btn"
    :class="[
      `btn-${color1}`,
       { [`text-${color1}`] : confirm }
    ]"
    @click.prevent="onFirstClick">{{ text1 }}</button
  >
  <button
    type="button"
    class="confirm-remove-button btn"
    :class="[
      `btn-${color2}`,
      { ['w-100'] : confirm }
    ]"
    :style="style"
    @click="onConfirmClick" @mouseout="confirm = false">{{ text2 }}</button
  >
</div>
</template>

<style>
.button-holder {
  position: relative;
  overflow: hidden;
  border-radius: 0.25rem;
}
.confirm-remove-button {
  position: absolute;
  overflow: hidden;
  width: 0;
  padding: 0;
  height: 100%;
}
</style>

<template>
  <div class="c-mark-line">
    <div
      v-for="(_, d) in props.marks"
      v-text="d"
      :key="d"
      :style="{
        left: 100 * (d / props.duration) + '%',
        zIndex: state.index,
      }"
      class="c-mark"
      @click="(e) => onTap(d, e)"
    ></div>
  </div>
</template>

<script setup name="CMarkLine">
import { defineExpose, reactive } from "vue";

const state = reactive({
  index: 0,
});

const props = defineProps({
  duration: {
    type: Number,
    default: 1,
    required: true,
  },
  marks: {
    type: Object,
    default: () => {},
  },
  onClick: {
    type: Function,
    default: () => {},
  },
});

const onTap = (duration, evt) => props.onClick({ evt, duration });

defineExpose({});
</script>
<style scoped>
.c-mark-line {
  position: absolute !important;
  height: 0;
  width: 100%;
  left: 0;
  top: -20px;
  z-index: inherit;
}
.c-mark {
  position: absolute !important;
  width: 20px;
  height: 20px;
  transform: translateX(-50%);
  background-color: red;
}
</style>

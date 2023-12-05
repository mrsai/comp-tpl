<template>
  <div class="c-caption">
    <h3 v-if="isIntelligent">已经为您自动生成视频字幕</h3>
    <ul>
      <li
        class="c-caption-line flex items-start"
        v-for="it in captionList"
        :key="it.time"
        @click="onTap(it)"
      >
        <span>[{{ it.time }}]</span>
        <div>{{ it.content }}</div>
      </li>
    </ul>
  </div>
</template>

<script setup name="Ccaption">
import { ref, defineEmits } from "vue";
const isIntelligent = ref(true);
const emits = defineEmits(["on-tap-caption"]);

const captionList = ref([
  {
    time: "11:11:11",
    content: "暂无字幕暂无字幕暂无字幕暂无字幕",
  },
  {
    time: "11:11:12",
    content: "暂无字幕",
  },
  {
    time: "11:11:13",
    content: "暂无字幕",
  },
]);

const onTap = (it) => {
  emits("on-tap-caption", it);
};
</script>
<style scoped>
.c-caption-line {
  gap: 10px;
}
.c-caption-line:hover {
  background-color: #ccc;
  cursor: pointer;
}
</style>

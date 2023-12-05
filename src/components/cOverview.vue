<template>
  <div class="c-overview">
    <el-card>
      <h3 v-text="currentTitle"></h3>
      <div class="c-overview" v-loading="loading" v-text="content"></div>
      <div class="c-overview-create" v-if="!loading">
        <div>学练一题，一键视频出题</div>
        <div>互动答题，提升学生学习效率</div>
        <el-button type="primary">一键出题</el-button>
      </div>
    </el-card>
  </div>
</template>

<script setup name="COverview">
import { computed, defineProps } from "vue";

const props = defineProps({
  step: {
    type: Number,
    default: 0,
  },

  content: {
    type: String,
    default: () => "暂无内容",
  },
});

const stepsText = [
  "正在智能解析视频内容...",
  "正在自动生成字幕...",
  "正在智能分析视频内容...",
  "已为您智能生成视频总结",
];

const loading = computed(() => {
  return props.step < 3;
});

const currentTitle = computed(() => {
  return stepsText[props.step];
});
</script>
<style scoped>
.c-overview {
}
</style>

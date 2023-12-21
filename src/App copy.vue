<template>
  <div id="app">
    <el-slider v-model="scale"> </el-slider>
    <div id="timeline"></div>
  </div>
</template>

<script setup>
import { onMounted, ref, computed, watchEffect } from "vue";
// 最大的格子是 一个格子最大50像素，最小20像素，单位是秒，一个格子代表5s
// 距离20个像素，分配到100%，然后分为三个区域，[0,33.3][33.3,66.6][66.9-100]

const scale = ref(100); // 缩放步长

// 视频时长, 最大 5个小时
// let duration = 7200 * 2.5;
let duration = 3660;
// 1像素3s，10像素30
let conf = {
  second: {
    max: 50,
    min: 30,
    unit: "s",
    time: 5,
    f: 5,
  },

  minite: {
    max: 80,
    min: 30,
    unit: "m",
    time: 120,
    f: 2,
  },
};

const currentUnit = computed(() => {
  if (scale.value > 50) return conf.second;
  return conf.minite;
});

// 传入的时间是 360s,
// 按照最大的计算，
// 格子数

let drawTimeline = null;

watchEffect(() => {
  if (scale.value && drawTimeline) {
    drawTimeline();
  }
});

onMounted(() => {
  const container = document.getElementById("timeline");
  const canvas = document.createElement("canvas");
  container.appendChild(canvas);
  const ctx = canvas.getContext("2d");

  // 按秒来计算
  const computedWithSecond = () => {
    let dis = currentUnit.value.max - currentUnit.value.min;

    let r = scale.value % 50 === 0 ? 50 : scale.value % 50;

    let perGridWidth = currentUnit.value.min + (dis / 50) * r;

    perGridWidth = parseInt(perGridWidth, 10);
    let gridCount = Math.ceil(duration / currentUnit.value.time);
    let canvasWidth = perGridWidth * gridCount;

    return { perGridWidth, gridCount, canvasWidth };
  };

  // 绘制时间刻度尺
  drawTimeline = () => {
    // 根据缩放比例计算时间刻度尺的宽度
    const { perGridWidth, gridCount, canvasWidth } = computedWithSecond();
    canvas.width = canvasWidth;

    ctx.clearRect(0, 0, canvasWidth, 100);

    // 根据缩放比例计算时间刻度尺的宽度
    // 绘制刻度线
    ctx.beginPath();
    ctx.moveTo(0, 40);
    ctx.lineTo(canvasWidth, 40);
    ctx.stroke();

    // 绘制刻度标签
    ctx.fillStyle = "#000";
    ctx.font = "12px Arial";
    ctx.textAlign = "center";
    for (let i = 0; i <= gridCount; i += 1) {
      ctx.fillText(
        i * currentUnit.value.f + currentUnit.value.unit,
        i * perGridWidth,
        10
      );
    }
  };

  // 初始化绘制时间刻度尺
  drawTimeline();
});
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin-top: 60px;
}
canvas {
  border: 1px solid #000;
}
</style>

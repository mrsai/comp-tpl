<template>
  <div id="app">
    <el-slider v-model="scale"> </el-slider>
    <div id="timeline"></div>
  </div>
</template>

<script setup>
import { onMounted, ref, watchEffect } from "vue";
// 最大的格子是 一个格子最大50像素，最小20像素，单位是秒，一个格子代表5s
// 距离20个像素，分配到100%，然后分为三个区域，[0,33.3][33.3,66.6][66.9-100]

const scale = ref(100); // 缩放步长
// 60000像素 3000s
// 视频时长
let duration_total = 1800;
// 1像素3s，10像素30

// 传入的时间是 360s,
// 按照最大的计算，
// 格子数

let drawAll = null;

watchEffect(() => {
  if (scale.value && drawAll) {
    drawAll(scale.value);
  }
});

// if(duration < 1320) {
//   disabled.value = true
// }

onMounted(() => {
  const container = document.getElementById("timeline");
  let conf = {
    second: {
      max: 80, // 格子最大宽度
      min: 40, // 格子最小宽度
      unit: "s", // 单位
      time: 5, // 一个格子代表的时间
      f: 5, // 格式化文本展示时间，
      m: 3600, // 一个canvas最长绘制的时间是3600s
    },

    minite: {
      max: 80,
      min: 40,
      unit: "m",
      time: 60,
      f: 1,
      m: 60, // 一个canvas最长绘制的时间是60分钟
    },
  };
  let currentUnit = {};

  const computedWithSecond = (duration) => {
    // 可升缩的宽度
    let dis = currentUnit.max - currentUnit.min;
    // 50 表示拖拽的值的中间值。计算拖拽修改的是分钟（大于50）区域还是秒钟（小于）区域
    let r = scale.value % 50 === 0 ? 50 : scale.value % 50;
    // 每个格子的宽度，动态调整
    let perGridWidth = currentUnit.min + (dis / 50) * r;
    perGridWidth = parseInt(perGridWidth, 10);
    // 格子数
    let gridCount = Math.ceil(duration / currentUnit.time);
    // duration_total < 3600 假设一个canvas最长绘制的时间是3600s
    // 如果时间太短，则需要重新安排格子的宽度，把容器宽度除以格子个数，计算出格子实际的宽度。
    if (
      perGridWidth * gridCount <= container.offsetWidth &&
      duration_total < 3600
    ) {
      perGridWidth = container.offsetWidth / gridCount;
    }
    // canvas宽度
    let canvasWidth = perGridWidth * gridCount;
    // 计算每个格子的宽度，以及格子的数量，canvas的宽度
    return { perGridWidth, gridCount, canvasWidth };
  };

  let drawTimeline = (ctx, canvas, start, duration) => {
    // 根据缩放比例计算时间刻度尺的宽度
    const { perGridWidth, gridCount, canvasWidth } =
      computedWithSecond(duration);
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
        start * currentUnit.m + i * currentUnit.f + currentUnit.unit,
        i * perGridWidth,
        10
      );
    }
  };

  const create = () => {
    let all = [];
    const cc = Math.ceil(duration_total / 3600);
    for (let i = 0; i < cc; i++) {
      const canvas = document.createElement("canvas");
      container.appendChild(canvas);
      const ctx = canvas.getContext("2d");
      const currentDuration = i === cc - 1 ? duration_total - i * 3600 : 3600;
      all.push({
        canvas,
        ctx,
        currentDuration,
        start: i,
      });
    }
    return all;
  };

  const all = create();
  drawAll = (value) => {
    if (value > 50) {
      currentUnit = conf.second;
    } else {
      currentUnit = conf.minite;
    }
    // 1320 是 容器宽度除以各自数乘以60秒计算出来的
    all.forEach((it) => {
      drawTimeline(it.ctx, it.canvas, it.start, it.currentDuration);
    });
  };

  drawAll(scale.value);
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
#timeline {
  border: 1px solid #000;
  display: flex;
}
</style>

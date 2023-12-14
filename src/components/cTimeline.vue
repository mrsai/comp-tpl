<template>
  <div>
    <div class="c-timeline" id="timeline-container">
      <div id="tracker" class="tracker">
        <div class="pointer" id="pointer">
          <div class="header"></div>
        </div>
      </div>
    </div>
    <!-- <el-button type="primary" @click="update">MOTO</el-button> -->
  </div>
</template>

<script setup name="CTimeLine">
import { onMounted } from "vue";
import MeasureLine from "./measure-line.js";

onMounted(() => {
  const measure = new MeasureLine({
    container: "timeline-container", // 容器
    tracker: "tracker", // 轨道
    pointer: "pointer", // 指针
  });

  measure.on("on-pointer-drag-end", (data) => {
    console.log(data);
  });

  // 选择需要拖拽的元素
  // const draggableElement = document.getElementById("draggable");
  // const zhen = document.getElementById("zhen");
  // const canvas = document.createElement("canvas");
  // const { width } = draggableElement.getBoundingClientRect();
  // canvas.width = width;
  // canvas.height = 20;
  // draggableElement.appendChild(canvas);
  // const ctx = canvas.getContext("2d");
  // function measureNumberWidth(canvas, number, font) {
  //   // 获取 Canvas 2D 上下文
  //   const ctx = canvas.getContext("2d");
  //   // 设置文本样式
  //   ctx.font = font;
  //   // 测量文本宽度
  //   const metrics = ctx.measureText(number);
  //   // 返回文本宽度
  //   return metrics.width;
  // }
  // function drawLine(x1, y1, x2, y2, lineWidth = 1) {
  //   // 开始一段新路径
  //   ctx.beginPath();
  //   // 设置线段颜色
  //   ctx.strokeStyle = "black";
  //   // 设置线段宽度
  //   ctx.lineWidth = lineWidth;
  //   // 将路径起点移到x1,y1
  //   ctx.moveTo(x1 + 0.5, y1);
  //   // 将路径移动到x2,y2
  //   ctx.lineTo(x2 + 0.5, y2);
  //   // 把路径画出来
  //   ctx.stroke();
  // }
  // function drawText(text, x, y, font, color) {
  //   // 设置文本样式
  //   ctx.font = font;
  //   ctx.fillStyle = color;
  //   const fontWidth = measureNumberWidth(canvas, text, font);
  //   // 绘制文本
  //   ctx.fillText(text, x - fontWidth / 2, y);
  // }
  // // 每隔10px画一条线
  // const count = width / 40;
  // for (let i = 0; i < count; i++) {
  //   if (i > 0) {
  //     drawLine(i * 40, 0, i * 40, 4);
  //     drawText(i, i * 40 + 0.5, 15, "12px Arial", "black");
  //   }
  // }
  // // 使用 interact.js 创建拖拽交互
  // window.interact(draggableElement).draggable({
  //   onmove: dragMoveListener,
  //   // inertia: true,
  //   // modifiers: [
  //   //   window.interact.modifiers.restrictRect({
  //   //     restriction: "parent",
  //   //     endOnly: true,
  //   //   }),
  //   // ],
  //   // autoScroll: true,
  //   // listeners: {
  //   //   move: dragMoveListener,
  //   // },
  // });
  // // 使用 interact.js 创建拖拽交互
  // window
  //   .interact(zhen)
  //   .draggable({
  //     start: function (event) {
  //       event.target.x = 200;
  //     },
  //     onmove: zhendragMoveListener,
  //     end: function (event) {
  //       console.log(event);
  //     },
  //   })
  //   .on("mouseover", function (event) {
  //     console.log(event);
  //   });
  // const update = () => {
  //   zhen.setAttribute("data-x", 200);
  //   zhen.style.transform = "translate(200px, 0)";
  // };
  // setTimeout(() => {
  //   update();
  // }, 2000);
  // // 定义拖拽移动的回调函数
  // function dragMoveListener(event) {
  //   const target = event.target;
  //   let x = (parseFloat(target.getAttribute("data-x")) || 0) + event.dx;
  //   if (x > 0) {
  //     x = 0;
  //   }
  //   if (x < -700) {
  //     x = -700;
  //   }
  //   console.log(x);
  //   // 更新元素的位置
  //   target.style.transform = `translate(${x}px, 0px)`;
  //   // 保存新的位置信息
  //   target.setAttribute("data-x", x);
  // }
  // // 定义拖拽移动的回调函数
  // function zhendragMoveListener(event) {
  //   const target = event.target;
  //   let x = (parseFloat(target.getAttribute("data-x")) || 0) + event.dx;
  //   // 更新元素的位置
  //   target.style.transform = `translate(${x}px, 0px)`;
  //   // if (x < 0) {
  //   //   x = 0;
  //   // }
  //   // if (x > 280) {
  //   //   x = 280;
  //   // }
  //   // console.log(x);
  //   // 保存新的位置信息
  //   console.log((x / width) * 700);
  //   target.setAttribute("data-x", x);
  // }
  // draggableElement.addEventListener("wheel", function (event) {
  //   event.preventDefault();
  //   const target = event.target;
  //   // 获取滚轮的位移量
  //   const delta = Math.sign(event.deltaY);
  //   // 获取元素的当前位置
  //   let x = parseFloat(target.getAttribute("data-x")) || 0;
  //   // 根据滚轮的位移量来调整元素的位置
  //   x += delta * 30;
  //   // 更新元素的位置
  //   target.style.transform = `translate(${x}px,0)`;
  //   // 保存新的位置信息
  //   target.setAttribute("data-x", x);
  // });
});
</script>
<style scoped>
.c-timeline {
  width: 300px;
  height: 300px;
  border: 1px saddlebrown solid;
  overflow: hidden;
  position: relative;
  content-visibility: auto;
  contain: layout;
}

.tracker {
  background-color: #eee;
  margin-top: 40px;
  position: absolute;
  transition: transform 0.3s;
}
.pointer {
  height: 120px;
  width: 1px;
  background-color: red;
  position: absolute;
  top: -20px;
}
.header {
  width: 10px;
  height: 10px;
  position: absolute;
  top: 0;
  left: -5px;
  background-color: royalblue;
}
</style>

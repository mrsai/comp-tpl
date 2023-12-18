<template>
  <div>
    <div class="c-timeline" id="timeline-container" ref="container">
      <div
        id="tracker"
        class="tracker"
        ref="tracker"
        :style="{
          width: `${state.trackerWidth}px`,
        }"
      >
        <div class="pointer" id="pointer" ref="pointer" @click.stop>
          <div class="header">
            <span>12</span>
          </div>
        </div>
        <div
          v-for="it in list"
          class="item"
          :key="it"
          :style="{
            transform: `translate(${
              transT2P(it) - state.itemWidth / 2
            }px, 0px)`,
          }"
          :data-x="transT2P(it) - state.itemWidth / 2"
          :data-t="it"
          @click.stop="(event) => {}"
        >
          {{ it }}
          <div class="del" @click.stop="del(it)"></div>
        </div>
      </div>
    </div>
    <el-button type="primary" @click="add">ADD</el-button>
    <el-button type="primary" @click="rem">Remove</el-button>
  </div>
</template>

<script setup name="CTimeLine">
import { onMounted, reactive, ref } from "vue";
import Measure from "./measure";

let index = 0;
const emits = defineEmits([
  "on-tracker-click",
  "on-pointer-drag-end",
  "on-pointer-move",
  "on-item-drag-end",
  "on-item-click",
  "on-item-del-click",
]);

const list = ref([45, 30]);
const measure = reactive({
  gap: 50, // 刻度间隔，单位都是 px
  width: 1, // 刻度宽度
  height: 10, // 刻度高度
  font: "12px Arial", // 刻度字体
  className: "measure", // 刻度的类名
  margin: 4, // 刻度文字的距离
  color: "#000", // 刻度颜色
  lineWidth: 1, // 刻度线宽
});

const state = reactive({
  start: 0, // 开始时间
  end: 500, // 结束时间
  unit: 30, // 单位,一个格子代表 30s
  containerWidth: 0,
  containerHeight: 0,
  trackerWidth: 0,
  pointerWidth: 0,
  pointerHeight: 0,
  grid: 1,
  duration: 1,
  itemWidth: 30,
});

const container = ref(null); // 容器
const tracker = ref(null); // 轨道
const pointer = ref(null); // 指针

const add = () => {
  list.value.push(90);
};
const rem = () => {
  list.value = list.value.filter((it) => it !== 90);
};
const realX = (x, range) => {
  const [min, max] = range;
  if (x > min) {
    x = min;
  }
  if (x < max) {
    x = max;
  }
  return x;
};

const endow = (el, { start, end, move, tap }) => {
  window
    .interact(el)
    .draggable({
      cursorChecker() {
        return "pointer";
      },
      listeners: {
        move,
        start,
        end,
      },
    })
    .on("tap", tap);
};

const transP2T = (x) => {
  return parseInt((x / state.trackerWidth) * state.duration, 10);
};
/**
 * 计算时间到位置的转换
 */
const transT2P = (v) => {
  return parseInt((v / state.duration) * state.trackerWidth, 10);
};

const update = (el, x, t) => {
  el.style.transform = `translate(${x}px, 0px)`;
  el.setAttribute("data-x", x);
  (t || t === 0) && el.setAttribute("data-t", t);
};

const init = () => {
  // 初始化容器, 获取容器的宽高
  const { width: containerWidth, height: containerHeight } =
    container.value.getBoundingClientRect();
  const { width: pointerWidth, height: pointerHeight } =
    pointer.value.getBoundingClientRect();

  // 计算格子的数量
  const count = (state.end - state.start) / state.unit;
  // 计算轨道的真实长度，因为时间太短的情况下，可能需要重新设置间距
  const w = count * measure.gap;
  state.trackerWidth = w > containerWidth ? w : state.containerWidth;
  // 因为时间太短，未占满容器，重新设置标尺的间距
  if (w < containerWidth) {
    measure.gap = containerWidth / count;
  }
  state.grid = count;
  state.containerWidth = containerWidth;
  state.containerHeight = containerHeight;
  state.pointerWidth = pointerWidth;
  state.pointerHeight = pointerHeight;
  state.duration = state.end - state.start;
};

const initTracker = () => {
  if (state.trackerWidth > state.containerWidth) {
    // range 是计算标尺可拖动的范围
    const range = [0, state.containerWidth - state.trackerWidth];
    // 绑定拖动事件
    endow(tracker.value, {
      move: (event) => {
        const target = event.target;
        // 获取移动的位置 x
        let x = (parseFloat(target.getAttribute("data-x")) || 0) + event.dx;
        // 使用x值来不停的更新轨道的位置
        update(target, realX(x, range));
      },
      // tap: (event) => {
      //   let x = parseFloat(event.offsetX) || 0;
      //   let current = transP2T(x);
      //   emits("on-tracker-click", { event, x, current });
      // },
    });
    // 绑定轮子事件
    tracker.value.addEventListener("wheel", (event) => {
      event.preventDefault();
      const target = tracker.value;
      // 获取滚轮的位移量
      const delta = Math.sign(event.deltaY);
      // 获取元素的当前位置
      let x = parseFloat(target.getAttribute("data-x")) || 0;
      // 根据滚轮的位移量来调整元素的位置
      x += delta * measure.gap;
      update(target, realX(x, range));
    });
  }
  tracker.value.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    let x = parseFloat(event.offsetX) || 0;
    let current = transP2T(x);
    emits("on-tracker-click", { event, x, current });
    console.log("on-tracker-click", { event, x, current });
  });
};

const initMeasure = () => {
  // 使用 canvas 绘制标尺
  // 这个地方可能会出现bug，canvas的最大的面积为 6w像素*6w像素左右，如果超出这个宽度，可能会出现空白
  const ruler = new Measure(state.trackerWidth, 60, state.grid, measure);
  tracker.value.appendChild(ruler);
};

const initItems = () => {
  endow(".item", {
    start: (event) => {
      // 拖拽的时候把元素置于顶层
      const target = event.target;
      target.style.zIndex = ++index;
    },
    move: (event) => {
      const target = event.target;
      let x = (parseFloat(target.getAttribute("data-x")) || 0) + event.dx;
      // 计算元素的可拖拽范围
      const range = [
        state.trackerWidth - state.itemWidth / 2,
        -state.itemWidth / 2,
      ];
      update(target, realX(x, range));
    },
    end: (event) => {
      const target = event.target;
      let x = (parseFloat(target.getAttribute("data-x")) || 0) + event.dx;
      let current = transP2T(x + state.itemWidth / 2);
      // 拖拽的起始位置记录一下
      let start = target.getAttribute("data-t");
      // 拖拽的结束位置设置一下
      target.setAttribute("data-t", current);
      // 拖拽结束把起始位置和结束位置发射出去更新数据
      emits("on-item-drag-end", {
        event,
        x,
        start: Number(start),
        current,
      });
      console.log("on-item-drag-end", {
        event,
        x,
        start: Number(start),
        current,
      });

      const res = list.value.filter((it) => it !== Number(start));
      res.push(current);
      list.value = res;
    },
    // tap: (event) => {
    //   event.stopPropagation();
    //   event.originalEvent.preventDefault();
    //   event.originalEvent.stopPropagation();
    //   const target = event.target;
    //   event.target.style.Zindex = ++index;
    //   let x = parseFloat(target.getAttribute("data-x")) || 0;
    //   let current = transP2T(x + state.itemWidth / 2);
    //   emits("on-item-click", { event, x, current });
    //   console.log(
    //     "on-item-click",
    //     { event, x, current },
    //     event.originalEvent.preventDefault
    //   );
    // },
  });
};

const initPointer = () => {
  // 为指针绑定拖拽事件
  endow(pointer.value, {
    move: (event) => {
      const target = event.target;
      let x = (parseFloat(target.getAttribute("data-x")) || 0) + event.dx;
      const range = [state.trackerWidth - state.pointerWidth, 0];
      update(target, realX(x, range));
      let current = transP2T(x);
      emits("on-pointer-move", { event, x, current });
    },
    end: (event) => {
      // 指针拖拽结束
      const target = event.target;
      // 计算拖拽的位置
      let x = (parseFloat(target.getAttribute("data-x")) || 0) + event.dx;
      // 计算当前点的时间
      let current = transP2T(x);
      // 触发外部定义的指针拖拽结束事件
      emits("on-pointer-drag-end", { event, x, current });
    },
  });
};

const setPointer = (t) => {
  let x = transT2P(t);
  update(pointer.value, x, t);
};
/**
 * 外部播放的时候调用
 * todo:优化
 * 1.当指针在可见窗口的左侧，指针移动到可视窗口的中间，
 * 2.然后指针位置继续向右移动，轨道向左移动，针式的视觉感受不动。
 * 3.当轨道无法再移动，指针继续向右移动，直到移动结束
 * 4.指针如果在可视区域的右侧，轨道移动，指针移动，结束
 */
const play = (t) => {
  setPointer(t);
};

const del = (v) => {
  console.log("del", v);
  list.value = list.value.filter((it) => it !== v);
};

onMounted(() => {
  init();
  initTracker();
  initMeasure();
  initItems();
  initPointer();

  // vue 写法
  // js 式写法
  // measure = new MeasureLine({
  //   container: "timeline-container", // 容器
  //   tracker: "tracker", // 轨道
  //   pointer: "pointer", // 指针
  // });
  // measure.on("on-pointer-drag-end", (data) => {
  //   console.log(data);
  // });
  // measure.on("on-item-drag-end", (data) => {
  //   console.log(data);
  // });
  // measure.on("on-item-click", (data) => {
  //   console.log("on-item-click", data);
  //   console.log(measure.getItem());
  // });
  // measure.on("on-item-del-click", (data) => {
  //   console.log("on-item-del-click", data);
  // });
  // measure.on("on-tracker-click", (data) => {
  //   console.log("on-tracker-click", data);
  // });
  // let c = 0;
  // let t = setInterval(() => {
  //   play(c++);
  //   if (c === 500) {
  //     clearInterval(t);
  //   }
  // }, 25);
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
.item {
  position: absolute;
  width: 30px;
  height: 30px;
  background-color: red;
  top: 60px;
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

.del {
  width: 10px;
  height: 10px;
  background-color: rebeccapurple;
  right: 0;
  top: 0;
}
.header span {
  opacity: 0;
  transition: all 0.3s;
  transform: translateX(-50%);
}
.header:hover span {
  opacity: 1;
}
</style>

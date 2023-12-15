<template>
  <div>
    <div class="c-timeline" id="timeline-container"></div>
    <div class="div-with-vertical-lines"></div>
    <el-button type="primary" @click="handleMove">MOTO</el-button>
  </div>
</template>

<script setup name="CTimeLine">
import { ref, onMounted } from "vue";
import { Timeline, DataSet } from "vis-timeline/standalone";

let timeline = null;
const init = (container) => {
  const items = new DataSet([
    {
      id: 1,
      content: "item 1",
      start: "2014-03-22 00:20:00",
      title: "什么",
      // editable: {
      //   updateTime: true,
      //   remove: true,
      //   overrideItems: true,
      // },
      editable: false,
    },
    {
      id: 2,
      content: "item 1",
      start: "2014-03-22 00:30:00",
      title: "111",
      editable: {
        updateTime: true,
        remove: true,
        overrideItems: true,
      },
    },
  ]);
  timeline = new Timeline(container, items, {
    width: "100%",
    height: "180px",
    margin: {
      item: 20,
    },
    editable: {
      remove: true,
    },
    // 开始起止时间和结束时间
    start: "2014-03-22 00:00:00",
    end: "2014-03-22 01:20:00",
    max: "2014-03-22 01:20:00",
    min: "2014-03-22 00:00:00",
    maxMinorChars: 5,
    onMove: function (item, callback) {
      console.log(item);
      // 如果返回 item 则更新ui，否则不更新
      callback(null);
    },
    onRemove: function (item, callback) {
      console.log(item);
      callback(item);
    },
    onUpdate: function (item, callback) {
      console.log(item);
      callback(item);
    },
    orientation: {
      axis: "top",
      item: "bottom",
    },
    showCurrentTime: false,
    showMajorLabels: false,
    showMinorLabels: true,
    stack: false,
    snap: function (date, scale, step) {
      // console.log(date, scale, step);
      return date;
    },
    // 自定义 item 的内容模板
    template: function (item, element, data) {
      console.log(item, element, data);
      return item.content;
    },
    type: "box", // item 元素的形状，
    showTooltips: true, // item 提示的设置
    zoomFriction: 12,
    zoomMax: 4800000, // 50分钟换算成为毫秒值
    zoomMin: (1000 * 3600) / 5,
  });
  // 添加一个自定义的可拖拽的时间线。返回改节点的 id
  const c = timeline.addCustomTime("2014-03-22 00:32:00");
  const t = timeline.getCustomTime(c);
  timeline.setCustomTime("2014-03-22 00:52:00");
  // 蓝色的marks
  timeline.setCustomTimeMarker(t);
  // 长时间停留可查看
  timeline.setCustomTimeTitle("me!");
  console.log(t);
  // timeline.moveTo('2014-03-22 00:40:00"');

  timeline.on("click", (v) => {
    console.log(v.what);
  });

  // timeline.zoomOut(0.3);
  timeline.zoomIn(0.2);
  // 设置的是最终的结果
  timeline.setItems([
    {
      id: 4,
      content: "item 1",
      start: "2014-03-22 00:10:00",
      title: "~~",
      editable: {
        updateTime: true,
        remove: true,
        overrideItems: true,
      },
    },
  ]);
  timeline.on("select", function (properties) {
    console.log("selected items: ", properties);
  });

  timeline.on("timechanged", function (properties) {
    console.log("timechanged", properties);
  });
};

const handleMove = () => {
  let index = 0;
  if (timeline) {
    // timeline.moveTo(`2014-03-22 01:19:40`);
    // timeline.setCustomTime("2014-03-22 01:19:40");
    // let t = setInterval(function () {
    //   let n = `2014-03-22 00:${40 + index++}:00`;
    //   if (n) {
    //     timeline.moveTo(n);
    //   }
    //   if (index === 20) {
    //     clearInterval(t);
    //   }
    // }, 250);
  }
};

onMounted(() => {
  const container = document.getElementById("timeline-container");
  init(container);
});
</script>
<style scoped>
.c-timeline {
  width: 600px;
}
</style>

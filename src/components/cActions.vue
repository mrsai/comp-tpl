<template>
  <div class="c-action flex flex-row items-center">
    <date-picker
      :hour-options="timeOptions.hourOption"
      :minute-options="timeOptions.minuteOptions"
      :second-options="timeOptions.secondOptions"
      v-model="uTime"
      type="time"
      placeholder="选择一个时间点"
      format="HH:mm:ss"
      value-type="format"
      @close="valadateTime"
    >
    </date-picker>
    <div>
      <el-button
        type="primary"
        :disabled="!uTime"
        @click="onTap(ActionType.Location)"
        >定位</el-button
      >
      <el-button
        type="primary"
        :disabled="!uTime"
        @click="onTap(ActionType.InertManual)"
        >手动插题</el-button
      >
      <el-button
        type="primary"
        :disabled="!uTime"
        @click="onTap(ActionType.InertIntelligent)"
        >智能插题</el-button
      >
    </div>
  </div>
</template>

<script setup name="CAction">
import { ref, defineEmits, computed, defineProps } from "vue";
import DatePicker from "vue2-datepicker";
import "vue2-datepicker/index.css";
import { Message } from "element-ui";
import { TimeTools } from "../utils/tools";

// 视频的时长
const props = defineProps({
  duration: {
    type: Number,
    default: 360,
  },
});
// 把视频时长解析为时分秒字符串
const defaultVideoTime = computed(() =>
  TimeTools.formatTimeToString(props.duration)
);
const emits = defineEmits([
  "on-tap-location",
  "on-tap-inert-manual",
  "on-tap-inert-intelligent",
]);

// 点击事件分发的类型
const ActionType = {
  Location: "on-tap-location", //定位
  InertManual: "on-tap-inert-manual", // 手动插入
  InertIntelligent: "on-tap-inert-intelligent", // 智能插入
};

// 用户选择的时间
const uTime = ref(null);

// 构造事件选择器下拉选项
const timeOptions = computed(() => {
  const { hours, minutes, seconds } = TimeTools.formatDuration(props.duration);
  const hourOption = TimeTools.generateTimeOptions(hours);
  const minuteOptions = hours
    ? TimeTools.generateTimeOptions(59)
    : TimeTools.generateTimeOptions(minutes);
  const secondOptions =
    hours || minutes
      ? TimeTools.generateTimeOptions(59)
      : TimeTools.generateTimeOptions(seconds);
  return {
    hourOption,
    minuteOptions,
    secondOptions,
  };
});

// 点击事件
const onTap = () => {
  if (!uTime.value) {
    Message.error("请选择一个时间点");
    return;
  }
  emits(ActionType.Location, uTime.value);
};

// 验证时间的输入是否合法
const valadateTime = () => {
  if (uTime.value) {
    if (!TimeTools.compareTime(uTime.value, props.duration)) {
      Message.error(`时间点不能大于视频时长 ${defaultVideoTime.value}`);
      uTime.value = defaultVideoTime.value;
    }
  }
};
</script>
<style scoped>
.c-action {
  gap: 10px;
}
</style>

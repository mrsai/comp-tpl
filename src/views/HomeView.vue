<template>
  <main>
    <CTimeline />
    <CTabs @on-tab-change="onTabChange" :tab-list="tabList">
      <template #overview>
        <COverview :step="overview.step" :content="overview.content" />
      </template>
      <template #exercises>
        <CExercises
          @on-tap-question-del="onTapQuestionDel"
          @on-tap-question-edit="onTapQuestionEdit"
          @on-tap-question-preview="onTapQuestionPreview"
        />
      </template>
      <template #caption>
        <CCaption @on-tap-caption="onTapCaption" />
      </template>
    </CTabs>
    <CAction
      @on-tap-location="onTapLocation"
      @on-tap-inert-manual="onTapInertManual"
      @on-tap-inert-intelligent="onTapInertIntelligent"
    />
    <CGenerateQuestions
      ref="IntelligentQuestionRef"
      @on-tap-insert="onTapInsert"
      @on-tap-remove="onTapRemove"
    />
    <CPlayer />

    <el-button type="primary" @click="open">OpenADialog</el-button>

    <CDialog
      ref="cDialogRef"
      title="智能出题"
      @on-confirm="onConfirm"
      @on-cancel="onCancel"
      >我是一个弹窗</CDialog
    >
  </main>
</template>

<script setup>
import { computed, ref, reactive } from "vue";
import CTabs from "../components/cTabs.vue";
import CAction from "../components/cActions.vue";
import COverview from "../components/cOverview.vue";
import CCaption from "../components/cCaption.vue";
import CExercises from "../components/cExercises.vue";
import CPlayer from "../components/cPlayer.vue";
import CGenerateQuestions from "../components/cGenerateQuestions.vue";
import CDialog from "../components/cDialog.vue";
import CTimeline from "../components/cTimeline.vue";

const IntelligentQuestionRef = ref(null);
const cDialogRef = ref(null);

const tabs = ref([
  {
    label: "视频概览",
    key: "overview",
  },
  {
    label: "视频习题",
    key: "exercises",
  },
  {
    label: "字幕",
    key: "caption",
  },
]);

const tabList = computed(() => tabs.value);
const onTabChange = (v1) => {
  console.log("onTabChange", console.log(v1));
};

const onTapLocation = (utime) => {
  console.log(utime);
};
const onTapInertManual = (utime) => {
  console.log(utime);
};
const onTapInertIntelligent = (utime) => {
  console.log(utime);
};

const onTapCaption = (line) => {
  console.log(line);
};

const overview = reactive({
  step: 4,
  content: "暂无内容",
});

// 题目的增删改查
const onTapQuestionDel = (it) => {
  console.log(it, "del");
};
const onTapQuestionEdit = (it) => {
  console.log(it, "edit");
};
const onTapQuestionPreview = (it) => {
  IntelligentQuestionRef.value && IntelligentQuestionRef.value.open();
  console.log(it, "preview");
};

// 插入题目
const onTapInsert = (it) => {
  console.log(it, "insert");
};
const onTapRemove = (it) => {
  console.log(it, "remove");
};

const open = () => {
  cDialogRef.value.openDialog();
};
const onConfirm = () => {
  console.log("onConfirm");
  cDialogRef.value.closeDialog();
};

const onCancel = () => {};
</script>

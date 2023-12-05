<template>
  <div id="app">
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
  </div>
</template>

<script setup>
import { computed, ref, reactive } from "vue";
import CTabs from "./components/cTabs.vue";
import CAction from "./components/cActions.vue";
import COverview from "./components/cOverview.vue";
import CCaption from "./components/cCaption.vue";
import CExercises from "./components/cExercises.vue";
import CGenerateQuestions from "./components/cGenerateQuestions.vue";

const IntelligentQuestionRef = ref(null);

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
  IntelligentQuestionRef.value.open();
  console.log(it, "preview");
};

// 插入题目
const onTapInsert = (it) => {
  console.log(it, "insert");
};
const onTapRemove = (it) => {
  console.log(it, "remove");
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin-top: 60px;
}
</style>

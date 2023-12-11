<template>
  <div class="c-question" v-show="visable">
    <div class="c-question-inner" v-for="it in formData" :key="it.id">
      <div class="c-questiom-type">{{ it.id }}</div>
      <div class="c-question-title" v-text="it.label"></div>
      <div class="c-question-options">
        <el-input type="text" v-model="it.answer"></el-input>
        <el-radio-group v-model="it.answer">
          <el-radio
            :label="it.title"
            :value="it.id"
            v-for="it in it.options"
            :key="it.id"
          ></el-radio>
        </el-radio-group>
      </div>
      {{ props.question }}
      <div class="c-question-actions">
        <el-button
          type="primary"
          @click="onTapAnswer"
          :disabled="loading"
          class="btn-fix"
          >提交答案</el-button
        >
        <el-button @click="onTapSkip">跳过</el-button>
      </div>
    </div>
  </div>
</template>

<script setup name="CQuestion">
import { ref, watchEffect, defineExpose } from "vue";
const visable = ref(false);

const formData = ref([]);

watchEffect(() => {
  if (props.question) {
    formData.value = props.question;
  }
});

const props = defineProps({
  mode: {
    type: String,
    default: "preview",
  },
  loading: {
    type: Boolean,
    default: false,
  },
  question: {
    type: Object,
    default: () => {},
  },
  onAnswer: {
    type: Function,
    default: () => {},
  },
  onSkip: {
    type: Function,
    default: () => {},
  },
  onExit: {
    type: Function,
    default: () => {},
  },
});

const onTapAnswer = () => {
  props.onAnswer(formData.value);
};

const onTapSkip = () => {
  props.onSkip(formData.value);
  close();
};

const open = () => {
  visable.value = true;
};

const close = () => {
  visable.value = false;
};

defineExpose({
  open,
  close,
});
</script>
<style scoped>
.c-question {
  position: absolute !important;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 1);
  z-index: 9999;
}
.btn-fix {
  padding: 10px !important;
}
</style>

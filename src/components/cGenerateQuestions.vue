<template>
  <el-drawer
    title="生成习题"
    :visible.sync="visible"
    direction="ltr"
    custom-class="generate-questions"
    ref="drawer"
    :before-close="cancel"
  >
    <div class="demo-drawer__content">
      <!-- 生成状态的维护 -->
      <div class="questions-content">
        <div class="flex flex-col" v-if="CurrentStatus.NotStarted">
          <div class="flex justify-between">
            <span>正在准备生成题目</span>
          </div>
        </div>
        <div class="flex flex-col" v-if="CurrentStatus.Processing">
          <div class="flex justify-between">
            <span>正在生成题目...</span>
            <el-link type="primary" @click="stopTask">结束任务</el-link>
          </div>
          <el-progress :percentage="50"></el-progress>
        </div>
        <div class="flex flex-col" v-if="CurrentStatus.Error">
          <div class="flex justify-between">
            <span>生成题目出错</span>
            <el-link type="primary" @click="startTask">重新生成</el-link>
          </div>
        </div>
        <div class="flex flex-col" v-if="CurrentStatus.Interrupted">
          <div class="flex justify-between">
            <span>题目生成被取消</span>
            <el-link type="primary" @click="startTask">继续生成</el-link>
          </div>
        </div>
        <div class="flex flex-col" v-if="CurrentStatus.Done">
          <div class="flex justify-between">
            <el-link type="primary" @click="insert(questions)"
              >一键插入</el-link
            >
            <el-link type="primary" @click="startTask">重新生成</el-link>
          </div>
        </div>
        <!-- 生成的题目 -->
        <ul>
          <li
            class="flex flex-col gap"
            v-for="question in questions"
            :key="question.id"
          >
            <div class="flex flex-row gap">
              <div v-text="question.title"></div>
              <div @click="startTask(question)" class="cursor-pointer">
                单个生成
              </div>
            </div>
            <div class="flex flex-col gap justify-start">
              <div v-for="ans in question.options" :key="ans.id">
                <el-radio
                  v-model="question.answer"
                  :label="ans.id"
                  :key="ans.id"
                  >{{ ans.title }}</el-radio
                >
              </div>
            </div>
            <div class="flex flex-row gap justify-between">
              <div>插入位置：<span v-text="question.insertTime"></span></div>
              <div>
                <div v-if="question.inserted">已插入</div>
                <div v-else @click="insert([question])" class="cursor-pointer">
                  插入
                </div>
              </div>
            </div>
          </li>
        </ul>
      </div>
      <div class="demo-drawer__footer"></div>
    </div>
  </el-drawer>
</template>

<script setup name="generateQuestions">
import { ref, defineExpose, defineEmits } from "vue";
import { useGenerateIntelligentQuestion } from "@/hooks/useGenerateIntelligentQuestion.js";

const drawer = ref(null);
const visible = ref(false);

const emits = defineEmits(["on-tap-insert", "on-tap-remove"]);

const { StatusCode, status, start, stop, CurrentStatus, questions } =
  useGenerateIntelligentQuestion();

const startTask = () => {
  console.log("start generate");
  start();
};

const stopTask = () => {
  status.value = StatusCode.Interrupted;
  stop();
};

const insert = (questions) => {
  emits("on-tap-insert", questions);
};

const open = () => {
  visible.value = true;
  if (CurrentStatus.value.NotStarted) {
    startTask();
  }
};

const cancel = () => {
  visible.value = false;
  stop();
};

const remove = (id) => {
  // 可能有问题，需要验证测试
  // 如果外部移除一个插入的题目，要在这个地方还原
  const found = questions.value.index((it) => it.id === id);
  found && (found.inserted = false);
  emits("on-tap-remove", found);
};

defineExpose({
  open,
  cancel,
  remove,
});
</script>
<style scoped>
.gap {
  gap: 10px;
}
.cursor-pointer {
  cursor: pointer;
}
</style>

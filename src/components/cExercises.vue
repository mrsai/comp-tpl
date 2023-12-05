<template>
  <div class="c-exercises">
    <ul class="flex flex-col c-exercises-list">
      <li
        class="c-exercises-item flex items-center cursor-pointer"
        :class="{ active: active === it.id }"
        v-for="it in exercisesList"
        :key="it.id"
        @click="onTapView(it)"
      >
        <div class="c-exercises-item-title" v-text="it.title"></div>
        <div class="c-exercises-item-type" v-text="it.type"></div>
        <div class="c-exercises-item-icon">Icon</div>
        <div class="c-exercises-item-durition" v-text="it.durition"></div>
        <div class="c-exercises-item-edit" @click.stop="onTapEdit(it)">
          编辑
        </div>
        <div class="c-exercises-item-delete" @click.stop="onTapDel(it)">
          删除
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup name="CExercises">
import { ref, defineEmits } from "vue";

const active = ref(null);
const emits = defineEmits([
  "on-tap-question-preview",
  "on-tap-question-edit",
  "on-tap-question-del",
]);

const exercisesList = ref([
  {
    title: "题目1",
    type: "单选题",
    durition: "00:00:01",
    id: 12,
    isIntelligent: true,
  },
  {
    title: "题目2",
    type: "单选题",
    durition: "00:00:01",
    id: 1,
    isIntelligent: true,
  },
  {
    title: "题目3",
    type: "单选题",
    durition: "00:00:01",
    id: 2,
    isIntelligent: false,
  },
]);

// Event
const onTapView = (it) => {
  active.value = it.id;
  emits("on-tap-question-preview", it);
};
const onTapEdit = (it) => {
  emits("on-tap-question-edit", it);
};
const onTapDel = (it) => {
  emits("on-tap-question-del", it);
};
</script>
<style scoped>
.c-exercises-list {
  gap: 10px;
}
.c-exercises-item.active {
  border: 1px steelblue solid;
}
.c-exercises-item {
  gap: 10px;
  border: 1px #fff solid;
}
.cursor-pointer {
  cursor: pointer;
}
.c-exercises {
  width: 100%;
  height: 100%;
  overflow: auto;
  gap: 10px;
}
</style>

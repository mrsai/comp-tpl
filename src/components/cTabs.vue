<template>
  <div class="c-tabs">
    <el-tabs @tab-click="handleClick" :value="props.activeTab">
      <el-tab-pane
        :label="it.label"
        :name="it.key"
        v-for="it in props.tabList"
        :key="it.key"
      >
        <div class="c-tab-content">
          <slot :name="it.key"></slot>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup name="CTabs">
import { defineProps, defineEmits } from "vue";

const emits = defineEmits(["on-tab-change"]);
const props = defineProps({
  activeTab: {
    type: String,
    default: "overview",
  },
  tabList: {
    type: Array,
    default: () => [],
  },
});

const handleClick = (tab) => {
  emits("on-tab-change", tab.name);
};
</script>
<style scoped></style>

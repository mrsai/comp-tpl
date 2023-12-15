<template>
  <el-dialog
    :title="props.title"
    :visible.sync="visible"
    v-bind="$attrs"
    v-on="$listeners"
  >
    <slot></slot>
    <div slot="footer" class="dialog-footer">
      <el-button @click="cancleDialog">取 消</el-button>
      <el-button type="primary" @click="confirmDialog">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script setup name="CDialog">
import { ref, defineExpose } from "vue";

const visible = ref(false);
const props = defineProps({
  title: {
    type: String,
    default: "",
  },
});

const emits = defineEmits(["on-cancel", "on-confirm"]);

const openDialog = () => {
  visible.value = true;
};

const closeDialog = () => {
  visible.value = false;
};

const cancleDialog = () => {
  emits("on-cancel");
};

const confirmDialog = () => {
  emits("on-confirm");
};

defineExpose({
  openDialog,
  closeDialog,
});
</script>
<style scoped></style>

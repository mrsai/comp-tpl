import { onUnmounted, ref, computed, watchEffect } from "vue";
import { usePolling } from "./usePolling";

function useGenerateIntelligentQuestion() {
  // 定义了一堆状态码
  const StatusCode = {
    NotStarted: 0, //尚未开始
    Processing: 1, //正在生成
    Done: 2, //生成完成
    Error: 3, //生成出错
    Interrupted: 4, //生成被中断
  };

  // 当前的状态
  const status = ref(StatusCode.NotStarted);
  const questions = ref([]);

  const { data, startPolling, stopPolling } = usePolling(async () => {
    const response = await fetch(
      "http://localhost:3000/api/intelligent-question"
    );
    const result = await response.json();
    return result;
  }, 1000);

  // 观察 data，修改状态
  watchEffect(() => {
    // status.value = data.result
    questions.value = [
      {
        id: "1",
        title: "eiwoeiuiowe",
        options: [{}],
        insertTime: "11:11:11",
      },
    ];
    // 如果题目完成生成了，那么就停止轮询
    if (data.result === StatusCode.Done) {
      done();
    }
  });

  // 获取当前的状态
  const CurrentStatus = computed(() => {
    return {
      NotStarted: status.value === StatusCode.NotStarted,
      Processing: status.value === StatusCode.Processing,
      Done: status.value === StatusCode.Done,
      Error: status.value === StatusCode.Error,
      Interrupted: status.value === StatusCode.Interrupted,
    };
  });

  const start = () => {
    startPolling();
  };

  const stop = () => {
    stopPolling();
  };

  // 需要不需要告知服务端，我已经收到了结果？方便后端更新状态。
  // 这个可以解决，如果用户在生成的过程中，刷新了页面，那么就会导致前端生成的过程中断
  // 但是服务端还是会继续生成。
  const done = () => {
    stopPolling();
  };

  onUnmounted(() => {
    stopPolling();
  });

  return {
    start,
    stop,
    data,
    StatusCode,
    CurrentStatus,
    status,
    questions,
    done,
  };
}

export { useGenerateIntelligentQuestion };

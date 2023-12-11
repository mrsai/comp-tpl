import { onUnmounted, reactive } from "vue";

/**
 *
 * @param {*} fn 一个异步函数
 * @param {*} interval 轮询间隔
 * @returns
 */
function usePolling(fn, interval) {
  const data = reactive({
    result: null,
    error: null,
    isPolling: false,
  });

  let timerId = null;

  const startPolling = () => {
    if (timerId) return;

    data.isPolling = true;
    timerId = setInterval(async () => {
      try {
        const result = await fn();
        data.result = result;
        data.error = null;
      } catch (error) {
        data.result = null;
        data.error = error;
      }
    }, interval);
  };

  const stopPolling = () => {
    if (!timerId) return;

    data.isPolling = false;
    clearInterval(timerId);
    timerId = null;
  };

  onUnmounted(() => {
    stopPolling();
  });

  return { data, startPolling, stopPolling };
}

export { usePolling };

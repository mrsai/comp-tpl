import Vue from "vue";
import CGenerateQuestions from "./cQuestion.vue";

function QuestionBoard(container, options = {}) {
  this.container = container;
  this.options = options;
  this.events = {};

  this.vm = Vue.extend(CGenerateQuestions);

  this.instance = new this.vm({
    propsData: {
      question: {},
      onAnswer: (data) => {
        this.emit("on-tap-confirm", data);
      },
      onSkip: (data) => {
        this.emit("on-tap-skip", data);
      },
      loading: false,
    },
  });
  this.el = this.instance.$mount().$el;
  this.container.appendChild(this.el);
}

QuestionBoard.prototype.init = function () {};

/**
 * 打开答题板
 */

QuestionBoard.prototype.open = function (question) {
  this.instance.question = question;
  this.instance.open();
};

/**
 * 更新答题板的数据 UI, 如果试题有了答案，要更新到界面上，需要手动调用一下
 * 可以尝试 watch，待会儿测试一下
 */

QuestionBoard.prototype.applay = function () {
  const origin = [...this.instance.question];
  this.instance.question = origin;
};

/**
 * 关闭答题板
 */
QuestionBoard.prototype.close = function () {
  this.instance.question = {};
  this.instance.close();
};
/**
 * 销毁答题板
 */
QuestionBoard.prototype.destroy = function () {
  this.vm.$destroy();
  this.instance.$destroy();
  this.container.removeChind(this.el);
};
/**
 * 监听事件
 */
QuestionBoard.prototype.on = function (name, callback) {
  if (!this.events[name]) {
    this.events[name] = [];
  }
  this.events[name].push(callback);
};
/**
 * 触发事件
 */
QuestionBoard.prototype.emit = async function (name, data) {
  var eventCallbacks = this.events[name];
  if (eventCallbacks) {
    this.instance.loading = true;
    for (let index = 0; index < eventCallbacks.length; index++) {
      await eventCallbacks[index](data);
    }
    this.instance.loading = false;
  }
};
/**
 *
 */
QuestionBoard.prototype.off = function (name, callback) {
  var eventCallbacks = this.events[name];
  if (eventCallbacks) {
    var index = eventCallbacks.indexOf(callback);
    if (index > -1) {
      eventCallbacks.splice(index, 1);
    }
  }
};

export default QuestionBoard;

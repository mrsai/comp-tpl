import Vue from "vue";
import CMarkLine from "./cMarkLine.vue";
import EventEmitter from "./emit";

function MarksLine(container, questions, options = {}) {
  this.container = container;
  this.options = options;
  this.raw = questions || [];

  this.Emitter = new EventEmitter();
  this.skims = Object.create(null);
  this.questions = Object.create(null);
  this.vm = null;
  this.instance = null;

  this.init();
}

MarksLine.prototype.init = function () {
  // 判断必有的一些字段
  if (!this.container || !this.options.duration) {
    return Error("container or duration not exists");
  }

  // 搞成 key value 的形式
  this.raw.reduce((acc, cur) => {
    acc[cur.duration]
      ? acc[cur.duration].push(cur)
      : (acc[cur.duration] = [cur]);
    return acc;
  }, this.questions);

  // 渲染一下界面
  this.vm = Vue.extend(CMarkLine);
  this.instance = new this.vm({
    propsData: {
      marks: {},
      onClick: (data) => {
        const questions = this.get(data.duration);
        this.emit("on-click", {
          ...data,
          questions,
        });
      },
      duration: this.options.duration,
    },
  });
  this.setMarks();
  const el = this.instance.$mount().$el;
  this.container.appendChild(el);
};

/**
 * 插入一个题目
 * @param {*} question
 */
MarksLine.prototype.insert = function (question) {
  if (this.questions[question.duration]) {
    this.questions[question.duration].push(question);
  } else {
    this.questions[question.duration] = [question];
  }
  this.setMarks();
  return true;
};

/**
 * 移除一个题目。
 * @param {*} question
 */
MarksLine.prototype.remove = function (question) {
  if (this.questions[question.duration]) {
    this.questions[question.duration] = this.questions[
      question.duration
    ].filter((item) => item.id !== question.id);
  }
  if (
    this.questions[question.duration] &&
    this.questions[question.duration].length === 0
  ) {
    delete this.questions[question.duration];
  }
  this.setMarks();
};

/**
 * 移动一个 mark的 位置
 * @param {*} from duration
 * @param {*} to duration
 */
MarksLine.prototype.moveTo = function (from, to) {
  const question = this.questions[from];
  if (question) {
    question.forEach((item) => {
      item.duration = to;
    });
    this.questions[to]
      ? this.questions[to].push(...question)
      : (this.questions[to] = question);
    delete this.questions[from];
    this.setMarks();
  }
};

/**
 * 移动题目，暂时未涉及
 * @param {*} question
 * @param {*} to
 */
MarksLine.prototype.moveQuestion = function () {};

/**
 * 清除所有题目
 */
MarksLine.prototype.clean = function () {
  this.questions = [];
  this.setMarks();
};

/**
 * 销毁组件
 */
MarksLine.prototype.destroy = function () {
  this.vm.$destroy();
  this.instance.$destroy();
  this.container = null;
  this.questions = null;
  this.options = null;
  this.Emitter = null;
  this.raw = null;
};

/**
 * 获取某个时间节点的题目
 * @param {*} time
 */
MarksLine.prototype.get = function (time) {
  if (arguments.length === 0) return this.questions;
  return this.questions[time];
};

/**
 * 修改某个题目的属性，暂时没有涉及
 * @param {*} question
 */
MarksLine.prototype.set = function () {};

/***
 *
 */
MarksLine.prototype.on = function (name, callback) {
  this.Emitter.on(name, callback);
};

MarksLine.prototype.emit = function (name, data) {
  this.Emitter.emit(name, data);
};

/**
 *
 * @param {*} duration
 * @returns
 */
MarksLine.prototype.getSkim = function (duration) {
  return this.skims[duration];
};

/**
 *
 * @param {*} duration
 * @param {*} data
 */
MarksLine.prototype.setSkim = function (duration, data) {
  this.skims[duration] = data || true;
};

/**
 * 设置marks组件的值
 */
MarksLine.prototype.setMarks = function () {
  this.instance.marks = { ...this.questions };
};

/**
 * 该节点是否存在题目
 */
MarksLine.prototype.has = function (duration) {
  return this.questions[duration] ? true : false;
};

export default MarksLine;

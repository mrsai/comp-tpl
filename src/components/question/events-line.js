import Vue from "vue";
import CMarkLine from "./cMarkLine.vue";
import EventEmitter from "./emit";

function EventsLine(
  container,
  questions,
  options = {
    duration: 46,
  }
) {
  this.container = container;
  this.options = options;
  this.Emitter = new EventEmitter();
  this.skims = Object.create(null);
  this.questions = questions || [];
  this.vm = null;
  this.instance = null;
  this.duration = options.duration;

  this.init();
}

EventsLine.prototype.init = function () {
  // 判断必有的一些字段
  if (!this.container || !this.duration) {
    return Error("container or duration not exists");
  }

  // 渲染一下界面
  this.vm = Vue.extend(CMarkLine);
  this.instance = new this.vm({
    propsData: {
      marks: this.questions,
      onClick: (data) => {
        this.emit("on-item-click", {
          ...data,
        });
      },
      duration: this.duration,
    },
  });
  this.update();
  const el = this.instance.$mount().$el;
  this.container.appendChild(el);
};

/**
 * 插入一个题目
 * @param {*} time
 */
EventsLine.prototype.insert = function (time) {
  if (!this.has(time)) {
    this.questions.push(time);
    this.update();
  }
};

/**
 * 移除一个题目。
 * @param {*} time
 */
EventsLine.prototype.remove = function (time) {
  this.questions = this.questions.filter((item) => item !== time);
  this.update();
};

/**
 * 移动一个 mark的 位置
 * @param {*} from duration
 * @param {*} to duration
 */
EventsLine.prototype.moveTo = function (from, to) {
  if (this.has(from) && !this.has(to)) {
    this.questions = this.questions.filter((item) => item !== from);
    this.questions.push(to);
    this.update();
  }
};
/**
 * 销毁组件
 */

EventsLine.prototype.destroy = function () {
  this.vm.$destroy();
  this.instance.$destroy();
  this.container = null;
  this.questions = null;
  this.options = null;
  this.Emitter = null;
};

/**
 * 获取某个时间节点的题目
 * @param {*} time
 */
EventsLine.prototype.has = function (time) {
  let found = this.questions.find((item) => item === time);
  return found || found === 0;
};

/***
 *
 */
EventsLine.prototype.on = function (name, callback) {
  this.Emitter.on(name, callback);
};

EventsLine.prototype.emit = function (name, data) {
  this.Emitter.emit(name, data);
};

/**
 *
 * @param {*} time
 * @returns
 */
EventsLine.prototype.getSkim = function (time) {
  return this.skims[time];
};

/**
 *
 * @param {*} time
 * @param {*} data
 */
EventsLine.prototype.setSkim = function (time, data) {
  this.skims[time] = data || true;
};

/**
 * 设置marks组件的值
 */
EventsLine.prototype.update = function () {
  this.instance.marks = { ...this.questions };
};

export default EventsLine;

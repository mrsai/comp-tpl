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

QuestionBoard.prototype.open = function (question) {
  this.instance.question = question;
  this.instance.open();
};

QuestionBoard.prototype.close = function () {
  this.instance.question = {};
  this.instance.close();
};

QuestionBoard.prototype.destroy = function () {
  this.vm.$destroy();
  this.instance.$destroy();
  this.container.removeChind(this.el);
};

QuestionBoard.prototype.on = function (name, callback) {
  if (!this.events[name]) {
    this.events[name] = [];
  }
  this.events[name].push(callback);
};

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

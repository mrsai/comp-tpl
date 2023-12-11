/**
 * 事件发布订阅器
 */
function EventEmitter() {
  this.events = {};
}

EventEmitter.prototype.on = function (eventName, callback) {
  if (!this.events[eventName]) {
    this.events[eventName] = [];
  }
  this.events[eventName].push(callback);
};

EventEmitter.prototype.emit = function (eventName, data) {
  var eventCallbacks = this.events[eventName];
  if (eventCallbacks) {
    eventCallbacks.forEach(function (callback) {
      callback(data);
    });
  }
};

EventEmitter.prototype.off = function (eventName, callback) {
  var eventCallbacks = this.events[eventName];
  if (eventCallbacks) {
    var index = eventCallbacks.indexOf(callback);
    if (index > -1) {
      eventCallbacks.splice(index, 1);
    }
  }
};

export default EventEmitter;

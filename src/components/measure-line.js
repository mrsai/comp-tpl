import EventEmitter from "./question/emit";

class MeasureLine {
  constructor(
    containers = {
      container: null, // 容器
      tracker: null, // 轨道
      pointer: null, // 指针
    },
    items = {
      60: "111",
      30: "3333",
    },
    options = {
      start: 0, // 开始时间
      end: 360, // 结束时间
      unit: 30, // 单位,一个格子代表 30s
      // 刻度
      measure: {
        gap: 50, // 刻度间隔
        width: 1, // 刻度宽度
        height: 10, // 刻度高度
        font: "12px Arial", // 刻度字体
        className: "ruler", // 刻度的类名
        margin: 4, // 刻度文字的距离
        color: "#000", // 刻度颜色
        lineWidth: 1, // 刻度线宽
      },
      itemConf: {
        className: "item",
        width: 30,
      },
    }
  ) {
    this.containers = containers;
    this.options = options;
    this.container = document.getElementById(this.containers.container);
    this.tracker = document.getElementById(this.containers.tracker);
    this.pointer = document.getElementById(this.containers.pointer);
    this.start = this.options.start;
    this.end = this.options.end;
    this.unit = this.options.unit;
    this.duration = this.options.end - this.options.start;
    this.measure = this.options.measure;
    // 题目节点
    this.items = items || Object.create(null);
    // 题目节点的配置
    this.itemConf = this.options.itemConf;

    this.EventEmitter = new EventEmitter();
    // 注册触发的事件, 现在只注册了一个句柄拖拽结束的事件
    this.events = {
      onPointerDragEnd: "on-pointer-drag-end",
      onItemDragEnd: "on-item-drag-end",
      onItemClick: "on-item-click",
      onItemDelClick: "on-item-del-click",
    };
    // itemIndex
    this.index = 1;

    this.init();
  }

  init() {
    // 初始化容器, 获取容器的宽高
    const { width, height } = this.container.getBoundingClientRect();
    this.containerWidth = width;
    this.containerHeight = height;
    // 初始化容器, 获取容器的宽高
    const { width: pw, height: ph } = this.pointer.getBoundingClientRect();
    this.pointerWidth = pw;
    this.pointerHeight = ph;
    // 计算轨道时长
    // 假设给定的时长乘以 gap 一定会超出容器的宽度
    // TODO：这里需要处理一个逻辑，就是时间太短，轨道的宽度会小于容器的宽度的问题
    // 计算轨道标尺的格子数量
    const count = this.duration / this.unit;
    // 计算轨道的长度
    const w = count * this.measure.gap;
    this.trackerWidth = w > this.containerWidth ? w : this.containerWidth;
    // 假设格子的数量就是count，未处理时间太短的情况
    this.gridCount = count;
    // 绘制标尺
    this.initMeasure();
    // 初始化轨道
    this.initTracker();
    // 初始化指针
    this.initPointer();
    // 题目的初始化
    this.initItems();
  }

  /**
   * 初始化轨道
   */
  initTracker() {
    if (this.trackerWidth > this.containerWidth) {
      this.tracker.style.width = `${this.trackerWidth}px`;
      // range 是可拖动的范围
      const range = [0, this.containerWidth - this.trackerWidth];
      this.endow(this.tracker, {
        move: (event) => {
          const target = event.target;
          let x = (parseFloat(target.getAttribute("data-x")) || 0) + event.dx;
          this.update(target, this.realX(x, range));
        },
      });
      // 绑定轮子事件
      this.tracker.addEventListener("wheel", (event) => {
        event.preventDefault();
        const target = this.tracker;
        // 获取滚轮的位移量
        const delta = Math.sign(event.deltaY);
        // 获取元素的当前位置
        let x = parseFloat(target.getAttribute("data-x")) || 0;
        // 根据滚轮的位移量来调整元素的位置
        x += delta * this.measure.gap;
        this.update(target, this.realX(x, range));
      });
    }
  }
  /**
   * 初始化指针
   */
  initPointer() {
    this.endow(this.pointer, {
      move: (event) => {
        const target = event.target;
        let x = (parseFloat(target.getAttribute("data-x")) || 0) + event.dx;
        const range = [this.trackerWidth - this.pointerWidth, 0];
        this.update(target, this.realX(x, range));
      },
      end: (event) => {
        const target = event.target;
        let x = (parseFloat(target.getAttribute("data-x")) || 0) + event.dx;
        let current = this.transP2V(x);
        this.emit(this.events.onPointerDragEnd, { event, x, current });
      },
    });
  }
  /**
   * 初始化标尺
   */
  initMeasure() {
    const ruler = new Measure(
      this.trackerWidth,
      60,
      this.gridCount,
      this.measure
    );
    this.tracker.appendChild(ruler);
  }
  /**
   * 初始化题目
   */
  initItems() {
    let fragment = document.createDocumentFragment();
    Object.keys(this.items).forEach((it) => {
      const item = this.createItemUi(it);
      fragment.appendChild(item);
    });
    this.tracker.appendChild(fragment);
  }
  /**
   * 传入一个元素，赋予一个拖拽的能力
   */
  endow(el, { start, end, move, tap }) {
    window
      .interact(el)
      .draggable({
        cursorChecker() {
          return "pointer";
        },
        listeners: {
          move,
          start,
          end,
        },
      })
      .on("tap", tap);
  }
  /**
   * 设置指针的位置
   */
  setPointer(v = 20) {
    let x = this.transV2P(v);
    this.update(this.pointer, x);
  }
  /**
   * 更新某个元素的位置
   */
  update(el, x) {
    el.style.transform = `translate(${x}px, 0px)`;
    el.setAttribute("data-x", x);
  }
  /**
   * 绑定事件
   */
  on(name, callback) {
    this.EventEmitter.on(name, callback);
  }
  /**
   * 触发事件发射器
   */
  emit(name, data) {
    this.EventEmitter.emit(name, data);
  }
  /**
   * 计算位置到时间的转换
   */
  transP2V(x) {
    return (x / this.trackerWidth) * this.duration;
  }
  /**
   * 计算时间到位置的转换
   */
  transV2P(v) {
    return (v / this.duration) * this.trackerWidth;
  }
  /**
   * 计算受限制拖拽的范围
   */
  realX(x, range) {
    const [min, max] = range;
    if (x > min) {
      x = min;
    }
    if (x < max) {
      x = max;
    }
    return x;
  }
  /**
   * 新增一个节点
   */
  addItem(it) {
    this.items[it] = it;
    const item = this.createItemUi(it);
    this.tracker.appendChild(item);
  }

  removeItem(it) {
    delete this.items[it];
  }

  moveItemTo(from, to) {
    this.removeItem(from);
    this.addItem(to);
  }

  hasItem(it) {
    return it && this.items[it];
  }

  getItem(it) {
    if (arguments.length) {
      return this.items[it];
    }
    return this.items;
  }

  createItemUi(time) {
    const div = document.createElement("div");
    div.className = this.itemConf.className;
    div.setAttribute(
      "style",
      `width:${this.itemConf.width}px;height:30px;background:red;position:absolute;top:60px;`
    );
    if (time) {
      div.id = `${this.itemConf.className}-${time}`;
    }
    this.update(div, this.transV2P(time) - this.itemConf.width / 2);
    this.endow(div, {
      start: () => {
        div.style.zIndex = this.index++;
      },
      move: (event) => {
        const target = event.target;
        let x = (parseFloat(target.getAttribute("data-x")) || 0) + event.dx;
        const range = [this.trackerWidth - this.itemConf.width, 0];
        this.update(target, this.realX(x, range));
      },
      end: (event) => {
        const target = event.target;
        let x = (parseFloat(target.getAttribute("data-x")) || 0) + event.dx;
        let current = this.transP2V(x);
        this.emit(this.events.onItemDragEnd, { event, x, current });
      },
      tap: (event) => {
        const target = event.target;
        let x = parseFloat(target.getAttribute("data-x")) || 0;
        let current = this.transP2V(x);
        this.emit(this.events.onItemClick, { event, x, current });
      },
    });

    const del = document.createElement("div");
    del.style.position = "absolute";
    del.className = this.itemConf.delClassName;
    del.setAttribute(
      "style",
      `width:10px;height:10px;background:blue;position:absolute;top:0;right:0`
    );
    this.endow(del, {
      tap: (event) => {
        event.stopPropagation();
        const target = event.target.parentNode;
        let x = parseFloat(target.getAttribute("data-x")) || 0;
        let current = this.transP2V(x);
        this.emit(this.events.onItemDelClick, { event, x, current });
      },
    });
    div.appendChild(del);
    return div;
  }
}

/**
 * 绘制一个时间轴的canvas的刻度
 * 放弃dom绘制刻度是因为Dom太多可能导致页面卡顿
 * 尤其还有许多的动画
 */
class Measure {
  constructor(width, height, gridCount, options = {}) {
    this.width = width;
    this.height = height;
    this.gridCount = gridCount;
    this.options = options;
    this.canvas = null;
    this.ctx = null;
    this.init();
    return this.canvas;
  }

  init() {
    this.canvas = document.createElement("canvas");
    this.canvas.width = this.width;
    this.canvas.height = this.height;
    this.canvas.className = this.options.className || "ruler";
    this.ctx = this.canvas.getContext("2d");
    this.drawGrid();
  }

  drawGrid() {
    let start = this.options.start || 0;
    for (let i = 0; i < this.gridCount; i++) {
      if (i > 0) {
        this.drawLine(
          i * this.options.gap + start,
          0,
          i * this.options.gap + start,
          this.options.height,
          this.options.lineWidth || 1,
          this.options.color || "#000"
        );
        this.drawText(
          i + start,
          i * this.options.gap + 0.5 + start,
          this.options.height + this.options.margin,
          this.options.font,
          this.options.color || "#000"
        );
      }
    }
  }

  drawLine(x1, y1, x2, y2, lineWidth = 1, color) {
    this.ctx.beginPath();
    this.ctx.strokeStyle = color;
    this.ctx.lineWidth = lineWidth;
    this.ctx.moveTo(x1 + 0.5, y1);
    this.ctx.lineTo(x2 + 0.5, y2);
    this.ctx.stroke();
  }

  drawText(text, x, y, font, color) {
    this.ctx.font = font;
    this.ctx.fillStyle = color;
    this.ctx.textBaseline = "top";
    const fontWidth = this.measureNumberWidth(text);
    this.ctx.fillText(text, x - fontWidth / 2, y);
  }

  measureNumberWidth(number) {
    const metrics = this.ctx.measureText(number);
    return metrics.width;
  }
}

export default MeasureLine;

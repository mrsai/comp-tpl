import EventEmitter from "./question/emit";

class MeasureLine {
  constructor(
    containers = {
      container: null, // 容器
      tracker: null, // 轨道
      pointer: null, // 指针
    },
    items = {
      45: 45,
      30: 30,
    },
    options = {
      start: 0, // 开始时间
      end: 500, // 结束时间
      unit: 30, // 单位,一个格子代表 30s
      // 刻度
      measure: {
        gap: 50, // 刻度间隔，单位都是 px
        width: 1, // 刻度宽度
        height: 10, // 刻度高度
        font: "12px Arial", // 刻度字体
        className: "ruler", // 刻度的类名
        margin: 4, // 刻度文字的距离
        color: "#000", // 刻度颜色
        lineWidth: 1, // 刻度线宽
      },
      itemConf: {
        className: "item", //item的className，id 也使用了这个名字 + 当前的时间进度值
        width: 30, // item 本身的宽度，这个非常重要，一定要设置
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
    // 视频共有多少秒
    this.duration = this.options.end - this.options.start;
    // 标尺的一些配置文件
    this.measure = this.options.measure;
    // 题目节点
    this.items = items || Object.create(null);
    // 题目节点的配置
    this.itemConf = this.options.itemConf;
    // 使用了事件触发器
    this.EventEmitter = new EventEmitter();
    // 注册触发的事件, 现在只注册了一个句柄拖拽结束的事件
    // 目前发射的时间，可以在外部通过 on 来监听
    this.events = {
      onTrackerClick: "on-tracker-click",
      onPointerDragEnd: "on-pointer-drag-end",
      onPointerMove: "on-pointer-move",
      onItemDragEnd: "on-item-drag-end",
      onItemClick: "on-item-click",
      onItemDelClick: "on-item-del-click",
    };
    // item的层级，防止相互掩盖
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
    // 计算格子的数量
    const count = this.duration / this.unit;
    // 计算轨道的真实长度，因为时间太短的情况下，可能需要重新设置间距
    const w = count * this.measure.gap;
    this.trackerWidth = w > this.containerWidth ? w : this.containerWidth;
    // 因为时间太短，未占满容器，重新设置标尺的间距
    if (w < this.containerWidth) {
      this.measure.gap = this.containerWidth / count;
    }
    this.gridCount = count;
    // 绘制标尺
    this.initMeasure();
    // 初始化轨道
    this.initTracker();
    // 初始化指针
    this.initPointer();
    // 题目的初始化
    this.renderItems(this.items);
  }

  /**
   * 初始化轨道
   */
  initTracker() {
    if (this.trackerWidth > this.containerWidth) {
      // 动态设标尺的长度
      this.tracker.style.width = `${this.trackerWidth}px`;
      // range 是计算标尺可拖动的范围
      const range = [0, this.containerWidth - this.trackerWidth];
      // 绑定拖动事件
      this.endow(this.tracker, {
        move: (event) => {
          const target = event.target;
          // 获取移动的位置 x
          let x = (parseFloat(target.getAttribute("data-x")) || 0) + event.dx;
          // 使用x值来不停的更新轨道的位置
          this.update(target, this.realX(x, range));
        },
        tap: (event) => {
          let x = parseFloat(event.offsetX) || 0;
          let current = this.transP2V(x);
          this.emit(this.events.onTrackerClick, { event, x, current });
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
    // 为指针绑定拖拽事件
    this.endow(this.pointer, {
      move: (event) => {
        const target = event.target;
        let x = (parseFloat(target.getAttribute("data-x")) || 0) + event.dx;
        const range = [this.trackerWidth - this.pointerWidth, 0];
        this.update(target, this.realX(x, range));
        let current = this.transP2V(x);
        this.emit(this.events.onPointerMove, { event, x, current });
      },
      end: (event) => {
        // 指针拖拽结束
        const target = event.target;
        // 计算拖拽的位置
        let x = (parseFloat(target.getAttribute("data-x")) || 0) + event.dx;
        // 计算当前点的时间
        let current = this.transP2V(x);
        // 触发外部定义的指针拖拽结束事件
        this.emit(this.events.onPointerDragEnd, { event, x, current });
      },
    });
  }
  /**
   * 初始化标尺
   */
  initMeasure() {
    // 使用 canvas 绘制标尺
    // 这个地方可能会出现bug，canvas的最大的面积为 6w像素*6w像素左右，如果超出这个宽度，可能会出现空白
    const ruler = new Measure(
      this.trackerWidth,
      60,
      this.gridCount,
      this.measure
    );
    this.tracker.appendChild(ruler);
  }
  /**
   * 初始化已经有的题目
   */
  renderItems(items) {
    let fragment = document.createDocumentFragment();
    Object.keys(items).forEach((it) => {
      const item = this.createItemUi(it);
      fragment.appendChild(item);
    });
    this.tracker.appendChild(fragment);
  }
  /**
   * 批量插入题目,在外部去重时候再使用, 还没有测试
   */
  setItems(newItems) {
    Object.assign(this.items, newItems);
    this.renderItems(newItems);
  }

  /**
   * 工具函数，传入一个元素，绑定一堆事件
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
   * 工具函数，设置指针的位置，当外部有播放器播放的时候，更新指针的位置
   */
  setPointer(t = 20) {
    let x = this.transV2P(t);
    this.update(this.pointer, x, t);
  }
  /**
   * 外部播放的时候调用
   * todo:优化
   * 1.当指针在可见窗口的左侧，指针移动到可视窗口的中间，
   * 2.然后指针位置继续向右移动，轨道向左移动，针式的视觉感受不动。
   * 3.当轨道无法再移动，指针继续向右移动，直到移动结束
   * 4.指针如果在可视区域的右侧，轨道移动，指针移动，结束
   */
  play(t) {
    this.setPointer(t);
  }
  /**
   * 工具函数，更新某个元素的位置
   */
  update(el, x, t) {
    el.style.transform = `translate(${x}px, 0px)`;
    el.setAttribute("data-x", x);
    (t || t === 0) && el.setAttribute("data-t", t);
  }
  /**
   * 工具函数，绑定事件
   */
  on(name, callback) {
    this.EventEmitter.on(name, callback);
  }
  /**
   * 工具函数，触发事件发射器
   */
  emit(name, data) {
    this.EventEmitter.emit(name, data);
  }
  /**
   * 工具函数，计算位置到时间的转换
   */
  transP2V(x) {
    return parseInt((x / this.trackerWidth) * this.duration, 10);
  }
  /**
   * 计算时间到位置的转换
   */
  transV2P(v) {
    return parseInt((v / this.duration) * this.trackerWidth, 10);
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
    if (this.hasItem(it)) return;
    this.items[it] = it;
    const item = this.createItemUi(it);
    this.tracker.appendChild(item);
  }
  /**
   * 判断该时间是否有节点
   * @param {*} it
   * @returns
   */
  hasItem(it) {
    return it && this.items[it];
  }
  /**
   * 根据时间来移除一个节点
   * @param {} it
   */
  removeItem(it) {
    const item = this.tracker.querySelector(`#${this.genId(it)}`);
    item && this.tracker.removeChild(item);
    delete this.items[it];
  }
  /**
   * 工具函数，根据时间来生成一个 id 名称
   * @param {} it
   * @returns
   */
  genId(it) {
    return `${this.itemConf.className}-${it}`;
  }
  /**
   * 根据时间来获取时间？奇怪不，但是确实有用
   * @param {*} it
   * @returns
   */
  getItem(it) {
    if (arguments.length) {
      return this.items[it];
    }
    return this.items;
  }
  /**
   * 创建试题的ui并且绑定事件
   * @param {*} time
   * @returns
   */
  createItemUi(time) {
    const div = document.createElement("div");
    div.className = this.itemConf.className;
    div.setAttribute(
      "style",
      `width:${
        this.itemConf.width
      }px;height:30px;background:red;position:absolute;top:60px;z-index:${this
        .index++}`
    );
    div.id = `${this.itemConf.className}-${time}`;
    this.update(div, this.transV2P(time) - this.itemConf.width / 2, time);
    this.endow(div, {
      start: () => {
        // 拖拽的时候把元素置于顶层
        div.style.zIndex = this.index++;
      },
      move: (event) => {
        const target = event.target;
        let x = (parseFloat(target.getAttribute("data-x")) || 0) + event.dx;
        // 计算元素的可拖拽范围
        const range = [
          this.trackerWidth - this.itemConf.width / 2,
          -this.itemConf.width / 2,
        ];
        this.update(target, this.realX(x, range));
      },
      end: (event) => {
        const target = event.target;
        let x = (parseFloat(target.getAttribute("data-x")) || 0) + event.dx;
        let current = this.transP2V(x + this.itemConf.width / 2);
        // 拖拽完成之后，修改了这个节点的 id ，因为removeItem 这个函数中要根据这个ID来删除这个节点
        target.id = this.genId(current);
        // 拖拽的起始位置记录一下
        let start = target.getAttribute("data-t");
        // 拖拽的结束位置设置一下
        target.setAttribute("data-t", current);
        // 拖拽结束把起始位置和结束位置发射出去更新数据
        this.emit(this.events.onItemDragEnd, {
          event,
          x,
          start: Number(start),
          current,
        });
        // dom 拖拽结束之后，要更新一下this.items中的数据
        this.items[current] = current;
        delete this.items[start];
      },
      tap: (event) => {
        div.style.zIndex = this.index++;
        const target = event.target;
        let x = parseFloat(target.getAttribute("data-x")) || 0;
        let current = this.transP2V(x + this.itemConf.width / 2);
        this.emit(this.events.onItemClick, { event, x, current });
      },
    });

    const del = this.createDelUI();
    div.appendChild(del);
    return div;
  }
  /**
   * 创建删除的 ui 并且绑定删除事件
   * @returns
   */
  createDelUI() {
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
        let current = this.transP2V(x + this.itemConf.width / 2);
        this.removeItem(current);
        this.emit(this.events.onItemDelClick, { event, x, current });
      },
    });
    return del;
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

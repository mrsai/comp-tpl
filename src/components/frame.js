import { Stage, Layer, Line, Text, Group, Rect } from "Konva";

class Frame {
  constructor(container, options) {
    this.container = container;
    this.options = options;
    this.stage = null;

    this.start = options.start;
    this.end = options.end;
    // 时长
    this.duration = (this.end - this.start) / 60;
    // 刻度距离上边界的距离
    this.rules = options.rules || {
      top: 20,
      color: "red",
      width: 1,
    };
    // 每个刻度的间距
    this.scale = this.scale || 20;
    this.init();
    this.render();
  }

  // 修正刻度
  fixScale() {
    const count = this.stage.width() / this.scale;
    if (count < this.duration) {
      this.scale = this.stage.width() / this.duration;
    }
  }
  // 初始化
  init() {
    const $el = document.getElementById(this.container);
    const { width, height } = $el.getBoundingClientRect();
    this.stage = new Stage({
      container: this.container,
      width: width,
      height: height,
    });
    this.layer = new Layer();
    this.stage.add(this.layer);
  }

  // 渲染
  render() {
    this.drawScale();
    this.layer.draw();
  }
  // 渲染刻度
  drawRule(start = 0) {
    // // 画刻度
    const rGroup = new Group();
    const grid = this.stage.width() / this.scale;
    for (let i = 0; i < grid; i++) {
      if (i * this.scale <= this.stage.width()) {
        const line = new Line({
          points: [
            start * this.scale + i * this.scale,
            this.rules.top,
            start * this.scale + i * this.scale,
            this.rules.top + 10,
          ],
          stroke: this.rules.color,
          strokeWidth: this.rules.width,
        });

        const fontSize = 12;
        // 估算了一个值4，这个需要研究一下 canvasz 的文字宽度的计算方式
        const offsetX = (String(i).length * fontSize) / 4;
        const text = new Text({
          x: i * this.scale - offsetX + start * this.scale,
          y: this.rules.top + 20,
          text: start + i,
          fontSize: 12,
          fontFamily: "Calibri",
          fill: "green",
        });
        rGroup.add(line);
        rGroup.add(text);
      }
    }
    return rGroup;
  }
  // 画刻度
  drawScale(start = 0) {
    // 创建一个组
    this.group = new Group({
      draggable: true,
      dragBoundFunc: function (pos) {
        return {
          x: pos.x,
          y: this.absolutePosition().y,
        };
      },
    });
    // 一个拖拽占位句柄
    const placeholder = new Rect({
      x: 0,
      y: 0,
      width: this.stage.width(),
      height: 50,
      fill: "transparent",
    });
    this.group.add(placeholder);
    // 画红线
    const redLine = new Line({
      points: [
        start * this.scale,
        this.rules.top,
        this.stage.width() + start * this.scale,
        this.rules.top,
      ],
      stroke: this.rules.color,
      strokeWidth: this.rules.width,
    });
    let rGroup = this.drawRule();
    this.group.add(redLine);
    this.group.add(rGroup);
    this.layer.add(this.group);

    // this.group.on("dragmove", (e) => {
    //   console.log(e.target.x());
    //   const offsetX = e.target.x();
    //   if (offsetX > 0) {
    //     rGroup.remove();
    //     rGroup = this.drawRule();
    //     this.group.add(rGroup);
    //   }
    // });
  }
}

export { Frame };

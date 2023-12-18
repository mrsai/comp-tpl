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

export default Measure;

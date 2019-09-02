import config from "@/router/config";

/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-08-13 17:12:40
 * @LastEditTime: 2019-08-23 16:36:56
 * @LastEditors: Please set LastEditors
 */

export type ProgressConfig = {
  percent: number;
  quantity: number;
  year: number;
};

class CircleUtils {
  canvasEle: any;
  ctx: CanvasRenderingContext2D;
  x: number;
  y: number;
  radius: number;

  constructor(canvasEle: HTMLCanvasElement, radius: number = 55) {
    const $canvas = <HTMLCanvasElement>canvasEle;
    this.canvasEle = $canvas;
    this.x = $canvas.width / 2;
    this.y = $canvas.height / 2;
    this.radius = radius;
    this.ctx = $canvas.getContext ? $canvas.getContext("2d") : null;
  }

  public init = (configs: ProgressConfig) => {
    this.animateProgress(0, configs.percent, configs.quantity, configs.year);
  };

  private drawCircle = () => {
    const pen = this.ctx;
    const beginAngle = 0;
    const endAngle = Math.PI * 2;
    this.canvasEle.width = this.x * 2;

    pen.save();
    pen.beginPath();
    pen.clearRect(0, 0, this.x * 2, this.y * 2);
    pen.arc(this.x, this.y, this.radius, beginAngle, endAngle);
    pen.lineWidth = 8;
    pen.strokeStyle = "rgba(106,214,255,0.2)";
    pen.stroke();
    pen.closePath();
  };

  private drawInnerCircle = (x: number, y: number, r: number) => {
    const pen = this.ctx;
    const beginAngle = 0;
    const endAngle = Math.PI * 2;

    pen.save();
    pen.beginPath();
    pen.arc(x, y, r, beginAngle, endAngle);
    pen.lineWidth = 1;
    pen.strokeStyle = "rgba(106,214,255,0.21)";
    pen.stroke();
    pen.closePath();
  };

  private drawProgress = (w: number, h: number, percent: number) => {
    const pen = this.ctx;
    const beginAngle = -0.5 * Math.PI;
    const endAngle = ((2 * Math.PI) / 100) * percent - 0.5 * Math.PI;
    const g = pen.createLinearGradient(this.x, 0, this.x, this.y);

    g.addColorStop(0.2, "rgba(110,130,255,1)");
    g.addColorStop(0.63, "rgba(255,130,156,1)");
    g.addColorStop(0.76, "rgba(253,255,110,1)");
    g.addColorStop(1, "rgba(62,232,255,1)");

    pen.save();
    pen.beginPath();
    pen.arc(w, h, this.radius, beginAngle, endAngle);
    pen.lineWidth = 6;
    pen.strokeStyle = g;
    pen.stroke();
    pen.closePath();
  };

  private drawInnerText = (percent: number, quantity: number, year: number) => {
    const pen = this.ctx;
    const text = percent + "%";
    const quantityStr = quantity + "";
    const yearStr = year + "";

    pen.save();
    pen.beginPath();
    pen.font = "24px serif";
    pen.fillStyle = "#fff";
    pen.textAlign = "center";
    pen.fillText(text, this.x, this.y);
    pen.font = "12px serif";
    pen.fillText(quantityStr, this.x, this.y + 20);
    pen.font = "14px";
    pen.fillStyle = "#6AD6FF";
    pen.fillText(yearStr, this.x, this.y * 1.95);
    pen.stroke();
    pen.closePath();
    pen.restore();
  };

  private animateProgress = (
    start: number = 0,
    end: number,
    quantity: number,
    year: number
  ) => {
    start++;

    if (start > end) {
      return;
    }

    // 清空画布
    this.canvasEle.width = this.x * 2;

    this.drawCircle();
    this.drawInnerCircle(this.x, this.y, this.radius - 15);
    this.drawProgress(this.x, this.y, start);
    this.drawInnerText(start, quantity, year);

    const timer = setTimeout(() => {
      clearTimeout(timer);
      this.animateProgress(start, end, quantity, year);
    }, 50);
  };
}

export default CircleUtils;

import React, { useEffect, useRef } from 'react';

const PI = Math.PI;
const DESIRED_DISTANCE = 30;
const MAX_ANGLE = Math.PI / 6;
const sizes = [10, 25, 40, 35, 30, 25, 10, 10];

class Point {
  x: number;
  y: number;
  size: number;
  xSpeed: number;
  ySpeed: number;
  targetX: number | null = null;
  targetY: number | null = null;

  constructor(x: number, y: number, size: number, xSpeed = 0, ySpeed = 0) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.xSpeed = xSpeed;
    this.ySpeed = ySpeed;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.strokeStyle = '#a82b18';
    ctx.lineWidth = 3;
    ctx.fillStyle = '#f23c1f';
    ctx.fill();
    ctx.stroke();
  }
}

class Line {
  p1: Point;
  p2: Point;

  constructor(p1: Point, p2: Point) {
    this.p1 = p1;
    this.p2 = p2;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.moveTo(this.p1.x, this.p1.y);
    ctx.lineTo(this.p2.x, this.p2.y);
    ctx.strokeStyle = '#a82b18';
    ctx.lineWidth = 4;
    ctx.stroke();
  }
}

const Canvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const WIDTH = canvas.width = window.innerWidth;
    const HEIGHT = canvas.height = window.innerHeight;

    const points: Point[] = sizes.map(size => new Point(WIDTH / 2, HEIGHT / 2, size, Math.random() * 4 - 2, Math.random() * 4 - 2));
    const lines: Line[] = [];

    for (let i = 0; i < points.length - 1; i++) {
      lines.push(new Line(points[i], points[i + 1]));
    }

    function draw() {
      if (ctx == null) return;
      ctx.clearRect(0, 0, WIDTH, HEIGHT);
      points.forEach(p => p.draw(ctx!!));
      lines.forEach(l => l.draw(ctx!!));
    }

    function update() {
      if (points.length > 1) {
        const p0 = points[0];
        if (p0.targetX !== null && p0.targetY !== null) {
          const dx = p0.targetX - p0.x;
          const dy = p0.targetY - p0.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance > 1) {
            p0.xSpeed = (dx / distance) * 2;
            p0.ySpeed = (dy / distance) * 2;
          } else {
            p0.xSpeed = 1;
            p0.ySpeed = 1;
            p0.targetX = null;
            p0.targetY = null;
          }
        }

        const p1 = points[1];
        let newX = p0.x + p0.xSpeed;
        let newY = p0.y + p0.ySpeed;
        let angle = Math.atan2(p1.y - p0.y, p1.x - p0.x);
        p1.x = p0.x + Math.cos(angle) * DESIRED_DISTANCE;
        p1.y = p0.y + Math.sin(angle) * DESIRED_DISTANCE;
        let movementAngle = Math.atan2(p0.ySpeed, p0.xSpeed);

        if (newX - DESIRED_DISTANCE <= 0 || newX + DESIRED_DISTANCE >= WIDTH || newY - DESIRED_DISTANCE <= 0 || newY + DESIRED_DISTANCE >= HEIGHT) {
          let angleAdjustment = Math.PI / 180;
          if (newX - DESIRED_DISTANCE <= 0 || newX + DESIRED_DISTANCE >= WIDTH) {
            movementAngle = Math.PI - movementAngle;
          }
          if (newY - DESIRED_DISTANCE <= 0 || newY + DESIRED_DISTANCE >= HEIGHT) {
            movementAngle = -movementAngle;
          }
          movementAngle += angleAdjustment;
          const speed = Math.sqrt(p0.xSpeed * p0.xSpeed + p0.ySpeed * p0.ySpeed);
          p0.xSpeed = Math.cos(movementAngle) * speed;
          p0.ySpeed = Math.sin(movementAngle) * speed;
        } else {
          p0.x = newX;
          p0.y = newY;
        }
      }

      for (let i = 2; i < points.length; i++) {
        const p0 = points[i - 2];
        const p1 = points[i - 1];
        const p2 = points[i];
        const angle1 = Math.atan2(p1.y - p0.y, p1.x - p0.x);
        const angle2 = Math.atan2(p2.y - p1.y, p2.x - p1.x);
        let diffAngle = angle2 - angle1;

        if (diffAngle > PI) diffAngle -= 2 * PI;
        else if (diffAngle < -PI) diffAngle += 2 * PI;

        if (Math.abs(diffAngle) > MAX_ANGLE) {
          const newAngle = angle1 + Math.sign(diffAngle) * MAX_ANGLE;
          p2.x = p1.x + Math.cos(newAngle) * DESIRED_DISTANCE;
          p2.y = p1.y + Math.sin(newAngle) * DESIRED_DISTANCE;
        } else {
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (distance !== DESIRED_DISTANCE) {
            const angle = Math.atan2(dy, dx);
            p2.x = p1.x - Math.cos(angle) * DESIRED_DISTANCE;
            p2.y = p1.y - Math.sin(angle) * DESIRED_DISTANCE;
          }
        }
      }
    }

    function handleClick(event: MouseEvent) {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      points[0].targetX = x;
      points[0].targetY = y;
    }

    canvas.addEventListener('click', handleClick);

    function loop() {
      update();
      draw();
      requestAnimationFrame(loop);
    }

    loop();

    return () => {
      canvas.removeEventListener('click', handleClick);
    };
  }, []);

  return <canvas ref={canvasRef} className="w-full h-full"></canvas>;
};

export default Canvas;

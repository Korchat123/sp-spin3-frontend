// src/component/customer/InteractivePoolGrid.jsx
import React, { useRef, useEffect } from "react";

export default function InteractivePoolGrid({ children }) {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let animationFrameId;

    // เซ็ตขนาด Canvas ให้เต็มกล่อง
    let width = (canvas.width = container.offsetWidth);
    let height = (canvas.height = container.offsetHeight);

    // เก็บตำแหน่งเมาส์ (เป้าหมาย และ ตำแหน่งปัจจุบันสำหรับทำสมูทตี้)
    let mouse = { x: -1000, y: -1000, targetX: -1000, targetY: -1000 };

    const handleMouseMove = (e) => {
      const rect = container.getBoundingClientRect();
      mouse.targetX = e.clientX - rect.left;
      mouse.targetY = e.clientY - rect.top;
    };

    const handleMouseLeave = () => {
      // เอาเมาส์ออกปุ๊บ เอาเป้าหมายไปซ่อนไกลๆ ลายเส้นจะได้เด้งกลับที่เดิม
      mouse.targetX = -1000;
      mouse.targetY = -1000;
    };

    const handleResize = () => {
      width = canvas.width = container.offsetWidth;
      height = canvas.height = container.offsetHeight;
    };

    container.addEventListener("mousemove", handleMouseMove);
    container.addEventListener("mouseleave", handleMouseLeave);
    window.addEventListener("resize", handleResize);

    // ─── 🎨 ลอจิกการวาดเส้น (Render Loop) ───
    const render = () => {
      // 1. ทำให้เมาส์ตามแบบหน่วงๆ (Easing) ดูเป็นธรรมชาติขึ้น
      mouse.x += (mouse.targetX - mouse.x) * 0.1;
      mouse.y += (mouse.targetY - mouse.y) * 0.1;

      // ล้างหน้าจอก่อนวาดเฟรมใหม่
      ctx.clearRect(0, 0, width, height);

      // ตั้งค่าสีเส้นตาราง (สีเทาเข้มโปร่งใส)
      ctx.strokeStyle = "rgba(36, 36, 36, 0.12)";
      ctx.lineWidth = 1.5;

      const spacing = 60; // ความกว้างของช่องตาราง
      const radius = 120; // รัศมีวงกลมที่เมาส์จะไปดันเส้น
      const tension = 0.4; // ความแรงในการดันเส้น

      // ─── วาดเส้นแนวนอน ───
      for (let y = 0; y <= height + spacing; y += spacing) {
        ctx.beginPath();
        for (let x = 0; x <= width + 20; x += 20) {
          // วาดจุดต่อจุดทุกๆ 20px
          let dx = mouse.x - x;
          let dy = mouse.y - y;
          let dist = Math.sqrt(dx * dx + dy * dy);

          let offsetX = 0;
          let offsetY = 0;

          // ถ้าจุดนี้อยู่ใกล้เมาส์ ให้ผลักมันออก
          if (dist < radius) {
            let force = Math.pow((radius - dist) / radius, 2);
            offsetX = -dx * force * tension;
            offsetY = -dy * force * tension;
          }

          if (x === 0) ctx.moveTo(x + offsetX, y + offsetY);
          else ctx.lineTo(x + offsetX, y + offsetY);
        }
        ctx.stroke();
      }

      // ─── วาดเส้นแนวตั้ง ───
      for (let x = 0; x <= width + spacing; x += spacing) {
        ctx.beginPath();
        for (let y = 0; y <= height + 20; y += 20) {
          let dx = mouse.x - x;
          let dy = mouse.y - y;
          let dist = Math.sqrt(dx * dx + dy * dy);

          let offsetX = 0;
          let offsetY = 0;

          if (dist < radius) {
            let force = Math.pow((radius - dist) / radius, 2);
            offsetX = -dx * force * tension;
            offsetY = -dy * force * tension;
          }

          if (y === 0) ctx.moveTo(x + offsetX, y + offsetY);
          else ctx.lineTo(x + offsetX, y + offsetY);
        }
        ctx.stroke();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      container.removeEventListener("mousemove", handleMouseMove);
      container.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full overflow-hidden bg-[#eeeeee]"
    >
      {/* ผืนผ้าใบวาดเส้นตาราง (วางไว้หลังสุด z-0) */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 z-0 pointer-events-none"
      />

      {/* เนื้อหาด้านบน (ปุ่มกด ฟอร์มต่างๆ ยังทำงานได้ปกติเพราะอยู่ z-10) */}
      <div className="relative z-10 w-full">{children}</div>
    </div>
  );
}

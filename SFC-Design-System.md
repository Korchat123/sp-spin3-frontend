# Serious Fried Chicken (SFC) Design System

**Version:** 1.0 (The Crispy Update)
**Theme:** Street Culture | Lo-fi | Gen Z | Brutalist Design

---

## Color Palette (The "Serious" Colors)

| Role           | Color         | Hex       | Description                                            |
| :------------- | :------------ | :-------- | :----------------------------------------------------- |
| **Primary**    | Serious Red   | `#e4002b` | สีหลักของแบรนด์ ใช้กับ CTA, Background เด่นๆ           |
| **Secondary**  | Street Orange | `#DC5F00` | สีเน้นสำหรับสติ๊กเกอร์, จุดที่ต้องการให้กด (Order Now) |
| **Dark Base**  | Night Black   | `#242424` | สีฟอนต์หลัก, เส้นขอบ (Border), และเงา (Shadow)         |
| **Background** | Concrete      | `#eeeeee` | สีพื้นหลังเว็บไซต์ ให้ฟีลลิ่งสตรีท                     |
| **Surface**    | Clean White   | `#ffffff` | พื้นหลังการ์ดหรือส่วนที่ต้องการให้อ่านง่าย             |

### Sprinkle Colors (Pastels) ไม่ใช้บ่อย แค่โอกาสพิเศษ

ใช้สำหรับ Confetti หรือ Sprinkles ตกแต่ง:

- Yellow: `#FDE68A`
- Pink: `#FBCFE8`
- Mint: `#A7F3D0`
- Peach: `#FFDAB9`

---

## Typography

| Style         | Font Family          | Case      | Usage                                  |
| :------------ | :------------------- | :-------- | :------------------------------------- |
| **Heading**   | `Bebas Neue`         | Uppercase | หัวข้อใหญ่, ชื่อเมนู (Tracking: Wider) |
| **Body / UI** | `IBM Plex Sans Thai` | Normal    | เนื้อหา, รายละเอียด, ปุ่มลิ้งค์ต่างๆ   |

---

## UI Components & Elements

### 1. The "Street" Button ใช้กับปุ่ม CTA ส่วนมากที่ต้องการให้เด่น มีแรงเงา

ดีไซน์แบบ Brutalist เน้นความดิบและมั่นคง

- **Border:** `2px solid #242424`
- **Shadow:** `8px 8px 0 #242424` (Flat shadow ไม่เบลอ)
- **Hover State:** ขยับลง `translate-y-[4px]` และลดขนาดเงาเหลือ `4px`
- **Animation:** ใส่ Overlay สีแดงวิ่งจากซ้ายไปขวาตอน Hover

### 2. Starburst Sticker (เช่น Order Now) ใช้กับสติกเกอร์ที่ต้องการ call for attention

ใช้ `clip-path` ทรงฟันปลา (20 points)

- **Color:** `#DC5F00`
- **Rotation:** เอียง `12deg`
- **Animation:** `animate-pulse` หรือ `animate-fast-pulse` เพื่อเรียกความสนใจ

### 3. Cards & Sections

- **Corner Radius:** `2rem` (32px) ถึง `3rem` (48px)
- **Border:** `1px solid #e5e7eb` (หรือจางๆ) เพื่อให้เงาสีดำดูโดดเด่น

---

## Motion & Animations

- **Floating Effect:** รูปอาหารหรือไก่ต้องมีแอนิเมชัน `translateY` ขึ้นลงเบาๆ (ประมาณ 15-20px)
- **Parallax Fly-Through:** เมื่อเลื่อน Scroll รูปภาพควรขยับเร็วกว่าการไถปกติ เพื่อสร้างมิติ
- **Dancing Letters:** ตัวอักษรใน Footer หรือพาดหัวบางจุด ให้เอียงสลับซ้าย-ขวา (`rotate-[-4deg]` / `rotate-[4deg]`)
- **Follow Eye:** ลูกตาในโลโก้ SERIOUS ต้องขยับตาม Mouse Move เสมอ

---

## Key Visuals (Brand Assets)

1. **Chicken Character:** ต้องมีความกวน (Dabbing, Resting)
2. **Sprinkles:** ทรงเรียวยาว (Pill shape) สีพาสเทล โรยกระจายแบบสุ่ม
3. **Black Bottom Bar:** ปิดท้ายหน้าเว็บด้วยบาร์สีดำ `#1a1a1a` เพื่อความหนักแน่น

---

## Code Implementation Quick-Tips (Tailwind CSS)

- **Primary Shadow:** `shadow-[8px_8px_0_#242424]`
- **Bebas Neue:** `font-['Bebas_Neue'] tracking-widest uppercase`
- **Smooth Transition:** `transition-all duration-300 ease-in-out`

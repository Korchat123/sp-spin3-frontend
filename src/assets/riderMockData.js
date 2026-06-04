// src/assets/riderMockData.js
// ข้อมูลจำลองสำหรับฐานข้อมูลการจัดส่ง (ใช้ทดสอบ Filter ย้อนหลัง)

export const riderMockOrders = [
  {
    _id: "ORD-20260601-001",
    type: "delivery",
    status: "delivered",
    customer: {
      name: "คุณสมชาย",
      contact: "081-111-2222",
      address: "123/45 หมู่บ้านพฤกษา บางนา",
      note: "ฝากไว้ที่ป้อมยาม"
    },
    orderList: [
      { name: "SIGNATURE 8PC BUCKET", quantity: 1, price: 299, image: "/images/menu-sig8pcbuc.png" }
    ],
    totalPrice: 299,
    createdAt: "2026-06-01T10:00:00Z",
    deliveredAt: "2026-06-01T10:45:00Z",
    riderNote: "ส่งเรียบร้อยที่ป้อมยาม"
  },
  {
    _id: "ORD-20260602-002",
    type: "delivery",
    status: "delivered",
    customer: {
      name: "คุณวิภา",
      contact: "082-222-3333",
      address: "คอนโดศุภาลัย อโศก ชั้น 12",
      note: "โทรหาเมื่อถึง"
    },
    orderList: [
      { name: "ZINGER BURGER", quantity: 2, price: 198, image: "/images/menu-zinger.png" },
      { name: "COCA-COLA", quantity: 2, price: 60, image: "/images/menu-cola.png" }
    ],
    totalPrice: 258,
    createdAt: "2026-06-02T12:30:00Z",
    deliveredAt: "2026-06-02T13:10:00Z",
    riderNote: "ส่งให้ลูกค้าโดยตรง"
  },
  {
    _id: "ORD-20260603-003",
    type: "delivery",
    status: "cancelled",
    customer: {
      name: "คุณมานะ",
      contact: "083-333-4444",
      address: "ซอยสุขุมวิท 23",
      note: "รอนานยกเลิกได้"
    },
    orderList: [
      { name: "CHICK N SHARE", quantity: 1, price: 99, image: "/images/menu-chicknshare.png" }
    ],
    totalPrice: 99,
    createdAt: "2026-06-03T18:00:00Z",
    deliveredAt: "2026-06-03T18:30:00Z",
    riderNote: "ติดต่อลูกค้าไม่ได้"
  },
  {
    _id: "ORD-20260530-001",
    type: "delivery",
    status: "delivered",
    customer: {
      name: "คุณจอย",
      contact: "084-444-5555",
      address: "หอพักสตรี จุฬาลงกรณ์",
      note: "วางหน้าหอ"
    },
    orderList: [
      { name: "PARTY PACK", quantity: 1, price: 459, image: "/images/menu-partypack.png" }
    ],
    totalPrice: 459,
    createdAt: "2026-05-30T11:00:00Z",
    deliveredAt: "2026-05-30T11:40:00Z",
    riderNote: "วางไว้ที่โต๊ะรับของ"
  }
];

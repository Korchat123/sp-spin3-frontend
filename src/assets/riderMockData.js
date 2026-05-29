// src/assets/riderMockData.js

export const riderMockOrders = [
  {
    id: "DEL-1001",
    orderId: "DEL-1001",
    type: "delivery",
    status: "preparing",
    customer: {
      name: "สมชาย รักดี",
      contact: "081-234-5678",
      address: "123/45 หมู่บ้านแสนสุข ซอยสุขุมวิท 101 กรุงเทพฯ",
      note: "ฝากไว้ที่ป้อมยามหน้าหมู่บ้าน แล้วโทรแจ้งด้วยครับ",
    },
    orderList: [
      {
        id: "item-1",
        name: "SIGNATURE 8PC BUCKET",
        quantity: 1,
        price: 299,
        image: "/images/menu-sig8pcbuc.png",
        status: "finished",
        orderTime: new Date(Date.now() - 3600000), // 1 hour ago
      },
      {
        id: "item-2",
        name: "GOLDEN FRIES L",
        quantity: 2,
        price: 49,
        image: "/images/menu-goldenfries.png",
        status: "Cook", // Still preparing
        orderTime: new Date(Date.now() - 3600000),
      }
    ],
  },
  {
    id: "DEL-1002",
    orderId: "DEL-1002",
    type: "delivery",
    status: "ready",
    customer: {
      name: "วิภาวดี มานะ",
      contact: "099-888-7766",
      address: "คอนโดวิวสวย ชั้น 12 ห้อง 1204 ถนนรัชดาภิเษก",
      note: "กรุณาใส่หน้ากากอนามัยตอนส่งของ",
    },
    orderList: [
      {
        id: "item-3",
        name: "ZINGER DOUBLE BURGER",
        quantity: 2,
        price: 199,
        image: "/images/menu-zinger.png",
        status: "finished",
        orderTime: new Date(Date.now() - 1800000), // 30 mins ago
      },
      {
        id: "item-4",
        name: "COCA-COLA",
        quantity: 2,
        price: 39,
        image: "/images/menu-cola.png",
        status: "finished",
        orderTime: new Date(Date.now() - 1800000),
      }
    ],
  },
  {
    id: "DEL-1003",
    orderId: "DEL-1003",
    type: "delivery",
    status: "delivered",
    customer: {
      name: "มานะ อดทน",
      contact: "082-333-4455",
      address: "99/9 หมู่บ้านจัดสรร ถนนเกษตร-นวมินทร์",
      note: "บ้านรั้วสีฟ้า",
    },
    orderList: [
      {
        id: "item-5",
        name: "CHICK N SHARE",
        quantity: 3,
        price: 99,
        image: "/images/menu-chicknshare.png",
        status: "finished",
        orderTime: new Date(Date.now() - 7200000), // 2 hours ago
      }
    ],
  },
  {
    id: "DEL-1004",
    orderId: "DEL-1004",
    type: "delivery",
    status: "cancelled",
    customer: {
      name: "ใจดี มีสุข",
      contact: "085-000-1122",
      address: "อาคารออฟฟิศ แยกรัชดา",
      note: "ชั้น 5 แผนกไอที",
    },
    orderList: [
      {
        id: "item-6",
        name: "PARTY PACK 20PC",
        quantity: 1,
        price: 555,
        image: "/images/menu-partypack.png",
        status: "cancel",
        orderTime: new Date(Date.now() - 10800000), // 3 hours ago
      }
    ],
  }
];

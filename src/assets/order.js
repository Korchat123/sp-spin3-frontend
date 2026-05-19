// src/assets/order.js

export const orders = [
  {
    id: "1",
    type: "delivery",
    customer: {
      name: "สมชาย รักดี",
      contact: "081-234-5678",
      address: "123/45 หมู่บ้านแสนสุข ซอยสุขุมวิท 101 เขตพระโขนง กรุงเทพฯ 10110",
      note: "ฝากไว้ที่ป้อมยามหน้าหมู่บ้าน แล้วโทรแจ้งด้วยครับ"
    },
    orderList: [
      { 
        id: 1, 
        name: "fire_chicken", 
        quantity: 2, 
        price: 159, 
        image: "https://images.unsplash.com/photo-1567620832903-9fc6debc209f?q=80&w=200&auto=format&fit=crop", // รูปไก่ทอดเผ็ด
        status: "finished", 
        orderTime: new Date(2026, 4, 6, 15, 0, 15) 
      },
      { 
        id: 2, 
        name: "burger", 
        quantity: 1, 
        price: 89, 
        image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=200&auto=format&fit=crop", // รูปเบอร์เกอร์
        status: "finished", 
        orderTime: new Date(2026, 4, 6, 15, 10, 0) 
      },
      { 
        id: 3, 
        name: "french_fries", 
        quantity: 2, 
        price: 55, 
        image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?q=80&w=200&auto=format&fit=crop", // รูปเฟรนช์ฟรายส์
        status: "finished", 
        orderTime: new Date(2026, 4, 6, 15, 15, 30) 
      }
    ]
  },
  {
    id: "2",
    type: "Onsite",
    customer: {
      name: "Table 05",
      contact: "N/A",
      address: "In-Store",
      note: "ขอซอสมะเขือเทศเพิ่ม"
    },
    orderList: [
      { 
        id: 1, 
        name: "fire_chicken", 
        quantity: 5, 
        price: 159, 
        image: "https://images.unsplash.com/photo-1567620832903-9fc6debc209f?q=80&w=200&auto=format&fit=crop",
        status: "Cook", 
        orderTime: new Date(2026, 4, 6, 15, 20, 15) 
      }
    ]
  },
  {
    id: "3",
    type: "delivery",
    customer: {
      name: "วิภาวดี มานะ",
      contact: "099-888-7766",
      address: "คอนโดวิวสวย ชั้น 12 ห้อง 1204 ถนนรัชดาภิเษก",
      note: "กรุณาใส่หน้ากากอนามัยตอนส่งของ"
    },
    orderList: [
      { 
        id: 1, 
        name: "burger", 
        quantity: 2, 
        price: 89, 
        image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=200&auto=format&fit=crop",
        status: "InKitchen", 
        orderTime: new Date(2026, 4, 6, 15, 45, 0) 
      }
    ]
  }
];

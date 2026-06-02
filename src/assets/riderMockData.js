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
        orderTime: new Date(), // Today
      },
      {
        id: "item-2",
        name: "GOLDEN FRIES L",
        quantity: 2,
        price: 49,
        image: "/images/menu-goldenfries.png",
        status: "Cook", // Still preparing
        orderTime: new Date(), // Today
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
    status: "ready",
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
    status: "delivered",
    customer: {
      name: "ใจดี มีสุข",
      contact: "085-000-1122",
      address: "อาคารออฟฟิศ แยกรัชดา ชั้น 5 แผนกไอที",
      note: "ชั้น 5 แผนกไอที",
    },
    orderList: [
      {
        id: "item-6",
        name: "PARTY PACK 20PC",
        quantity: 1,
        price: 555,
        image: "/images/menu-partypack.png",
        status: "finished",
        orderTime: new Date(Date.now() - 86400000 * 2), // 2 days ago
      }
    ],
  },
  {
    id: "DEL-1005",
    orderId: "DEL-1005",
    type: "delivery",
    status: "delivered",
    customer: {
      name: "พัชร ศรีวิลาส",
      contact: "086-123-4567",
      address: "147/8 เพชรบุรี 36 ซอยลัดดาวน์ กรุงเทพฯ",
      note: "บ้านใหม่ หากไม่เจอโทรมาได้",
    },
    orderList: [
      {
        id: "item-7",
        name: "CRISPY CHICKEN SANDWICH",
        quantity: 3,
        price: 129,
        image: "/images/menu-spicychicksand.png",
        status: "finished",
        orderTime: new Date(Date.now() - 86400000 * 3),
      },
      {
        id: "item-8",
        name: "SPICY MAYO MAYO",
        quantity: 2,
        price: 59,
        image: "/images/menu-soft.png",
        status: "finished",
        orderTime: new Date(Date.now() - 86400000 * 3),
      }
    ],
  },
  {
    id: "DEL-1006",
    orderId: "DEL-1006",
    type: "delivery",
    status: "delivered",
    customer: {
      name: "สุชาติ ไทยแท้",
      contact: "089-555-6666",
      address: "34/5 หมู่บ้านพฤษแสม ซอยวิทยุ 49 บางโพ",
      note: "รั้วสีแดง หน้าบ้านมีป้ายชื่อ",
    },
    orderList: [
      {
        id: "item-9",
        name: "ZINGER TOWER",
        quantity: 1,
        price: 449,
        image: "/images/menu-zabbteambox.png",
        status: "finished",
        orderTime: new Date(Date.now() - 86400000 * 1),
      },
      {
        id: "item-10",
        name: "GOLDEN FRIES XL",
        quantity: 1,
        price: 79,
        image: "/images/menu-goldenfries.png",
        status: "finished",
        orderTime: new Date(Date.now() - 86400000 * 1),
      },
      {
        id: "item-11",
        name: "SPRITE",
        quantity: 3,
        price: 35,
        image: "/images/menu-soft.png",
        status: "finished",
        orderTime: new Date(Date.now() - 86400000 * 1),
      }
    ],
  },
  {
    id: "DEL-1007",
    orderId: "DEL-1007",
    type: "delivery",
    status: "cancelled",
    customer: {
      name: "ปฐมพร พงษ์ศรี",
      contact: "082-888-9999",
      address: "235 เพิ่มสิน ซอย 13 หัวเฉียว",
      note: "ร้านเสื้อผ้า หน้าโครงการ",
    },
    orderList: [
      {
        id: "item-12",
        name: "SIGNATURE BUCKET 12PC",
        quantity: 1,
        price: 459,
        image: "/images/menu-sig12pc.png",
        status: "finished",
        orderTime: new Date(Date.now() - 86400000 * 4),
      }
    ],
  },
  {
    id: "DEL-1008",
    orderId: "DEL-1008",
    type: "delivery",
    status: "delivered",
    customer: {
      name: "วัฒนา ศรีกุล",
      contact: "087-234-5678",
      address: "99 อ่อนนุช ซอย 49/1 ประเวศ",
      note: "ตึกสีขาว ห้องเหลือบ้าน",
    },
    orderList: [
      {
        id: "item-13",
        name: "POPCORN CHICKEN",
        quantity: 2,
        price: 139,
        image: "/images/menu-popcorn.png",
        status: "finished",
        orderTime: new Date(Date.now() - 86400000 * 2.5),
      },
      {
        id: "item-14",
        name: "COLESLAW M",
        quantity: 1,
        price: 49,
        image: "/images/menu-coleslaw.png",
        status: "finished",
        orderTime: new Date(Date.now() - 86400000 * 2.5),
      }
    ],
  },
  {
    id: "DEL-1009",
    orderId: "DEL-1009",
    type: "delivery",
    status: "delivered",
    customer: {
      name: "สรัญญา บุญศรี",
      contact: "090-111-2222",
      address: "8 ศรีนครินทร์ ซอย 38 ประเวศ",
      note: "อพาร์ท 303 ตรง BTS",
    },
    orderList: [
      {
        id: "item-15",
        name: "HOT & SPICY BURGER",
        quantity: 2,
        price: 189,
        image: "/images/menu-hotspicy.png",
        status: "finished",
        orderTime: new Date(Date.now() - 86400000 * 1.5),
      },
      {
        id: "item-16",
        name: "FRENCH FRIES L",
        quantity: 2,
        price: 59,
        image: "/images/menu-fries.png",
        status: "finished",
        orderTime: new Date(Date.now() - 86400000 * 1.5),
      },
      {
        id: "item-17",
        name: "ICED TEA",
        quantity: 2,
        price: 29,
        image: "/images/menu-icedtea.png",
        status: "finished",
        orderTime: new Date(Date.now() - 86400000 * 1.5),
      }
    ],
  },
  {
    id: "DEL-1010",
    orderId: "DEL-1010",
    type: "delivery",
    status: "delivered",
    customer: {
      name: "กฤษณ์ จันทร์สุขี",
      contact: "084-666-7777",
      address: "125/7 ราชเทวี ซอย เดื่อ กรุงเทพฯ",
      note: "ร้านกาแฟ ฝากเคาน์เตอร์",
    },
    orderList: [
      {
        id: "item-18",
        name: "ZINGER 3PC BOX",
        quantity: 3,
        price: 199,
        image: "/images/menu-zinger3pc.png",
        status: "finished",
        orderTime: new Date(Date.now() - 86400000 * 5),
      }
    ],
  },
  {
    id: "DEL-1011",
    orderId: "DEL-1011",
    type: "delivery",
    status: "delivered",
    customer: {
      name: "นิยมพร นิยม",
      contact: "083-999-0000",
      address: "456/12 ปรัญชบุรี ซอย 18 ดินแดง",
      note: "โรงแรม ห้องสัมมนา",
    },
    orderList: [
      {
        id: "item-19",
        name: "PARTY PACK 12PC",
        quantity: 1,
        price: 349,
        image: "/images/menu-partypack.png",
        status: "finished",
        orderTime: new Date(Date.now() - 86400000 * 6),
      },
      {
        id: "item-20",
        name: "GOLDEN FRIES XL",
        quantity: 2,
        price: 79,
        image: "/images/menu-goldenfries.png",
        status: "finished",
        orderTime: new Date(Date.now() - 86400000 * 6),
      }
    ],
  },
  {
    id: "DEL-1012",
    orderId: "DEL-1012",
    type: "delivery",
    status: "delivered",
    customer: {
      name: "วิชัย ชัยวัฒน์",
      contact: "081-777-8888",
      address: "789/45 เศรษฐศิริ ซอย เฉลิมพระเกียรติ บึง",
      note: "บ้านมุมซอย",
    },
    orderList: [
      {
        id: "item-21",
        name: "CRISPY CHICKEN 2PC",
        quantity: 4,
        price: 149,
        image: "/images/menu-crispy2pc.png",
        status: "finished",
        orderTime: new Date(Date.now() - 86400000 * 3.5),
      },
      {
        id: "item-22",
        name: "CHEESE FRIES M",
        quantity: 1,
        price: 69,
        image: "/images/menu-cheesefries.png",
        status: "finished",
        orderTime: new Date(Date.now() - 86400000 * 3.5),
      }
    ],
  },
  {
    id: "DEL-1013",
    orderId: "DEL-1013",
    type: "delivery",
    status: "delivered",
    customer: {
      name: "สมหวัง เสาวัณณ์",
      contact: "088-333-4444",
      address: "234 ตรีชุมศรี ซอย 5 อ่อนนุช",
      note: "บ้านรั้วกระชังสี",
    },
    orderList: [
      {
        id: "item-23",
        name: "ORIGINAL CHICKEN BUCKET",
        quantity: 1,
        price: 449,
        image: "/images/menu-smilebucket.png",
        status: "finished",
        orderTime: new Date(Date.now() - 86400000 * 4.2),
      },
      {
        id: "item-24",
        name: "CORN SALAD",
        quantity: 1,
        price: 59,
        image: "/images/menu-cornsalad.png",
        status: "finished",
        orderTime: new Date(Date.now() - 86400000 * 4.2),
      }
    ],
  },
  {
    id: "DEL-1014",
    orderId: "DEL-1014",
    type: "delivery",
    status: "cancelled",
    customer: {
      name: "สิรินันท์ ทองคำ",
      contact: "092-555-6666",
      address: "567/8 สุขาภิบาล 4 หนองแขม",
      note: "ห้องทำงาน ชั้น 6",
    },
    orderList: [
      {
        id: "item-25",
        name: "SUPER COMBO",
        quantity: 1,
        price: 599,
        image: "/images/menu-zabbteambox.png",
        status: "finished",
        orderTime: new Date(Date.now() - 86400000 * 5.5),
      }
    ],
  },
  {
    id: "DEL-1015",
    orderId: "DEL-1015",
    type: "delivery",
    status: "delivered",
    customer: {
      name: "อภิรักษ์ สุภามิตร",
      contact: "085-888-9999",
      address: "890/12 ศรีบูญ ซอย 32 ป้อมปราณ",
      note: "ตรงข้ามวัด",
    },
    orderList: [
      {
        id: "item-26",
        name: "TENDERS 5PC BOX",
        quantity: 2,
        price: 219,
        image: "/images/menu-chickskate.png",
        status: "finished",
        orderTime: new Date(Date.now() - 86400000 * 7),
      },
      {
        id: "item-27",
        name: "BAKED BEANS",
        quantity: 1,
        price: 45,
        image: "/images/menu-tteokbokki.png",
        status: "finished",
        orderTime: new Date(Date.now() - 86400000 * 7),
      }
    ],
  },
  {
    id: "DEL-1016",
    orderId: "DEL-1016",
    type: "delivery",
    status: "delivered",
    customer: {
      name: "ลายหนี่ ตั้งใจ",
      contact: "089-111-2222",
      address: "345/67 อิสรภาพ ซอย 20 บาง เขน",
      note: "บ้านสีชมพู ประตูดำ",
    },
    orderList: [
      {
        id: "item-28",
        name: "ZINGER BOX 2PC",
        quantity: 1,
        price: 239,
        image: "/images/menu-zinger.png",
        status: "finished",
        orderTime: new Date(Date.now() - 86400000 * 2.8),
      },
      {
        id: "item-29",
        name: "GRAVY",
        quantity: 2,
        price: 25,
        image: "/images/menu-soft.png",
        status: "finished",
        orderTime: new Date(Date.now() - 86400000 * 2.8),
      }
    ],
  },
  {
    id: "DEL-1017",
    orderId: "DEL-1017",
    type: "delivery",
    status: "delivered",
    customer: {
      name: "เมศวร์ สงคราม",
      contact: "082-777-8888",
      address: "612/78 กำแพงแสน ซอย 26 บ้านสวน",
      note: "โปรดโทรแจ้งเมื่อมาถึง",
    },
    orderList: [
      {
        id: "item-30",
        name: "FRIED RICE BOWL",
        quantity: 3,
        price: 129,
        image: "/images/menu-japchae.png",
        status: "finished",
        orderTime: new Date(Date.now() - 86400000 * 6.5),
      }
    ],
  },
  {
    id: "DEL-1018",
    orderId: "DEL-1018",
    type: "delivery",
    status: "delivered",
    customer: {
      name: "ชนิดา วังบัวแสน",
      contact: "086-444-5555",
      address: "901/23 เทพาพร ซอย 55 สวนกุหลาบ",
      note: "ข้างบ้านปั้มน้ำมัน",
    },
    orderList: [
      {
        id: "item-31",
        name: "BBQ PLATTER",
        quantity: 1,
        price: 399,
        image: "/images/menu-smilebucket2.png",
        status: "finished",
        orderTime: new Date(Date.now() - 86400000 * 8),
      },
      {
        id: "item-32",
        name: "COLESLAW L",
        quantity: 1,
        price: 69,
        image: "/images/menu-coleslaw.png",
        status: "finished",
        orderTime: new Date(Date.now() - 86400000 * 8),
      }
    ],
  },
  {
    id: "DEL-1019",
    orderId: "DEL-1019",
    type: "delivery",
    status: "delivered",
    customer: {
      name: "คมสัน บุญชูนอก",
      contact: "087-666-7777",
      address: "123/89 สัมเมือง ซอย 4 ลาดกระบัง",
      note: "บ้านใหม่โครงการใหญ่",
    },
    orderList: [
      {
        id: "item-33",
        name: "CHICKEN CHOP COMBO",
        quantity: 2,
        price: 349,
        image: "/images/menu-classsandwich.png",
        status: "finished",
        orderTime: new Date(Date.now() - 86400000 * 1.2),
      }
    ],
  },
  {
    id: "DEL-1020",
    orderId: "DEL-1020",
    type: "delivery",
    status: "delivered",
    customer: {
      name: "ดนัย ศรีชัย",
      contact: "083-111-2222",
      address: "456/34 จรัสแสง ซอย 12 ราชสัตร์",
      note: "สำนักงาน ชั้น 3",
    },
    orderList: [
      {
        id: "item-34",
        name: "CRISPY CHICKEN FAMILY SET",
        quantity: 1,
        price: 659,
        image: "/images/menu-smilebucket2.png",
        status: "finished",
        orderTime: new Date(Date.now() - 86400000 * 3.3),
      },
      {
        id: "item-35",
        name: "GOLDEN FRIES XL",
        quantity: 2,
        price: 79,
        image: "/images/menu-goldenfries.png",
        status: "finished",
        orderTime: new Date(Date.now() - 86400000 * 3.3),
      },
      {
        id: "item-36",
        name: "PEPSI BOTTLE",
        quantity: 3,
        price: 39,
        image: "/images/menu-soft.png",
        status: "finished",
        orderTime: new Date(Date.now() - 86400000 * 3.3),
      }
    ],
  },
  {
    id: "DEL-1021",
    orderId: "DEL-1021",
    type: "delivery",
    status: "preparing",
    customer: {
      name: "นัทธมน พูนสุข",
      contact: "080-444-5555",
      address: "19/7 สุขุมวิท 101 ใกล้ BTS ปุณณวิถี",
      note: "กรุณาเคาะประตูสองครั้ง",
    },
    orderList: [
      {
        id: "item-37",
        name: "SIGNATURE 8PC BUCKET",
        quantity: 1,
        price: 299,
        image: "/images/menu-sig8pcbuc.png",
        status: "Cook",
        orderTime: new Date(Date.now() - 86400000 * 0.8),
      },
      {
        id: "item-38",
        name: "COCA-COLA",
        quantity: 1,
        price: 39,
        image: "/images/menu-cola.png",
        status: "pending",
        orderTime: new Date(Date.now() - 86400000 * 0.8),
      }
    ],
  },
  {
    id: "DEL-1022",
    orderId: "DEL-1022",
    type: "delivery",
    status: "ready",
    customer: {
      name: "ลลิตา เจริญทรัพย์",
      contact: "091-222-3333",
      address: "88/3 ลาดพร้าว 71 วังทองหลาง",
      note: "บ้านคอนโดชั้น 5",
    },
    orderList: [
      {
        id: "item-39",
        name: "ZINGER DOUBLE BURGER",
        quantity: 2,
        price: 199,
        image: "/images/menu-zinger.png",
        status: "finished",
        orderTime: new Date(Date.now() - 86400000 * 1.1),
      },
      {
        id: "item-40",
        name: "GOLDEN FRIES L",
        quantity: 1,
        price: 49,
        image: "/images/menu-goldenfries.png",
        status: "finished",
        orderTime: new Date(Date.now() - 86400000 * 1.1),
      },
      {
        id: "item-41",
        name: "SPRITE",
        quantity: 1,
        price: 35,
        image: "/images/menu-soft.png",
        status: "finished",
        orderTime: new Date(Date.now() - 86400000 * 1.1),
      }
    ],
  },
  {
    id: "DEL-1023",
    orderId: "DEL-1023",
    type: "delivery",
    status: "cancelled",
    customer: {
      name: "แพรวา เงินทอง",
      contact: "086-777-8888",
      address: "10/1 รัชดา 18 ดินแดง",
      note: "ไม่รับอาหารเผ็ด",
    },
    orderList: [
      {
        id: "item-42",
        name: "CHICK N SHARE",
        quantity: 2,
        price: 99,
        image: "/images/menu-chicknshare.png",
        status: "finished",
        orderTime: new Date(Date.now() - 86400000 * 2.3),
      },
      {
        id: "item-43",
        name: "COLESLAW M",
        quantity: 1,
        price: 49,
        image: "/images/menu-coleslaw.png",
        status: "finished",
        orderTime: new Date(Date.now() - 86400000 * 2.3),
      }
    ],
  },
  {
    id: "DEL-1024",
    orderId: "DEL-1024",
    type: "delivery",
    status: "delivered",
    customer: {
      name: "กอล์ฟ สันติสุข",
      contact: "089-222-1111",
      address: "72/8 พหลโยธิน 34 หลักสี่",
      note: "กรุณาฝากบัตรประชาชนไว้ที่ป้อม",
    },
    orderList: [
      {
        id: "item-44",
        name: "PARTY PACK 12PC",
        quantity: 1,
        price: 349,
        image: "/images/menu-partypack.png",
        status: "finished",
        orderTime: new Date(Date.now() - 86400000 * 9),
      },
      {
        id: "item-45",
        name: "FRIES XL",
        quantity: 2,
        price: 79,
        image: "/images/menu-goldenfries.png",
        status: "finished",
        orderTime: new Date(Date.now() - 86400000 * 9),
      },
      {
        id: "item-46",
        name: "COCA-COLA",
        quantity: 3,
        price: 39,
        image: "/images/menu-cola.png",
        status: "finished",
        orderTime: new Date(Date.now() - 86400000 * 9),
      }
    ],
  },
  {
    id: "DEL-1025",
    orderId: "DEL-1025",
    type: "delivery",
    status: "ready",
    customer: {
      name: "มานพ ชาญชัย",
      contact: "080-999-0000",
      address: "19/25 สัญจร 2 ถนนแจ้งวัฒนะ",
      note: "หน้าร้าน 24 ชั่วโมง",
    },
    orderList: [
      {
        id: "item-47",
        name: "ZINGER 3PC BOX",
        quantity: 1,
        price: 199,
        image: "/images/menu-zinger3pc.png",
        status: "finished",
        orderTime: new Date(Date.now() - 86400000 * 0.5),
      },
      {
        id: "item-48",
        name: "COLESLAW M",
        quantity: 1,
        price: 49,
        image: "/images/menu-coleslaw.png",
        status: "finished",
        orderTime: new Date(Date.now() - 86400000 * 0.5),
      }
    ],
  }
];

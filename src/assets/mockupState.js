 // จำลอง State ข้อมูลที่ดึงมาจาก API/Backend
  const [deliveryData, setDeliveryData] = useState({
    orderId: '12345',
    etaMinutes: 15,
    currentStep: 3,
    rider: {
      name: 'สมชาย ใจดี',
      rating: '4.9',
      vehicle: 'Honda Wave 110i',
      licensePlate: '1กข 1234'
    },
    address: {
      title: 'คอนโด A ชั้น 5 ห้อง 501',
      detail: 'ถ.สุขุมวิท แขวงคลองตันเหนือ เขตวัฒนา กทม.'
    },
    items: [
      { qty: 1, name: 'ชุดไก่ทอดสุดคุ้ม (Size L)', price: 299 },
      { qty: 2, name: 'ชามะนาวเย็น', price: 90 }
    ],
    total: 389
  });
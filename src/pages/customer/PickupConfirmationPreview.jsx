import { useNavigate } from "react-router-dom";
import PickupConfirmation from "../../component/customer/PickupConfirmation";

export default function PickupConfirmationPreview() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#eeeeee]">
      <PickupConfirmation
        isOpen={true}
        onClose={() => navigate("/menu")}
        orderNo="#PK1234"
        menuList={[
          "Signature 8pc Bucket (x1)",
          "Golden Fries L (x2)",
          "Coca-Cola (x2)",
        ]}
        totalPrice="436"
        deliveryTime="ASAP"
        status="pending"
      />
    </div>
  );
}

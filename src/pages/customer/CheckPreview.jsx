import { useNavigate } from "react-router-dom";
import CheckConfirmation from "../../component/Check";

export default function CheckPreview() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#eeeeee]">
      <CheckConfirmation
        isOpen={true}
        onClose={() => navigate("/menu")}
        orderNo="#CHECK01"
        menuList={[
          "Spicy Chicken Sandwich (x1)",
          "Mac and Cheese (x1)",
          "Chocolate Float (x1)",
        ]}
        totalPrice="203"
        deliveryTime="Dine-in / Table 05"
        comment="Less spicy, please."
      />
    </div>
  );
}

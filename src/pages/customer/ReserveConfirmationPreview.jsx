import { useNavigate } from "react-router-dom";
import ReserveConfirmation from "../../component/customer/ReserveConfirmation";

export default function ReserveConfirmationPreview() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#eeeeee]">
      <ReserveConfirmation
        isOpen={true}
        onClose={() => navigate("/menu")}
        tableNo="#RSV042"
        detail="Window Table / SFC Asok Branch"
        person="4"
        date="2026-06-02"
        time="19:30"
        menuList={[
          "Party Bucket Set (x1)",
          "Tteokbokki (x1)",
          "Coca-Cola (x4)",
        ]}
        comment="Need a baby chair."
        status="pending"
      />
    </div>
  );
}

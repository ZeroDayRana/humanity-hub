import { useNavigate } from "react-router-dom";

export const usePayment = () => {
    const navigate = useNavigate();
    const handlePayment = ( selectedCampaign, amount) => {
        if (!amount || amount <= 0) {
            alert("Please enter a valid amount");
            return;
        }
        navigate("/checkout", {
            state: { campaign: selectedCampaign, amount },
        });
    };
    return { handlePayment };
};

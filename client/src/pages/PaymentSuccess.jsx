import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const transactionId =
    location.state?.transactionId || "N/A";

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/challenges");
    }, 4000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <div style={checkCircle}>✓</div>

        <h2>Payment Successful 🎉</h2>

        <p>
          Transaction ID:
          <strong> {transactionId}</strong>
        </p>

        <p>Your purchase was successful.</p>
        <p>Redirecting to challenges...</p>
      </div>
    </div>
  );
};

/* ---------- Styles ---------- */

const containerStyle = {
  height: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  background: "#f3f4f6",
};

const cardStyle = {
  background: "white",
  padding: "40px",
  borderRadius: "14px",
  textAlign: "center",
  width: "380px",
  boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
};

const checkCircle = {
  width: "70px",
  height: "70px",
  borderRadius: "50%",
  background: "#10b981",
  color: "white",
  fontSize: "40px",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  margin: "0 auto 20px",
};

export default PaymentSuccess;
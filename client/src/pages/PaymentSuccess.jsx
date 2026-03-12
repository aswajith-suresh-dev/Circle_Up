import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "../css/PaymentSuccess.css";

const PaymentSuccess = () => {

  const location = useLocation();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);

  const transactionId = location.state?.transactionId;

  useEffect(() => {

    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000); // fake verification delay

    return () => clearTimeout(timer);

  }, []);

  if (loading) {

    return (

      <div className="payment-success-page">

        <div className="payment-loader-box">

          <div className="loader"></div>

          <p>Verifying payment...</p>

        </div>

      </div>

    );

  }

  return (

    <div className="payment-success-page">

      <div className="success-card">

        <h2>Payment Successful 🎉</h2>

        <p>Your challenge access has been activated.</p>

        <p className="txn">
          Transaction ID: <strong>{transactionId}</strong>
        </p>

        <button
          onClick={() => navigate("/challenges")}
          className="success-btn"
        >
          Go to Challenges
        </button>

      </div>

    </div>

  );

};

export default PaymentSuccess;
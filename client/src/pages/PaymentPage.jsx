import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api/axios";

const PaymentPage = () => {
  const { challengeId } = useParams();
  const navigate = useNavigate();

  const [challenge, setChallenge] = useState(null);

  const [cardNumber, setCardNumber] = useState("");
  const [name, setName] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchChallenge = async () => {
      try {
        const res = await api.get(`/challenges/${challengeId}`);
        setChallenge(res.data.challenge);
      } catch (err) {
        console.error(err);
      }
    };

    fetchChallenge();
  }, [challengeId]);

  // ✅ VALIDATION
  const validate = () => {
    let newErrors = {};

    const cleanedCard = cardNumber.replace(/\s/g, "");

    if (cleanedCard.length !== 16) {
      newErrors.cardNumber = "Card number must be 16 digits";
    }

    if (!name.trim()) {
      newErrors.name = "Cardholder name is required";
    }

    if (!/^\d{2}\/\d{2}$/.test(expiry)) {
      newErrors.expiry = "Expiry must be MM/YY";
    }

    if (!/^\d{3}$/.test(cvv)) {
      newErrors.cvv = "CVV must be 3 digits";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ✅ HANDLE PAYMENT
  const handlePayment = async () => {
    if (!validate()) return;

    try {
      setLoading(true);

      // Fake 2 second delay
      await new Promise((resolve) =>
        setTimeout(resolve, 2000)
      );
await api.post(`/challenges/${challengeId}/purchase`);

// generate fake transaction id
const transactionId =
  "TXN" +
  Date.now().toString().slice(-6) +
  Math.floor(Math.random() * 100);

navigate("/payment-success", {
  state: { transactionId },
});
    } catch (err) {
      alert(err.response?.data?.message || "Payment failed");
    } finally {
      setLoading(false);
    }
  };

  if (!challenge) return <p>Loading...</p>;

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <h2>Secure Payment</h2>

        <p>
          <strong>Challenge:</strong> {challenge.title}
        </p>
        <p>
          <strong>Amount:</strong> ₹{challenge.price}
        </p>

        <div style={{ marginTop: "20px" }}>
          {/* Card Number */}
          <input
            type="text"
            placeholder="Card Number"
            value={cardNumber}
            onChange={(e) => {
              let value = e.target.value
                .replace(/\D/g, "")
                .slice(0, 16);

              value = value.replace(/(.{4})/g, "$1 ").trim();

              setCardNumber(value);
            }}
            style={inputStyle}
          />
          {errors.cardNumber && (
            <p style={errorStyle}>{errors.cardNumber}</p>
          )}

          {/* Name */}
          <input
            type="text"
            placeholder="Cardholder Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={inputStyle}
          />
          {errors.name && (
            <p style={errorStyle}>{errors.name}</p>
          )}

          {/* Expiry */}
          <input
            type="text"
            placeholder="MM/YY"
            value={expiry}
            onChange={(e) => {
              let value = e.target.value
                .replace(/\D/g, "")
                .slice(0, 4);

              if (value.length >= 3) {
                value =
                  value.slice(0, 2) +
                  "/" +
                  value.slice(2);
              }

              setExpiry(value);
            }}
            style={inputStyle}
          />
          {errors.expiry && (
            <p style={errorStyle}>{errors.expiry}</p>
          )}

          {/* CVV */}
          <input
            type="password"
            placeholder="CVV"
            value={cvv}
            onChange={(e) =>
              setCvv(e.target.value.replace(/\D/g, "").slice(0, 3))
            }
            style={inputStyle}
          />
          {errors.cvv && (
            <p style={errorStyle}>{errors.cvv}</p>
          )}
        </div>

        <button
          onClick={handlePayment}
          disabled={loading}
          style={payButton}
        >
          {loading ? "Processing..." : "Pay Now"}
        </button>

        {loading && <div style={loaderStyle}></div>}
      </div>
    </div>
  );
};

/* ---------- STYLES ---------- */

const containerStyle = {
  height: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  background: "#f3f4f6",
};

const cardStyle = {
  background: "white",
  padding: "30px",
  borderRadius: "12px",
  width: "350px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
};

const inputStyle = {
  width: "100%",
  padding: "8px",
  marginBottom: "10px",
  borderRadius: "6px",
  border: "1px solid #ccc",
};

const errorStyle = {
  color: "red",
  fontSize: "12px",
  marginBottom: "8px",
};

const payButton = {
  width: "100%",
  padding: "10px",
  background: "#3b82f6",
  color: "white",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
};

const loaderStyle = {
  marginTop: "15px",
  border: "4px solid #f3f3f3",
  borderTop: "4px solid #3b82f6",
  borderRadius: "50%",
  width: "30px",
  height: "30px",
  animation: "spin 1s linear infinite",
};

export default PaymentPage;
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { FiLock } from "react-icons/fi";
import api from "../api/axios";
import "../css/PaymentPage.css";

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


  /* ---------------- FETCH CHALLENGE ---------------- */

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


  /* ---------------- EXPIRY VALIDATION ---------------- */

  const validateExpiry = () => {

  if (!expiry) return "Expiry date is required";

  if (!/^\d{2}\/\d{2}$/.test(expiry)) {
    return "Expiry must be in MM/YY format";
  }

  const [month, year] = expiry.split("/").map(Number);

  /* Month validation */

  if (month < 1 || month > 12) {
    return "Invalid month";
  }

  /* Minimum allowed year (2026) */

  const minimumYear = 26;

  if (year < minimumYear) {
    return "Year must be 2026 or later";
  }

  /* Prevent past dates */

  const now = new Date();
  const currentMonth = now.getMonth() + 1;
  const currentYear = now.getFullYear() % 100;

  if (year === currentYear && month < currentMonth) {
    return "Card expired";
  }

  return null;
};


  /* ---------------- FORM VALIDATION ---------------- */

  const validate = () => {

    let newErrors = {};

    if (!name.trim()) {
      newErrors.name = "Cardholder name is required";
    }

    const cleanedCard = cardNumber.replace(/\s/g, "");

    if (!cleanedCard) {
      newErrors.cardNumber = "Card number is required";
    }
    else if (cleanedCard.length !== 16) {
      newErrors.cardNumber = "Card number must be 16 digits";
    }

    const expiryError = validateExpiry();

    if (expiryError) {
      newErrors.expiry = expiryError;
    }

    if (!cvv) {
      newErrors.cvv = "CVV is required";
    }
    else if (!/^\d{3}$/.test(cvv)) {
      newErrors.cvv = "CVV must be 3 digits";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;

  };


  /* ---------------- PAYMENT ---------------- */

  const handlePayment = async () => {

    if (!validate()) return;

    try {

      setLoading(true);

      await new Promise(resolve => setTimeout(resolve, 2000));

      await api.post(`/challenges/${challengeId}/purchase`);

      const transactionId =
        "TXN" +
        Date.now().toString().slice(-6) +
        Math.floor(Math.random() * 100);

      navigate("/payment-success", {
        state: { transactionId }
      });

    } catch (err) {

      alert(err.response?.data?.message || "Payment failed");

    } finally {

      setLoading(false);

    }

  };


  if (!challenge) return <p>Loading...</p>;


  return (

    <div className="payment-page">

      {/* HEADER */}

      <div className="payment-header">

        <div className="secure-badge">
          <FiLock />
          Secured by CircleUp
        </div>

        <button
          className="back-button"
          onClick={() => navigate(-1)}
        >
          ← Back
        </button>

      </div>


      {/* MAIN CHECKOUT */}

      <div className="payment-wrapper">


        {/* LEFT SIDE */}

        <div className="payment-summary">

          <h3>Payment details</h3>

          <div className="summary-card">

            <h4>{challenge.title}</h4>

            <p>CircleUp Challenge</p>

            <div className="summary-divider"></div>

            <div className="summary-row total">

              <span>Price</span>
              <span>₹{challenge.price}</span>

            </div>

          </div>

        </div>


        {/* RIGHT SIDE */}

        <div className="payment-form">

          <input
            type="text"
            placeholder="Cardholder Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          {errors.name && <p className="error">{errors.name}</p>}


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
          />

          {errors.cardNumber && (
            <p className="error">{errors.cardNumber}</p>
          )}


          <div className="row">

            <div className="field">

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
              />

              {errors.expiry && (
                <p className="error">{errors.expiry}</p>
              )}

            </div>


            <div className="field">

              <input
                type="password"
                placeholder="CVV"
                value={cvv}
                onChange={(e) =>
                  setCvv(
                    e.target.value
                      .replace(/\D/g, "")
                      .slice(0, 3)
                  )
                }
              />

              {errors.cvv && (
                <p className="error">{errors.cvv}</p>
              )}

            </div>

          </div>


          <p className="secure-text">
            Your payment is secured with 256-bit SSL encryption
          </p>


          <button
            className="pay-button"
            onClick={handlePayment}
            disabled={loading}
          >

            {loading
              ? "Processing..."
              : `Pay ₹${challenge.price}`}

          </button>

        </div>

      </div>


      {/* FOOTER */}

      <div className="payment-footer">

        <p className="footer-text">
          All transactions are encrypted and secure.
        </p>

        <div className="payment-logos">

          <img src="/payment/visa.svg" alt="visa"/>
          <img src="/payment/mastercard.svg" alt="mastercard"/>
          <img src="/payment/paypal.svg" alt="paypal"/>
          <img src="/payment/applepay.svg" alt="applepay" />

        </div>

      </div>

    </div>

  );

};

export default PaymentPage;
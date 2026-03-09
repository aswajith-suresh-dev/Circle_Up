import { useEffect, useState } from "react";
import api from "../../api/axios";

const MentorRevenue = () => {

  const [data, setData] = useState(null);

  const fetchRevenue = async () => {
    try {

      const res = await api.get("/mentor/revenue");
      setData(res.data);

    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchRevenue();
  }, []);

  if (!data) return <p>Loading...</p>;

  return (
    <div style={{ padding: "20px" }}>

      <h2>Mentor Revenue</h2>

      <div style={cardStyle}>
        <h3>Total Earnings</h3>
        <p>₹ {data.revenue}</p>
      </div>

      <div style={cardStyle}>
        <h3>Total Sales</h3>
        <p>{data.totalSales}</p>
      </div>

    </div>
  );
};

const cardStyle = {
  border: "1px solid #ddd",
  borderRadius: "10px",
  padding: "16px",
  marginBottom: "16px",
  width: "250px"
};

export default MentorRevenue;
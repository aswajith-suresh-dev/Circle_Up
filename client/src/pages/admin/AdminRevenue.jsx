import { useEffect, useState } from "react";
import api from "../../api/axios";

const AdminRevenue = () => {

  const [data, setData] = useState(null);

  const fetchRevenue = async () => {
    try {

      const res = await api.get("/admin/revenue");
      console.log(res.data);
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

      <h2>Platform Revenue</h2>

      <div style={cardStyle}>
        <h3>Total Revenue</h3>
        <p>₹ {data.revenue}</p>
      </div>

      <div style={cardStyle}>
        <h3>Total Transactions</h3>
        <p>{data.totalTransactions}</p>
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

export default AdminRevenue;
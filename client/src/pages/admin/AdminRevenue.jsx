// src/pages/admin/AdminRevenue.jsx

import { useEffect, useState } from "react";
import api from "../../api/axios";
import "../../css/AdminRevenue.css";

const AdminRevenue = () => {

  const [stats, setStats] = useState(null);

  const [paidRows, setPaidRows] = useState([]);
  const [freeRows, setFreeRows] = useState([]);

  /* FETCH STATS */

  const fetchStats = async () => {
    try {
      const res = await api.get("/admin/dashboard");
      setStats(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  /* FETCH REVENUE LIST */

  const fetchRevenueList = async () => {
    try {
      const res = await api.get("/admin/revenue-list");

      setPaidRows(res.data.paid || []);
      setFreeRows(res.data.free || []);

    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchStats();
    fetchRevenueList();
  }, []);

  if (!stats) {
    return <p>Loading revenue...</p>;
  }

  return (
    <div className="admin-revenue-page">

      <h2 className="admin-revenue-title">
        Platform Revenue
      </h2>

      {/* ================= TOP STATS ================= */}

      <div className="admin-revenue-stats">

        <div className="admin-revenue-card">
          <h3>Total Revenue</h3>
          <p>₹ {stats.totalRevenue}</p>
        </div>

        <div className="admin-revenue-card">
          <h3>Monthly Revenue</h3>
          <p>₹ {stats.monthRevenue}</p>
        </div>

        <div className="admin-revenue-card">
          <h3>Total Transactions</h3>
          <p>{stats.totalSales}</p>
        </div>

        <div className="admin-revenue-card">
          <h3>Average Sale</h3>
          <p>₹ {stats.avgSale}</p>
        </div>

      </div>

      {/* ================= PAID TABLE ================= */}

      <div className="admin-revenue-table-wrapper">

        <h3>Paid Challenges Revenue</h3>

        <table className="admin-revenue-table">

          <thead>
            <tr>
              <th>Mentor</th>
              <th>Challenge</th>
              <th>Price</th>
              <th>Buyers</th>
              <th>Total Revenue</th>
            </tr>
          </thead>

          <tbody>
            {paidRows.map((row, index) => (
              <tr key={index}>
                <td>{row.mentor}</td>
                <td>{row.challenge}</td>
                <td>₹ {row.price}</td>
                <td>{row.buyers}</td>
                <td>₹ {row.totalRevenue}</td>
              </tr>
            ))}
          </tbody>

        </table>

      </div>

      {/* ================= FREE TABLE ================= */}

      <div className="admin-revenue-table-wrapper">

        <h3 style={{ marginTop: "30px" }}>
          Free Challenges (Engagement)
        </h3>

        <table className="admin-revenue-table small-table">

          <thead>
            <tr>
              <th>Mentor</th>
              <th>Challenge</th>
              <th>Participants</th>
            </tr>
          </thead>

          <tbody>
            {freeRows.map((row, index) => (
              <tr key={index}>
                <td>{row.mentor}</td>
                <td>{row.challenge}</td>
                <td>{row.buyers}</td>
              </tr>
            ))}
          </tbody>

        </table>

      </div>

    </div>
  );
};

export default AdminRevenue;
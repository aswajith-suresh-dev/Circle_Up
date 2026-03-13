import {
  FiDollarSign,
  FiTrendingUp,
  FiTarget,
  FiUsers
} from "react-icons/fi";

const StatsCards = ({ stats }) => {

  return (

    <div className="admin-stats-grid">

      <div className="admin-stat-card">
        <h4>Total Revenue</h4>
        <p>₹{stats.totalRevenue}</p>
      </div>

      <div className="admin-stat-card">
        <h4>Monthly Revenue</h4>
        <p>₹{stats.monthRevenue}</p>
      </div>

      <div className="admin-stat-card">
        <h4>Total Sales</h4>
        <p>{stats.totalSales}</p>
      </div>

      <div className="admin-stat-card">
        <h4>Average Sale</h4>
        <p>₹{stats.avgSale}</p>
      </div>

    </div>

  );

};

export default StatsCards;
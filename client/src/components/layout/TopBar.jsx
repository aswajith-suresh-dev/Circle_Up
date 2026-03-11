import "../../css/TopBar.css";

const TopBar = ({ filter, setFilter }) => {

  return (

    <div className="topbar">

      {/* LEFT */}
      <div className="topbar-title">
        Feeds
      </div>

      {/* RIGHT */}
      <div className="topbar-actions">

        <button
          className={`topbar-btn ${filter === "recent" ? "active" : ""}`}
          onClick={() => setFilter("recent")}
        >
          Recent
        </button>

        <button
          className={`topbar-btn ${filter === "discussion" ? "active" : ""}`}
          onClick={() => setFilter("discussion")}
        >
          Discussions
        </button>

        <button
          className={`topbar-btn ${filter === "doubt" ? "active" : ""}`}
          onClick={() => setFilter("doubt")}
        >
          Doubts
        </button>

      </div>

    </div>

  );

};

export default TopBar;
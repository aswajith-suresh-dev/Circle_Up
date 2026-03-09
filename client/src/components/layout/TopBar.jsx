import "../../css/TopBar.css";

const TopBar = ({ filter, setFilter }) => {

  return (
    <div className="topbar">

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
  );
};

export default TopBar;
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";

import {
  FiBookOpen,
  FiBarChart2,
  FiUser,
  FiUsers
} from "react-icons/fi";

import "../../css/MyCircles.css";

const MyCircles = () => {

  const [circles, setCircles] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {

    const fetchMyCircles = async () => {

      try {

        const res = await api.get("/circles/my");
        setCircles(res.data);

      } catch (err) {

        console.error(err);

      } finally {

        setLoading(false);

      }

    };

    fetchMyCircles();

  }, []);

  if (loading) {

    return (
      <div className="mycircles-container">
        Loading your circles...
      </div>
    );

  }

  return (

    <div className="mycircles-container">

      <h2 className="mycircles-title">
        My Circles
      </h2>

      {circles.length === 0 ? (

        <p className="empty-text">
          You haven’t joined any circles yet.
        </p>

      ) : (

        <div className="circles-list">

          {circles.map((circle) => (

            <div
              key={circle._id}
              className="circle-card"
              onClick={() =>
                navigate(`/circles/${circle._id}`)
              }
            >

              <div className="circle-header">

                <div className="circle-avatar">
                  {circle.name.charAt(0)}
                </div>

                <div>

                  <h3 className="circle-name">
                    {circle.name}
                  </h3>

                  <p className="circle-description">
                    {circle.description}
                  </p>

                </div>

              </div>

              <div className="circle-meta">

                <span>
                  <FiBookOpen className="meta-icon" />
                  {circle.topic}
                </span>

                <span>
                  <FiBarChart2 className="meta-icon" />
                  {circle.level}
                </span>

                <span>
                  <FiUser className="meta-icon" />
                  {circle.mentor?.name}
                </span>

              </div>

            </div>

          ))}

        </div>

      )}

    </div>

  );

};

export default MyCircles;
import { useEffect, useState } from "react";
import api from "../../api/axios";

const Mentors = () => {
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMentors = async () => {
    try {
      const res = await api.get("/mentor/all");
      setMentors(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMentors();
  }, []);

  if (loading) return <p>Loading mentors...</p>;

  return (
    <div style={{ padding: "20px", maxWidth: "900px" }}>
      <h2>Our Mentors</h2>

      {mentors.length === 0 && (
        <p>No mentors available yet.</p>
      )}

      {mentors.map((mentorApp) => {
        const mentor = mentorApp.user;

        return (
          <div
            key={mentorApp._id}
            style={{
              border: "1px solid #ddd",
              padding: "20px",
              marginBottom: "16px",
              borderRadius: "10px",
              background: "#fafafa",
            }}
          >
            <h3>
              {mentor.name} 🧑‍🏫
            </h3>

            <p>
              <strong>Expertise:</strong>{" "}
              {mentorApp.expertise}
            </p>

            <p>
              <strong>Bio:</strong>{" "}
              {mentorApp.bio}
            </p>

            {mentorApp.portfolioLink && (
              <p>
                <strong>Portfolio:</strong>{" "}
                <a
                  href={mentorApp.portfolioLink}
                  target="_blank"
                  rel="noreferrer"
                >
                  Visit
                </a>
              </p>
            )}

            <hr />

            <p>
              ✅ Solved Replies:{" "}
              {mentor.solvedRepliesCount}
            </p>

            <p>
              👍 Reply Upvotes:{" "}
              {mentor.replyUpvotesCount}
            </p>

            <p>
              📚 Circles Contributed:{" "}
              {mentor.contributorCircles.length}
            </p>

            <p style={{ fontSize: "13px", color: "#666" }}>
              Mentor since{" "}
              {new Date(
                mentorApp.updatedAt
              ).toLocaleDateString()}
            </p>
          </div>
        );
      })}
    </div>
  );
};

export default Mentors;
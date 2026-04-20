import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/FAQ.css";

const faqData = {
  "Getting Started": [
    {
      q: "What is CircleUp?",
      a: "CircleUp is a structured learning community platform where users can join topic-based circles, participate in challenges, and learn through collaboration and mentorship."
    },
    {
      q: "How do I join a circle?",
      a: "Users can browse circles using search and filter options and join them by clicking the join button."
    },
    {
      q: "Is CircleUp free?",
      a: "CircleUp offers both free and paid features. Some challenges may require payment."
    }
  ],

  "Circles & Community": [
    {
      q: "What are circles?",
      a: "Circles are learning communities within the platform where users gather based on shared interests. The term circle is used to describe these structured communities."
    },
    {
      q: "Can I leave a circle?",
      a: "Yes, users can leave a circle at any time by clicking the leave button on circle homepage."
    },
    {
      q: "How do I become a contributor?",
      a: "Active participation and meaningful contributions can help users gain contributor recognition.The system automatically identifies and promotes active members to contributors based on stats like upvotes,circle participation,solved doubts."
    }
  ],

  "Challenges": [
    {
      q: "What are challenges?",
      a: "Challenges are structured learning programs designed by mentors with daily tasks and resources."
    },
    {
      q: "Are challenges free or paid?",
      a: "Both types exist. Paid challenges require purchase before access."
    },
    {
      q: "How is progress tracked?",
      a: "The system tracks completed days and displays progress throughout the challenge."
    }
  ],

  "Mentorship": [
    {
      q: "How can I become a mentor?",
      a: "Users needs to complete certain requirements and after that they can apply for mentorship and get approved by the admin."
    },
    {
      q: "Can mentors earn money?",
      a: "Yes, mentors can earn by creating paid challenges."
    },
    {
      q: "Who approves mentors?",
      a: "All mentor requests are reviewed by the administrator."
    }
  ],

  "Account & Profile": [
    {
      q: "How can I edit my profile?",
      a: "Users can update their profile details from the profile settings page."
    },
    {
      q: "What is personal space?",
      a: "Personal space allows users to organize folders,tasks, and resources."
    },
    {
      q: "How do notifications work?",
      a: "Users receive updates about posts, replies, and role promotions."
    }
  ],

  "Support": [
    {
      q: "How can I report a problem?",
      a: "Users can submit issues through the support system."
    },
    {
      q: "How can I contact admin?",
      a: "Users can reach out through the feedback or complaint system."
    }
  ]
};

const FAQ = () => {

  const navigate = useNavigate();

  const [activeCategory, setActiveCategory] = useState("Getting Started");
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (

    <div className="faq-page">


      <div className="faq-content">

        {/* HEADER */}
        <div className="faq-header">
          <h1>Frequently Asked Questions</h1>
          <p>
            Find answers about circles, challenges, and how CircleUp helps you learn better.
          </p>
        </div>

        {/* MAIN */}
        <div className="faq-main">

          {/* LEFT CATEGORY */}
          <div className="faq-categories">

            {Object.keys(faqData).map((cat) => (
              <div
                key={cat}
                className={`faq-category ${activeCategory === cat ? "active" : ""}`}
                onClick={() => {
                  setActiveCategory(cat);
                  setOpenIndex(null);
                }}
              >
                {cat}
              </div>
            ))}

          </div>

          {/* RIGHT QUESTIONS */}
          <div className="faq-questions">

            {faqData[activeCategory].map((item, index) => (

              <div key={index} className="faq-item">

                <div
                  className="faq-question"
                  onClick={() => toggle(index)}
                >
                  {item.q}
                  <span>{openIndex === index ? "−" : "+"}</span>
                </div>

                {openIndex === index && (
                  <div className="faq-answer">
                    {item.a}
                  </div>
                )}

              </div>

            ))}

          </div>

        </div>

        {/* FOOTER */}
        <div className="faq-footer">
          <h3>Still have a question?</h3>
          <p>Feel free to reach out to us.</p>
         <button
  onClick={() =>
    window.open(
      "https://mail.google.com/mail/?view=cm&fs=1&to=support@circleup.com&su=Support&body=Hello",
      "_blank"
    )
  }
>
  Contact Us
</button>
        </div>

      </div>

    </div>

  );
};

export default FAQ;
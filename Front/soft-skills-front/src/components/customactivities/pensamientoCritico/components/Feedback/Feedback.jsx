import "./Feedback.css";

const Feedback = ({ data }) => {
  return (
    <div className="feedback-container">
      {data.sections.map((section, index) => (
        <div key={index} className="section">
          <h2>{section.title}</h2>
          <ul>
            {section.items.map((item, i) => (
              <li key={i}>
                {typeof item === "string" ? (
                  item
                ) : (
                  <>
                    <strong>{item.title}:</strong>
                    <ul>
                      {item.details.map((detail, dIdx) => (
                        <li key={dIdx}>{detail}</li>
                      ))}
                    </ul>
                  </>
                )}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default Feedback;

import { parseUserFriendlyDate } from "../../helpers/helpers";

import "./Report.css";

const Report = ({
  userName,
  userPicture,
  date,
  id,
  setSelectedReportID,
  rating,
}) => {
  return (
    <div
      onClick={() => {
        setSelectedReportID(id);
      }}
      className="report-container"
    >
      <div className="report-user-info">
        <img className="report-user-avatar" src={userPicture} alt={`${userName} profile`} />
        <span className="report-user-name">{userName}</span>
      </div>
      <div className="report-details">
        <div className="report-rating">
          <span className="report-label">Calificación:</span>
          <span className="report-rating-value">{rating}</span>
        </div>
        <div className="report-date">
          <span>{parseUserFriendlyDate(date)}</span>
        </div>
      </div>
    </div>
  );
};

export default Report;

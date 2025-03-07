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
      <div>
        <img width="35px" height="35px" src={userPicture} alt="user profile" />
      </div>
      <div>
        <p style={{ opacity: "0.5" }}>{userName}</p>
      </div>
      <div>
        <p>Calificación: {rating} </p>
      </div>
      <p style={{ opacity: "0.5" }}>{parseUserFriendlyDate(date)}</p>
    </div>
  );
};

export default Report;

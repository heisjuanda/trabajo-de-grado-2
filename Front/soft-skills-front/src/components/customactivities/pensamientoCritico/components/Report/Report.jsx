import { parseUserFriendlyDate } from "../../helpers/helpers";

import "./Report.css";

const Report = ({ userName, userPicture, date, id, setSelectedReportID }) => {
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
        <p>{userName}</p>
      </div>
      <p>{parseUserFriendlyDate(date)}</p>
    </div>
  );
};

export default Report;

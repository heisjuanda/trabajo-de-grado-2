import Loader from "../../Loader/Loader";
import "./Message.css";

const Message = ({ isUser, message }) => {
  if (!message) {
    return (
      <div className="message-box incoming">
        <div className="message incoming">
          <Loader isText={true} />
          <div className="messaged">IA</div>
        </div>
      </div>
    );
  }

  return (
    <div className="chat-container">
      {!isUser ? (
        <div className="message-box incoming">
          <div className="message incoming">
            {message}
            <div className="messaged">IA</div>
          </div>
        </div>
      ) : (
        <div className="message-box outgoing">
          <div className="message outgoing">
            {message}
            <div className="messaged">Usuario</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Message;

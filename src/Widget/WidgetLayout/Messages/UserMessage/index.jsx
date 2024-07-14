import { useContext } from "react";
import AppContext from "../../../AppContext";
import { formattedTs, MardownText } from "../utils";
import "./style.css";

export const UserTextmessage = ({ messageItem }) => {
  const { text, ts } = messageItem;
  const appContext = useContext(AppContext);
  const { textColor, userMsgBackgroundColor } = appContext;

  return (
    <div className="user-text-message-container">
      <div className="message-column">
        <div
          className="message-row"
          style={{ color: textColor, backgroundColor: userMsgBackgroundColor }}
        >
          <MardownText text={text} />
        </div>
        <div className="timestamp">{formattedTs(ts)}</div>
      </div>
    </div>
  );
};

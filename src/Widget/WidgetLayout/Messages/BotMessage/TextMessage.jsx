import { useContext } from "react";
import AppContext from "../../../AppContext";
import { formattedTs, MardownText } from "../utils";
import "./TextMessage.css";

export const TextMessage = ({
  text,
  startsSequence,
  endsSequence,
  showBotAvatar,
  ts,
}) => {
  const theme = useContext(AppContext);
  const { botAvatar, botMsgColor, botMsgBackgroundColor } = theme;
  const position = [
    "message",
    `${startsSequence ? "start" : ""}`,
    `${endsSequence ? "end" : ""}`,
  ]
    .join(" ")
    .trim();
  let borderStyle;
  if (position === "message start end") {
    borderStyle = "rounded-20";
  }

  if (position === "message start") {
    borderStyle = "rounded-start";
  }

  if (position === "message  end") {
    borderStyle = "rounded-end";
  }
  if (position === "message") {
    borderStyle = "rounded-message";
  }

  return (
    <div className="text-message-container">
      <div className="avatar-container">
        <img
          className={`avatar ${showBotAvatar ? "" : "hidden"}`}
          src={botAvatar}
          alt="Bot Logo"
        />
      </div>
      <div className="message-column">
        <div
          className={`message-row ${borderStyle}`}
          style={{ color: botMsgColor, backgroundColor: botMsgBackgroundColor }}
          dir="auto"
        >
          <MardownText text={text} />
        </div>
        {showBotAvatar && <div className="timestamp">{formattedTs(ts)}</div>}
      </div>
    </div>
  );
};

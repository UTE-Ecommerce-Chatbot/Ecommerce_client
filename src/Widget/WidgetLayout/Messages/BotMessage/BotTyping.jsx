import { useContext } from "react";
import { useSelector } from "react-redux";
import AppContext from "../../../AppContext";
import "./BotTyping.css";

export const BotTyping = () => {
  const theme = useContext(AppContext);

  const botTyping = useSelector((state) => state.messageState.botTyping);
  const { botAvatar, botMsgColor, botMsgBackgroundColor } = theme;
  return (
    botTyping && (
      <div className="bot-typing-container">
        <div className="avatar-container">
          <img className="avatar" src={botAvatar} alt="Bot Logo" />
        </div>
        <div
          className="message-container"
          style={{ backgroundColor: botMsgBackgroundColor }}
        >
          <div
            className="dot animation-delay-32"
            style={{ backgroundColor: botMsgColor }}
          ></div>
          <div
            className="dot animation-delay-16"
            style={{ backgroundColor: botMsgColor }}
          ></div>
          <div className="dot" style={{ backgroundColor: botMsgColor }}></div>
        </div>
      </div>
    )
  );
};

import { useContext } from "react";
import AppContext from "../../../AppContext";
import { formattedTs } from "../utils";
import "./Image.css";

export const Image = ({ showBotAvatar, imageUrl, ts }) => {
  const appContext = useContext(AppContext);
  const { botAvatar } = appContext;
  return (
    <div className="image-container">
      <div className="avatar-container">
        <img
          className={`avatar ${showBotAvatar ? "" : "hidden"}`}
          src={botAvatar}
          alt="BotAvatar"
        />
      </div>
      <div className="image-column">
        <div className="image-row">
          <img className="image" src={imageUrl} alt="imgAlt" />
        </div>
        {showBotAvatar && <div className="timestamp">{formattedTs(ts)}</div>}
      </div>
    </div>
  );
};

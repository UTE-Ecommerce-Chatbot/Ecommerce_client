import { useContext, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useScrollBottom } from "../../../hooks/useScrollBottom";
import AppContext from "../../AppContext";
import { BotTyping } from "./BotMessage/BotTyping";
import { Chats } from "./Chats";
import {
  fetchBotResponse,
  setUserGreeted,
  setUserTypingPlaceholder,
  toggleBotTyping,
  toggleUserTyping,
} from "./messageSlice";
import "./style.css";

export const Messages = () => {
  const dispatch = useDispatch();
  const appContext = useContext(AppContext);

  const { widgetColor, initialPayload, rasaServerUrl, userId } = appContext;
  const { messages, userGreeted } = useSelector((state) => state.messageState);
  const bottomRef = useScrollBottom(messages);
  useEffect(() => {
    if (!userGreeted && messages.length < 1) {
      dispatch(setUserGreeted(true));
      dispatch(setUserTypingPlaceholder("Please wait while bot is typing..."));
      dispatch(toggleBotTyping(true));
      dispatch(toggleUserTyping(false));
      dispatch(
        fetchBotResponse({
          rasaServerUrl,
          message: initialPayload,
          sender: userId,
        })
      );
    }
  }, [
    dispatch,
    initialPayload,
    messages.length,
    rasaServerUrl,
    userGreeted,
    userId,
  ]);

  return (
    <div
      className="messages-container"
      style={{ "--scrollbar-thumb-color": widgetColor }}
    >
      <Chats messages={messages} />
      <BotTyping />
      <div ref={bottomRef}></div>
    </div>
  );
};

import { PaperAirplaneIcon } from "@heroicons/react/24/outline";
import { useContext, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import { createUserMessage } from "../../../utils/helpers";
import AppContext from "../../AppContext";
import {
  addMessage,
  fetchBotResponse,
  toggleBotTyping,
  toggleUserTyping,
} from "../Messages/messageSlice";
import './style.css';

const Textarea = styled.textarea`
  -ms-overflow-style: none;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
`;

export const Keypad = () => {
  const dispatch = useDispatch();
  const theme = useContext(AppContext);
  const [userInput, setUserInput] = useState("");
  const userTypingPlaceholder = useSelector(
    (state) => state.messageState.userTypingPlaceholder
  );

  const userTyping = useSelector((state) => state.messageState.userTyping);
  const { rasaServerUrl, userId, textColor } = theme;

  const handleSubmit = async () => {
    if (userInput.length > 0) {
      dispatch(addMessage(createUserMessage(userInput.trim())));
      setUserInput("");
      dispatch(toggleUserTyping(false));
      dispatch(toggleBotTyping(true));
      dispatch(
        fetchBotResponse({
          rasaServerUrl,
          message: userInput.trim(),
          sender: userId,
        })
      );
    }
  };

  return (
    <div className="keypad-container">
      <textarea
        rows="1"
        className={`textarea ${userTyping ? "cursor-default" : "cursor-not-allowed"}`}
        placeholder={userTypingPlaceholder}
        value={userInput}
        onChange={(e) => {
          setUserInput(e.target.value);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            handleSubmit();
          }
        }}
        readOnly={!userTyping}
      />
      <button
        type="submit"
        className={`submit-button ${userInput.trim().length > 1 ? "cursor-default" : "cursor-not-allowed"}`}
        style={{ color: textColor }}
        onClick={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        <PaperAirplaneIcon className="paper-airplane-icon" />
      </button>
    </div>
  );
};

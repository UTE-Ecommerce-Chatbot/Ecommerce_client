import { motion, AnimatePresence } from "framer-motion";
import { nanoid } from "nanoid";
import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import AppContext from "../AppContext";
import { setUserId } from "../widgetSlice";
import { Header } from "./Header";
import { Keypad } from "./Keypad";
import { Launcher } from "./Launcher";
import { Messages } from "./Messages";
import "./style.css";

export const WidgetLayout = (props) => {
  const dispatch = useDispatch();
  let { toggleWidget, userId: _userId } = useSelector(
    (state) => state.widgetState
  );
  let { userId, embedded } = props;
  let userIdRef = useRef(_userId);
  useEffect(() => {
    if (userId) {
      userIdRef.current = userId;
    } else {
      if (!userIdRef.current) {
        userIdRef.current = nanoid();
        dispatch(setUserId(userIdRef.current));
      }
    }
  }, [dispatch, embedded, props.userId, toggleWidget, userId]);

  if (embedded) {
    return (
      <AppContext.Provider value={{ userId: userIdRef.current, ...props }}>
        <AnimatePresence>
          <div className="widget-container" key="widget">
            <Header />
            <Messages />
            <Keypad />
          </div>
        </AnimatePresence>
      </AppContext.Provider>
    );
  }
  return (
    <AppContext.Provider value={{ userId: userIdRef.current, ...props }}>
      <AnimatePresence>
        {toggleWidget && (
          <motion.div
            className="widget-motion"
            animate={{ y: -60 }}
            exit={{ opacity: 0 }}
            transition={{ type: "spring", stiffness: 100 }}
            key="widget"
          >
            <Header />
            <Messages />
            <Keypad />
          </motion.div>
        )}
        <Launcher />
      </AnimatePresence>
    </AppContext.Provider>
  );
};

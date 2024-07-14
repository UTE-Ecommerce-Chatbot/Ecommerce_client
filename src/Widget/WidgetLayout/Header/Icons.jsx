import {
  ArrowUturnLeftIcon,
  TrashIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import './style.css';

export const Icon = ({ name }) => {
  if (name === "Restart") {
    return <ArrowUturnLeftIcon className="icon" />;
  }
  if (name === "Clear Chat") {
    return <TrashIcon className="icon" />;
  }
  if (name === "Close") {
    return <XMarkIcon className="icon" />;
  }
};
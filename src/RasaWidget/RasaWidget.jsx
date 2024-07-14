import React, { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "./index.js";
    script.id = "bot_ui";
    script.onload = () => {
      window?.ChatbotWidget.default({
        rasaServerUrl: "http://localhost:5005/webhooks/rest/webhook",
        userId: null,
        initialPayload: "/greet",
        metadata: {},
        botAvatar:
          "https://github.com/JiteshGaikwad/Chatbot-Widget/blob/main/static/img/botAvatar.png",
        widgetColor: "#A4BE7B",
        textColor: "#034809",
        userMsgBackgroundColor: "#E5D9B6",
        botTitle: "Chat Bot",
        botSubTitle: "Agriculture Services Assistant",
        botMsgBackgroundColor: "#f3f4f6",
        botResponseDelay: "",
        chatHeaderCss: {
          textColor: "#034809",
          backgroundColor: "#A4BE7B",
          enableBotAvatarBorder: true,
        },
        chatHeaderTextColor: "#4c1d95",
        botMsgColor: "#4b5563",
        userMsgColor: "#4c1d95",
        embedded: false,
        buttonsCss: {
          color: "#5F8D4E",
          backgroundColor: "#5F8D4E",
          borderColor: "#5F8D4E",
          borderWidth: "0px",
          borderRadius: "999px",
          hoverBackgroundColor: "white",
          hoverColor: "#4b5563",
          hoverborderWidth: "1px",
          enableHover: false,
        },
      });
    };
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return <main className="text-red-500"></main>;
}

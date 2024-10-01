import { IoChatbubblesOutline } from "react-icons/io5";
import { IoClose } from "react-icons/io5";

const ChatBot = ({ className, onClick, isChatbotVisible }) => {
  return (
    <div className={`${className}`} onClick={onClick}>
      {/* Apply 'group' to parent div */}
      <div
        title="Ask your doubts to chatbot"
        className="group rounded-full w-14 h-14 hover:cursor-pointer bg-yellow-50 flex justify-center items-center transition-all duration-300 transform hover:scale-110"
      >
        {isChatbotVisible ? (
          // Rotate the IoClose only when parent div is hovered using 'group-hover'
          <IoClose className="scale-150 transition-transform duration-300 group-hover:rotate-90" />
        ) : (
          <IoChatbubblesOutline className="scale-150" />
        )}
      </div>
    </div>
  );
};

export default ChatBot;

import "./userMessage.css";
import { IKImage } from "imagekitio-react";

const UserMessage = ({ attachments, textMessage }) => {
  return (
    <div className="userMessageContainer">
      <div className="userMessage">
        {attachments
          ? attachments.map((attachment, i) => (
              <div key={i} className="message userImage">
                <IKImage
                  urlEndpoint={import.meta.env.VITE_IMAGE_KIT_ENDPOINT}
                  path={attachment.filePath}
                  height="100"
                  width="100"
                  transformation={[{ height: 200, width: 200 }]}
                  loading="lazy"
                  lqip={{ active: true, quality: 20 }}
                />
              </div>
            ))
          : null}
        <div className="message">{textMessage}</div>
      </div>
    </div>
  );
};

export default UserMessage;

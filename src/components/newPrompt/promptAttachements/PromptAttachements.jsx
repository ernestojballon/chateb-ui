import "./PromptAttachements.css";
import { IKImage } from "imagekitio-react";
import { MdCancel } from "react-icons/md";
import useNewPromptStore from "../../../store/newPromptStore.store";
import Spinner from "../../spinner/Spinner";
const PromptAttachements = () => {
  const { attachments, attachmentLoading, removeAttachment } =
    useNewPromptStore();
  if (attachmentLoading) {
    return (
      <span className="spinner-container">
        <Spinner size={"small"} />
      </span>
    );
  }
  return (
    <div className="tempImg">
      {attachments.map((attachment) => (
        <div key={attachment.fileId} className="thumbnailImg">
          <span
            onClick={() => removeAttachment(attachment.fileId)}
            className="cancelButton"
          >
            <MdCancel color="#2c2937" size={24} />
          </span>
          <IKImage
            urlEndpoint={import.meta.env.VITE_IMAGE_KIT_ENDPOINT}
            path={attachment.filePath}
            width="50"
            transformation={[{ width: 50, height: 50 }]}
          />
        </div>
      ))}
    </div>
  );
};

export default PromptAttachements;

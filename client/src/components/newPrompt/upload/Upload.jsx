import { IKContext, IKUpload } from "imagekitio-react";
import { useRef } from "react";
import useNewPromptStore from "../../../store/newPromptStore.store.ts";

const urlEndpoint = import.meta.env.VITE_IMAGE_KIT_ENDPOINT;
const publicKey = import.meta.env.VITE_IMAGE_KIT_PUBLIC_KEY;

const authenticator = async () => {
  try {
    const response = await fetch("http://localhost:3000/api/upload");

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Request failed with status ${response.status}: ${errorText}`,
      );
    }

    const data = await response.json();
    const { signature, expire, token } = data;
    return { signature, expire, token };
  } catch (error) {
    throw new Error(`Authentication request failed: ${error.message}`);
  }
};

const Upload = () => {
  const { addAttachment, setAttachmentLoading } = useNewPromptStore();
  const ikUploadRef = useRef(null);

  // Use the external ref if provided, otherwise use the local ref
  const finalRef = ikUploadRef;

  const onError = (err) => {
    console.log("Error", err);
  };

  const onSuccess = (res) => {
    console.log("Success", res);
    addAttachment(res);
    setAttachmentLoading(false);
  };

  const onUploadProgress = (progress) => {
    console.log("Progress", progress);
  };

  const onUploadStart = (evt) => {
    const file = evt.target.files[0];

    const reader = new FileReader();
    reader.onloadend = () => {
      setAttachmentLoading(true);
    };
    reader.readAsDataURL(file);
  };

  return (
    <IKContext
      urlEndpoint={urlEndpoint}
      publicKey={publicKey}
      authenticator={authenticator}
    >
      <IKUpload
        fileName="test-upload.png"
        onError={onError}
        onSuccess={onSuccess}
        useUniqueFileName={true}
        onUploadProgress={onUploadProgress}
        onUploadStart={onUploadStart}
        style={{ display: "none" }}
        ref={finalRef}
      />
      {
        <>
          <label onClick={() => finalRef.current.click()}>
            <img src="/attachment.png" alt="" />
          </label>
        </>
      }
    </IKContext>
  );
};

export default Upload;

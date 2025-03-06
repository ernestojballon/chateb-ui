import { IKContext, IKUpload } from "imagekitio-react";
import { useRef } from "react";
import useNewPromptStore from "../../../store/newPromptStore.store.ts";
import { useAuth } from "@clerk/clerk-react"; // Or however you're importing Clerk

const urlEndpoint = import.meta.env.VITE_IMAGE_KIT_ENDPOINT;
const publicKey = import.meta.env.VITE_IMAGE_KIT_PUBLIC_KEY;

const authenticator = async (getApiToken) => {
  const apiToken = await getApiToken();
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/upload`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiToken}`,
      },
    });

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
  const { getToken } = useAuth();
  const { addAttachment, setAttachmentLoading } = useNewPromptStore();
  const ikUploadRef = useRef(null); // Ref for the IKUpload component

  // Use the external ref if provided, otherwise use the local ref
  const finalRef = ikUploadRef;

  const onError = (err) => {
    console.log("Error", err);
  };

  const onSuccess = (res) => {
    console.log("Success", res);
    addAttachment(res);
    setAttachmentLoading(false);
    // Reset the input value to allow uploading the same file again
    finalRef.current.value = "";
  };

  const onUploadProgress = (progress) => {
    console.log("Progress", progress);
  };

  return (
    <IKContext
      urlEndpoint={urlEndpoint}
      publicKey={publicKey}
      authenticator={() => authenticator(getToken)}
    >
      <IKUpload
        fileName="test-upload.png"
        onError={onError}
        onSuccess={onSuccess}
        useUniqueFileName={true}
        onUploadStart={() => setAttachmentLoading(true)}
        onUploadProgress={onUploadProgress}
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

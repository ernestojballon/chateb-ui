import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

export type Attachment = {
  _id: string;
  name: string;
  url: string;
  mimeType: string;
  data: string;
}

const store = (set) => ({
  attachments: [],
  attachmentLoading: false,
  setAttachmentLoading: (loading) => set({ attachmentLoading: loading }, false, "Setting Attachment Loading"),
  addAttachment: (attachment) => set((state) => ({
    attachments: [...state.attachments, attachment],
    attachmentLoading: false
  }), false, "Adding Attachment"),
  removeAttachment: (fileId) => set((state) => ({
    attachments: state.attachments.filter((attachment) => attachment.fileId !== fileId)
  }), false, "Removing Attachment"),
  clearAttachments: () => set({ attachments: [] }, false, "Clearing Attachments"),
})


const useNewPromptStore = create(devtools(store))

export default useNewPromptStore;
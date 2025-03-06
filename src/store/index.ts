import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

const store = (set) => ({
  isSidebarOpen: false,
  setIsSidebarOpen: (isOpen) => set({ isSidebarOpen: isOpen }),
  scrolltoEnd: true,
  setScrollToEnd: (scrollToEnd) => set({ scrolltoEnd: scrollToEnd }),
  chatId: null,
  apiCallsReferences: {},
  chatHistory: [],
  userId: null,


  setChatId: (newChatId) => set({ chatId: newChatId }, false, "Setting Up ChatId"),
  setChatInfo: (data) => set((state) => ({
    chatHistory: data?.history || [],
    userId: data?.userId || null,
    apiCallsReferences: { ...state.apiCallsReferences, chatInfoCall: data }
  }),
    false,
    { type: 'chat/updateHistory', description: 'Update chat history' }
  ),
  preAddUserMsgToChatHistory: (chatEntry) => set((state) => ({
    chatHistory: [...state.chatHistory, {
      role: "user",
      parts: [{
        text: chatEntry.text
      }],
      attachments: chatEntry.attachments || ""
    }]
  }),
    false,
    { type: 'chat/updateHistory', description: 'Pre adding user message' }
  ),
  preAddModelMsgToChatHistory: (chatEntry) => set((state) => {

    const chatHistory = [...state.chatHistory]; // Create a copy to avoid direct state mutation

    // Check if array has items and if the last one is a model message
    const lastIndex = chatHistory.length - 1;
    const isLastOneModel = lastIndex >= 0 && chatHistory[lastIndex].role === "model";

    if (isLastOneModel) {
      // Update the last object in the array
      chatHistory[lastIndex].parts = [{
        text: chatEntry.text
      }];
      return ({
        chatHistory: chatHistory // Return the updated array
      });
    }
    return ({
      chatHistory: [...state.chatHistory, {
        role: "model",
        parts: [{
          text: chatEntry.text
        }]
      }]
    })


  },
    false,
    { type: 'chat/updateHistory', description: 'Pre adding model message' }
  ),

})

const useStore = create(devtools(store))

export default useStore;

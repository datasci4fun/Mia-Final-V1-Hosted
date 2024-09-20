import { ChatbotUIContext } from "@/context/context"
import { useContext, useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"

/**
 * Custom hook for handling chat history in the chat component.
 * It provides functions to set the new message content to the previous or next user message in the chat history.
 *
 * @returns An object containing the following functions:
 *   - setNewMessageContentToPreviousUserMessage: Sets the new message content to the previous user message.
 *   - setNewMessageContentToNextUserMessage: Sets the new message content to the next user message in the chat history.
 */
export const useChatHistoryHandler = () => {
  const { setUserInput, chatMessages, isGenerating, selectedChat } =
    useContext(ChatbotUIContext)
  const userRoleString = "user"

  const [messageHistoryIndex, setMessageHistoryIndex] = useState<number>(
    chatMessages.length
  )
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    // If messages get deleted the history index pointed could be out of bounds
    if (!isGenerating && messageHistoryIndex > chatMessages.length) {
      setMessageHistoryIndex(chatMessages.length)
    }
  }, [chatMessages, isGenerating, messageHistoryIndex])

  /**
   * Function to preserve existing URL parameters like `?view=widget` during navigation.
   */
  const preserveParams = () => {
    // Retrieve existing parameters from the URL
    const currentParams = new URLSearchParams(searchParams.toString())
    console.log("Preserving parameters:", currentParams.toString()) // Log the parameters being preserved
    return currentParams.toString() ? `?${currentParams.toString()}` : ""
  }

  /**
   * Sets the new message content to the previous user message.
   */
  const setNewMessageContentToPreviousUserMessage = () => {
    let tempIndex = messageHistoryIndex
    while (
      tempIndex > 0 &&
      chatMessages[tempIndex - 1].message.role !== userRoleString
    ) {
      tempIndex--
    }

    const previousUserMessage =
      chatMessages.length > 0 && tempIndex > 0
        ? chatMessages[tempIndex - 1]
        : null
    if (previousUserMessage) {
      setUserInput(previousUserMessage.message.content)
      setMessageHistoryIndex(tempIndex - 1)

      // Log navigation details
      if (selectedChat) {
        const path = `/${selectedChat.workspace_id}/chat/${selectedChat.id}${preserveParams()}`
        console.log("Navigating to previous conversation:", path)
        router.push(path)
      } else {
        console.error("Selected chat is not set")
      }
    }
  }

  /**
   * Sets the new message content to the next user message in the chat history.
   * If there is a next user message, it updates the user input and message history index accordingly.
   * If there is no next user message, it resets the user input and sets the message history index to the end of the chat history.
   */
  const setNewMessageContentToNextUserMessage = () => {
    let tempIndex = messageHistoryIndex
    while (
      tempIndex < chatMessages.length - 1 &&
      chatMessages[tempIndex + 1].message.role !== userRoleString
    ) {
      tempIndex++
    }

    const nextUserMessage =
      chatMessages.length > 0 && tempIndex < chatMessages.length - 1
        ? chatMessages[tempIndex + 1]
        : null
    setUserInput(nextUserMessage?.message.content || "")
    setMessageHistoryIndex(
      nextUserMessage ? tempIndex + 1 : chatMessages.length
    )

    // Log navigation details
    if (selectedChat) {
      const path = `/${selectedChat.workspace_id}/chat/${selectedChat.id}${preserveParams()}`
      console.log("Navigating to next conversation:", path)
      router.push(path)
    } else {
      console.error("Selected chat is not set")
    }
  }

  return {
    setNewMessageContentToPreviousUserMessage,
    setNewMessageContentToNextUserMessage
  }
}

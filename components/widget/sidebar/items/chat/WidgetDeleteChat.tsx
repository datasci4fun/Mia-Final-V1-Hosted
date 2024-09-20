import { FC, useContext, useState, useRef } from "react"
import { IconTrash } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog"
import { ChatbotUIContext } from "@/context/context"
import { deleteChat } from "@/db/chats"
import { Tables } from "@/supabase/types"

interface WidgetDeleteChatProps {
  chat: Tables<"chats">
}

export const WidgetDeleteChat: FC<WidgetDeleteChatProps> = ({ chat }) => {
  const { setChats } = useContext(ChatbotUIContext)
  const [showDialog, setShowDialog] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)

  const handleDelete = async () => {
    await deleteChat(chat.id)
    setChats(prevState => prevState.filter(c => c.id !== chat.id))
    setShowDialog(false)
  }

  return (
    <Dialog open={showDialog} onOpenChange={setShowDialog}>
      <DialogTrigger asChild>
        <IconTrash className="hover:opacity-50" size={18} />
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete {chat.name}</DialogTitle>
        </DialogHeader>
        <DialogFooter>
          <Button variant="ghost" onClick={() => setShowDialog(false)}>
            Cancel
          </Button>
          <Button ref={buttonRef} variant="destructive" onClick={handleDelete}>
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

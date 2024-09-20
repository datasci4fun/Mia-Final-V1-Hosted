import { FC, useContext, useState, useRef } from "react"
import { IconEdit } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { ChatbotUIContext } from "@/context/context"
import { updateChat } from "@/db/chats"
import { Tables } from "@/supabase/types"

interface WidgetUpdateChatProps {
  chat: Tables<"chats">
}

export const WidgetUpdateChat: FC<WidgetUpdateChatProps> = ({ chat }) => {
  const { setChats } = useContext(ChatbotUIContext)
  const [showDialog, setShowDialog] = useState(false)
  const [name, setName] = useState(chat.name)
  const buttonRef = useRef<HTMLButtonElement>(null)

  const handleUpdate = async () => {
    const updatedChat = await updateChat(chat.id, { name })
    setChats(prevState =>
      prevState.map(c => (c.id === chat.id ? updatedChat : c))
    )
    setShowDialog(false)
  }

  return (
    <Dialog open={showDialog} onOpenChange={setShowDialog}>
      <DialogTrigger asChild>
        <IconEdit className="hover:opacity-50" size={18} />
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Chat</DialogTitle>
        </DialogHeader>
        <Input value={name} onChange={e => setName(e.target.value)} />
        <DialogFooter>
          <Button variant="ghost" onClick={() => setShowDialog(false)}>
            Cancel
          </Button>
          <Button ref={buttonRef} onClick={handleUpdate}>
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

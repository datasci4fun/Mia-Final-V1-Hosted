// C:\Users\blixa\Documents\xampp\git\Mia-Final-V1\components\widget\sidebar\sidebar-content.tsx

import { Tables } from "@/supabase/types"
import { ContentType } from "@/types"
import { FC, useState } from "react"
import { SidebarCreateButtons } from "@/components/sidebar/sidebar-create-buttons"
import { SidebarDataList } from "@/components/widget/sidebar/sidebar-data-list"
import { SidebarSearch } from "@/components/sidebar/sidebar-search"

// Define each specific data type for clarity
interface ChatData {
  id: string
  name: string
  description: string
  created_at: string
  folder_id: string | null
  sharing: string
  updated_at: string | null
  user_id: string
}

interface PresetData {
  id: string
  name: string
  description: string
  created_at: string
  folder_id: string | null
  sharing: string
  updated_at: string | null
  user_id: string
}

interface PromptData {
  id: string
  name: string
  description: string
  created_at: string
  folder_id: string | null
  sharing: string
  updated_at: string | null
  user_id: string
}

interface FileData {
  id: string
  name: string
  description: string
  created_at: string
  folder_id: string | null
  sharing: string
  updated_at: string | null
  user_id: string
}

interface CollectionData {
  id: string
  name: string
  description: string
  created_at: string
  folder_id: string | null
  sharing: string
  updated_at: string | null
  user_id: string
}

interface AssistantData {
  id: string
  name: string
  description: string // Placeholders, ensure it's defined
  created_at: string
  folder_id: string | null
  sharing: string
  updated_at: string | null
  user_id: string
}

interface ToolData {
  id: string
  name: string
  description: string
  created_at: string
  folder_id: string | null
  sharing: string
  updated_at: string | null
  user_id: string
}

interface ModelData {
  id: string
  name: string
  description: string
  created_at: string
  folder_id: string | null
  sharing: string
  updated_at: string | null
  user_id: string
}

// Consolidated type to match all potential data types
type DataListType =
  | ChatData
  | PresetData
  | PromptData
  | FileData
  | CollectionData
  | AssistantData
  | ToolData
  | ModelData

interface SidebarContentProps {
  contentType: ContentType
  data: DataListType[] // Explicitly typed to match defined types
  folders: Tables<"folders">[]
  handleNavigation: (path: string) => void
}

export const SidebarContent: FC<SidebarContentProps> = ({
  contentType,
  data,
  folders,
  handleNavigation
}) => {
  const [searchTerm, setSearchTerm] = useState("")

  // Ensure all data items conform to the expected structure with a description
  const normalizedData = data.map(item => ({
    ...item,
    description: item.description || "" // Ensure description is always present
  }))

  // Filter the data based on the search term
  const filteredData = normalizedData.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="flex max-h-[calc(100%-50px)] grow flex-col">
      <div className="mt-2 flex items-center">
        <SidebarCreateButtons
          contentType={contentType}
          hasData={normalizedData.length > 0}
        />
      </div>

      <div className="mt-2">
        <SidebarSearch
          contentType={contentType}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />
      </div>

      {/* Render the data list with the filtered and normalized data */}
      <SidebarDataList
        contentType={contentType}
        data={filteredData}
        folders={folders}
        handleNavigation={handleNavigation}
      />
    </div>
  )
}

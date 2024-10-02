import { useState, useContext, useEffect } from "react";
import { ChatbotUIContext } from "@/context/context";
import { createDocXFile, createFile } from "@/db/files";
import { LLM_LIST } from "@/lib/models/llm/llm-list";
import mammoth from "mammoth";
import { toast } from "sonner";

export const ACCEPTED_FILE_TYPES = [
  "text/csv",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/json",
  "text/markdown",
  "application/pdf",
  "text/plain"
].join(",");

export const useSelectFileHandler = () => {
  const {
    selectedWorkspace,
    profile,
    chatSettings,
    setNewMessageImages,
    setNewMessageFiles,
    setShowFilesDisplay,
    setFiles,
    setUseRetrieval
  } = useContext(ChatbotUIContext);

  const [filesToAccept, setFilesToAccept] = useState(ACCEPTED_FILE_TYPES);
  const [useAlternatePdfProcess, setUseAlternatePdfProcess] = useState(false); // State for checkbox

  useEffect(() => {
    handleFilesToAccept();
  }, [chatSettings?.model]);

  const handleFilesToAccept = () => {
    const model = chatSettings?.model;
    const FULL_MODEL = LLM_LIST.find(llm => llm.modelId === model);

    if (!FULL_MODEL) return;

    setFilesToAccept(
      FULL_MODEL.imageInput
        ? `${ACCEPTED_FILE_TYPES},image/*`
        : ACCEPTED_FILE_TYPES
    );
  };

  const handleSelectDeviceFile = async (file: File) => {
    if (!profile || !selectedWorkspace || !chatSettings) return;

    setShowFilesDisplay(true);
    setUseRetrieval(true);

    if (file) {
      // Ensure file.type is defined before calling .includes()
      let simplifiedFileType = file.type ? file.type.split("/")[1] : '';
      let reader = new FileReader();

      // Check if file.type exists and then call .includes()
      if (file.type && file.type.includes("image")) {
        reader.readAsDataURL(file);
      } else if (ACCEPTED_FILE_TYPES.split(",").includes(file.type)) {
        if (simplifiedFileType && simplifiedFileType.includes("vnd.adobe.pdf")) {
          simplifiedFileType = "pdf";
        } else if (
          simplifiedFileType &&
          simplifiedFileType.includes(
            "vnd.openxmlformats-officedocument.wordprocessingml.document" || "docx"
          )
        ) {
          simplifiedFileType = "docx";
        }

        setNewMessageFiles(prev => [
          ...prev,
          {
            id: "loading",
            name: file.name,
            type: simplifiedFileType,
            file: file
          }
        ]);

        // Handle docx files
        if (
          file.type &&
          file.type.includes(
            "vnd.openxmlformats-officedocument.wordprocessingml.document" || "docx"
          )
        ) {
          const arrayBuffer = await file.arrayBuffer();
          const result = await mammoth.extractRawText({
            arrayBuffer
          });

          const createdFile = await createDocXFile(
            result.value,
            file,
            {
              user_id: profile.user_id,
              description: "",
              file_path: "",
              name: file.name,
              size: file.size,
              tokens: 0,
              type: simplifiedFileType
            },
            selectedWorkspace.id,
            chatSettings.embeddingsProvider
          );

          setFiles(prev => [...prev, createdFile]);

          setNewMessageFiles(prev =>
            prev.map(item =>
              item.id === "loading"
                ? {
                    id: createdFile.id,
                    name: createdFile.name,
                    type: createdFile.type,
                    file: file
                  }
                : item
            )
          );

          reader.onloadend = null;

          return;
        } else {
          // Use readAsArrayBuffer for PDFs and readAsText for other types
          file.type && file.type.includes("pdf")
            ? reader.readAsArrayBuffer(file)
            : reader.readAsText(file);
        }
      } else {
        throw new Error("Unsupported file type");
      }

      reader.onloadend = async function () {
        try {
          if (file.type && file.type.includes("image")) {
            const imageUrl = URL.createObjectURL(file);

            setNewMessageImages(prev => [
              ...prev,
              {
                messageId: "temp",
                path: "",
                base64: reader.result, // base64 image
                url: imageUrl,
                file
              }
            ]);
          } else {
            const createdFile = await createFile(
              file,
              {
                user_id: profile.user_id,
                description: "",
                file_path: "",
                name: file.name,
                size: file.size,
                tokens: 0,
                type: simplifiedFileType,
                useAlternatePdfProcess // Pass checkbox state to backend
              },
              selectedWorkspace.id,
              chatSettings.embeddingsProvider
            );

            setFiles(prev => [...prev, createdFile]);

            setNewMessageFiles(prev =>
              prev.map(item =>
                item.id === "loading"
                  ? {
                      id: createdFile.id,
                      name: createdFile.name,
                      type: createdFile.type,
                      file: file
                    }
                  : item
              )
            );
          }
        } catch (error: any) {
          toast.error("Failed to upload. " + error?.message, {
            duration: 10000
          });
          setNewMessageImages(prev =>
            prev.filter(img => img.messageId !== "temp")
          );
          setNewMessageFiles(prev => prev.filter(file => file.id !== "loading"));
        }
      };
    }
  };

  // Toggle for alternate processing
  const handleToggleAlternateProcessing = () => {
    setUseAlternatePdfProcess(!useAlternatePdfProcess);
  };

  return {
    handleSelectDeviceFile,
    filesToAccept,
    useAlternatePdfProcess,
    handleToggleAlternateProcessing // Return toggle handler
  };
};

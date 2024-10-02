import { FileItemChunk } from "@/types";
import { encode } from "gpt-tokenizer";
import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { CHUNK_OVERLAP, CHUNK_SIZE } from ".";
import * as csvWriter from "csv-writer"; // Assuming you have a CSV writer package installed

// Helper function to remove headers
const stripHeaders = (text: string): string => {
  const headerPatterns = [
    /Page \d+ of \d+/g,            // Matches page numbers
    /\d{2}\/\d{2}\/\d{4}/g,        // Matches dates
    /Item\s+Qty\s+Description/g,    // Matches column headers
    /ITEM TOTAL:\s+\$\d+(\.\d{2})?/g,  // Matches ITEM TOTAL
    /^[A-Z ]+(\s+Inc\.|LLC|Corp\.)/g  // Matches company names
  ];

  headerPatterns.forEach(pattern => {
    text = text.replace(pattern, "").trim();
  });

  return text;
};

// Helper function to search for specific patterns (e.g., Model number and Quantity)
const extractLineItemData = (text: string): { modelNumber: string; quantity: string }[] => {
  const lineItems: { modelNumber: string; quantity: string }[] = [];
  
  const lineItemPattern = /(\d+)\s+ea\s+(?:[A-Za-z\s]+Model No\.\s+([A-Za-z0-9\-]+))/g;
  let match;
  
  while ((match = lineItemPattern.exec(text)) !== null) {
    const quantity = match[1]; // e.g., "2 ea"
    const modelNumber = match[2]; // e.g., "STG-3672SSK-X"
    
    lineItems.push({ quantity, modelNumber });
  }
  
  return lineItems;
};

// Helper function to create CSV file
const createCSV = async (lineItems: { modelNumber: string; quantity: string }[]) => {
  const createCsvWriter = csvWriter.createObjectCsvWriter;
  
  const csvWriterInstance = createCsvWriter({
    path: '/mnt/data/extracted_line_items.csv',
    header: [
      { id: 'modelNumber', title: 'Model Number' },
      { id: 'quantity', title: 'Quantity' }
    ]
  });

  await csvWriterInstance.writeRecords(lineItems);
};

export const processPdfWithHeaders = async (pdf: Blob): Promise<FileItemChunk[]> => {
  const loader = new PDFLoader(pdf);
  const docs = await loader.load();
  let completeText = docs.map(doc => doc.pageContent).join(" ");

  // Strip headers from the text
  completeText = stripHeaders(completeText);

  // Extract line item data
  const lineItems = extractLineItemData(completeText);

  // Generate CSV with the extracted data
  await createCSV(lineItems);

  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: CHUNK_SIZE,
    chunkOverlap: CHUNK_OVERLAP
  });
  const splitDocs = await splitter.createDocuments([completeText]);

  let chunks: FileItemChunk[] = [];

  for (let i = 0; i < splitDocs.length; i++) {
    const doc = splitDocs[i];

    chunks.push({
      content: doc.pageContent,
      tokens: encode(doc.pageContent).length
    });
  }

  return chunks;
};

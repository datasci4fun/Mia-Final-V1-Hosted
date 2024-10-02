import { FileItemChunk } from "@/types";
import { encode } from "gpt-tokenizer";
import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { CHUNK_OVERLAP, CHUNK_SIZE } from ".";
import * as fs from "fs";
import * as path from "path";

// Log file path in /tmp directory (or other writable path)
const logFilePath = path.join("/tmp", "pdf_processing_log.txt");

// Helper function to log messages
const logMessage = (message: string) => {
  console.log(message); // Log to console (server-side)
  fs.appendFileSync(logFilePath, `${new Date().toISOString()}: ${message}\n`); // Append to log file
};

// Helper function to remove headers and footers from the PDF text
const stripHeadersAndFooters = (text: string): string => {
  const headerFooterPatterns = [
    /Page \d+ of \d+/g,             // Matches page numbers (e.g., "Page 1 of 10")
    /\d{2}\/\d{2}\/\d{4}/g,         // Matches dates (e.g., "12/07/2022")
    /Item\s+Qty\s+Description/g,     // Matches column headers
    /ITEM TOTAL:\s+\$\d+(\.\d{2})?/g, // Matches item totals
    /^[A-Z ]+(\s+Inc\.|LLC|Corp\.)/g, // Matches company names
  ];

  headerFooterPatterns.forEach(pattern => {
    text = text.replace(pattern, "").trim();
  });

  return text;
};

// Helper function to extract item quantity and model number using regex
const extractItemData = (text: string): { quantity: string; modelNumber: string }[] => {
  const items: { quantity: string; modelNumber: string }[] = [];
  const itemPattern = /(\d+)\s+ea\s+(?:[A-Za-z\s]+Model No\.\s+([A-Za-z0-9\-]+))/g;
  let match;

  logMessage("Extracting item data...");

  // Loop through matches and extract the data
  while ((match = itemPattern.exec(text)) !== null) {
    const quantity = match[1]; // e.g., "1"
    const modelNumber = match[2]; // e.g., "XYZ-1234"
    items.push({ quantity, modelNumber });
    logMessage(`Found item - Quantity: ${quantity}, Model No: ${modelNumber}`);
  }

  if (items.length === 0) {
    logMessage("No items found in this text segment.");
  }

  return items;
};

// Convert extracted item data into FileItemChunk[]
const convertToChunks = (items: { quantity: string; modelNumber: string }[]): FileItemChunk[] => {
  logMessage("Converting items to chunks...");
  return items.map(item => {
    const content = `Quantity: ${item.quantity}, Model No: ${item.modelNumber}`;
    return {
      content,
      tokens: encode(content).length // Tokenize the content for use in embeddings
    };
  });
};

// Main function to process the PDF
export const processPdfWithHeaders = async (pdf: Blob): Promise<FileItemChunk[]> => {
  logMessage("Starting PDF processing...");

  const loader = new PDFLoader(pdf);
  const docs = await loader.load();

  // Log the number of pages
  logMessage(`Processing ${docs.length} page(s) from the PDF...`);

  // Join all pages' text together
  let completeText = docs.map((doc, index) => {
    logMessage(`Processing page ${index + 1}...`);
    return doc.pageContent;
  }).join(" ");

  // Strip headers and footers from the text
  completeText = stripHeadersAndFooters(completeText);
  logMessage("Stripped headers and footers from the text...");

  // Extract item data (quantity and model number)
  const items = extractItemData(completeText);

  // Convert extracted items into chunks
  const chunks = convertToChunks(items);

  logMessage(`Extracted ${items.length} item(s) from the PDF.`);
  
  logMessage("Finished PDF processing.");
  
  return chunks;
};

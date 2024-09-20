// C:\Users\blixa\Documents\xampp\git\Mia-Final-V1-Hosted\app\api\chat-widget\route.js
import path from 'path';
import { promises as fs } from 'fs';

export async function GET(req) {
  try {
    // Define the path to the chat-widget.js file in the public directory
    const filePath = path.join(process.cwd(), 'public', 'chat-widget.js');

    // Read the file contents
    const fileContents = await fs.readFile(filePath, 'utf8');

    // Return the JavaScript file contents with the correct headers
    return new Response(fileContents, {
      headers: {
        'Content-Type': 'application/javascript',
      },
    });
  } catch (error) {
    console.error('Error serving chat-widget.js:', error);
    return new Response('Failed to load chat-widget.js', { status: 500 });
  }
}

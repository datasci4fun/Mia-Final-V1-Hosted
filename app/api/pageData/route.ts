// C:\Users\blixa\Documents\xampp\git\Mia-Final-V1-Hosted\app\api\pageData\route.ts

import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server'; // Corrected path to match your file structure
import { cookies } from 'next/headers'; // Import cookies to pass to createClient

// Define the POST handler to receive data and insert it into Supabase
export async function POST(request: Request) {
  try {
    // Use cookies from the request to initialize the Supabase client
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);

    // Parse the incoming request JSON data
    const { user_id, session_id, page_url, page_title, page_description, product_info } = await request.json();

    console.log("Received payload:", { user_id, session_id, page_url, page_title, page_description, product_info });

    // Validate the required fields
    if (!user_id || !session_id || !page_url || !page_title) {
      console.error("Missing required fields in payload.");
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }

    // Insert the data into the Supabase table
    const { data, error } = await supabase
      .from('user_page_data')
      .insert({
        user_id,
        session_id,
        page_url,
        page_title,
        page_description,
        product_info,
        created_at: new Date().toISOString(),
      });

    if (error) {
      console.error("Error inserting data into Supabase:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    console.log("Data successfully inserted:", data);
    return NextResponse.json({ message: "Data successfully inserted.", data }, { status: 200 });
  } catch (error) {
    console.error("Error handling request:", error);
    return NextResponse.json({ error: "Failed to process the request." }, { status: 500 });
  }
}

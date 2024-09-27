import { supabase } from "@/lib/supabase/browser-client";
import { TablesInsert, TablesUpdate } from "@/supabase/types";

// Utility function to retrieve the current session
const getSession = async () => {
  const { data, error } = await supabase.auth.getSession();

  if (error) {
    console.error("Error fetching session:", error.message);
    throw new Error("Unable to fetch session data.");
  }

  const session = data?.session;
  if (!session) {
    throw new Error("Session not available.");
  }

  return session;
};

// Retrieve a single page data entry by ID
export const getPageDataById = async (pageDataId: string) => {
  const { data: pageData, error } = await supabase
    .from("user_page_data")
    .select("*")
    .eq("id", pageDataId)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return pageData;
};

// Retrieve page data by session ID, ordered by creation date
export const getPageDataBySessionId = async () => {
  try {
    const session = await getSession();
    const sessionId = session.access_token; // or session.user.id if using user ID

    const { data: pageData, error } = await supabase
      .from("user_page_data")
      .select("*")
      .eq("session_id", sessionId)
      .order("created_at", { ascending: false });

    if (error) {
      throw new Error(error.message);
    }

    return pageData;
  } catch (error) {
    console.error("Error fetching page data by session:", error);
    throw error;
  }
};

// Insert a single page data entry
export const createPageData = async (pageData: TablesInsert<"user_page_data">) => {
  try {
    const session = await getSession();
    const sessionId = session.access_token; // or session.user.id if using user ID

    const { data: createdPageData, error } = await supabase
      .from("user_page_data")
      .insert([{ ...pageData, session_id: sessionId }])
      .select("*")
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return createdPageData;
  } catch (error) {
    console.error("Error creating page data:", error);
    throw error;
  }
};

// Insert multiple page data entries
export const createPageDataEntries = async (pageDataEntries: TablesInsert<"user_page_data">[]) => {
  try {
    const session = await getSession();
    const sessionId = session.access_token; // or session.user.id if using user ID

    const entriesWithSession = pageDataEntries.map((entry) => ({
      ...entry,
      session_id: sessionId,
    }));

    const { data: createdPageDataEntries, error } = await supabase
      .from("user_page_data")
      .insert(entriesWithSession)
      .select("*");

    if (error) {
      throw new Error(error.message);
    }

    return createdPageDataEntries;
  } catch (error) {
    console.error("Error creating multiple page data entries:", error);
    throw error;
  }
};

// Update a page data entry by ID
export const updatePageData = async (
  pageDataId: string,
  pageData: TablesUpdate<"user_page_data">
) => {
  const { data: updatedPageData, error } = await supabase
    .from("user_page_data")
    .update(pageData)
    .eq("id", pageDataId)
    .select("*")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return updatedPageData;
};

// Delete a page data entry by ID
export const deletePageData = async (pageDataId: string) => {
  const { error } = await supabase.from("user_page_data").delete().eq("id", pageDataId);

  if (error) {
    throw new Error(error.message);
  }

  return true;
};

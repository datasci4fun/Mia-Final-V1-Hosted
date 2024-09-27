import { supabase } from "@/lib/supabase/browser-client";
import { TablesInsert, TablesUpdate } from "@/supabase/types";

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
export const getPageDataBySessionId = async (sessionId: string) => {
  const { data: pageData, error } = await supabase
    .from("user_page_data")
    .select("*")
    .eq("session_id", sessionId)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return pageData;
};

// Insert a single page data entry
export const createPageData = async (pageData: TablesInsert<"user_page_data">) => {
  const { data: createdPageData, error } = await supabase
    .from("user_page_data")
    .insert([pageData])
    .select("*")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return createdPageData;
};

// Insert multiple page data entries
export const createPageDataEntries = async (pageDataEntries: TablesInsert<"user_page_data">[]) => {
  const { data: createdPageDataEntries, error } = await supabase
    .from("user_page_data")
    .insert(pageDataEntries)
    .select("*");

  if (error) {
    throw new Error(error.message);
  }

  return createdPageDataEntries;
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

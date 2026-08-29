import { supabaseConfig } from "@/config/supabase-client-config";

export const uploadFileAndReturnUrl = async (file: File) => {
  try {
    const supabase = supabaseConfig();
    const fileName = `${Date.now()}-${file.name}`;
    const { data, error } = await supabase.storage
      .from("shop_products")
      .upload(fileName, file);

    if (error) {
      throw new Error(error.message);
    }

    const { data: publicUrlData } = supabase.storage
      .from("shop_products")
      .getPublicUrl(fileName);

    return publicUrlData.publicUrl;
  } catch (err) {
    throw err instanceof Error ? err : new Error("Failed to upload file.");
  }
};
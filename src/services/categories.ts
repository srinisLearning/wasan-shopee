import { ICategory } from "@/interfaces/index";
import { supabaseConfig } from "@/config/supabase-client-config";

export const addCategory = async (payload: Partial<ICategory>) => {
  try {
    const supabase = supabaseConfig();
    const { data, error } = await supabase
      .from("shop_categories")
      .insert({
        name: payload.name,
        description: payload.description,
      })
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }
    return data;
  } catch (err) {
    throw err instanceof Error ? err : new Error("Failed to add category.");
  }
};

export const getCategoryById = async (id: string) => {
  try {
    const supabase = supabaseConfig();
    const { data, error } = await supabase
      .from("shop_categories")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      throw new Error(error.message);
    }
    return data;
  } catch (err) {
    throw err instanceof Error ? err : new Error("Failed to get category.");
  }
};

export const editCategoryById = async (id: string, payload: Partial<ICategory>) => {
  try {
    const supabase = supabaseConfig();
    const { data, error } = await supabase
      .from("shop_categories")
      .update({
        name: payload.name,
        description: payload.description,
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }
    return data;
  } catch (err) {
    throw err instanceof Error ? err : new Error("Failed to edit category.");
  }
};

export const getAllCategories = async () => {
  try {
    const supabase = supabaseConfig();
    const { data, error } = await supabase
      .from("shop_categories")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      throw new Error(error.message);
    }
    return data;
  } catch (err) {
    throw err instanceof Error ? err : new Error("Failed to get all categories.");
  }
};

export const deleteCategory = async (id: string) => {
  try {
    const supabase = supabaseConfig();
    const { data, error } = await supabase
      .from("shop_categories")
      .delete()
      .eq("id", id)
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }
    return data;
  } catch (err) {
    throw err instanceof Error ? err : new Error("Failed to delete category.");
  }
};

export const getCategoriesCount = async () => {
  try {
    const supabase = supabaseConfig();
    const { count, error } = await supabase
      .from("shop_categories")
      .select("*", { count: "exact", head: true });

    if (error) throw new Error(error.message);
    return { success: true, count: count ?? 0 };
  } catch (err: any) {
    return { success: false, message: err.message, count: 0 };
  }
};


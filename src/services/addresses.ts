import { IAddress } from "@/interfaces/index";
import { supabaseConfig } from "@/config/supabase-client-config";

export const addAddress = async (payload: Partial<IAddress>) => {
  try {
    const supabase = supabaseConfig();
    const isDefault = payload.is_default === true;

    if (isDefault && payload.user_id) {
      await supabase.from("shop_addresses").update({ is_default: false }).eq("user_id", payload.user_id);
    }

    const { data, error } = await supabase
      .from("shop_addresses")
      .insert({
        user_id: payload.user_id,
        name: payload.name,
        address_line_1: payload.address_line_1,
        address_line_2: payload.address_line_2,
        city: payload.city,
        state: payload.state,
        zip_code: payload.zip_code,
        is_default: isDefault,
      })
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }
    return data;
  } catch (err) {
    throw err instanceof Error ? err : new Error("Failed to add address.");
  }
};

export const getUserAddresses = async (userId: string) => {
  try {
    const supabase = supabaseConfig();
    const { data, error } = await supabase
      .from("shop_addresses")
      .select("*")
      .eq("user_id", userId)
      .order("is_default", { ascending: false })
      .order("created_at", { ascending: false });

    if (error) {
      throw new Error(error.message);
    }
    return data;
  } catch (err) {
    throw err instanceof Error ? err : new Error("Failed to get addresses.");
  }
};

export const editAddress = async (id: string, payload: Partial<IAddress>) => {
  try {
    const supabase = supabaseConfig();
    const isDefault = payload.is_default === true;

    if (isDefault) {
      // Unset others first if we can determine the user_id (or we can just fetch it)
      const { data: currentAddr } = await supabase.from("shop_addresses").select("user_id").eq("id", id).single();
      if (currentAddr?.user_id) {
        await supabase.from("shop_addresses").update({ is_default: false }).eq("user_id", currentAddr.user_id);
      }
    }

    const { data, error } = await supabase
      .from("shop_addresses")
      .update({
        name: payload.name,
        address_line_1: payload.address_line_1,
        address_line_2: payload.address_line_2,
        city: payload.city,
        state: payload.state,
        zip_code: payload.zip_code,
        is_default: isDefault,
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }
    return data;
  } catch (err) {
    throw err instanceof Error ? err : new Error("Failed to edit address.");
  }
};

export const deleteAddress = async (id: string) => {
  try {
    const supabase = supabaseConfig();
    const { data, error } = await supabase
      .from("shop_addresses")
      .delete()
      .eq("id", id)
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }
    return data;
  } catch (err) {
    throw err instanceof Error ? err : new Error("Failed to delete address.");
  }
};

export const setDefaultAddress = async (id: string, userId: string) => {
  try {
    const supabase = supabaseConfig();
    
    // First, set all other addresses for this user to not default
    const { error: resetError } = await supabase
      .from("shop_addresses")
      .update({ is_default: false })
      .eq("user_id", userId)
      .neq("id", id);
      
    if (resetError) {
      throw new Error(resetError.message);
    }

    // Then, set the target address to default
    const { data, error } = await supabase
      .from("shop_addresses")
      .update({ is_default: true })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }
    
    return data;
  } catch (err) {
    throw err instanceof Error ? err : new Error("Failed to set default address.");
  }
};

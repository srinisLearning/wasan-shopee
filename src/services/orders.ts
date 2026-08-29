import { IOrder } from "@/interfaces";
import { supabaseConfig } from "@/config/supabase-client-config";

export const createOrder = async (payload: Partial<IOrder>) => {
  try {
    const supabase = supabaseConfig();
    const { data, error } = await supabase
      .from("shop_orders")
      .insert(payload)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return { success: true, data };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
};

export const getOrdersOfUser = async (userId: string) => {
  try {
    const supabase = supabaseConfig();
    const { data, error } = await supabase
      .from("shop_orders")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);
    return { success: true, data };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
};

export const getOrderById = async (id: string) => {
  try {
    const supabase = supabaseConfig();
    const { data, error } = await supabase
      .from("shop_orders")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw new Error(error.message);
    return { success: true, data };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
};

export const getAllOrders = async () => {
  try {
    const supabase = supabaseConfig();
    const { data, error } = await supabase
      .from("shop_orders")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);
    return { success: true, data };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
};

export const updateOrderById = async (id: string, payload: Partial<IOrder>) => {
  try {
    const supabase = supabaseConfig();
    const { data, error } = await supabase
      .from("shop_orders")
      .update(payload)
      .eq("id", id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return { success: true, data };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
};

export const deleteOrder = async (id: string) => {
  try {
    const supabase = supabaseConfig();
    const { error } = await supabase.from("shop_orders").delete().eq("id", id);

    if (error) throw new Error(error.message);
    return { success: true, message: "Order deleted successfully" };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
};

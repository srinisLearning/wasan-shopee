import { IProduct } from "@/interfaces/index";
import { supabaseConfig } from "@/config/supabase-client-config";

export const addProduct = async (payload: Partial<IProduct>) => {
  try {
    const supabase = supabaseConfig();
    const { data, error } = await supabase
      .from("shop_products")
      .insert({
        name: payload.name,
        description: payload.description,
        price: payload.price,
        images: payload.images,
        category_id: payload.category_id,
      })
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }
    return data;
  } catch (err) {
    throw err instanceof Error ? err : new Error("Failed to add product.");
  }
};

export const getProductById = async (id: string) => {
  try {
    const supabase = supabaseConfig();
    const { data, error } = await supabase
      .from("shop_products")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      throw new Error(error.message);
    }
    return data;
  } catch (err) {
    throw err instanceof Error ? err : new Error("Failed to get product.");
  }
};

export const editProductById = async (id: string, payload: Partial<IProduct>) => {
  try {
    const supabase = supabaseConfig();
    const { data, error } = await supabase
      .from("shop_products")
      .update({
        name: payload.name,
        description: payload.description,
        price: payload.price,
        images: payload.images,
        category_id: payload.category_id,
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }
    return data;
  } catch (err) {
    throw err instanceof Error ? err : new Error("Failed to edit product.");
  }
};

export const getAllProducts = async () => {
  try {
    const supabase = supabaseConfig();
    const { data, error } = await supabase
      .from("shop_products")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      throw new Error(error.message);
    }
    return data;
  } catch (err) {
    throw err instanceof Error ? err : new Error("Failed to get all products.");
  }
};
export const getAllProductsWithFilters = async (
  filters: {
    searchQuery?: string;
    categoryId?: string;
    sortOrder?: string;
  } = {},
) => {
  try {
    const supabase = supabaseConfig();
    let query = supabase.from("shop_products").select("*");

    if (filters.searchQuery) {
      query = query.or(
        `name.ilike.%${filters.searchQuery}%,description.ilike.%${filters.searchQuery}%`,
      );
    }

    if (filters.categoryId && filters.categoryId !== "all") {
      query = query.eq("category_id", filters.categoryId);
    }

    if (filters.sortOrder === "asc") {
      query = query.order("price", { ascending: true });
    } else if (filters.sortOrder === "desc") {
      query = query.order("price", { ascending: false });
    } else {
      query = query.order("created_at", { ascending: false });
    }

    const { data, error } = await query;

    if (error) {
      throw new Error(error.message);
    }
    return data;
  } catch (err) {
    throw err instanceof Error ? err : new Error("Failed to get all products.");
  }
};


export const deleteProduct = async (id: string) => {
  try {
    const supabase = supabaseConfig();
    const { data, error } = await supabase
      .from("shop_products")
      .delete()
      .eq("id", id)
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }
    return data;
  } catch (err) {
    throw err instanceof Error ? err : new Error("Failed to delete product.");
  }
};

export const getFeaturedProducts = async () => {
  try {
    const supabase = supabaseConfig();
    const { data: products, error } = await supabase
      .from("shop_products")
      .select("*");

    if (error) {
      throw new Error(error.message);
    }

    if (!products) return [];

    const categoryMap = new Map();
    products.forEach((product) => {
      if (!categoryMap.has(product.category_id)) {
        categoryMap.set(product.category_id, []);
      }
      categoryMap.get(product.category_id).push(product);
    });

    const featured: any[] = [];
    categoryMap.forEach((categoryProducts) => {
      const randomIndex = Math.floor(Math.random() * categoryProducts.length);
      featured.push(categoryProducts[randomIndex]);
    });

    return featured;
  } catch (err) {
    throw err instanceof Error ? err : new Error("Failed to get featured products.");
  }
};


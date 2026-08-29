import { ICartItem } from "@/store/cart-store";

export interface IUser {
  id: string;
  name: string;
  email: string;
  mobile: string;
  password: string;
  role: "user" | "admin";
  isActive: boolean;
  profile_pic?: string;
  created_at: string;
  updated_at: string;
}

export interface ICategory {
  id: string;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface IProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  category_id: number;
  created_at: string;
  updated_at: string;
}

export interface IAddress {
  id: string;
  user_id: string;
  name: string;
  address_line_1: string;
  address_line_2?: string;
  city: string;
  state: string;
  zip_code: string;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

export interface IOrder {
  id: string;
  created_at: string;
  user_id?: string;
  subtotal?: number;
  shipping_fee?: number;
  tax?: number;
  total?: number;
  status?: string;
  payment_id?: string;
  items?: ICartItem[];
  address_id?: string;
}

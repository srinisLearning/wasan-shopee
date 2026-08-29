import { IUser } from "@/interfaces/index";
import { supabaseConfig } from "@/config/supabase-client-config";

export const registerNewUser = async (paylod: Partial<IUser>) => {
  try {
    const supabase = supabaseConfig();
    const response = await supabase.auth.signUp({
      email: paylod.email!,
      password: paylod.password!,
    });

    if (response.error) {
      throw new Error(response.error.message);
    }

    const dBResponse = await supabase.from("shop_users").insert({
      name: paylod.name!,
      email: paylod.email!,
      mobile: paylod.mobile!,
      role: "user",
      isActive: true,
      profile_pic: "",
    });

    if (dBResponse.error) {
      throw new Error(dBResponse.error.message);
    }

    return dBResponse;
  } catch (err) {
    throw err instanceof Error ? err : new Error("Failed to register user.");
  }
};

export const loginUser = async (payload: {
  email: string;
  password: string;
  role: "user" | "admin";
}) => {
  try {
    const supabase = supabaseConfig();

    // 1. Authenticate with Supabase Auth
    const { error: authError } = await supabase.auth.signInWithPassword({
      email: payload.email,
      password: payload.password,
    });

    if (authError) {
      throw new Error(authError.message);
    }

    // 2. Fetch the user profile from "shop_users" matching email and role
    const { data: userData, error: dbError } = await supabase
      .from("shop_users")
      .select("*")
      .eq("email", payload.email)
      .eq("role", payload.role)
      .single();

    if (dbError || !userData) {
      // If role does not match or user profile is missing
      await supabase.auth.signOut();
      throw new Error(
        `Invalid credentials or no account found with role '${payload.role}'.`,
      );
    }

    if (userData.isActive === false) {
      await supabase.auth.signOut();
      throw new Error(
        "Your account has been deactivated. Please contact support.",
      );
    }

    return userData as IUser;
  } catch (err) {
    throw err instanceof Error ? err : new Error("Failed to sign in.");
  }
};


export const getCurrentUserDBRecord = async () => {
  try {
    const supabase = supabaseConfig();
    const response = await supabase.auth.getUser();

    if (response.error || !response.data.user) {
      throw new Error("No user is currently logged in.");
    }

    const dbResponse = await supabase
      .from("shop_users")
      .select("*")
      .eq("email", response.data.user.email)
      .single();

    if (dbResponse.error || !dbResponse.data) {
      throw new Error("User profile not found in database.");
    }

    if (dbResponse.data.isActive === false) {
      await supabase.auth.signOut();
      throw new Error(
        "Your account has been deactivated. Please contact support.",
      );
    }

    return dbResponse.data as IUser;
  } catch (err) {
    throw err instanceof Error ? err : new Error("Failed to get user record.");
  }
};

export const getLoggedInUser = getCurrentUserDBRecord;

export const logoutUser = async () => {
  try {
    const supabase = supabaseConfig();
    await supabase.auth.signOut();
  } catch (_) {}

  if (typeof window !== "undefined") {
    try {
      localStorage.clear();
      sessionStorage.clear();
    } catch (_) {}

    try {
      document.cookie.split(";").forEach((cookie) => {
        const eqPos = cookie.indexOf("=");
        const name = eqPos > -1 ? cookie.substring(0, eqPos).trim() : cookie.trim();
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;`;
      });
    } catch (_) {}
  }
};

/* export const getCurrentUserV2 = async () => {
  try {
    const supabase = supabaseConfig();
    const { data: authUser, error: authError } = await supabase.auth.getUser();

    if (authError || !authUser) {
      throw new Error("No user is currently logged in.");
    }

    const { data: dbUser, error: dbError } = await supabase
      .from("user_profiles")
      .select("*")
      .eq("email", authUser.user.email)
      .single();

    if (dbError || !dbUser) {
      throw new Error(dbError?.message || "User profile not found.");
    }

    return dbUser;
  } catch (error) {
    throw error;
  }
}; */
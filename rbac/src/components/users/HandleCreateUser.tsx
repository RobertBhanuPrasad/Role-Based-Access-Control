import { supabase } from '@/utility/SupabaseClient';
import { toast, Bounce } from "react-toastify";


type UserBody = {
  id?: number;
  email?: string;
  first_name?: string;
  last_name?: string;
  role?: string[];
  permissions: string[];
  status?: string;
  full_name?: string;
  user_code?: string;
  address?: string;
  phone_number?: string;
};

export const handleSubmitUserDetails = async (data: UserBody) => {
  try {
    const userBody: any = {};
    console.log(data, "databhanusubmit")
    // step - 1: Dynamically check and add fields to userBody if they exist in data
    if (data?.id) {
      userBody.id = data?.id;
    }

    if (data?.first_name) {
      userBody.first_name = data?.first_name?.trim();
    }

    if (data?.last_name) {
      userBody.last_name = data?.last_name?.trim();
    }

    if (data?.email) {
      userBody.email = data?.email?.trim();
    }

    if (data?.full_name) {
      userBody.full_name = data?.full_name?.trim();
    }

    if (data?.address) {
      userBody.address = data?.address?.trim();
    }

    if (data?.phone_number) {
      userBody.phone_number = data?.phone_number?.trim();
    }

    if (data?.role) {
      userBody.role = data?.role;
    }

    if (data?.permissions) {
      userBody.permissions = data?.permissions;
    }

    if (data?.user_code) {
      userBody.user_code = data?.user_code;
    }

    if (data?.status) {
      userBody.status = data?.status;
    }

    console.log("User payload:", userBody);

    // Step - 2: Upsert the user into the Supabase users table
    const { data: userData, error } = await supabase
      .from("users")
      .upsert(userBody)
      .select();

    if (error) {
      console.error("Error upserting user:", error);
      toast.error("Error saving user data.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
        transition: Bounce,
      });
      throw error;
    }

    console.log("User upserted successfullybhanu:", userData);
    toast.success("User saved successfully!", {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: "light",
      transition: Bounce,
    });

    return true;
  } catch (error) {
    console.error("Unexpected error:", error);
    throw error;
  }
};





/**
 * This function is used to determine whether the particular url contains edit-discount-code or not
 * @param url
 * @returns a boolean
 */
export const IsEditUser = (url: string) => {
  return url?.includes("/edit");
};

/**
 * This function is used to determine whether the particular url contains copy-disocunt-code or not
 * @param url
 * @returns a boolean
 */
export const IsCopyUser = (url: string) => {
  return url?.includes("/copy");
};

/**
 * This function is used to determine whether the particular url contains request discount code or not
 * @param url
 * @returns a boolean
 */
export const IsRequestUser = (url: string) => {
  return url?.includes("/request");
};

/**
 * This function is used to determine whether the particular url contains add or not
 * @param url
 * @returns a boolean
 */
export const IsNewUser = (url: string) => {
  return url?.includes("/add");
};

/**
 * This function is used to determine whether the particukar url contains list or not
 * @param url
 * @returns
 */
export const IsFindUser = (url: string) => {
  return url?.includes("/list");
};

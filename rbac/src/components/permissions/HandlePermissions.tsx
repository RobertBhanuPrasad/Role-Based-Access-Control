import { supabase } from '@/utility/SupabaseClient';
import { toast, Bounce } from "react-toastify";

type PermissionBody = {
  id?: number;
  name?: string;
  type?: string;
  category?: string;
  description?: string;
};

export const handleSubmitPermissionDetails = async (data: PermissionBody) => {
  try {
    const permissionBody: any = {};
    console.log(data, "data on submit permission");

    // Step - 1: Dynamically check and add fields to permissionBody if they exist in data
    if (data?.id) {
      permissionBody.id = data?.id;
    }

    if (data?.name) {
      permissionBody.name = data?.name?.trim();
    }

    if (data?.type) {
      permissionBody.type = data?.type?.trim();
    }

    if (data?.category) {
      permissionBody.category = data?.category?.trim();
    }

    if (data?.description) {
      permissionBody.description = data?.description?.trim();
    }

    console.log("Permission payload:", permissionBody);

    // Step - 2: Upsert the permission into the Supabase permissions table
    const { data: permissionData, error } = await supabase
      .from("permissions")
      .upsert(permissionBody)
      .select();

    if (error) {
      console.error("Error upserting permission:", error);
      toast.error("Error saving permission data.", {
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

    console.log("Permission upserted successfully:", permissionData);
    toast.success("Permission saved successfully!", {
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
 * This function is used to determine whether the particular url contains edit-permission or not
 * @param url
 * @returns a boolean
 */
export const IsEditPermission = (url: string) => {
  return url?.includes("/edit");
};

/**
 * This function is used to determine whether the particular url contains add-permission or not
 * @param url
 * @returns a boolean
 */
export const IsNewPermission = (url: string) => {
  return url?.includes("/add");
};

/**
 * This function is used to determine whether the particular url contains list-permission or not
 * @param url
 * @returns a boolean
 */
export const IsFindPermission = (url: string) => {
  return url?.includes("/list");
};

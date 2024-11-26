import { supabase } from '@/utility/SupabaseClient';
import { toast, Bounce } from "react-toastify";

type RoleBody = {
  id?: number;
  name?: string;
  description?: string;
};

export const handleSubmitRoleDetails = async (data: RoleBody) => {
  try {
    const roleBody: any = {};
    console.log(data, "data on submit role");

    // Step - 1: Dynamically check and add fields to roleBody if they exist in data
    if (data?.id) {
      roleBody.id = data?.id;
    }

    if (data?.name) {
      roleBody.name = data?.name?.trim();
    }

    if (data?.description) {
      roleBody.description = data?.description?.trim();
    }

    console.log("Role payload:", roleBody);

    // Step - 2: Upsert the role into the Supabase roles table
    const { data: roleData, error } = await supabase
      .from("roles")
      .upsert(roleBody)
      .select();

    if (error) {
      console.error("Error upserting role:", error);
      toast.error("Error saving role data.", {
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

    console.log("Role upserted successfully:", roleData);
    toast.success("Role saved successfully!", {
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
 * This function is used to determine whether the particular url contains edit-role or not
 * @param url
 * @returns a boolean
 */
export const IsEditRole = (url: string) => {
  return url?.includes("/edit");
};

/**
 * This function is used to determine whether the particular url contains add-role or not
 * @param url
 * @returns a boolean
 */
export const IsNewRole = (url: string) => {
  return url?.includes("/add");
};


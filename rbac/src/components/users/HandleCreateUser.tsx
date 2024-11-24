import { supabase } from "@/utility/SupabaseClient";
import { toast, Bounce } from "react-toastify";

type UserBody = {
    id?: number;
    email?: string;
    first_name?: string;
    last_name?: string;
    role?: string;
    status?: string;
  };

  
export const handleSubmitUserUtils = async (formData: UserBody) => {

  try {
    const userBody: UserBody = {};

    // Check each field in the formData and add it to the userBody if it exists
    if (formData?.id) {
      userBody.id = formData?.id;
    }

    if (formData?.email) {
      userBody.email = formData?.email.trim();
    }

    if (formData?.first_name) {
      userBody.first_name = formData?.first_name.trim();
    }

    if (formData?.last_name) {
      userBody.last_name = formData?.last_name.trim();
    }

    if (formData?.role) {
      userBody.role = formData?.role;
    }

    if (formData?.status) {
      userBody.status = formData?.status;
    }


    console.log("User payload:", userBody);

    // Upsert the user into the Supabase users table
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

    console.log("User upserted successfully:", userData);
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


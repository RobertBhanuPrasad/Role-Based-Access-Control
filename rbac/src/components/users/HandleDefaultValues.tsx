// import { supabase } from '@/utility/SupabaseClient';

// export const handleUserDetails = async (userId: number) => {
//     console.log(userId, "useidbhanudef")
//   // Fetch user details from the users table
//   const { data, error } = await supabase
//     .from("users")
//     .select()
//     .eq("id", userId)
//     .single(); 

//     console.log(data, "datahanu")

//   if (!error && data) {
//     const defaultValues = getUserDefaultValues(data);
//     return defaultValues;
//   }
  
//   throw new Error(`Error fetching user details: ${error?.message || "Unknown error"}`);
// };

// export const getUserDefaultValues = (data: any) => {
//   const defaultValues: Record<string, any> = {};

//   if (data?.id) defaultValues.id = data.id;

//   if (data?.first_name) {
//     defaultValues.first_name = data.first_name;
//   }

//   if (data?.last_name) {
//     defaultValues.last_name = data.last_name;
//   }

//   if (data?.email) {
//     defaultValues.email = data.email;
//   }

//   if (data?.password) {
//     defaultValues.password = data.password;
//   }

//   if (data?.status) {
//     defaultValues.status = data.status;
//   }

//   if (data?.full_name) {
//     defaultValues.full_name = data.full_name;
//   }

//   if (data?.role) {
//     defaultValues.role = data.role;
//   }

//   if (data?.user_code) {
//     defaultValues.user_code = data.user_code;
//   }

//   if (data?.address) {
//     defaultValues.address = data.address;
//   }

//   if (data?.phone_number) {
//     defaultValues.phone_number = data.phone_number;
//   }
// console.log(defaultValues, "defaultprasad")
//   return defaultValues;
// };


// import { supabase } from '@/utility/SupabaseClient';

// export const handleUserDetails = async (userId: number) => {
//   console.log(userId, "userIdLog");

//   // Fetch user details from the users table
//   const { data, error } = await supabase
//     .from("users")
//     .select()
//     .eq("id", userId)
//     .single(); 

//   console.log(data, "dataLog");

//   if (!error && data) {
//     const defaultValues = getUserDefaultValues(data);
//     return defaultValues;
//   }

//   throw new Error(`Error fetching user details: ${error?.message || "Unknown error"}`);
// };

// export const getUserDefaultValues = (data: any) => {
//   const defaultValues: Record<string, any> = {};

//   if (data?.id) defaultValues.id = data.id;

//   if (data?.first_name) {
//     defaultValues.first_name = data.first_name;
//   }

//   if (data?.last_name) {
//     defaultValues.last_name = data.last_name;
//   }

//   if (data?.email) {
//     defaultValues.email = data.email;
//   }

//   if (data?.password) {
//     defaultValues.password = data.password;
//   }

//   if (data?.status) {
//     defaultValues.status = data.status;
//   }

//   if (data?.full_name) {
//     defaultValues.full_name = data.full_name;
//   }

//   if (data?.user_code) {
//     defaultValues.user_code = data.user_code;
//   }

//   if (data?.address) {
//     defaultValues.address = data.address;
//   }

//   if (data?.phone_number) {
//     defaultValues.phone_number = data.phone_number;
//   }

//   // Parse roles and permissions as arrays of objects
//   if (data?.role) {
//     try {
//       defaultValues.role = JSON.parse(data.role); // Assuming the `role` column contains valid JSON
//     } catch (err) {
//       console.error("Error parsing role:", err);
//       defaultValues.role = []; // Default to an empty array in case of parsing error
//     }
//   }

//   if (data?.permissions) {
//     try {
//       defaultValues.permissions = JSON.parse(data.permissions); // Assuming the `permissions` column contains valid JSON
//     } catch (err) {
//       console.error("Error parsing permissions:", err);
//       defaultValues.permissions = []; // Default to an empty array in case of parsing error
//     }
//   }

//   console.log(defaultValues, "defaultValuesLog");
//   return defaultValues;
// };


import { supabase } from '@/utility/SupabaseClient';

export const handleUserDetails = async (userId: number) => {
  console.log(userId, "userIdLog");

  // Fetch user details from the users table
  const { data, error } = await supabase
    .from("users")
    .select()
    .eq("id", userId)
    .single(); 

  console.log(data, "dataLog");

  if (!error && data) {
    const defaultValues = getUserDefaultValues(data);
    return defaultValues;
  }

  throw new Error(`Error fetching user details: ${error?.message || "Unknown error"}`);
};

export const getUserDefaultValues = (data: any) => {
  const defaultValues: Record<string, any> = {};

  if (data?.id) defaultValues.id = data.id;

  if (data?.first_name) {
    defaultValues.first_name = data.first_name;
  }

  if (data?.last_name) {
    defaultValues.last_name = data.last_name;
  }

  if (data?.email) {
    defaultValues.email = data.email;
  }

  if (data?.password) {
    defaultValues.password = data.password;
  }

  if (data?.status) {
    defaultValues.status = data.status;
  }

  if (data?.full_name) {
    defaultValues.full_name = data.full_name;
  }

  if (data?.user_code) {
    defaultValues.user_code = data.user_code;
  }

  if (data?.address) {
    defaultValues.address = data.address;
  }

  if (data?.phone_number) {
    defaultValues.phone_number = data.phone_number;
  }

  // Extract labels from role if it is a valid object or JSON string
  if (data?.role) {
    try {
      let parsedRole = data.role;

      // Check if data.role is a string and needs parsing
      if (typeof parsedRole === "string") {
        parsedRole = JSON.parse(parsedRole);
      }

      // If it's an object/array, map to extract labels
      if (Array.isArray(parsedRole)) {
        defaultValues.role = parsedRole.map((item: { label: string }) => item.label);
      } else {
        console.error("Invalid role data format:", parsedRole);
        defaultValues.role = []; // Fallback to empty array
      }
    } catch (err) {
      console.error("Error parsing role:", err);
      defaultValues.role = []; // Fallback if parsing fails
    }
  }

  // Extract labels from permissions if it is a valid object or JSON string
  if (data?.permissions) {
    try {
      let parsedPermissions = data.permissions;

      // Check if data.permissions is a string and needs parsing
      if (typeof parsedPermissions === "string") {
        parsedPermissions = JSON.parse(parsedPermissions);
      }

      // If it's an object/array, map to extract labels
      if (Array.isArray(parsedPermissions)) {
        defaultValues.permissions = parsedPermissions.map((item: { label: string }) => item.label);
      } else {
        console.error("Invalid permissions data format:", parsedPermissions);
        defaultValues.permissions = []; // Fallback to empty array
      }
    } catch (err) {
      console.error("Error parsing permissions:", err);
      defaultValues.permissions = []; // Fallback if parsing fails
    }
  }

  console.log(defaultValues, "defaultValuesLog");
  return defaultValues;
};

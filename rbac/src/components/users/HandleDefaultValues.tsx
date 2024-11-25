import { supabase } from '@/utility/SupabaseClient';

export const handleUserDetails = async (userId: number) => {
    console.log(userId, "useidbhanudef")
  // Fetch user details from the users table
  const { data, error } = await supabase
    .from("users")
    .select()
    .eq("id", userId)
    .single(); 

    console.log(data, "datahanu")

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

  if (data?.role) {
    defaultValues.role = data.role;
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
console.log(defaultValues, "defaultprasad")
  return defaultValues;
};

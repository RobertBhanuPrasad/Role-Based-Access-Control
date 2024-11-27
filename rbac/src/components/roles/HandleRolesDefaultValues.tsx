import { supabase } from '@/utility/SupabaseClient';

export const handleRoleDetails = async (roleId: number) => {
    console.log(roleId, "roleid");

    // Fetch role details from the roles table
    const { data, error } = await supabase
        .from("roles")
        .select()
        .eq("id", roleId)
        .single();

    console.log(data, "data for role");

    if (!error && data) {
        const defaultValues = getRoleDefaultValues(data);
        return defaultValues;
    }

    throw new Error(`Error fetching role details: ${error?.message || "Unknown error"}`);
};

export const getRoleDefaultValues = (data: any) => {
    const defaultValues: Record<string, any> = {};

    if (data?.id) defaultValues.id = data.id;

    if (data?.name) {
        defaultValues.name = data.name;
    }

    if (data?.description) {
        defaultValues.description = data.description;
    }

    console.log(defaultValues, "default values for role");
    return defaultValues;
};

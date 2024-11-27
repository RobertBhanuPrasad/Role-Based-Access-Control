import { supabase } from '@/utility/SupabaseClient';

export const handlePermissionDetails = async (permissionId: number) => {
    console.log(permissionId, "permissionId");

    // Fetch permission details from the permissions table
    const { data, error } = await supabase
        .from("permissions")
        .select()
        .eq("id", permissionId)
        .single();

    console.log(data, "data for permission");

    if (!error && data) {
        const defaultValues = getPermissionDefaultValues(data);
        return defaultValues;
    }

    throw new Error(`Error fetching permission details: ${error?.message || "Unknown error"}`);
};

export const getPermissionDefaultValues = (data: any) => {
    const defaultValues: Record<string, any> = {};

    if (data?.id) defaultValues.id = data.id;

    if (data?.name) {
        defaultValues.name = data.name;
    }

    if (data?.type) {
        defaultValues.type = data.type;
    }

    if (data?.category) {
        defaultValues.category = data.category;
    }

    if (data?.description) {
        defaultValues.description = data.description;
    }

    console.log(defaultValues, "default values for permission");
    return defaultValues;
};

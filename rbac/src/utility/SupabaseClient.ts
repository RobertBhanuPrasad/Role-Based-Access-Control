import { createClient } from "@refinedev/supabase";
import { SupabaseClient } from "@supabase/supabase-js";
import { ConfigStore } from "src/zustandStore/ConfigStore";
import nookies from "nookies";
import { Database } from "./supabaseClientTypes";
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  throw new Error("Supabase URL or key is not defined");
}

/**
 * This function creates a Supabase client that can be used to interact with a Supabase database.
 * @param {any} [context=null] - The context from which to retrieve the authentication token using cookies.
 * @param {boolean} [withAuth=true] - A flag indicating whether to include authentication while creating the client.If TRUE token is used otherwise anon key is used for client creation
 * @returns {SupabaseClient<Database>} - Returns an initialized Supabase client.
 */
export const supabaseClient = (context: any = null, withAuth = true) => {
  /**
   * To get country code or language code we need useRouter hook becuase in that we have locale attribute
   * but we cant call hook inside this file becuase there was no component or hooks here
   * so we need to store in zustand we need to get the data with getState it will helpful for that
   */
  const { countryCode } = ConfigStore.getState();
  const token = withAuth
    ? (nookies.get(context).token ?? SUPABASE_KEY)
    : SUPABASE_KEY;

  const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_KEY, {
    auth: {
      persistSession: true,
    },
    global: {
      headers: {
        Authorization: `Bearer ${token}`,
        "tenant-code": countryCode,
      },
    },
  });

  return supabase;
};

// Generic SupabaseClient Type for allowing non-public schemas as well
type SupabaseClientType = SupabaseClient<Database>;
export { type SupabaseClientType as SupabaseClient };

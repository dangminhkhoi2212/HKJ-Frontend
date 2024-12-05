import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const client = createClient(supabaseUrl!, supabaseKey!);

export const getSupbaseInstance = () => {
	if (!supabaseUrl || !supabaseKey) {
		throw new Error("Supabase credentials are not properly configured");
	}

	return client;
};

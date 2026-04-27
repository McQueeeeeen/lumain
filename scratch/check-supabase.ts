import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";

dotenv.config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
  console.log("Checking connection to:", supabaseUrl);
  
  const { data, error } = await supabase.from("products").select("count");
  
  if (error) {
    console.error("Connection failed:", error.message);
  } else {
    console.log("Connection successful! Products count:", data);
  }

  // Try to list tables via RPC or direct query if possible
  const { data: tables, error: tableError } = await supabase.rpc("get_tables"); // Custom RPC if it exists
  if (tableError) {
     console.log("Could not list tables via RPC, trying direct select from information_schema...");
     const { data: schemaData, error: schemaError } = await supabase.from("information_schema.tables").select("table_name").eq("table_schema", "public");
     if (schemaError) {
       console.error("Could not read information_schema:", schemaError.message);
     } else {
       console.log("Tables in public schema:", schemaData);
     }
  }
}

check();

import "https://deno.land/x/dotenv@v3.2.0/load.ts";

export const TOKEN = Deno.env.get("TOKEN") || "";

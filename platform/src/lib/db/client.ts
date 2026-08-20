import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import * as schema from "./schema";

/**
 * A local SQLite file, by design. FDE OS runs on localhost: engagement data is
 * client material, and keeping it in a file on the operator's machine is the
 * point, not a limitation to grow out of.
 *
 * The libSQL driver is kept because it speaks SQLite over a `file:` URL with
 * no server to run — not because a remote database is planned.
 */
const client = createClient({
  url: process.env.DATABASE_URL ?? "file:./local.db",
});

export const db = drizzle(client, { schema });

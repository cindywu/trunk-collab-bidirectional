import pgInit from 'pg-promise'
const pgp = pgInit()
export const db = pgp(process.env.NEXT_PUBLIC_SUPABASE_DB_CONNECTION_STRING)
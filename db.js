import pgInit from 'pg-promise'
import { NEXT_PUBLIC_SUPABASE_DB_CONNECTION_STRING } from './lib/constants'

const pgp = pgInit()
export const db = pgp(NEXT_PUBLIC_SUPABASE_DB_CONNECTION_STRING)
import { db } from '../../db'
import type { NextApiResponse } from 'next'

export default async (_ : any, res: NextApiResponse) => {
  await db.task(async t => {
    await t.none('DROP TABLE IF EXISTS reference')
    await t.none('DROP TABLE IF EXISTS reference_replicache_client')
    await t.none('DROP SEQUENCE IF EXISTS version')
    // Stores chat messages
    await t.none(`CREATE TABLE reference (
      id VARCHAR(255) PRIMARY KEY NOT NULL,
      links TEXT ARRAY NOT NULL,
      publication_date TEXT NOT NULL,
      authors TEXT ARRAY NOT NULL,
      source_url TEXT NOT NULL,
      name VARCHAR(255) NOT NULL,
      parent VARCHAR(255) NOT NULL,
      date VARCHAR(255) NOT NULL,
      description TEXT NOT NULL,
      labels TEXT ARRAY NOT NULL,
      comments TEXT ARRAY NOT NULL,
      deleted BOOLEAN NOT NULL DEFAULT FALSE,
      version BIGINT NOT NULL)`)
    // Stores last mutation ID for each Replicache client
    await t.none(`CREATE TABLE reference_replicache_client (
      id VARCHAR(36) PRIMARY KEY NOT NULL,
      last_mutation_id BIGINT NOT NULL)`)
    // Will be used for computing diffs for pull response
    await t.none('CREATE SEQUENCE version')
  })
  res.send('ok')
}
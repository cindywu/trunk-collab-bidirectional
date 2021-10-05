import type { NextApiRequest, NextApiResponse } from 'next'
import { db } from '../../db'
import Pusher from 'pusher'
import {
  NEXT_PUBLIC_REPLICHAT_PUSHER_APP_ID,
  NEXT_PUBLIC_REPLICHAT_PUSHER_KEY,
  NEXT_PUBLIC_REPLICHAT_PUSHER_SECRET,
  NEXT_PUBLIC_REPLICHAT_PUSHER_CLUSTER,
} from '../../lib/constants'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const push = req.body
  console.log('Processing push', JSON.stringify(push))

  const t0 = Date.now()
  try {
    await db.tx(async t => {
      const {nextval: version} = await t.one("SELECT nextval('version')")
      let lastMutationID = await getLastMutationID(t, push.clientID)

      console.log('version', version, 'lastMutationID:', lastMutationID)

      for (const mutation of push.mutations) {
        const t1 = Date.now()

        const expectedMutationID = lastMutationID + 1

        if (mutation.id < expectedMutationID) {
          console.log(
            `Mutation ${mutation.id} has already been processed - skipping`,
          )
          continue
        }
        if (mutation.id > expectedMutationID) {
          console.warn(`Mutation ${mutation.id} is from the future - aborting`)
          break
        }

        console.log('Processing mutation:', JSON.stringify(mutation))

        switch (mutation.name) {
          case 'createReference':
            await createReference(t, mutation.args, version)
            break
          case 'deleteReference':
            await deleteReference(t, mutation.args)
            break
          case 'updateReference':
            await updateReference(t, mutation.args, version)
            break
          default:
            throw new Error(`Unknown mutation: ${mutation.name}`)
        }

        lastMutationID = expectedMutationID
        console.log('Processed mutation in', Date.now() - t1)
      }

      await sendPoke()

      console.log(
        'setting',
        push.clientID,
        'last_mutation_id to',
        lastMutationID,
      )
      await t.none(
        'UPDATE reference_replicache_client SET last_mutation_id = $2 WHERE id = $1',
        [push.clientID, lastMutationID],
      )
      res.send('{}')
    })
  } catch (e) {
    console.error(e)
    res.status(500).send(e.toString())
  } finally {
    console.log('Processed push in', Date.now() - t0)
  }
}

async function getLastMutationID(t, clientID) {
  const clientRow = await t.oneOrNone(
    'SELECT last_mutation_id FROM reference_replicache_client WHERE id = $1',
    clientID,
  )
  if (clientRow) {
    return parseInt(clientRow.last_mutation_id)
  }

  console.log('Creating new client', clientID)
  await t.none(
    'INSERT INTO reference_replicache_client (id, last_mutation_id) VALUES ($1, 0)',
    clientID,
  )
  return 0
}

async function createReference(t, {id, publication_date, authors, source_url, name, parent, date, description, labels, comments}, version) {
  await t.none(
    `INSERT INTO reference (
      id, publication_date, authors, source_url, name, parent, date, description, labels, comments, version) values
    ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
    [id, publication_date, authors, source_url, name, parent, date, description, labels, comments, version],
  )
}

async function deleteReference(t, {id}) {
  await t.none(
    `UPDATE reference
    SET
    deleted = true
    WHERE id = ($1)`,
    [id],
  )
}

async function updateReference(t, {id, publication_date, authors, source_url, name, parent, date, description, labels, comments}, version) {
  await t.none(
    `UPDATE reference
    SET
    publication_date = ($2),
    authors = ($3),
    source_url = ($4),
    name = ($5),
    parent = ($6),
    date = ($7),
    description = ($8),
    labels = ($9),
    comments = ($10),
    version = ($11)
    WHERE id = ($1)`,
    [id, publication_date, authors, source_url, name, parent, date, description, labels, comments, version],
  )
}

async function sendPoke() {
  const pusher = new Pusher({
    appId: NEXT_PUBLIC_REPLICHAT_PUSHER_APP_ID,
    key: NEXT_PUBLIC_REPLICHAT_PUSHER_KEY,
    secret: NEXT_PUBLIC_REPLICHAT_PUSHER_SECRET,
    cluster: NEXT_PUBLIC_REPLICHAT_PUSHER_CLUSTER,
    useTLS: true,
  })
  const t0 = Date.now()
  await pusher.trigger('default', 'poke', {})
  console.log('Sent poke in', Date.now() - t0)
}
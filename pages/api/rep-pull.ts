import type { NextApiRequest, NextApiResponse } from 'next'
import { db } from '../../db'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const pull = req.body
  console.log(`Processing pull`, JSON.stringify(pull))
  const t0 = Date.now()

  try {
    await db.tx(async t => {
      const lastMutationID = parseInt(
        (
          await db.oneOrNone(
            'select last_mutation_id from reference_replicache_client where id = $1',
            pull.clientID,
          )
        )?.last_mutation_id ?? '0',
      )
      const changed = await db.manyOrNone(
        'select id, source_url, name, parent, date, description, labels, comments, deleted from reference',
        parseInt(pull.cookie ?? 0),
      )
      const cookie = (
        await db.one('select max(version) as version from reference')
      ).version
      console.log({cookie, lastMutationID, changed})

      const patch = []

      if (pull.cookie === null) {
        patch.push({
          op: 'clear',
        })
      }

      patch.push(
        ...changed.map(row => {
          if (row.deleted == true) {
            console.log("<<<<<<< im gonna delete u", row)
            return (
              {
                op: 'del',
                key: `ref/${row.id}`
              }
            )
          } else {
            return (
              {
                op: 'put',
                key: `ref/${row.id}`,
                value: {
                  source_url: row.source_url,
                  name: row.name,
                  parent: row.parent,
                  date: row.date,
                  description: row.description,
                  labels: row.labels,
                  comments: row.comments,
                },
              }
            )
          }
        })
      )

      console.log('patch', patch)

      res.json({
        lastMutationID,
        cookie,
        patch,
      })
      res.end()
    })
  } catch (e) {
    console.error(e)
    res.status(500).send(e.toString())
  } finally {
    console.log('Processed pull in', Date.now() - t0)
  }
}
import React, { useState, useEffect } from 'react'
import Head from 'next/head'
import Layout from '../../components/layout'
import ReferenceAdd from '../../components/reference-add'
import NavWest from '../../components/nav-west'
import NavNorth from '../../components/nav-north'
import NavSouth from '../../components/nav-south'
import NavEast from '../../components/nav-east'
import styles from '../../styles/workspace.module.css'
import { useReferences } from '../../components/reference-provider'

import { Replicache } from 'replicache'
import Pusher from 'pusher-js'

export default function Workspace() {
  const [rep, setRep] = useState<any>(null)
  const { handleSetRep } = useReferences()

  useEffect(() => {
    (async() => {
      const rep = new Replicache({
        pushURL: '/api/rep-push',
        pullURL: 'api/rep-pull',
        wasmModule: '/replicache.dev.wasm',
        mutators: {
          async createReference(tx, {id, name, parent, date, description, labels, comments}) {
            await tx.put(`ref/${id}`, {
              name,
              parent,
              date,
              description,
              labels,
              comments
            })
          },
          async deleteReference(tx, {id}) {
            await tx.del(`ref/${id}`)
          },
          async updateReference(tx, {id, name, parent, date, description, labels, comments}) {
            await tx.put(`ref/${id}`, {
              name,
              parent,
              date,
              description,
              labels,
              comments
            })
          }
        },
      })
      listen(rep)
      setRep(rep)
      handleSetRep(rep)

      console.log("rep", rep)
    })()
  }, [])

  function listen(rep: any){
    console.log('listening');
    // Listen for pokes, and pull whenever we get one.
    Pusher.logToConsole = true;
    const pusher = new Pusher(process.env.NEXT_PUBLIC_REPLICHAT_PUSHER_KEY!, {
      cluster: process.env.NEXT_PUBLIC_REPLICHAT_PUSHER_CLUSTER,
    });
    const channel = pusher.subscribe('default');
    channel.bind('poke', () => {
      console.log('got poked');
      rep.pull();
    });
  }

  return (
    <Layout>
      <Head>
        <title>Workspace</title>
      </Head>
      <ReferenceAdd />
      <div className={styles.container}>
        <NavWest />
        <div className={styles.center}>
          <NavNorth />
          {rep &&
            <NavSouth
              rep={rep}
            />
          }
        </div>
        {rep &&
          <NavEast
            rep={rep}
          />
      }
      </div>
    </Layout>
  )
}

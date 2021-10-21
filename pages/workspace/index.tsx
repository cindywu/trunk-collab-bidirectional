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
import { AuthSession } from '@supabase/supabase-js'
import { Replicache } from 'replicache'
import Pusher from 'pusher-js'
import { LOCAL_STORAGE_AUTH_TOKEN_KEY } from '../../lib/constants'

import {
  NEXT_PUBLIC_REPLICHAT_PUSHER_KEY,
  NEXT_PUBLIC_REPLICHAT_PUSHER_CLUSTER
} from '../../lib/constants'

export default function Workspace() {
  const [rep, setRep] = useState<Replicache>(null)
  const { handleSetRep } = useReferences()
  const [session, setSession] = useState<AuthSession | null>()

  useEffect(() => {
    const session = localStorage.getItem(LOCAL_STORAGE_AUTH_TOKEN_KEY)
    setSession(session ? JSON.parse(session).currentSession : null)
  },[])


  const mutators = {
    async createReference(tx: any, {id, links, publication_date, authors, source_url, name, parent, date, description, labels, comments}) {
      await tx.put(`ref/${id}`, {
        name,
        links,
        publication_date,
        authors,
        source_url,
        parent,
        date,
        description,
        labels,
        comments
      })
    },
    async deleteReference(tx: any, {id}) {
      await tx.del(`ref/${id}`)
    },
    async updateReference(tx: any, {id, links, publication_date, authors, source_url, name, parent, date, description, labels, comments}) {
      await tx.put(`ref/${id}`, {
        name,
        links,
        publication_date,
        authors,
        source_url,
        parent,
        date,
        description,
        labels,
        comments
      })
    }
  }

  useEffect(() => {
    (async() => {
      const rep = new Replicache({
        pushURL: '/api/rep-push',
        pullURL: 'api/rep-pull',
        wasmModule: '/replicache.dev.wasm',
        mutators: mutators,
      })
      listen(rep)
      setRep(rep)
      handleSetRep(rep)
    })()
  }, [])

  function listen(rep: Replicache){
    console.log('listening')
    // Listen for pokes, and pull whenever we get one.
    Pusher.logToConsole = true
    const pusher = new Pusher(NEXT_PUBLIC_REPLICHAT_PUSHER_KEY!, {
      cluster: NEXT_PUBLIC_REPLICHAT_PUSHER_CLUSTER,
    })
    const channel = pusher.subscribe('default')
    channel.bind('poke', () => {
      console.log('got poked')
      rep.pull()
    })
  }

  return (
    <Layout>
      <Head>
        <title>Workspace</title>
      </Head>
      <ReferenceAdd/>
      <div className={styles.container}>
        {rep &&
          <NavWest
            rep={rep}
          />
        }
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

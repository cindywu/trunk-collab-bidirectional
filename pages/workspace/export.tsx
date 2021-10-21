import React, { useState, useEffect } from 'react'
import Head from 'next/head'
import Layout from '../../components/layout'
import ReferenceAdd from '../../components/reference-add'
import styles from '../../styles/workspace.module.css'
import { useReferences } from '../../components/reference-provider'
import { useSubscribe } from 'replicache-react'

import { Replicache } from 'replicache'
import Pusher from 'pusher-js'


import {
  NEXT_PUBLIC_REPLICHAT_PUSHER_KEY,
  NEXT_PUBLIC_REPLICHAT_PUSHER_CLUSTER
} from '../../lib/constants'

export default function Export() {
  const [rep, setRep] = useState<Replicache>(null)
  const [references, setReferences] = useState<any[]>([])
  const { handleSetRep } = useReferences()

  useEffect(() => {
    (async() => {
      const rep = new Replicache({
        pushURL: '/api/rep-push',
        pullURL: '/api/rep-pull',
        wasmModule: '/replicache.dev.wasm',
        mutators: {},
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

  return rep && <Data rep={rep}/>

  function Data({rep}){
    const references = useSubscribe(
      rep,
      async tx => {
        const list = await tx.scan({ prefix: 'ref/'}).entries().toArray()
        return list
      },
      [],
    )
    const json = JSON.stringify(references)

    const blob1 = new Blob([json], {type: "application/json"})

    return (
      <div>
        <div className={styles.downloadDataButton}>
          <div className={styles.referenceNumber}>{references.length} references</div>
          <button className="btn btn--secondary">
            <a href={URL.createObjectURL(blob1)}>Download data</a>
          </button>
        </div>
      </div>
    )
  }
}

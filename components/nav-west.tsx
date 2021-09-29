import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import styles from './nav-west.module.css'
import { supabase } from '../lib/supabaseClient'
import { Offline, Online } from 'react-detect-offline'

export default function NavWest() {
  const [email, setEmail] = useState<string>()

  async function signOut() {
    const { error } = await supabase.auth.signOut()
    error ? console.log('Error logging out:', error.message) : alert('You have been signed out')
  }

  useEffect(() => {
    const session = localStorage.getItem('supabase.auth.token')
    session ? setEmail(JSON.parse(session).currentSession.user.email) : setEmail('guest')
  }, [])

  return (
    <div className={styles.container}>
      <div className={styles.userInfoContainer}>
        <div>
          {email}
        </div>
        <div>
          <Offline>You are offline</Offline>
          <Online>You are online</Online>
        </div>
      </div>
      <div className={styles.signOutContainer}>
        <Link href="/">
          <button
            onClick={() => signOut()}
            className={`${styles.signOutBtn} btn btn-primary`}
          >
            <a>Leave</a>
          </button>
        </Link>
      </div>
    </div>
  )
}

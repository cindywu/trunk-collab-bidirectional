import React from 'react'
import Link from 'next/link'
import styles from './nav-west.module.css'
import { supabase } from '../lib/supabaseClient'

export default function NavWest() {
  async function signOut() {
    const { error } = await supabase.auth.signOut()
    error ? console.log('Error logging out:', error.message) : alert('You have been signed out')
  }

  return (
    <div className={styles.container}>
      <Link href="/">
        <button
          onClick={() => signOut()}
          className={`${styles.signOutBtn} btn btn-primary`}
        >
          <a>Leave</a>
        </button>
      </Link>
    </div>
  )
}

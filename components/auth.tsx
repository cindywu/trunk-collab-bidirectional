import React, { useState } from 'react'
import styles from './auth.module.css'
import { supabase } from '../lib/supabaseClient'

export default function Auth() {
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')

  const handleLogin = async (email: string) => {
    try {
      setLoading(true)
      const { error, user } = await supabase.auth.signIn({
        email
      }, {
        redirectTo: process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : null
      })
      if (error) throw error
      console.log('user', user)
      alert('Check your email for the login link!')
    } catch (error) {
      console.log('Error thrown:', error.message)
      alert(error.error_description || error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <input
        className={styles.input}
        type='email'
        placeholder='cindy@jellypbc.com'
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button
        className={`${styles.magicLinkBtn} btn btn-primary`}
        onClick={(e) => {
          e.preventDefault()
          handleLogin(email)
        }}
      >
          SEND MAGIC LINK
      </button>
    </>
  )
}

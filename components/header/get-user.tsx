"use client"

import { redirect } from "next/navigation"

import { useEffect } from "react"

import { useStore } from "@marimo/stores/use-store"

export const GetUser = () => {
  const { setUser, clearUser } = useStore()

  const fetchedUser = async () => {
    const response = await fetch("/api/user")

    if (response.status !== 200) {
      clearUser()
      redirect("/login")
    }

    const { user } = await response.json()
    setUser(user)
  }

  useEffect(() => {
    fetchedUser()
  }, [])

  return <></>
}

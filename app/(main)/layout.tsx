import { Header } from "@marimo/components/header"
import { GetUser } from "@marimo/components/get-user"

import "@marimo/app/globals.css"

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <>
      <GetUser />
      <Header />
      <main>{children}</main>
    </>
  )
}

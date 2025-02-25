import { PayForm } from "@marimo/app/pay/_components/pay-form"
import { VerticalLogo } from "@marimo/components/vertical-logo"

import styles from "@marimo/app/pay/page.module.css"

const Login = () => {
  const { container } = styles

  return (
    <div className={container}>
      <VerticalLogo />
      <PayForm />
    </div>
  )
}

export default Login

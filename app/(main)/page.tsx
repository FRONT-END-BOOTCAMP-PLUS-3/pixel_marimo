import TrashComponent from "@marimo/components/trash/trash-component"
import FeedbackButton from "@marimo/components/feedback-btn/feedback-btn"

import styles from "@marimo/app/(main)/page.module.css"
const Home = () => {
  return (
    <div className={styles.page}>
      <TrashComponent />
      <FeedbackButton />
    </div>
  )
}

export default Home

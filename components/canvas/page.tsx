import styles from "./page.module.css"

interface CanvasProps {
  marimoComponent: React.ReactNode
}

const Canvas: React.FC<CanvasProps> = ({ marimoComponent }) => {
  return (
    <div>
      <canvas className={styles.canvas}>{marimoComponent}</canvas>
    </div>
  )
}

export default Canvas

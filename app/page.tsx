import Canvas from "@marimo/components/canvas/page"
import TrashComponent from "@marimo/components/trash/trash-component"

const Home = () => {
  return (
    <div>
      <h1>Marimo Img in Canvas</h1>
      <Canvas marimoImgSrc="/marimo.svg" />
      <TrashComponent />
    </div>
  )
}

export default Home

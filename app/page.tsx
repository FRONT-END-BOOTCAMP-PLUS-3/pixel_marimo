import Canvas from "@marimo/components/canvas/page"
import Marimo from "@marimo/components/marimo/page"
import TrashComponent from "@marimo/components/trash/trash-component"

const Home = () => {
  return (
    <div>
      <h1>Marimo Img in Canvas</h1>
      <Canvas marimoImgSrc="/marimo.svg" />
      <h1>Marimo Img</h1>
      <Marimo />
      <TrashComponent />
    </div>
  )
}

export default Home

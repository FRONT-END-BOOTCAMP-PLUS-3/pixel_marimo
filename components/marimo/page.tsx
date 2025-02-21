import Image from "next/image"

import marimo from "../../public/marimo.svg"

const Marimo = () => {
  return (
    <div>
      <Image src={marimo} alt="Marimo" />
    </div>
  )
}
export default Marimo

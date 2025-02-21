"use client"

import Image from "next/image"

import styles from "@marimo/components/vertical-logo/index.module.css"

export const VerticalLogo = () => {
  const { wrapper, title__div, image__div } = styles
  return (
    <div className={wrapper}>
      <div className={title__div}>
        <p className="text-5xl-b">Angry Marimo</p>
      </div>
      <div className={image__div}>
        {/* FIXME : 이미지 변경해야 합니다. */}
        <Image src="./marimo/secondary_marimo.svg" fill alt="marimo" />
      </div>
    </div>
  )
}

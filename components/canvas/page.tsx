"use client"

import React, { useState, useEffect, useRef } from "react"

import styles from "./page.module.css"

interface CanvasProps {
  marimoImgSrc: string
}

const Canvas: React.FC<CanvasProps> = ({ marimoImgSrc }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [canvasWidth, setCanvasWidth] = useState(window.innerWidth)
  const [canvasHeight, setCanvasHeight] = useState(window.innerHeight)

  useEffect(() => {
    // 윈도우 크기가 변경될 때마다 canvas 크기 업데이트
    const handleCanvasResize = () => {
      setCanvasWidth(window.innerWidth)
      setCanvasHeight(window.innerHeight)
    }

    window.addEventListener("resize", handleCanvasResize)

    return () => {
      window.removeEventListener("resize", handleCanvasResize)
    }
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (canvas) {
      const ctx = canvas.getContext("2d")
      if (ctx) {
        drawFlag(ctx, canvasWidth, canvasHeight) // 캔버스 크기에 맞게 그리기

        // 마리모 이미지를 캔버스에 그리기
        const marimoImage = new Image()
        marimoImage.src = marimoImgSrc
        marimoImage.onload = () => {
          ctx.drawImage(
            marimoImage,
            canvasWidth / 2 - 50,
            canvasHeight / 2 - 50,
            100,
            100,
          ) // 중앙에 마리모 그리기
        }
      }
    }
  }, [canvasWidth, canvasHeight, marimoImgSrc]) // 크기 변경 시마다 다시 그림

  const drawFlag = (
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
  ) => {
    ctx.clearRect(0, 0, width, height) // 캔버스를 초기화

    // 프랑스 국기처럼 3등분해서 색 칠하기
    const sectionWidth = width / 3

    // 왼쪽: 파란색
    ctx.fillStyle = "#0055A4"
    ctx.fillRect(0, 0, sectionWidth, height)

    // 가운데: 흰색
    ctx.fillStyle = "#FFFFFF"
    ctx.fillRect(sectionWidth, 0, sectionWidth, height)

    // 오른쪽: 빨간색
    ctx.fillStyle = "#EF4135"
    ctx.fillRect(sectionWidth * 2, 0, sectionWidth, height)
  }

  return (
    <div>
      <canvas
        ref={canvasRef}
        className={styles.canvas}
        width={canvasWidth}
        height={canvasHeight}
      />
    </div>
  )
}

export default Canvas

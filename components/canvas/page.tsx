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
  const [imageLoaded, setImageLoaded] = useState(false) // 이미지 로딩 완료 여부 추적하기 위해
  const [marimoPosition, setMarimoPosition] = useState({
    x: canvasWidth / 2 - 50,
    y: canvasHeight / 2 - 50,
  })
  const [isDragging, setIsDragging] = useState(false)
  const [startPosition, setStartPosition] = useState({ x: 0, y: 0 }) // 드래그 시작 위치 저장
  const imageRef = useRef(new Image()) // 이미지 객체를 참조

  useEffect(() => {
    window.addEventListener("resize", handleCanvasResize)
    return () => {
      window.removeEventListener("resize", handleCanvasResize)
    }
  }, [])

  useEffect(() => {
    const marimoImage = imageRef.current
    marimoImage.src = marimoImgSrc
    marimoImage.onload = () => {
      setImageLoaded(true) // 이미지 로딩이 완료되면 상태를 업데이트
      const canvas = canvasRef.current
      if (canvas) {
        const ctx = canvas.getContext("2d") // 캔버스의 2D 렌더링 컨텍스트를 얻습니다.
        if (ctx) {
          ctx.drawImage(
            marimoImage,
            marimoPosition.x,
            marimoPosition.y,
            100,
            100,
          )
        }
      }
    }
  }, [marimoImgSrc, marimoPosition.x, marimoPosition.y])

  useEffect(() => {
    if (canvasRef.current && imageLoaded) {
      const ctx = canvasRef.current.getContext("2d")
      if (ctx) {
        ctx.clearRect(0, 0, canvasWidth, canvasHeight)
        drawFlag(ctx, canvasWidth, canvasHeight)
        ctx.drawImage(
          imageRef.current,
          marimoPosition.x,
          marimoPosition.y,
          100,
          100,
        ) // 로드된 이미지를 현재 위치에 그립니다.
      }
    }
  }, [marimoPosition, canvasWidth, canvasHeight, imageLoaded])

  const handleCanvasResize = () => {
    setCanvasWidth(window.innerWidth)
    setCanvasHeight(window.innerHeight)
  }

  const handleMouseDown = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current?.getBoundingClientRect()
    if (!rect) return
    const x = event.clientX - rect.left // 클릭한 x 좌표를 캔버스 상대 좌표로 변환
    const y = event.clientY - rect.top //클릭한 y 좌표를 캔버스 상대 좌표로 변환
    if (
      x > marimoPosition.x &&
      x < marimoPosition.x + 100 &&
      y > marimoPosition.y &&
      y < marimoPosition.y + 100
    ) {
      setIsDragging(true)
      setStartPosition({ x: x - marimoPosition.x, y: y - marimoPosition.y }) // 드래그 시작 위치를 저장
    }
  }

  const handleMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas || !isDragging) return
    //canvasRef.current를 변수 canvas에 저장하고 시작 부분에서 존재하지 않거나 드래그 상태가 아닐 경우 조기 반환(return)

    const rect = canvas.getBoundingClientRect()
    const x = event.clientX - rect.left - startPosition.x
    const y = event.clientY - rect.top - startPosition.y

    // 마우스 위치가 이미지 범위 내인지 확인하고, 커서 스타일 설정
    const isOverImage =
      x > marimoPosition.x &&
      x < marimoPosition.x + 100 &&
      y > marimoPosition.y &&
      y < marimoPosition.y + 100
    canvas.style.cursor = isOverImage ? "pointer" : "default"

    // 이미지 드래그 위치 업데이트
    setMarimoPosition({ x, y })
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const drawFlag = (
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
  ) => {
    ctx.clearRect(0, 0, width, height)
    const sectionWidth = width / 3
    ctx.fillStyle = "#0055A4"
    ctx.fillRect(0, 0, sectionWidth, height)
    ctx.fillStyle = "#FFFFFF"
    ctx.fillRect(sectionWidth, 0, sectionWidth, height)
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
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp} // 마우스가 캔버스를 벗어날 때 드래그 종료
      />
    </div>
  )
}

export default Canvas

"use client"

import dynamic from "next/dynamic"

import React, { useState, useEffect, useRef } from "react"

import styles from "./index.module.css"

import { useStore } from "@marimo/stores/use-store"

interface MarimoData {
  user: {
    id: number
    userId: number
    size: number
    rect: string
    color: string
    status: string
  }
}

const Canvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const marimoImgSrc = "/images/marimo.svg"
  const [canvasWidth, setCanvasWidth] = useState(window.innerWidth)
  const [canvasHeight, setCanvasHeight] = useState(window.innerHeight)
  const [imageLoaded, setImageLoaded] = useState(false)
  // const [loadedTrashImages, setLoadedTrashImages] = useState([])

  const [marimoPosition, setMarimoPosition] = useState({
    x: -500, // fetch 전 안보이게 하려고 넣어놓은 숫자
    y: -500,
  })
  const [isDragging, setIsDragging] = useState(false)
  const [startPosition, setStartPosition] = useState({ x: 0, y: 0 })
  const imageRef = useRef(new Image())
  const { user, trashItems } = useStore()

  const [marimoData, setMarimoData] = useState<MarimoData | null>(null)

  // useEffect(() => {
  //   console.log("생성된 쓰레기 배열:", trashItems)
  // }, [trashItems])

  useEffect(() => {
    window.addEventListener("resize", handleCanvasResize)
    return () => {
      window.removeEventListener("resize", handleCanvasResize)
    }
  }, [])

  const handleCanvasResize = () => {
    setCanvasWidth(window.innerWidth)
    setCanvasHeight(window.innerHeight)
  }

  const loadMarimoImage = () => {
    const marimoImage = imageRef.current
    marimoImage.src = marimoImgSrc
    marimoImage.onload = () => {
      setImageLoaded(true)
    }
  }

  const drawMarimoOnCanvas = () => {
    if (imageLoaded && canvasRef.current) {
      const canvas = canvasRef.current
      const ctx = canvas.getContext("2d")
      if (ctx) {
        ctx.clearRect(0, 0, canvasWidth, canvasHeight)
        ctx.drawImage(
          imageRef.current,
          marimoPosition.x,
          marimoPosition.y,
          100,
          100,
        )
      }
    }
  }

  useEffect(() => {
    loadMarimoImage()
  }, [marimoImgSrc])

  useEffect(() => {
    drawMarimoOnCanvas()
  }, [marimoPosition, imageLoaded, canvasWidth, canvasHeight])

  // const loadTrashImages = () => {
  //   trashItems.forEach((item) => {
  //     const img = new Image()
  //     img.src = item.url
  //     img.onload = () =>
  //       setLoadedTrashImages((prev) => [...prev, { ...item, image: img }])
  //   })
  // }

  // // 캔버스에 쓰레기 이미지를 그리는 함수
  // const drawTrashOnCanvas = () => {
  //   const canvas = canvasRef.current
  //   const ctx = canvas?.getContext("2d")

  //   if (ctx) {
  //     loadedTrashImages.forEach((trash) => {
  //       const x = (trash.x / 100) * canvasWidth // 퍼센테이지 위치 계산
  //       const y = (trash.y / 100) * canvasHeight
  //       ctx.drawImage(trash.image, x, y, 50, 50) // 이미지 그리기
  //     })
  //   }
  // }

  // useEffect(() => {
  //   loadTrashImages()
  // }, [trashItems])

  // useEffect(() => {
  //   drawTrashOnCanvas() // 캔버스에 그리기
  // }, [loadedTrashImages, canvasWidth, canvasHeight])

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
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top

    if (
      x > marimoPosition.x &&
      x < marimoPosition.x + 100 &&
      y > marimoPosition.y &&
      y < marimoPosition.y + 100
    ) {
      canvas.style.cursor = "pointer"
    } else {
      canvas.style.cursor = "default"
    }

    // 드래그 상태일 때만 위치 업데이트
    if (isDragging) {
      const newX = x - startPosition.x
      const newY = y - startPosition.y
      setMarimoPosition({ x: newX, y: newY })
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const fetchMarimo = async () => {
    try {
      const response = await fetch(`/api/marimo/${user?.id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
      })
      console.log(response)
      if (!response.ok) {
        throw new Error("Failed to fetch data")
      }
      const data = await response.json()

      // 마리모 데이터를 상태에 저장
      setMarimoData({
        ...data,
      })
    } catch (error) {
      console.error("API Error:", error)
    }
  }

  const updateMarimo = async () => {
    const updatedRect = JSON.stringify({
      x: (marimoPosition.x * 100) / canvasWidth,
      y: (marimoPosition.y * 100) / canvasHeight,
    })

    // marimoData의 rect 정보를 업데이트
    const updatedMarimoData = {
      ...marimoData,
      user: {
        ...marimoData?.user,
        rect: updatedRect,
      },
    }
    const response = await fetch(`/api/marimo/update/${marimoData?.user.id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedMarimoData.user),
    })
    if (!response.ok) {
      console.error("Failed to update marimo.")
      return
    }

    const data = await response.json()
    console.log("Marimo updated:", data)
  }

  useEffect(() => {
    const handleBeforeUnload = async () => {
      // 이벤트의 기본 동작을 막지 않고 업데이트 함수를 바로 호출합니다.
      await updateMarimo()
    }

    window.addEventListener("beforeunload", handleBeforeUnload)

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload)
    }
  }, [updateMarimo])

  useEffect(() => {
    if (user) {
      console.log("User data loaded:", user)
      fetchMarimo()
    } else {
      console.log("User data is not loaded. User is null.")
    }
  }, [user])

  useEffect(() => {
    if (marimoData) {
      const rectObject = JSON.parse(marimoData.user.rect)
      const percentagedX = (canvasWidth * rectObject.x) / 100
      const percentagedY = (canvasHeight * rectObject.y) / 100
      setMarimoPosition({ x: percentagedX, y: percentagedY })
    }
  }, [marimoData])

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
        onMouseLeave={handleMouseUp}
      />
    </div>
  )
}

const DynamicCanvas = dynamic(() => Promise.resolve(Canvas), {
  ssr: false,
})

export default DynamicCanvas

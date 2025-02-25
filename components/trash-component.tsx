"use client"
import Image from "next/image"

import { useEffect, useRef } from "react"

import styles from "./trash.module.css"

import { useTrashStore } from "@marimo/stores/trash-store"

export default function TrashComponent() {
  const { trashItem, trashImage } = styles

  const worker = useRef<Worker | null>(null)
  const idCounter = useRef(0)

  const { trashItems, addTrashItems } = useTrashStore()

  useEffect(() => {
    worker.current = new Worker(
      new URL("/public/workers/fetch-worker", import.meta.url),
      { type: "module" },
    )

    worker.current.onmessage = (
      event: MessageEvent<{
        points: Array<{ x: number; y: number; isInside: boolean }>
        piValue: number
      }>,
    ) => {
      // 각 포인트마다 쓰레기 아이템 생성
      const newTrashItems = event.data.points.map((point) => {
        const level = Math.floor(Math.random() * 3) // 0-2 사이의 레벨 생성
        return {
          id: idCounter.current++,
          level,
          url: getTrashImage(level), // level에 따른 이미지 URL 추가
          x: point.x * 100, // 0-100% 위치값으로 변환
          y: point.y * 100,
        }
      })

      addTrashItems(newTrashItems)
    }

    return () => {
      worker.current?.terminate()
    }
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      if (worker.current) {
        worker.current.postMessage(1) // 한 번에 1개의 포인트 생성
      }
    }, 20000)

    return () => clearInterval(interval)
  }, [])

  const getTrashImage = (level: number) => {
    if (level === 0) return "/images/trash_level1.png"
    if (level === 1) return "/images/trash_level2.png"
    if (level === 2) return "/images/trash_level3.png"
    return "/images/trash_level3.png"
  }

  return (
    <div>
      <h2>쓰레기 컴포넌트 생성기</h2>
      <div>
        {trashItems.map((item) => (
          <div
            id="trash_item"
            key={item.id}
            className={trashItem}
            style={{
              left: `${item.x}%`,
              top: `${item.y}%`,
              transition: "all 0.3s ease-in-out",
            }}
          >
            <Image
              src={getTrashImage(item.level)}
              alt={`Trash Level ${item.level}`}
              className={trashImage}
              width={100}
              height={100}
            />
          </div>
        ))}
      </div>
    </div>
  )
}

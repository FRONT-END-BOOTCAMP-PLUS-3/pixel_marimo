"use client"
import Image from "next/image"

import { useEffect, useRef, useState } from "react"

import styles from "./trash.module.css"

type TrashItem = {
  id: number
  level: number
  x: number
  y: number
}

export default function TrashComponent() {
  const workerRef = useRef<Worker>()
  const [trash, setTrash] = useState<TrashItem[]>([])
  const idCounter = useRef(0)

  useEffect(() => {
    workerRef.current = new Worker(
      new URL("/public/workers/fetchWorker", import.meta.url),
      { type: "module" },
    )

    workerRef.current.onmessage = (
      event: MessageEvent<{
        points: Array<{ x: number; y: number; isInside: boolean }>
        piValue: number
      }>,
    ) => {
      // 각 포인트마다 쓰레기 아이템 생성
      const newTrashItems = event.data.points.map((point) => ({
        id: idCounter.current++,
        level: Math.floor(Math.random() * 2), // 0-2 사이의 레벨
        x: point.x * 100, // 0-100% 위치값으로 변환
        y: point.y * 100,
      }))

      setTrash((prev) => [...prev, ...newTrashItems])
      // 이부분에서 zustand 연결 필요함.
    }

    return () => {
      workerRef.current?.terminate()
    }
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      if (workerRef.current) {
        workerRef.current.postMessage(1) // 한 번에 1개의 포인트 생성
      }
    }, 20000)

    return () => clearInterval(interval)
  }, [])

  const getTrashImage = (level: number) => {
    if (level === 0) return "/images/trash_level1.png"
    if (level === 1) return "/images/trash_level2.png"
    return "/images/trash_level3.png"
  }

  return (
    <div className={styles.contain}>
      <h2 className={styles.title}>쓰레기 컴포넌트 생성기</h2>
      <div className={styles.contain}>
        {trash.map((item) => (
          <div
            key={item.id}
            className={styles.trashItem}
            style={{
              left: `${item.x}%`,
              top: `${item.y}%`,
              transition: "all 0.3s ease-in-out",
            }}
          >
            <Image
              src={getTrashImage(item.level)}
              alt={`Trash Level ${item.level}`}
              className={styles.trashImage}
              width={100}
              height={100}
            />
          </div>
        ))}
      </div>
    </div>
  )
}

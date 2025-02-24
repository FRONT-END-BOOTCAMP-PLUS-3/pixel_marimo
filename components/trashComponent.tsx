"use client"
import { useEffect, useRef, useState } from "react"

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
    }

    return () => {
      workerRef.current?.terminate()
    }
  }, [])

  const getTrashImage = (level: number) => {
    if (level === 0) return "/images/trash_level1.png"
    if (level === 1) return "/images/trash_level2.png"
    return "/images/trash_level3.png"
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">쓰레기 컴포넌트 생성기</h2>
      <div className="relative w-full h-[600px] border border-gray-300 mt-4">
        {trash.map((item) => (
          <div
            key={item.id}
            className="absolute transform -translate-x-1/2 -translate-y-1/2"
            style={{
              left: `${item.x}%`,
              top: `${item.y}%`,
              transition: "all 0.3s ease-in-out",
            }}
          >
            <img
              src={getTrashImage(item.level)}
              alt={`Trash Level ${item.level}`}
              className="w-12 h-12 object-contain"
            />
          </div>
        ))}
      </div>
    </div>
  )
}

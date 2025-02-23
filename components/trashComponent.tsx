"use client"
import { useEffect, useRef, useState, useCallback } from "react"
import { workerData } from "worker_threads";

type TrashItem = { id: number; level: number }

export default function TrashComponent() {
  const workerRef = useRef<Worker>()
  const [trash, setTrash] = useState<TrashItem[]>([])
  const idCounter = useRef(0)

  useEffect(() => {
    workerRef.current = new Worker(
      new URL("/public/workers/fetchWorker.ts", import.meta.url),
    )

    workerRef.current.onmessage = (event: MessageEvent<number | string>) => {
      const newTrash = { id: idCounter.current++, level: event.data }
      setTrash((prev) => [...prev, newTrash])
    }

    return () => {
      workerRef.current?.terminate()
    }
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      handleWork()
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  const handleWork = useCallback(() => {
    if (workerRef.current) {
      workerRef.current.postMessage(1000000)
    }
  }, [])

  return (
    <div>
      <h2>쓰레기 컴포넌트 생성기</h2>
      <button onClick={handleWork}>수동 생성</button>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "10px",
          marginTop: "10px",
        }}
      >
        {trash.map((g) => (
          <div
            key={g.id}
            style={{ padding: "10px", border: "1px solid black" }}
          >
            <Image url={} alt={}></Image>
          </div>
        ))}
      </div>
    </div>
  )
}

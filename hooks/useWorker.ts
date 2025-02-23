"use client"
import { useEffect, useRef, useState } from "react"

type TrashItem = {
  id: number
  content: string
}

type WorkerMessage = {
  type: string
  trash?: TrashItem[]
  error?: string
  status?: string
}

export const useWorker = (interval = 2000) => {
  const workerRef = useRef<Worker | null>(null)
  const [trash, setTrash] = useState<TrashItem[]>([])
  const [status, setStatus] = useState<string>("")
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (typeof window === "undefined") return
    console.log("🚀 Trash Worker 생성 시도")

    try {
      console.log("Worker 경로:", "/workers/fetchWorker.ts")
      workerRef.current = new Worker("/workers/fetchWorker.ts")
      console.log("✅ Worker 생성 성공:", workerRef.current)
    } catch (error) {
      console.error("❌ Worker 생성 실패:", error)
      return
    }

    console.log("Worker 메시지 핸들러 설정")
    workerRef.current.onmessage = (event: MessageEvent<WorkerMessage>) => {
      console.log("📨 Worker로부터 메시지 수신:", event.data)

      switch (event.data.type) {
        case "update":
          if (event.data.trash) {
            setTrash(event.data.trash)
            setStatus("업데이트 완료")
          }
          break

        case "clear":
          setTrash([])
          setStatus("청소 완료")
          break

        case "error":
          if (event.data.error) {
            setError(event.data.error)
            setStatus("에러 발생")
          }
          break

        case "status":
          if (event.data.status) {
            setStatus(event.data.status)
          }
          break

        default:
          console.warn("알 수 없는 메시지 타입:", event.data.type)
      }
    }

    // 에러 처리 추가
    workerRef.current.onerror = (error) => {
      console.error("Worker 에러:", error)
      setError(error.message)
      setStatus("에러 발생")
    }

    console.log("Worker에게 start 메시지 전송")
    workerRef.current.postMessage({ type: "start", interval })

    return () => {
      console.log("🛑 Worker 종료 시도")
      try {
        workerRef.current?.postMessage({ type: "stop" })
        workerRef.current?.terminate()
        console.log("✅ Worker 정상 종료")
      } catch (error) {
        console.error("❌ Worker 종료 실패:", error)
      }
      workerRef.current = null
    }
  }, [interval])

  const clearTrash = () => {
    alert("쓰레기를 청소합니다!!")
    workerRef.current?.postMessage({ type: "clear" })
  }

  return {
    trash,
    clearTrash,
    status,
    error,
    isRunning: !!workerRef.current,
  }
}

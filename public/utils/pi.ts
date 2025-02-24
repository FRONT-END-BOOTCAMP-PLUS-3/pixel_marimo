//  랜덤 위치 - div 안과 밖이라고 가정하에 실행
export function pi(
  iterations: number,
): { x: number; y: number; isInside: boolean }[] {
  const points: { x: number; y: number; isInside: boolean }[] = []

  for (let i = 0; i < iterations; i++) {
    const x = Math.random()
    const y = Math.random()

    // x, y 값으로 계산해서 랜덤 위치 생성
    const isInside = x * x + y * y <= 1

    points.push({ x, y, isInside })
  }

  return points
}

// 랜덤 위치 - div 안과 밖이라고 가정하에 실행
export function calculatePi(
  points: { x: number; y: number; isInside: boolean }[],
): number {
  const insidePoints = points.filter((point) => point.isInside).length
  return 4 * (insidePoints / points.length)
}

export default pi

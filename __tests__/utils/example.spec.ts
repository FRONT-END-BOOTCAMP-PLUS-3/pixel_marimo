import { describe, expect, test } from "vitest"

// 테스트할 함수
const multiply = (a: number, b: number) => a * b

describe("Math 관련 함수 테스트", () => {
  test("multiply 함수는 두 수의 곱을 반환해야 한다.", () => {
    expect(multiply(2, 3)).toBe(6)
  })

  test("multiply 함수는 0을 곱하면 0을 반환해야 한다.", () => {
    expect(multiply(5, 0)).toBe(0)
  })
})

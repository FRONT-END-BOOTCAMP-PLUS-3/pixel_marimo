import crypto from "crypto"

const salt = process.env.MARIMO_SECRET_KEY!

// 비밀번호 해싱
export const hashPassword = (password: string) => {
  return crypto.pbkdf2Sync(password, salt, 1000, 64, "sha512").toString("hex")
}

// 비밀번호 비교
export const comparePassword = (password: string, hashedPassword: string) => {
  const hash = crypto
    .pbkdf2Sync(password, salt, 1000, 64, "sha512")
    .toString("hex")
  return hash === hashedPassword
}

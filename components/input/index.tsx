"use client"

import {
  useState,
  type FC,
  ChangeEventHandler,
  Dispatch,
  SetStateAction,
  useEffect,
} from "react"

import { getWarningMsg } from "@marimo/utils/get-warning-msg"

import styles from "@marimo/components/input/index.module.css"

interface InputProps {
  label: string
  setState: Dispatch<SetStateAction<string | undefined>>
}

export const Input: FC<InputProps> = ({ label, setState }) => {
  const { input__wrapper, input_label, input, p, isVisible } = styles

  const [value, setValue] = useState<string | undefined>(undefined)
  const [warning, setWarning] = useState<string | undefined>(undefined)

  const onChangeHandler: ChangeEventHandler<HTMLInputElement> = (event) => {
    const value = event?.target.value
    value.length === 0 ? setValue(undefined) : setValue(value)
    value.length === 0 ? setState(undefined) : setState(value)
  }

  useEffect(() => {
    value
      ? setWarning(getWarningMsg(label as "email" | "password", value))
      : setWarning(undefined)
  }, [label, value])

  return (
    <div className={input__wrapper}>
      <label htmlFor={label} className={`${input_label} text-xl-b`}>
        {label}
      </label>
      <input
        type={label}
        id={label}
        name={label}
        className={`${input} text-lg`}
        onChange={onChangeHandler}
      />
      <p className={`${p} ${!!warning && isVisible} text-sm`}>{warning}</p>
    </div>
  )
}

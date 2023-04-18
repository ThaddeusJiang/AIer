import React, { ChangeEvent, InputHTMLAttributes } from "react"

interface Props extends Omit<InputHTMLAttributes<any>, "onChange"> {
  className?: string
  onChange: (value: string) => void
}
const Input = (props: Props) => {
  const { className, children, onChange, ...rest } = props

  const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (onChange) {
      onChange(e.target.value)
    }
    return null
  }

  return (
    <label>
      <input
        onChange={handleOnChange}
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck="false"
        {...rest}
      />
    </label>
  )
}

export default Input

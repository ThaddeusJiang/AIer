import { useForm } from "react-hook-form"

import { IconSearch } from "@tabler/icons-react"

export function MemoSearchForm(props: { text: string; onSearch: (text: string) => void }) {
  const { register, handleSubmit } = useForm({
    defaultValues: {
      text: props.text
    },
    values: {
      text: props.text
    }
  })
  return (
    <form
      onSubmit={handleSubmit((data: { text: string }) => {
        const text = data.text
        props.onSearch(text)
      })}
      className="form-control relative w-full py-1"
    >
      <IconSearch className="absolute left-4 top-5 h-4 w-4 text-gray-600" />
      <input
        type="text"
        className="
            input-bordered input w-full pl-10 text-base text-gray-900 focus:shadow focus:outline-none"
        placeholder="What do you want to search?"
        {...register("text")}
      />
    </form>
  )
}

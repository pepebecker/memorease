import { Button, TextInput, Textarea } from '@mantine/core'
import { useEffect, useMemo, useState } from 'react'
import { v4 } from 'uuid'
import { Entry } from '../types/entry'
import { useLocalStorage } from '@mantine/hooks'

interface Props {
  selected?: string
  onSubmit(id?: string): void
}

const Edit = (props: Props) => {
  const [entries, setEntries] = useLocalStorage<Entry[]>({
    key: 'entries',
    defaultValue: [],
  })

  const entry = useMemo(
    () => entries.find((e) => e.id === props.selected),
    [entries, props.selected]
  )

  const [title, setTitle] = useState(entry?.title || '')
  const [text, setText] = useState(entry?.text || '')

  useEffect(() => {
    if (!entry) return
    setTitle(entry.title)
    setText(entry.text)
  }, [entry])

  const onCreate = () => {
    if (!title) return
    if (!text) return
    let id = v4()
    while (entries.find((e) => e.id === id)) {
      console.warn('ID already exist. Generating new ID.')
      id = v4()
    }
    const newEntry: Entry = { id, title, text }
    setEntries([...entries, newEntry])
    props.onSubmit?.(id)
  }

  const onUpdate = () => {
    if (!props.selected) return
    if (!title) return
    if (!text) return
    const newEntries = entries.map((e) => {
      if (e.id === props.selected) {
        return { id: e.id, title, text }
      }
      return e
    })
    setEntries(newEntries)
    props.onSubmit?.(props.selected)
  }

  const onDelete = () => {
    if (!props.selected) return
    setEntries(entries.filter((e) => e.id !== props.selected))
    props.onSubmit?.(undefined)
  }

  return (
    <div className="mx-auto max-w-[800px]">
      <TextInput
        label="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <Textarea
        label="Text"
        rows={12}
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <div className="mt-2 flex gap-2 justify-end">
        <Button
          size="sm"
          onClick={entry ? onUpdate : onCreate}
          disabled={!title || !text}
        >
          {entry ? 'Update' : 'Create'}
        </Button>
        {entry ? (
          <Button color="red" onClick={onDelete}>
            Delete
          </Button>
        ) : null}
      </div>
    </div>
  )
}

export default Edit

import { List as MantineList, NavLink } from '@mantine/core'
import { IconChevronRight } from '@tabler/icons-react'
import { Entry } from '../types/entry'
import { useLocalStorage } from '@mantine/hooks'

interface Props {
  selected?: string
  onSelect(id: string): void
}

const List = (props: Props) => {
  const [entries] = useLocalStorage<Entry[]>({
    key: 'entries',
    defaultValue: [],
  })
  return (
    <div className="mx-auto max-w-[800px]">
      <MantineList>
        {entries.map((e, i) => (
          <NavLink
            key={i}
            label={e.title}
            active={props.selected === e.id}
            onClick={() => props.onSelect(e.id)}
            rightSection={
              <IconChevronRight
                size="0.8rem"
                stroke={1.5}
                className="mantine-rotate-rtl"
              />
            }
          />
        ))}
      </MantineList>
    </div>
  )
}

export default List

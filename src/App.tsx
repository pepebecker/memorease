import { AppShell, Burger, Button, Divider, NavLink } from '@mantine/core'
import { useDisclosure, useLocalStorage } from '@mantine/hooks'
import { IconChevronRight } from '@tabler/icons-react'
import { useEffect, useMemo, useState } from 'react'
import Edit from './pages/Edit'
import List from './pages/List'
import Study from './pages/Study'
import { Entry } from './types/entry'

enum Page {
  Study,
  List,
  Edit,
}

export default function App() {
  const [entries] = useLocalStorage<Entry[]>({
    key: 'entries',
    defaultValue: [],
  })

  const [opened, { toggle, close }] = useDisclosure()
  const [page, setPage] = useState(Page.List)
  const [selected, setSelected] = useState<string | undefined>(undefined)

  const entry = useMemo(
    () => entries.find((e) => e.id === selected),
    [entries, selected]
  )

  useEffect(() => {
    if (page === Page.Study || page === Page.Edit) return
    setSelected(undefined)
  }, [page, setSelected])

  return (
    <AppShell
      header={{ height: 40 }}
      classNames={{ header: 'p-2' }}
      navbar={{
        width: 300,
        breakpoint: 'sm',
        collapsed: { desktop: !opened, mobile: !opened },
      }}
      padding="md"
    >
      <AppShell.Header className="flex items-center gap-1">
        <Burger opened={opened} onClick={toggle} size="sm" />
        <div
          className="font-bold max-md:hidden cursor-pointer bg-gradient-to-tr from-blue-600 to-blue-400 inline-block text-transparent bg-clip-text"
          onClick={() => {
            setSelected(undefined)
            setPage(Page.List)
            close()
          }}
        >
          Memorease
        </div>
        {page === Page.Study ? (
          <>
            <div className="flex-grow max-sm:hidden" />
            {entry ? entry.title : null}
            <div className="flex-grow" />
            <Button
              size="xs"
              onClick={() => {
                setPage(Page.Edit)
                close()
              }}
            >
              Edit
            </Button>
          </>
        ) : null}
        {page === Page.List ? (
          <>
            <div className="flex-grow" />
            <Button
              size="xs"
              onClick={() => {
                setSelected(undefined)
                setPage(Page.Edit)
                close()
              }}
            >
              Add
            </Button>
          </>
        ) : null}
        {page === Page.Edit ? (
          <>
            <div className="flex-grow max-sm:hidden" />
            {entry ? `Edit "${entry.title}"` : 'Add'}
            <div className="flex-grow" />
          </>
        ) : null}
      </AppShell.Header>

      <AppShell.Navbar p="md">
        {/* <NavLink */}
        {/*   label="List" */}
        {/*   active={page === Page.List} */}
        {/*   onClick={() => { */}
        {/*     setSelected(undefined) */}
        {/*     setPage(Page.List) */}
        {/*     close() */}
        {/*   }} */}
        {/*   rightSection={ */}
        {/*     <IconChevronRight */}
        {/*       size="0.8rem" */}
        {/*       stroke={1.5} */}
        {/*       className="mantine-rotate-rtl" */}
        {/*     /> */}
        {/*   } */}
        {/* /> */}
        <NavLink
          label="Add"
          active={page === Page.Edit && !selected}
          onClick={() => {
            setSelected(undefined)
            setPage(Page.Edit)
            close()
          }}
          rightSection={
            <IconChevronRight
              size="0.8rem"
              stroke={1.5}
              className="mantine-rotate-rtl"
            />
          }
        />
        <Divider />
        <div className="overflow-scroll">
          {entries.map((e) => (
            <NavLink
              key={e.id}
              label={e.title}
              active={page === Page.Study && selected === e.id}
              onClick={() => {
                setSelected(e.id)
                setPage(Page.Study)
                close()
              }}
              rightSection={
                <IconChevronRight
                  size="0.8rem"
                  stroke={1.5}
                  className="mantine-rotate-rtl"
                />
              }
            />
          ))}
        </div>
      </AppShell.Navbar>

      <AppShell.Main>
        {page === Page.Study ? <Study selected={selected} /> : null}
        {page === Page.List ? (
          <List
            selected={selected}
            onSelect={(id) => {
              setSelected(id)
              setPage(Page.Study)
            }}
          />
        ) : null}
        {page === Page.Edit ? (
          <Edit
            selected={selected}
            onSubmit={(id) => {
              setSelected(id)
              setPage(id ? Page.Study : Page.List)
            }}
          />
        ) : null}
      </AppShell.Main>
    </AppShell>
  )
}

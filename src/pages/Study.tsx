import { Entry } from '../types/entry'
import { useLocalStorage } from '@mantine/hooks'
import { Fragment, useEffect, useMemo, useState } from 'react'

enum ViewMode {
  Complete,
  Initials,
  Random,
}

enum RevealMode {
  Words,
  Chars,
}

interface Word {
  text: string
  chars: { char: string; hidden: boolean }[]
}

interface Line {
  words: Word[]
}

interface Props {
  selected?: string
}

const Study = (props: Props) => {
  const [entries] = useLocalStorage<Entry[]>({
    key: 'entries',
    defaultValue: [],
  })
  const entry = useMemo(
    () => entries.find((e) => e.id === props.selected),
    [entries, props.selected]
  )

  const [viewMode] = useState(ViewMode.Initials)
  const [revealMode] = useState(RevealMode.Words)
  const [lines, setLines] = useState<Line[]>([])

  useEffect(() => {
    if (!entry?.text) return
    const lines = entry.text.split('\n').map((line) => line.trim())

    const newLines: Line[] = lines.map((line) => {
      return {
        words: line.split(' ').map((word) => {
          if (viewMode === ViewMode.Initials) {
            return {
              text: word,
              chars: word.split('').map((char, c) => ({
                char,
                hidden: c > 0,
              })),
            }
          }
          return {
            text: word,
            chars: word.split('').map((char) => ({ char, hidden: false })),
          }
        }),
      }
    })
    setLines(newLines)
  }, [entry, viewMode])

  return (
    <div className="overflow-y-scroll text-2xl text-left max-w-[800px] mx-auto overflow-scroll cursor-default pb-8 box-border">
      {lines.map((line, index) => {
        return (
          <p key={index} className="mb-4">
            {line.words.map((word, index) => {
              return (
                <Fragment key={index}>
                  <span className="group border-b border-[#ccc] hover:border-[#333]">
                    {word.chars.map((char, index) => (
                      <span
                        key={index}
                        className={`transition ${
                          char.hidden ? 'opacity-0' : ''
                        } ${
                          revealMode === RevealMode.Words
                            ? 'group-hover:opacity-100'
                            : 'hover:opacity-100'
                        }`}
                      >
                        {char.char}
                      </span>
                    ))}
                  </span>
                  <span key={index + '_space'} className="">
                    {' '}
                  </span>
                </Fragment>
              )
            })}
          </p>
        )
      })}
    </div>
  )
}

export default Study

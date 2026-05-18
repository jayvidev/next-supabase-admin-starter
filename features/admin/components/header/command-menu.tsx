'use client'

import React, { useEffect, useMemo } from 'react'

import { ArrowRight } from 'lucide-react'
import { useRouter } from 'nextjs-toploader/app'

import { getSidebarData } from '@admin/components/sidebar/sidebar-data'

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useSearchStore } from '@/lib/stores/search.store'

export function CommandMenu() {
  const router = useRouter()
  const { open, setOpen } = useSearchStore()

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }
    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [setOpen])

  const sidebarData = useMemo(() => getSidebarData({ isSuperAdmin: true }), [])

  const runCommand = React.useCallback(
    (command: () => unknown) => {
      command()
      Promise.resolve().then(() => setOpen(false))
    },
    [setOpen]
  )

  const [mounted, setMounted] = React.useState(false)
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <CommandDialog modal open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <ScrollArea type="hover" className="h-72 pr-1">
          <CommandEmpty>No results found.</CommandEmpty>
          {sidebarData.navGroups.map((group) => (
            <React.Fragment key={group.title}>
              <CommandGroup heading={group.title}>
                {group.items.flatMap((navItem, i) => {
                  if ('items' in navItem && navItem.items) {
                    return navItem.items.map((child, j) => {
                      const Icon = child.icon
                      return (
                        <CommandItem
                          key={`${child.url}-${i}-${j}`}
                          value={child.title}
                          onSelect={() => runCommand(() => router.push(child.url!))}
                        >
                          <div className="mr-2 flex h-4 w-4 items-center justify-center">
                            <ArrowRight className="text-muted-foreground/80 size-2" />
                          </div>
                          {Icon && <Icon className="mr-2" />}
                          {child.title}
                        </CommandItem>
                      )
                    })
                  }
                  if (!navItem.url) return []
                  const Icon = navItem.icon
                  return [
                    <CommandItem
                      key={`${navItem.url}-${i}`}
                      value={navItem.title}
                      onSelect={() => runCommand(() => router.push(navItem.url!))}
                    >
                      <div className="mr-2 flex h-4 w-4 items-center justify-center">
                        <ArrowRight className="text-muted-foreground/80 size-2" />
                      </div>
                      {Icon && <Icon className="mr-2" />}
                      {navItem.title}
                    </CommandItem>,
                  ]
                })}
              </CommandGroup>
              <CommandSeparator className="my-2" />
            </React.Fragment>
          ))}
        </ScrollArea>
      </CommandList>
    </CommandDialog>
  )
}

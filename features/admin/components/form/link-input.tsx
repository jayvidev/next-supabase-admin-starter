'use client'

import { ChevronDown } from 'lucide-react'

import { SECTION_OPTIONS } from '@admin/config/sections'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from '@/components/ui/input-group'

interface LinkInputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export function LinkInput({ value, onChange, placeholder = 'URL or #section' }: LinkInputProps) {
  return (
    <InputGroup className="w-full">
      <InputGroupInput
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
      <InputGroupAddon align="inline-end">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <InputGroupButton
              size="icon-xs"
              variant="ghost"
              className="text-muted-foreground hover:text-foreground border-l rounded-r-lg"
            >
              <ChevronDown className="size-3" />
            </InputGroupButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[200px]">
            <DropdownMenuItem onClick={() => onChange('/')}>Home</DropdownMenuItem>
            {SECTION_OPTIONS.map((opt) => (
              <DropdownMenuItem key={opt.value} onClick={() => onChange(opt.value)}>
                {opt.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </InputGroupAddon>
    </InputGroup>
  )
}

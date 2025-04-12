"use client"

import { useState } from "react"
import { Globe, Lock, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export type Visibility = "public" | "private" | "community"

interface VisibilitySelectorProps {
  value: Visibility
  onChange: (visibility: Visibility) => void
}

export function VisibilitySelector({ value, onChange }: VisibilitySelectorProps) {
  const [visibility, setVisibility] = useState<Visibility>(value)

  const handleChange = (newVisibility: Visibility) => {
    setVisibility(newVisibility)
    onChange(newVisibility)
  }

  const visibilityOptions = [
    {
      value: "public" as Visibility,
      label: "Public",
      icon: Globe,
      description: "Visible to everyone on the internet",
    },
    {
      value: "private" as Visibility,
      label: "Private",
      icon: Lock,
      description: "Visible only to you",
    },
    {
      value: "community" as Visibility,
      label: "Community",
      icon: Users,
      description: "Visible to all registered users",
    },
  ]

  const selectedOption = visibilityOptions.find((option) => option.value === visibility)

  return (
    <TooltipProvider>
      <Tooltip>
        <DropdownMenu>
          <TooltipTrigger asChild>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                <selectedOption.icon className="h-4 w-4" />
                {selectedOption.label}
              </Button>
            </DropdownMenuTrigger>
          </TooltipTrigger>
          <DropdownMenuContent align="end">
            {visibilityOptions.map((option) => (
              <DropdownMenuItem key={option.value} onClick={() => handleChange(option.value)} className="gap-2">
                <option.icon className="h-4 w-4" />
                <div>
                  <div>{option.label}</div>
                  <div className="text-xs text-muted-foreground">{option.description}</div>
                </div>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        <TooltipContent>
          <p>{selectedOption.description}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

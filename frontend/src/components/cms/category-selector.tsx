"use client"

import { useState } from "react"
import { Check, Plus, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

interface CategorySelectorProps {
  selectedCategories: string[]
  onChange: (categories: string[]) => void
}

const PREDEFINED_CATEGORIES = [
  "SEO",
  "Digital Marketing",
  "Social Media",
  "Content Marketing",
  "Web Development",
  "Design",
  "Analytics",
  "Email Marketing",
  "PPC Advertising",
  "Branding",
  "Consulting",
  "Strategy",
]

export default function CategorySelector({ selectedCategories, onChange }: CategorySelectorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [newCategory, setNewCategory] = useState("")

  const toggleCategory = (category: string) => {
    if (selectedCategories.includes(category)) {
      onChange(selectedCategories.filter((c) => c !== category))
    } else {
      onChange([...selectedCategories, category])
    }
  }

  const addNewCategory = () => {
    if (newCategory.trim() && !selectedCategories.includes(newCategory.trim())) {
      onChange([...selectedCategories, newCategory.trim()])
      setNewCategory("")
    }
  }

  const removeCategory = (category: string) => {
    onChange(selectedCategories.filter((c) => c !== category))
  }

  return (
    <div className="space-y-3">
      {/* Selected Categories */}
      {selectedCategories.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedCategories.map((category) => (
            <Badge key={category} variant="secondary" className="flex items-center gap-1">
              {category}
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeCategory(category)}
                className="h-auto p-0 w-4 h-4 hover:bg-transparent"
              >
                <X className="w-3 h-3" />
              </Button>
            </Badge>
          ))}
        </div>
      )}

      {/* Category Selector */}
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-full justify-start bg-transparent">
            <Plus className="w-4 h-4 mr-2" />
            Add Categories
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80" align="start">
          <div className="space-y-4">
            {/* Add New Category */}
            <div className="flex gap-2">
              <Input
                placeholder="Add new category"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && addNewCategory()}
              />
              <Button size="sm" onClick={addNewCategory} disabled={!newCategory.trim()}>
                Add
              </Button>
            </div>

            {/* Predefined Categories */}
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Predefined Categories</h4>
              <div className="grid grid-cols-1 gap-1 max-h-48 overflow-y-auto">
                {PREDEFINED_CATEGORIES.map((category) => (
                  <Button
                    key={category}
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleCategory(category)}
                    className="justify-between h-8"
                  >
                    <span>{category}</span>
                    {selectedCategories.includes(category) && <Check className="w-4 h-4 text-green-600" />}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}

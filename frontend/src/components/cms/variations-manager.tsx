"use client"

import { useState } from "react"
import { Plus, Trash2, Edit, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface ProductVariation {
  id: string
  name: string
  options: VariationOption[]
}

interface VariationOption {
  id: string
  value: string
  price: number
  inventory: number
}

interface VariationsManagerProps {
  variations: ProductVariation[]
  onChange: (variations: ProductVariation[]) => void
}

export default function VariationsManager({ variations, onChange }: VariationsManagerProps) {
  const [editingVariation, setEditingVariation] = useState<string | null>(null)
  const [editingOption, setEditingOption] = useState<string | null>(null)

  const addVariation = () => {
    const newVariation: ProductVariation = {
      id: Date.now().toString(),
      name: "New Variation",
      options: [],
    }
    onChange([...variations, newVariation])
    setEditingVariation(newVariation.id)
  }

  const updateVariation = (variationId: string, updates: Partial<ProductVariation>) => {
    onChange(variations.map((v) => (v.id === variationId ? { ...v, ...updates } : v)))
  }

  const deleteVariation = (variationId: string) => {
    onChange(variations.filter((v) => v.id !== variationId))
  }

  const addOption = (variationId: string) => {
    const newOption: VariationOption = {
      id: Date.now().toString(),
      value: "New Option",
      price: 0,
      inventory: 0,
    }

    updateVariation(variationId, {
      options: [...(variations.find((v) => v.id === variationId)?.options || []), newOption],
    })
    setEditingOption(newOption.id)
  }

  const updateOption = (variationId: string, optionId: string, updates: Partial<VariationOption>) => {
    const variation = variations.find((v) => v.id === variationId)
    if (!variation) return

    const updatedOptions = variation.options.map((o) => (o.id === optionId ? { ...o, ...updates } : o))

    updateVariation(variationId, { options: updatedOptions })
  }

  const deleteOption = (variationId: string, optionId: string) => {
    const variation = variations.find((v) => v.id === variationId)
    if (!variation) return

    const updatedOptions = variation.options.filter((o) => o.id !== optionId)
    updateVariation(variationId, { options: updatedOptions })
  }

  return (
    <div className="space-y-4">
      {variations.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <div className="text-4xl mb-4">🎨</div>
          <p className="mb-4">No variations added yet</p>
          <p className="text-sm text-gray-400">
            Add variations like size, color, or duration to offer different options
          </p>
        </div>
      )}

      {variations.map((variation) => (
        <Card key={variation.id}>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              {editingVariation === variation.id ? (
                <div className="flex items-center gap-2 flex-1">
                  <Input
                    value={variation.name}
                    onChange={(e) => updateVariation(variation.id, { name: e.target.value })}
                    className="flex-1"
                  />
                  <Button size="sm" onClick={() => setEditingVariation(null)}>
                    <Save className="w-4 h-4" />
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-2 flex-1">
                  <CardTitle className="text-lg">{variation.name}</CardTitle>
                  <Badge variant="secondary">{variation.options.length} options</Badge>
                </div>
              )}

              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={() => setEditingVariation(variation.id)}>
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => deleteVariation(variation.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-3">
            {/* Options */}
            {variation.options.map((option) => (
              <div key={option.id} className="flex items-center gap-3 p-3 border rounded-lg">
                {editingOption === option.id ? (
                  <>
                    <div className="flex-1 grid grid-cols-3 gap-2">
                      <Input
                        placeholder="Option name"
                        value={option.value}
                        onChange={(e) => updateOption(variation.id, option.id, { value: e.target.value })}
                      />
                      <Input
                        type="number"
                        placeholder="Price"
                        value={option.price}
                        onChange={(e) =>
                          updateOption(variation.id, option.id, { price: Number.parseFloat(e.target.value) || 0 })
                        }
                      />
                      <Input
                        type="number"
                        placeholder="Inventory"
                        value={option.inventory}
                        onChange={(e) =>
                          updateOption(variation.id, option.id, { inventory: Number.parseInt(e.target.value) || 0 })
                        }
                      />
                    </div>
                    <Button size="sm" onClick={() => setEditingOption(null)}>
                      <Save className="w-4 h-4" />
                    </Button>
                  </>
                ) : (
                  <>
                    <div className="flex-1">
                      <div className="font-medium">{option.value}</div>
                      <div className="text-sm text-gray-600">
                        ${option.price} • {option.inventory} in stock
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => setEditingOption(option.id)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteOption(variation.id, option.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </>
                )}
              </div>
            ))}

            {/* Add Option Button */}
            <Button variant="outline" size="sm" onClick={() => addOption(variation.id)} className="w-full">
              <Plus className="w-4 h-4 mr-2" />
              Add Option
            </Button>
          </CardContent>
        </Card>
      ))}

      {/* Add Variation Button */}
      <Button variant="outline" onClick={addVariation} className="w-full bg-transparent">
        <Plus className="w-4 h-4 mr-2" />
        Add Variation
      </Button>
    </div>
  )
}

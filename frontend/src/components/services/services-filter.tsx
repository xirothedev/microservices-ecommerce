"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Filter, X } from "lucide-react"

export default function ServicesFilter() {
  const [activeCategory, setActiveCategory] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [showFilters, setShowFilters] = useState(false)

  const categories = [
    { id: "all", name: "All Services", count: 24 },
    { id: "apple", name: "Apple Services", count: 8 },
    { id: "social", name: "Social Media", count: 6 },
    { id: "streaming", name: "Streaming", count: 5 },
    { id: "business", name: "Business", count: 5 },
  ]

  const priceRanges = [
    { id: "under-50", name: "Under $50", count: 12 },
    { id: "50-100", name: "$50 - $100", count: 8 },
    { id: "100-200", name: "$100 - $200", count: 4 },
  ]

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Search */}
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              placeholder="Search services..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12"
            />
          </div>
        </div>

        {/* Filter Toggle */}
        <Button variant="outline" onClick={() => setShowFilters(!showFilters)} className="lg:hidden h-12">
          <Filter className="h-4 w-4 mr-2" />
          Filters
        </Button>
      </div>

      {/* Filters */}
      <div className={`mt-6 space-y-6 ${showFilters ? "block" : "hidden lg:block"}`}>
        {/* Categories */}
        <div>
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Categories</h3>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={activeCategory === category.id ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveCategory(category.id)}
                className="h-8"
              >
                {category.name}
                <Badge variant="secondary" className="ml-2 text-xs">
                  {category.count}
                </Badge>
              </Button>
            ))}
          </div>
        </div>

        {/* Price Ranges */}
        <div>
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Price Range</h3>
          <div className="flex flex-wrap gap-2">
            {priceRanges.map((range) => (
              <Button key={range.id} variant="outline" size="sm" className="h-8 bg-transparent">
                {range.name}
                <Badge variant="secondary" className="ml-2 text-xs">
                  {range.count}
                </Badge>
              </Button>
            ))}
          </div>
        </div>

        {/* Active Filters */}
        {(activeCategory !== "all" || searchQuery) && (
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Active Filters</h3>
            <div className="flex flex-wrap gap-2">
              {activeCategory !== "all" && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  {categories.find((c) => c.id === activeCategory)?.name}
                  <X className="h-3 w-3 cursor-pointer" onClick={() => setActiveCategory("all")} />
                </Badge>
              )}
              {searchQuery && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Search: {searchQuery}
                  <X className="h-3 w-3 cursor-pointer" onClick={() => setSearchQuery("")} />
                </Badge>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

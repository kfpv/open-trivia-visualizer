import { useState } from 'react'
import { groupBy } from '@/lib/utils'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { CategoryBarChart } from '@/components/CategoryBarChart'
import { DifficultyPieChart } from '@/components/DifficultyPieChart'
import { useQuery } from '@tanstack/react-query'
import { fetchCategories, fetchQuestions, type Category } from '@/lib/api'

export function TriviaVisualizer() {
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | undefined>()
  const { data: categories, isLoading: categoriesLoading, error: categoriesError } = useQuery<Category[]>({
    queryKey: ['trivia', 'categories'],
    queryFn: fetchCategories,
  })

  const { data: allQuestions, isLoading: questionsLoading, error: questionsError } = useQuery({
    queryKey: ['trivia', 'questions'],
    queryFn: () => fetchQuestions(50),
  })

  const selectedCategory = categories?.find(cat => cat.id === selectedCategoryId);
  const filteredQuestions = selectedCategory
    ? allQuestions?.filter(q => q.category === selectedCategory.name) || []
    : allQuestions || [];

  const isLoading = categoriesLoading || questionsLoading
  const error = categoriesError || questionsError
  const categoryData = filteredQuestions ? groupBy(filteredQuestions, q => q.category).sort((a, b) => b.count - a.count) : []
  const difficultyData = filteredQuestions ? groupBy(filteredQuestions, q => q.difficulty) : []

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-destructive">Error loading data: {error.message}</p>
      </div>
    )
  }

  if (!filteredQuestions || filteredQuestions.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-muted-foreground">No questions available</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Select
          value={selectedCategoryId?.toString() || 'all'}
          onValueChange={(value) => setSelectedCategoryId(value === 'all' ? undefined : Number(value))}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories?.map(category => (
              <SelectItem key={category.id} value={category.id.toString()}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Questions by Category</CardTitle>
          </CardHeader>
          <CardContent className="pl-1">
            <CategoryBarChart data={categoryData} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Questions by Difficulty</CardTitle>
          </CardHeader>
          <CardContent>
            <DifficultyPieChart data={difficultyData} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

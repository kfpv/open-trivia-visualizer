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
import { Button } from '@/components/ui/button'
import { ArrowLeft, AlertCircle } from 'lucide-react'
import { CategoryBarChart } from '@/components/CategoryBarChart'
import { DifficultyPieChart } from '@/components/DifficultyPieChart'
import { Skeleton } from '@/components/ui/skeleton'
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
  const hasData = filteredQuestions && filteredQuestions.length > 0

  return (
    <div className="space-y-6">
      <div className={`flex items-center ${selectedCategoryId ? 'justify-between' : 'justify-end'}`}>
        {selectedCategoryId && (
          <Button
            variant="outline"
            onClick={() => setSelectedCategoryId(undefined)}
            className="gap-2"
            disabled={isLoading}
          >
            <ArrowLeft className="h-4 w-4" />
            All Categories
          </Button>
        )}
        <Select
          value={selectedCategoryId?.toString() || 'all'}
          onValueChange={(value) => setSelectedCategoryId(value === 'all' ? undefined : Number(value))}
          disabled={isLoading || !categories}
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

      {error && (
        <Card className="border-destructive">
          <CardContent>
            <div className="flex items-center gap-2 text-destructive">
              <AlertCircle className="h-4 w-4" />
              <p>Error loading data: {error.message}</p>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex flex-col lg:flex-row gap-6">
        <Card className="lg:flex-1 lg:self-start">
          <CardHeader>
            <CardTitle>Questions by Category</CardTitle>
          </CardHeader>
          <CardContent className="pl-1">
            {isLoading ? (
              <CategoryBarChartSkeleton />
            ) : !hasData ? (
              <div className="flex items-center justify-center min-h-[100px] text-muted-foreground">
                <p>No questions available for this category</p>
              </div>
            ) : (
              <CategoryBarChart
                data={categoryData}
                onCategoryClick={(categoryName) => {
                  const category = categories?.find(cat => cat.name === categoryName)
                  if (category) {
                    setSelectedCategoryId(category.id)
                  }
                }}
              />
            )}
          </CardContent>
        </Card>

        <Card className="lg:w-fit lg:flex-shrink-0 lg:self-start">
          <CardHeader>
            <CardTitle>Questions by Difficulty</CardTitle>
          </CardHeader>
          <CardContent className="w-full lg:w-fit">
            {isLoading ? (
              <DifficultyPieChartSkeleton />
            ) : !hasData ? (
              <div className="flex items-center justify-center min-h-[250px] text-muted-foreground">
                <p>No questions available for this category</p>
              </div>
            ) : (
              <DifficultyPieChart data={difficultyData} />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function CategoryBarChartSkeleton() {
  return (
    <div className="pl-6 space-y-2">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="flex items-center gap-2">
          <Skeleton className="h-4 w-[88px] sm:w-[158px]" />
          <Skeleton className="h-[40px] sm:h-[30px] flex-1" />
        </div>
      ))}
    </div>
  )
}

function DifficultyPieChartSkeleton() {
  return (
    <div className="flex items-center justify-center h-[250px] w-[250px] mx-auto">
      <Skeleton className="h-[192px] w-[192px] rounded-full" />
    </div>
  )
}

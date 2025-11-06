const API_URL = 'https://opentdb.com'

export interface Category {
    id: number
    name: string
}

export interface Question {
    category: string
    type: string
    difficulty: string
    question: string
    correct_answer: string
    incorrect_answers: string[]
}

export async function fetchCategories(): Promise<Category[]> {
    const params = new URLSearchParams({
        encode: 'url3986'
    })
    const response = await fetch(`${API_URL}/api_category.php?${params}`)
    if (!response.ok) {
        throw new Error('Failed to fetch categories')
    }
    try {
        const data = await response.json() as { trivia_categories: Category[] }
        return data.trivia_categories.map(cat => ({
            ...cat,
            name: decodeURIComponent(cat.name)
        }))
    } catch {
        throw new Error('Failed to parse categories response')
    }
}

export async function fetchQuestions(
    amount: number = 50,
    categoryId?: number
): Promise<Question[]> {
    const params = new URLSearchParams({
        amount: amount.toString(),
        encode: 'url3986'
    })

    if (categoryId) {
        params.append('category', categoryId.toString())
    }

    const response = await fetch(`${API_URL}/api.php?${params}`)
    if (!response.ok) {
        throw new Error('Failed to fetch questions')
    }

    let data: { response_code: number; results: Question[] }
    try {
        data = await response.json()
    } catch {
        throw new Error('Failed to parse questions response')
    }

    if (data.response_code !== 0) {
        throw new Error(`API error: response code ${data.response_code}`)
    }

    return data.results.map(q => ({
        category: decodeURIComponent(q.category),
        type: decodeURIComponent(q.type),
        difficulty: decodeURIComponent(q.difficulty),
        question: decodeURIComponent(q.question),
        correct_answer: decodeURIComponent(q.correct_answer),
        incorrect_answers: q.incorrect_answers.map(decodeURIComponent)
    }))
}


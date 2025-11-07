const API_URL = 'https://opentdb.com'

const ERROR_MESSAGES: Record<number, string> = {
    1: 'No results: The API doesn\'t have enough questions for your query.',
    2: 'Invalid parameter: Arguments passed in aren\'t valid.',
    3: 'Token not found: Session Token does not exist.',
    4: 'Token empty: Session Token has returned all possible questions. Resetting the Token is necessary.',
    5: 'Rate limit: Too many requests. Each IP can only access the API once every 5 seconds.',
}

function handleResponseCode(responseCode: number, context?: string): void {
    if (responseCode !== 0) {
        const errorMessage = ERROR_MESSAGES[responseCode] || `API error: response code ${responseCode}`
        const prefix = context ? `${context}: ` : ''
        throw new Error(`${prefix}${errorMessage}`)
    }
}

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

export async function getSessionToken(): Promise<string> {
    const response = await fetch(`${API_URL}/api_token.php?command=request`)
    if (!response.ok) {
        throw new Error('Failed to fetch session token')
    }
    try {
        const data = await response.json() as { response_code: number; token: string }
        handleResponseCode(data.response_code, 'Failed to get session token')
        return data.token
    } catch (error) {
        if (error instanceof Error && error.message.startsWith('Failed to get session token')) {
            throw error
        }
        throw new Error('Failed to parse session token response')
    }
}

export async function fetchQuestions(
    amount: number = 50,
    categoryId?: number,
    token?: string
): Promise<Question[]> {
    const params = new URLSearchParams({
        amount: amount.toString(),
        encode: 'url3986'
    })

    if (categoryId) {
        params.append('category', categoryId.toString())
    }

    if (token) {
        params.append('token', token)
    }

    const response = await fetch(`${API_URL}/api.php?${params}`)
    if (!response.ok) {
        throw new Error('Failed to fetch questions')
    }

    let data: {
        response_code: number
        results: Question[]
        token?: string
    }
    try {
        data = await response.json()
    } catch {
        throw new Error('Failed to parse questions response')
    }

    handleResponseCode(data.response_code)

    return data.results.map(q => ({
        category: decodeURIComponent(q.category),
        type: decodeURIComponent(q.type),
        difficulty: decodeURIComponent(q.difficulty),
        question: decodeURIComponent(q.question),
        correct_answer: decodeURIComponent(q.correct_answer),
        incorrect_answers: q.incorrect_answers.map(decodeURIComponent)
    }))
}


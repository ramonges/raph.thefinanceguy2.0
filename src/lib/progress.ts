import { SupabaseClient } from '@supabase/supabase-js'

/**
 * Save user's current position in a section
 */
export async function saveUserProgress(
  supabase: SupabaseClient,
  userId: string,
  section: string,
  currentQuestionIndex: number,
  blockType?: string | null,
  assetCategory?: string | null,
  strategyCategory?: string | null
) {
  try {
    await supabase
      .from('user_section_progress')
      .upsert({
        user_id: userId,
        section,
        current_question_index: currentQuestionIndex,
        block_type: blockType || null,
        asset_category: assetCategory || null,
        strategy_category: strategyCategory || null,
        updated_at: new Date().toISOString(),
      }, {
        onConflict: 'user_id,section',
      })
  } catch (error) {
    console.error('Error saving user progress:', error)
  }
}

/**
 * Load user's last position in a section
 * Returns the question index, or 0 if no progress found
 */
export async function loadUserProgress(
  supabase: SupabaseClient,
  userId: string,
  section: string
): Promise<number> {
  try {
    const { data, error } = await supabase
      .from('user_section_progress')
      .select('current_question_index')
      .eq('user_id', userId)
      .eq('section', section)
      .single()

    if (error || !data) {
      // No progress found, check answered questions as fallback
      return await loadProgressFromAnsweredQuestions(supabase, userId, section)
    }

    return data.current_question_index
  } catch (error) {
    console.error('Error loading user progress:', error)
    // Fallback to answered questions
    return await loadProgressFromAnsweredQuestions(supabase, userId, section)
  }
}

/**
 * Fallback: Load progress from answered questions
 * This ensures backward compatibility with existing data
 */
async function loadProgressFromAnsweredQuestions(
  supabase: SupabaseClient,
  userId: string,
  section: string
): Promise<number> {
  try {
    const { data: answeredQuestions } = await supabase
      .from('user_answered_questions')
      .select('question_number')
      .eq('user_id', userId)
      .eq('section', section)
      .order('question_number', { ascending: false })
      .limit(1)

    if (answeredQuestions && answeredQuestions.length > 0) {
      // Return the last answered question number (1-indexed) as 0-indexed
      return answeredQuestions[0].question_number - 1
    }

    return 0
  } catch (error) {
    console.error('Error loading progress from answered questions:', error)
    return 0
  }
}

/**
 * Mark a question as wrong and add to missed questions
 */
export async function markQuestionAsWrong(
  supabase: SupabaseClient,
  userId: string,
  section: string,
  questionNumber: number,
  questionText: string,
  correctAnswer: string,
  blockType?: string | null,
  assetCategory?: string | null,
  strategyCategory?: string | null
) {
  try {
    await supabase
      .from('user_missed_questions')
      .upsert({
        user_id: userId,
        section,
        question_number: questionNumber,
        question_text: questionText,
        correct_answer: correctAnswer,
        reviewed: false,
        understood: false,
        block_type: blockType || null,
        asset_category: assetCategory || null,
        strategy_category: strategyCategory || null,
        user_attempted_at: new Date().toISOString(),
      }, {
        onConflict: 'user_id,section,question_number',
      })
  } catch (error) {
    console.error('Error marking question as wrong:', error)
  }
}


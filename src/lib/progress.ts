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
    // Validate inputs
    if (!userId || !section || currentQuestionIndex < 0) {
      console.warn('⚠️ Invalid parameters for saveUserProgress:', { userId, section, currentQuestionIndex })
      return
    }

    const { data, error } = await supabase
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

    if (error) {
      console.error('❌ Error saving user progress:', error)
      console.error('Details:', { userId, section, currentQuestionIndex, blockType, assetCategory, strategyCategory })
      // If table doesn't exist, log a helpful message
      if (error.message?.includes('relation') || error.message?.includes('does not exist')) {
        console.error('⚠️ user_section_progress table does not exist! Please run the SQL script in Supabase.')
      }
      // If RLS policy issue
      if (error.message?.includes('permission') || error.message?.includes('policy')) {
        console.error('⚠️ RLS policy issue! Check that user is authenticated and policies are set correctly.')
      }
    } else {
      console.log(`✅ Progress saved successfully: ${section} -> question ${currentQuestionIndex + 1} (index ${currentQuestionIndex})`)
    }
  } catch (error) {
    console.error('❌ Exception saving user progress:', error)
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
    // Validate inputs
    if (!userId || !section) {
      console.warn('⚠️ Invalid parameters for loadUserProgress:', { userId, section })
      return 0
    }

    const { data, error } = await supabase
      .from('user_section_progress')
      .select('current_question_index')
      .eq('user_id', userId)
      .eq('section', section)
      .single()

    if (error) {
      // If table doesn't exist, log a helpful message
      if (error.message?.includes('relation') || error.message?.includes('does not exist')) {
        console.error('⚠️ user_section_progress table does not exist! Please run the SQL script in Supabase.')
        console.log('📝 Falling back to answered_questions table...')
      } else if (error.code === 'PGRST116') {
        // No rows returned (expected if no progress saved yet)
        console.log(`ℹ️ No saved progress found for ${section}, starting from beginning`)
        return 0
      } else {
        console.error('❌ Error loading user progress:', error)
        console.error('Details:', { userId, section, errorCode: error.code, errorMessage: error.message })
      }
      // No progress found, check answered questions as fallback
      const fallbackIndex = await loadProgressFromAnsweredQuestions(supabase, userId, section)
      console.log(`📊 Loaded progress from fallback: ${section} -> question ${fallbackIndex + 1}`)
      return fallbackIndex
    }

    if (!data) {
      // No progress found, check answered questions as fallback
      const fallbackIndex = await loadProgressFromAnsweredQuestions(supabase, userId, section)
      console.log(`📊 Loaded progress from fallback (no data): ${section} -> question ${fallbackIndex + 1}`)
      return fallbackIndex
    }

    console.log(`✅ Loaded progress: ${section} -> question ${data.current_question_index + 1} (index ${data.current_question_index})`)
    return data.current_question_index
  } catch (error) {
    console.error('❌ Exception loading user progress:', error)
    // Fallback to answered questions
    const fallbackIndex = await loadProgressFromAnsweredQuestions(supabase, userId, section)
    console.log(`📊 Loaded progress from fallback (exception): ${section} -> question ${fallbackIndex + 1}`)
    return fallbackIndex
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
      // This means if user answered question 10, they should resume at question 10 (index 9)
      // But we want them to continue from where they left off, so return the index they were at
      // If they answered question 10, they were at index 9, so next question is index 10
      const lastAnswered = answeredQuestions[0].question_number
      // Return the index of the last answered question (so they continue from next)
      return lastAnswered - 1
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


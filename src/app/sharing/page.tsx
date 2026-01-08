'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import DashboardNav from '@/components/DashboardNav'
import Statistics from '@/components/Statistics'
import { Profile, UserStats } from '@/types'
import { detectBlockTypeFromPath, calculateStats } from '@/lib/stats'
import { 
  Share2,
  BarChart3,
  Loader2,
  Plus,
  Heart,
  MessageCircle,
  Calendar,
  X,
  Send,
  Building2,
  Briefcase
} from 'lucide-react'

const emptyStats: UserStats = {
  overall: { total: 0, correct: 0, wrong: 0, percentage: 0 },
  byCategory: {}
}

interface Article {
  id: string
  user_id: string
  title: string
  content: string
  category: 'Interview Questions' | 'Interview Feedback' | 'General Comment' | 'Compensation'
  company_type: 'bank' | 'hedge fund' | null
  created_at: string
  updated_at: string
  author_name?: string
  author_avatar?: string
  like_count?: number
  comment_count?: number
  user_liked?: boolean
}

interface Comment {
  id: string
  article_id: string
  user_id: string
  content: string
  created_at: string
  author_name?: string
  author_avatar?: string
}

export default function SharingPage() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [userId, setUserId] = useState<string | null>(null)
  const [stats, setStats] = useState<UserStats>(emptyStats)
  const [showStats, setShowStats] = useState(false)
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [showPublishModal, setShowPublishModal] = useState(false)
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null)
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState('')
  const [publishForm, setPublishForm] = useState({
    title: '',
    content: '',
    category: 'General Comment' as Article['category'],
    company_type: null as 'bank' | 'hedge fund' | null
  })
  const router = useRouter()
  const supabase = createClient()

  // Fetch user and articles
  useEffect(() => {
    async function initialize() {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        
        if (!user) {
          router.push('/login')
          return
        }

        setUserId(user.id)

        // Fetch profile
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single()

        if (profileData) {
          setProfile(profileData)
        }

        // Fetch answered questions for stats
        const { data: answeredQuestions } = await supabase
          .from('user_answered_questions')
          .select('*')
          .eq('user_id', user.id)

        if (answeredQuestions) {
          const blockType = detectBlockTypeFromPath('/sharing')
          const calculatedStats = calculateStats(answeredQuestions, blockType)
          setStats(calculatedStats)
        }
      } catch (error) {
        console.error('Error initializing:', error)
      } finally {
        setLoading(false)
      }
    }

    initialize()
  }, [router, supabase])

  // Reload articles when userId changes or loadArticles function changes
  useEffect(() => {
    if (userId) {
      loadArticles()
    }
  }, [userId, loadArticles])

  const loadArticles = useCallback(async () => {
    try {
      // Fetch articles
      const { data: articlesData, error: articlesError } = await supabase
        .from('articles')
        .select('*')
        .order('created_at', { ascending: false })

      if (articlesError) {
        console.error('Error fetching articles:', articlesError)
        throw articlesError
      }

      if (!articlesData || articlesData.length === 0) {
        setArticles([])
        return
      }

      // Fetch profiles for all article authors
      const userIds = [...new Set(articlesData.map((a: any) => a.user_id))]
      const { data: profilesData } = await supabase
        .from('profiles')
        .select('id, full_name, avatar_url')
        .in('id', userIds)

      // Create a map of user_id to profile
      const profilesMap = new Map()
      if (profilesData) {
        profilesData.forEach((profile: any) => {
          profilesMap.set(profile.id, profile)
        })
      }

      // Fetch like counts and check if user liked
      const { data: likesData } = await supabase
        .from('article_likes')
        .select('article_id, user_id')

      // Fetch comment counts
      const { data: commentsData } = await supabase
        .from('article_comments')
        .select('article_id')

      // Process articles
      const processedArticles = articlesData.map((article: any) => {
        const profile = profilesMap.get(article.user_id)
        const likeCount = likesData?.filter((l: any) => l.article_id === article.id).length || 0
        const commentCount = commentsData?.filter((c: any) => c.article_id === article.id).length || 0
        const userLiked = userId ? likesData?.some((l: any) => l.article_id === article.id && l.user_id === userId) || false : false

        return {
          ...article,
          author_name: profile?.full_name || 'Anonymous',
          author_avatar: profile?.avatar_url || null,
          like_count: likeCount,
          comment_count: commentCount,
          user_liked: userLiked
        }
      })

      setArticles(processedArticles)
    } catch (error) {
      console.error('Error loading articles:', error)
      // Set empty array on error so UI doesn't break
      setArticles([])
    }
  }, [userId, supabase])

  const handlePublish = async () => {
    if (!userId || !publishForm.title.trim() || !publishForm.content.trim()) {
      return
    }

    try {
      const { error } = await supabase
        .from('articles')
        .insert({
          user_id: userId,
          title: publishForm.title.trim(),
          content: publishForm.content.trim(),
          category: publishForm.category,
          company_type: publishForm.category === 'Interview Questions' ? publishForm.company_type : null
        })

      if (error) throw error

      // Reset form and reload articles
      setPublishForm({
        title: '',
        content: '',
        category: 'General Comment',
        company_type: null
      })
      setShowPublishModal(false)
      await loadArticles()
    } catch (error) {
      console.error('Error publishing article:', error)
      alert('Failed to publish article. Please try again.')
    }
  }

  const handleLike = async (articleId: string, currentlyLiked: boolean) => {
    if (!userId) return

    try {
      if (currentlyLiked) {
        // Unlike
        const { error } = await supabase
          .from('article_likes')
          .delete()
          .eq('article_id', articleId)
          .eq('user_id', userId)

        if (error) throw error
      } else {
        // Like
        const { error } = await supabase
          .from('article_likes')
          .insert({
            article_id: articleId,
            user_id: userId
          })

        if (error) throw error
      }

      await loadArticles()
    } catch (error) {
      console.error('Error toggling like:', error)
    }
  }

  const handleViewArticle = async (article: Article) => {
    setSelectedArticle(article)
    
    // Load comments for this article
    const { data: commentsData, error: commentsError } = await supabase
      .from('article_comments')
      .select('*')
      .eq('article_id', article.id)
      .order('created_at', { ascending: true })

    if (commentsError) {
      console.error('Error fetching comments:', commentsError)
      setComments([])
      return
    }

    if (commentsData && commentsData.length > 0) {
      // Fetch profiles for comment authors
      const commentUserIds = [...new Set(commentsData.map((c: any) => c.user_id))]
      const { data: profilesData } = await supabase
        .from('profiles')
        .select('id, full_name, avatar_url')
        .in('id', commentUserIds)

      // Create a map of user_id to profile
      const profilesMap = new Map()
      if (profilesData) {
        profilesData.forEach((profile: any) => {
          profilesMap.set(profile.id, profile)
        })
      }

      // Process comments
      const processedComments = commentsData.map((comment: any) => {
        const profile = profilesMap.get(comment.user_id)
        return {
          ...comment,
          author_name: profile?.full_name || 'Anonymous',
          author_avatar: profile?.avatar_url || null
        }
      })
      setComments(processedComments)
    } else {
      setComments([])
    }
  }

  const handleAddComment = async () => {
    if (!userId || !selectedArticle || !newComment.trim()) return

    try {
      const { error } = await supabase
        .from('article_comments')
        .insert({
          article_id: selectedArticle.id,
          user_id: userId,
          content: newComment.trim()
        })

      if (error) throw error

      setNewComment('')
      await handleViewArticle(selectedArticle) // Reload comments
      await loadArticles() // Update comment count
    } catch (error) {
      console.error('Error adding comment:', error)
      alert('Failed to add comment. Please try again.')
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 7) return `${diffDays}d ago`
    return date.toLocaleDateString()
  }

  if (loading) {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#f97316]" />
      </div>
    )
  }

  return (
    <div className="min-h-screen gradient-bg">
      <DashboardNav 
        profile={profile} 
        onOpenStats={() => setShowStats(true)}
      />

      <main className="pt-20 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold mb-2">Sharing</h1>
              <p className="text-[#9ca3af]">Share your interview experiences and insights</p>
            </div>
            <button
              onClick={() => setShowPublishModal(true)}
              className="btn-primary flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              <span className="hidden sm:inline">Publish Article</span>
              <span className="sm:hidden">Publish</span>
            </button>
          </div>

          {/* Articles List */}
          <div className="space-y-4">
            {articles.length === 0 ? (
              <div className="bg-[#111827] border border-[#1f2937] rounded-2xl p-12 text-center">
                <Share2 className="w-12 h-12 text-[#6b7280] mx-auto mb-4" />
                <p className="text-[#9ca3af]">No articles yet. Be the first to share!</p>
              </div>
            ) : (
              articles.map((article) => (
                <div
                  key={article.id}
                  className="bg-[#111827] border border-[#1f2937] rounded-xl p-6 hover:border-[#374151] transition-colors cursor-pointer"
                  onClick={() => handleViewArticle(article)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold mb-2">{article.title}</h3>
                      <div className="flex items-center gap-3 text-sm text-[#6b7280] mb-3">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {formatDate(article.created_at)}
                        </span>
                        <span className="px-2 py-1 bg-[#1f2937] rounded text-xs">
                          {article.category}
                        </span>
                        {article.company_type && (
                          <span className="flex items-center gap-1 px-2 py-1 bg-[#1f2937] rounded text-xs">
                            {article.company_type === 'bank' ? (
                              <Building2 className="w-3 h-3" />
                            ) : (
                              <Briefcase className="w-3 h-3" />
                            )}
                            {article.company_type}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-[#9ca3af]">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleLike(article.id, article.user_liked || false)
                      }}
                      className={`flex items-center gap-2 hover:text-[#f97316] transition-colors ${
                        article.user_liked ? 'text-[#f97316]' : ''
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${article.user_liked ? 'fill-current' : ''}`} />
                      <span>{article.like_count || 0}</span>
                    </button>
                    <div className="flex items-center gap-2">
                      <MessageCircle className="w-4 h-4" />
                      <span>{article.comment_count || 0}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>

      {/* Publish Modal */}
      {showPublishModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#111827] border border-[#1f2937] rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Publish Article</h2>
              <button
                onClick={() => setShowPublishModal(false)}
                className="text-[#9ca3af] hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Title</label>
                <input
                  type="text"
                  value={publishForm.title}
                  onChange={(e) => setPublishForm({ ...publishForm, title: e.target.value })}
                  placeholder="Enter article title"
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Category</label>
                <select
                  value={publishForm.category}
                  onChange={(e) => setPublishForm({ 
                    ...publishForm, 
                    category: e.target.value as Article['category'],
                    company_type: e.target.value !== 'Interview Questions' ? null : publishForm.company_type
                  })}
                  className="w-full bg-[#111827] border border-[#1f2937] rounded-lg px-4 py-2 text-white"
                >
                  <option value="Interview Questions">Interview Questions</option>
                  <option value="Interview Feedback">Interview Feedback</option>
                  <option value="General Comment">General Comment</option>
                  <option value="Compensation">Compensation</option>
                </select>
              </div>

              {publishForm.category === 'Interview Questions' && (
                <div>
                  <label className="block text-sm font-medium mb-2">Company Type</label>
                  <select
                    value={publishForm.company_type || ''}
                    onChange={(e) => setPublishForm({ 
                      ...publishForm, 
                      company_type: e.target.value as 'bank' | 'hedge fund' | null
                    })}
                    className="w-full bg-[#111827] border border-[#1f2937] rounded-lg px-4 py-2 text-white"
                  >
                    <option value="">Select company type</option>
                    <option value="bank">Bank</option>
                    <option value="hedge fund">Hedge Fund</option>
                  </select>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium mb-2">Content</label>
                <textarea
                  value={publishForm.content}
                  onChange={(e) => setPublishForm({ ...publishForm, content: e.target.value })}
                  placeholder="Write your article content here..."
                  rows={10}
                  className="w-full"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowPublishModal(false)}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
                <button
                  onClick={handlePublish}
                  disabled={!publishForm.title.trim() || !publishForm.content.trim() || (publishForm.category === 'Interview Questions' && !publishForm.company_type)}
                  className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Publish
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Article Detail Modal */}
      {selectedArticle && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#111827] border border-[#1f2937] rounded-2xl p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">{selectedArticle.title}</h2>
              <button
                onClick={() => {
                  setSelectedArticle(null)
                  setComments([])
                  setNewComment('')
                }}
                className="text-[#9ca3af] hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="mb-6">
              <div className="flex items-center gap-3 text-sm text-[#6b7280] mb-4">
                <span>{formatDate(selectedArticle.created_at)}</span>
                <span className="px-2 py-1 bg-[#1f2937] rounded text-xs">
                  {selectedArticle.category}
                </span>
                {selectedArticle.company_type && (
                  <span className="flex items-center gap-1 px-2 py-1 bg-[#1f2937] rounded text-xs">
                    {selectedArticle.company_type === 'bank' ? (
                      <Building2 className="w-3 h-3" />
                    ) : (
                      <Briefcase className="w-3 h-3" />
                    )}
                    {selectedArticle.company_type}
                  </span>
                )}
              </div>

              <div className="prose prose-invert max-w-none">
                <p className="text-[#e8eaed] whitespace-pre-wrap">{selectedArticle.content}</p>
              </div>
            </div>

            <div className="border-t border-[#1f2937] pt-6">
              <div className="flex items-center gap-4 mb-6">
                <button
                  onClick={() => handleLike(selectedArticle.id, selectedArticle.user_liked || false)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                    selectedArticle.user_liked 
                      ? 'bg-[#f97316]/10 text-[#f97316]' 
                      : 'bg-[#1f2937] text-[#9ca3af] hover:text-white'
                  }`}
                >
                  <Heart className={`w-5 h-5 ${selectedArticle.user_liked ? 'fill-current' : ''}`} />
                  <span>{selectedArticle.like_count || 0}</span>
                </button>
                <div className="flex items-center gap-2 text-[#9ca3af]">
                  <MessageCircle className="w-5 h-5" />
                  <span>{selectedArticle.comment_count || 0} comments</span>
                </div>
              </div>

              {/* Comments Section */}
              <div className="space-y-4 mb-4">
                {comments.map((comment) => (
                  <div key={comment.id} className="bg-[#1a1f2e] rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-2">
                      {comment.author_avatar ? (
                        <img
                          src={comment.author_avatar}
                          alt={comment.author_name}
                          className="w-8 h-8 rounded-full"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-[#374151] flex items-center justify-center">
                          <span className="text-xs text-[#9ca3af]">
                            {comment.author_name?.[0]?.toUpperCase() || 'A'}
                          </span>
                        </div>
                      )}
                      <div>
                        <p className="text-sm font-medium">{comment.author_name}</p>
                        <p className="text-xs text-[#6b7280]">{formatDate(comment.created_at)}</p>
                      </div>
                    </div>
                    <p className="text-[#e8eaed]">{comment.content}</p>
                  </div>
                ))}
              </div>

              {/* Add Comment */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleAddComment()
                    }
                  }}
                  placeholder="Write a comment..."
                  className="flex-1"
                />
                <button
                  onClick={handleAddComment}
                  className="btn-primary px-4"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Statistics Modal */}
      {showStats && (
        <Statistics 
          stats={stats} 
          onClose={() => setShowStats(false)} 
          blockType={null}
          userId={userId || ''}
          showGlobalStats={true}
        />
      )}
    </div>
  )
}


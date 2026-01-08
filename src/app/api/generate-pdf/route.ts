import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { generateLatexSource } from '@/lib/latex-generator'
import { InterviewFlow } from '@/data/customInterviewQuestions'
import { exec } from 'child_process'
import { promisify } from 'util'
import { writeFile, unlink, mkdir } from 'fs/promises'
import { join } from 'path'
import { tmpdir } from 'os'

const execAsync = promisify(exec)

/**
 * API route to generate PDF from LaTeX
 * This route generates LaTeX source code and compiles it to PDF using pdflatex
 * 
 * Requirements:
 * - pdflatex must be installed on the server
 * - For Vercel/serverless, consider using a Docker-based LaTeX service or external API
 */
export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get interview flow data from request
    const body = await request.json()
    const interviewFlow: InterviewFlow = body.interviewFlow

    if (!interviewFlow) {
      return NextResponse.json({ error: 'Interview flow data is required' }, { status: 400 })
    }

    // Generate LaTeX source
    const latexSource = generateLatexSource(interviewFlow)

    // Try to compile LaTeX to PDF
    try {
      // Create temporary directory for LaTeX compilation
      const tempDir = join(tmpdir(), `latex-${Date.now()}`)
      await mkdir(tempDir, { recursive: true })

      const texFilePath = join(tempDir, 'interview.tex')
      const pdfFilePath = join(tempDir, 'interview.pdf')

      // Write LaTeX source to file
      await writeFile(texFilePath, latexSource, 'utf-8')

      // Compile LaTeX to PDF (requires pdflatex to be installed)
      // Run pdflatex twice to ensure references are resolved
      try {
        await execAsync(`pdflatex -interaction=nonstopmode -output-directory="${tempDir}" "${texFilePath}"`, {
          timeout: 30000, // 30 second timeout
        })
        await execAsync(`pdflatex -interaction=nonstopmode -output-directory="${tempDir}" "${texFilePath}"`, {
          timeout: 30000,
        })

        // Read the generated PDF
        const fs = await import('fs/promises')
        const pdfBuffer = await fs.readFile(pdfFilePath)

        // Clean up temporary files
        try {
          await unlink(texFilePath)
          await unlink(pdfFilePath)
          await unlink(join(tempDir, 'interview.aux'))
          await unlink(join(tempDir, 'interview.log'))
          await unlink(join(tempDir, 'interview.toc'))
          await unlink(join(tempDir, 'interview.out'))
        } catch (cleanupError) {
          // Ignore cleanup errors
        }

        // Return PDF as binary
        return new NextResponse(pdfBuffer, {
          headers: {
            'Content-Type': 'application/pdf',
            'Content-Disposition': `attachment; filename="${interviewFlow.track}-${interviewFlow.companyType}-interview.pdf"`,
          },
        })
      } catch (compileError) {
        // pdflatex not available or compilation failed
        console.warn('LaTeX compilation failed, returning source:', compileError)
        
        // Clean up on error
        try {
          await unlink(texFilePath).catch(() => {})
          await unlink(pdfFilePath).catch(() => {})
        } catch {}

        // Fallback: return LaTeX source
        return NextResponse.json({
          latexSource,
          message: 'LaTeX compilation not available. LaTeX source provided. Upload to Overleaf.com or compile locally with pdflatex.',
        })
      }
    } catch (error) {
      console.error('Error in PDF generation process:', error)
      
      // Fallback: return LaTeX source
      return NextResponse.json({
        latexSource,
        message: 'LaTeX compilation not available. LaTeX source provided. Upload to Overleaf.com or compile locally with pdflatex.',
      })
    }
  } catch (error) {
    console.error('Error generating PDF:', error)
    return NextResponse.json(
      { error: 'Failed to generate PDF' },
      { status: 500 }
    )
  }
}


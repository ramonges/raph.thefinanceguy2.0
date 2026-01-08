import { InterviewFlow } from '@/data/customInterviewQuestions'

/**
 * Escapes LaTeX special characters in text
 */
function escapeLatex(text: string): string {
  return text
    .replace(/\\/g, '\\textbackslash{}')
    .replace(/\{/g, '\\{')
    .replace(/\}/g, '\\}')
    .replace(/\$/g, '\\$')
    .replace(/\&/g, '\\&')
    .replace(/\#/g, '\\#')
    .replace(/\^/g, '\\textasciicircum{}')
    .replace(/\_/g, '\\_')
    .replace(/\~/g, '\\textasciitilde{}')
    .replace(/\%/g, '\\%')
}

/**
 * Generates LaTeX source code for the interview PDF
 */
export function generateLatexSource(interviewFlow: InterviewFlow): string {
  const escapedTitle = escapeLatex(interviewFlow.title)
  const escapedGoal = escapeLatex(interviewFlow.goal)
  const escapedMindset = escapeLatex(interviewFlow.mindset)

  let latex = `\\documentclass[11pt,a4paper]{article}
\\usepackage[utf8]{inputenc}
\\usepackage[T1]{fontenc}
\\usepackage[margin=2.5cm]{geometry}
\\usepackage{amsmath}
\\usepackage{amsfonts}
\\usepackage{amssymb}
\\usepackage{enumitem}
\\usepackage{xcolor}
\\usepackage{titlesec}
\\usepackage{fancyhdr}
\\usepackage{tcolorbox}
\\usepackage{hyperref}

% Colors
\\definecolor{primary}{RGB}{249, 115, 22}
\\definecolor{secondary}{RGB}{31, 41, 55}
\\definecolor{accent}{RGB}{99, 102, 241}
\\definecolor{hintbg}{RGB}{31, 41, 55}
\\definecolor{answerbg}{RGB}{10, 15, 26}

% Page style
\\pagestyle{fancy}
\\fancyhf{}
\\fancyhead[L]{\\textcolor{gray}{Custom Mock Interview}}
\\fancyhead[R]{\\textcolor{gray}{\\today}}
\\fancyfoot[C]{\\textcolor{gray}{\\thepage}}
\\renewcommand{\\headrulewidth}{0pt}

% Section formatting
\\titleformat{\\section}
  {\\Large\\bfseries\\color{primary}}
  {}
  {0em}
  {}
  [\\titlerule[0.8pt]]

\\titleformat{\\subsection}
  {\\large\\bfseries\\color{secondary}}
  {}
  {0em}
  {}

% Custom environments
\\newtcolorbox{hintbox}{
  colback=hintbg,
  colframe=accent,
  boxrule=0.5pt,
  left=8pt,
  right=8pt,
  top=6pt,
  bottom=6pt,
  arc=3pt
}

\\newtcolorbox{answerbox}{
  colback=answerbg,
  colframe=gray,
  boxrule=0.5pt,
  left=8pt,
  right=8pt,
  top=6pt,
  bottom=6pt,
  arc=3pt
}

\\begin{document}

% Title page
\\begin{titlepage}
\\centering
\\vspace*{2cm}
{\\Huge\\bfseries\\color{primary} ` + escapedTitle + `}\\[1cm]
\\vspace{1cm}
{\\Large\\color{secondary} Custom Mock Interview}\\[0.5cm]
\\vspace{2cm}
\\begin{minipage}{0.8\\textwidth}
\\centering
{\\large\\bfseries Goal:}\\[0.3cm]
` + escapedGoal + `\\[1cm]
{\\large\\bfseries Mindset Tested:}\\[0.3cm]
\\textit{"` + escapedMindset + `"}
\\end{minipage}
\\vfill
{\\large Generated on \\today}
\\end{titlepage}

\\newpage
\\tableofcontents
\\newpage

`

  // Generate sections
  interviewFlow.sections.forEach((section, sectionIdx) => {
    const escapedSectionTitle = escapeLatex(section.title)
    const escapedDescription = section.description ? escapeLatex(section.description) : ''

    latex += `\\section{${escapedSectionTitle}}\n\n`
    
    if (section.description) {
      latex += `\\textit{${escapedDescription}}\n\n`
    }

    latex += `\\begin{enumerate}[leftmargin=*, itemsep=1.5em]\n\n`

    section.questions.forEach((question, qIdx) => {
      const escapedQuestion = escapeLatex(question.question)
      const escapedHint = question.hint ? escapeLatex(question.hint) : ''
      const escapedAnswer = escapeLatex(question.answer)

      latex += `\\item \\textbf{${escapedQuestion}}\n\n`

      if (question.hint) {
        latex += `\\begin{hintbox}\n`
        latex += `\\textbf{\\color{accent}Hint:} ${escapedHint}\n`
        latex += `\\end{hintbox}\n\n`
      }

      latex += `\\begin{answerbox}\n`
      latex += `\\textbf{Answer:} ${escapedAnswer}\n`
      latex += `\\end{answerbox}\n\n`
    })

    latex += `\\end{enumerate}\n\n`
    latex += `\\newpage\n\n`
  })

  latex += `\\end{document}`

  return latex
}


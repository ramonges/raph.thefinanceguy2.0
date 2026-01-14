#!/usr/bin/env python3
"""
Transform brainstellar JSON questions to TypeScript format
"""
import json
import re

def clean_text(text):
    """Clean LaTeX and formatting"""
    if not text:
        return ""
    # Remove LaTeX formatting
    text = re.sub(r'\\%', '%', text)
    text = re.sub(r'\\bar\{3\}', '3', text)
    text = re.sub(r'\\pi', 'π', text)
    text = re.sub(r'\\theta', 'θ', text)
    text = re.sub(r'\\cdot', '·', text)
    text = re.sub(r'\\approx', '≈', text)
    text = re.sub(r'\\rightarrow', '→', text)
    text = re.sub(r'\\implies', '⟹', text)
    text = re.sub(r'\\dfrac\{([^}]+)\}\{([^}]+)\}', r'(\1)/(\2)', text)
    text = re.sub(r'\{([^}]+)\}', r'\1', text)
    text = re.sub(r'\s+', ' ', text)
    return text.strip()

def escape_ts(text):
    """Escape for TypeScript strings"""
    if not text:
        return '""'
    return json.dumps(text)

def split_explanation(explanation):
    """Split explanation into array, add credit"""
    if not explanation:
        return ['Credit: brainstellar']
    
    explanation = explanation + " Credit: brainstellar"
    # Split by sentence endings
    sentences = re.split(r'(?<=[.!?])\s+(?=[A-Z])', explanation)
    sentences = [s.strip() for s in sentences if s.strip()]
    if not sentences:
        sentences = [explanation]
    return sentences

def get_target_time(difficulty):
    if difficulty == "easy":
        return 60
    elif difficulty == "medium":
        return 90
    else:
        return 120

def format_question(q):
    """Format question to TypeScript"""
    question_text = clean_text(q.get('problem', q.get('title', '')))
    answer_text = clean_text(q.get('answer', ''))
    hint_text = clean_text(q.get('hint', ''))
    explanation_text = clean_text(q.get('explanation', ''))
    difficulty = q.get('difficulty', 'medium').lower()
    
    explanation_array = split_explanation(explanation_text)
    explanation_lines = ',\n'.join(f'        {escape_ts(s)}' for s in explanation_array)
    
    question_id = q.get('id', 1)
    target_time = get_target_time(difficulty)
    
    return f"""    {{
      id: {question_id},
      question: {escape_ts(question_text)},
      answer: {escape_ts(answer_text)},
      explanation: [
{explanation_lines}
      ],
      hint: {escape_ts(hint_text)},
      difficulty: "{difficulty}",
      targetTime: {target_time},
    }}"""

# The JSON data will be provided in the user query
# This script provides the transformation logic

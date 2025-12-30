// Custom Interview Questions organized by track and company type
// Based on Guide Technical 2025 question bank

export interface InterviewQuestion {
  id: string
  question: string
  answer: string
  hint?: string
  category: 'behavioral' | 'probability' | 'brainteaser' | 'technical' | 'practical' | 'ask'
}

export interface InterviewSection {
  title: string
  description: string
  questions: InterviewQuestion[]
}

export interface InterviewFlow {
  track: 'sales' | 'trading' | 'quant'
  companyType: 'bank' | 'hedge-fund'
  title: string
  goal: string
  mindset: string
  sections: InterviewSection[]
}

// Sales - Bank Interview Flow
export const salesBankFlow: InterviewFlow = {
  track: 'sales',
  companyType: 'bank',
  title: 'SALES — BANK INTERVIEW FLOW',
  goal: 'Client-facing, product intuition, communication',
  mindset: 'Can you explain markets to clients and support flow?',
  sections: [
    {
      title: '1. Behavioral (4)',
      description: '',
      questions: [
        {
          id: 'sb-beh-1',
          question: 'Why Sales & Trading rather than Investment Banking?',
          answer: 'Focus on client relationships, market dynamics, and real-time problem solving. Emphasize interest in markets, client interaction, and the fast-paced environment. Show understanding that sales & trading involves explaining complex products to clients and supporting their trading needs.',
          category: 'behavioral'
        },
        {
          id: 'sb-beh-2',
          question: 'Tell me about a time you explained a complex concept to a non-expert.',
          answer: 'Use STAR method: Situation (context), Task (what needed explaining), Action (how you simplified), Result (understanding achieved). Emphasize breaking down complexity, using analogies, checking for understanding, and adapting communication style.',
          category: 'behavioral'
        },
        {
          id: 'sb-beh-3',
          question: 'Describe a stressful client interaction.',
          answer: 'Show how you handled pressure, maintained professionalism, and resolved the issue. Emphasize listening, empathy, problem-solving, and follow-up. Demonstrate ability to stay calm under pressure.',
          category: 'behavioral'
        },
        {
          id: 'sb-beh-4',
          question: 'How do you stay informed about markets daily?',
          answer: 'Mention specific sources: Bloomberg, Financial Times, WSJ, market commentary, research reports. Show systematic approach: morning routine, key indicators tracked, how you synthesize information. Demonstrate genuine interest and habit.',
          category: 'behavioral'
        }
      ]
    },
    {
      title: '2. Probability / Mental Math (2)',
      description: '',
      questions: [
        {
          id: 'sb-prob-1',
          question: 'Probability of exactly two heads in three coin flips.',
          answer: 'There are 3 ways: HHT, HTH, THH. Total outcomes = 8. Probability = 3/8 = 37.5%',
          category: 'probability'
        },
        {
          id: 'sb-prob-2',
          question: '1% of $250 million — answer mentally.',
          answer: '0.01 × 250,000,000 = 2,500,000 or $2.5 million',
          category: 'probability'
        }
      ]
    },
    {
      title: '3. Brain Teasers (2) — Medium',
      description: '',
      questions: [
        {
          id: 'sb-brain-1',
          question: 'Why are manhole covers round?',
          answer: 'Round covers cannot fall through the hole (unlike square ones which can be rotated diagonally). Also easier to roll and manufacture. Shows practical thinking and problem-solving approach.',
          category: 'brainteaser'
        },
        {
          id: 'sb-brain-2',
          question: 'How many tennis balls fit in a bus?',
          answer: 'Estimate: Bus volume ≈ 10m × 2.5m × 3m = 75 m³ = 75,000 L. Tennis ball volume ≈ 0.15 L. Account for packing efficiency (~60%): 75,000 × 0.6 / 0.15 ≈ 300,000 balls. Show estimation methodology.',
          category: 'brainteaser'
        }
      ]
    },
    {
      title: '4. Technical (Product intuition, not pricing)',
      description: '',
      questions: [
        {
          id: 'sb-tech-1',
          question: 'What is an option? Why would a client use one?',
          answer: 'An option gives the right (not obligation) to buy (call) or sell (put) an asset at a set price. Clients use options for: hedging (protect downside), speculation (leverage), income generation (selling options), or strategic positioning (complex strategies).',
          category: 'technical'
        },
        {
          id: 'sb-tech-2',
          question: 'Difference between implied and historical volatility.',
          answer: 'Historical volatility: actual past price movements, backward-looking. Implied volatility: market\'s expectation of future volatility, derived from option prices, forward-looking. IV reflects market sentiment and demand for options.',
          category: 'technical'
        },
        {
          id: 'sb-tech-3',
          question: 'What is a call spread in simple terms?',
          answer: 'Buy a call at lower strike, sell a call at higher strike. Limits both upside (capped profit) and downside (limited loss). Cheaper than buying a call outright. Used when expecting moderate price increase.',
          category: 'technical'
        }
      ]
    },
    {
      title: '5. Practical Exercise (Light)',
      description: '',
      questions: [
        {
          id: 'sb-prac-1',
          question: 'Explain to a client why volatility increased after a central bank announcement.',
          answer: 'Central bank announcements create uncertainty about future policy and economic conditions. Markets react to unexpected information, causing larger price swings. Options become more expensive as demand for protection increases. Use simple language, avoid jargon.',
          category: 'practical'
        }
      ]
    },
    {
      title: '6. Ask Questions',
      description: '',
      questions: [
        {
          id: 'sb-ask-1',
          question: 'How does sales interact with trading on busy days?',
          answer: 'This shows interest in the day-to-day operations and team dynamics.',
          category: 'ask'
        },
        {
          id: 'sb-ask-2',
          question: 'What makes a junior salesperson successful early?',
          answer: 'This demonstrates interest in growth and understanding of success factors.',
          category: 'ask'
        }
      ]
    }
  ]
}

// Sales - Hedge Fund Interview Flow
export const salesHedgeFundFlow: InterviewFlow = {
  track: 'sales',
  companyType: 'hedge-fund',
  title: 'SALES — HEDGE FUND INTERVIEW FLOW',
  goal: 'Market intuition + idea communication',
  mindset: 'Can you pitch ideas clearly?',
  sections: [
    {
      title: '1. Behavioral (4)',
      description: '',
      questions: [
        {
          id: 'sh-beh-1',
          question: 'Pitch a trade idea you like.',
          answer: 'Structure: Thesis (why), Setup (what), Risk (downside), Conviction (size). Be specific, show market knowledge, demonstrate clear thinking. Example: Long volatility trade ahead of earnings, or relative value trade between correlated assets.',
          category: 'behavioral'
        },
        {
          id: 'sh-beh-2',
          question: 'How do you convince someone your idea is right?',
          answer: 'Use data and logic, acknowledge counterarguments, show conviction but remain open to feedback. Present clearly, anticipate questions, show you\'ve thought through risks. Demonstrate communication and persuasion skills.',
          category: 'behavioral'
        },
        {
          id: 'sh-beh-3',
          question: 'Describe a time you defended a view under pressure.',
          answer: 'Show ability to stand by analysis while remaining open to new information. Demonstrate resilience, logical thinking, and professional handling of disagreement. Show learning from the experience.',
          category: 'behavioral'
        },
        {
          id: 'sh-beh-4',
          question: 'How do you react if your idea is rejected?',
          answer: 'Show maturity: seek feedback, understand reasoning, learn from it, move on. Don\'t take it personally. Demonstrate resilience and growth mindset. Show you can handle rejection professionally.',
          category: 'behavioral'
        }
      ]
    },
    {
      title: '2. Probability / Mental Math (2)',
      description: '',
      questions: [
        {
          id: 'sh-prob-1',
          question: 'Expected value of a trade (given win/loss probabilities).',
          answer: 'EV = (Probability of Win × Win Amount) - (Probability of Loss × Loss Amount). Example: 60% chance of +5%, 40% chance of -3%: EV = 0.6 × 5% - 0.4 × 3% = 3% - 1.2% = 1.8%',
          category: 'probability'
        },
        {
          id: 'sh-prob-2',
          question: 'Daily volatility from annual volatility.',
          answer: 'Daily vol = Annual vol / √252. Example: 20% annual → 20% / √252 ≈ 20% / 15.87 ≈ 1.26% daily. Uses square root of time rule.',
          category: 'probability'
        }
      ]
    },
    {
      title: '3. Brain Teasers (2) — Harder',
      description: '',
      questions: [
        {
          id: 'sh-brain-1',
          question: 'Why diversification reduces risk but not expected return?',
          answer: 'Diversification reduces unsystematic risk (idiosyncratic) through correlation benefits. Expected return is weighted average, unchanged. But portfolio variance decreases due to correlation < 1. Shows understanding of portfolio theory.',
          category: 'brainteaser'
        },
        {
          id: 'sh-brain-2',
          question: 'Why do markets overreact?',
          answer: 'Behavioral biases: herding, anchoring, availability heuristic. Information cascades amplify moves. Fear/greed drive extremes. Markets correct over time as information diffuses. Shows understanding of market psychology.',
          category: 'brainteaser'
        }
      ]
    },
    {
      title: '4. Technical (Idea-level)',
      description: '',
      questions: [
        {
          id: 'sh-tech-1',
          question: 'Difference between directional and relative-value trades.',
          answer: 'Directional: bet on price direction (long/short). Relative value: bet on spread/convergence between related assets, market-neutral. RV has lower risk but requires more sophistication. Shows understanding of strategy types.',
          category: 'technical'
        },
        {
          id: 'sh-tech-2',
          question: 'Why options are useful even if you don\'t know direction.',
          answer: 'Volatility trading (straddles, strangles), relative value (spreads), income generation (covered calls), or hedging. Options provide asymmetric payoffs and flexibility. Shows understanding beyond simple directional bets.',
          category: 'technical'
        }
      ]
    },
    {
      title: '5. Practical Exercise',
      description: '',
      questions: [
        {
          id: 'sh-prac-1',
          question: 'Pitch a volatility trade in 2 minutes (no math).',
          answer: 'Example: "Volatility is low but we expect earnings season to create uncertainty. Buy straddles to profit from large moves either direction. Risk is time decay if market stays flat." Clear, concise, shows intuition.',
          category: 'practical'
        }
      ]
    },
    {
      title: '6. Ask Questions',
      description: '',
      questions: [
        {
          id: 'sh-ask-1',
          question: 'How are ideas evaluated internally?',
          answer: 'Shows interest in process and decision-making.',
          category: 'ask'
        },
        {
          id: 'sh-ask-2',
          question: 'How much autonomy do juniors have?',
          answer: 'Demonstrates interest in growth and responsibility.',
          category: 'ask'
        }
      ]
    }
  ]
}

// Trading - Bank Interview Flow
export const tradingBankFlow: InterviewFlow = {
  track: 'trading',
  companyType: 'bank',
  title: 'TRADING — BANK INTERVIEW FLOW',
  goal: 'Risk management, hedging, market mechanics',
  mindset: 'Can you survive on a desk without blowing up?',
  sections: [
    {
      title: '1. Behavioral (4)',
      description: '',
      questions: [
        {
          id: 'tb-beh-1',
          question: 'Describe a risk you took and how you managed it.',
          answer: 'Show understanding of risk/reward, position sizing, stop-losses, hedging. Demonstrate thoughtful risk management, not reckless behavior. Use concrete example with numbers if possible.',
          category: 'behavioral'
        },
        {
          id: 'tb-beh-2',
          question: 'Tell me about a fast decision you made with incomplete info.',
          answer: 'Show ability to act under uncertainty, use available information, make reasonable assumptions, and accept outcomes. Demonstrate decision-making process and learning from results.',
          category: 'behavioral'
        },
        {
          id: 'tb-beh-3',
          question: 'How do you handle losses?',
          answer: 'Show emotional control, analysis of what went wrong, learning from mistakes, moving on. Don\'t let losses affect future decisions. Demonstrate resilience and professional approach.',
          category: 'behavioral'
        },
        {
          id: 'tb-beh-4',
          question: 'What markets do you follow every day?',
          answer: 'Be specific: equity indices, FX pairs, rates, commodities. Show systematic approach, understanding of correlations, and genuine interest. Demonstrate market awareness.',
          category: 'behavioral'
        }
      ]
    },
    {
      title: '2. Probability / Mental Math (2)',
      description: '',
      questions: [
        {
          id: 'tb-prob-1',
          question: 'Probability of rolling a 7 with two dice.',
          answer: '6 combinations out of 36: (1,6), (2,5), (3,4), (4,3), (5,2), (6,1). Probability = 6/36 = 1/6 ≈ 16.67%',
          category: 'probability'
        },
        {
          id: 'tb-prob-2',
          question: 'Bond price change given duration and yield move.',
          answer: 'ΔPrice ≈ -Duration × ΔYield × Price. Example: Duration 6, Yield +50bp, Price 100: ΔPrice ≈ -6 × 0.005 × 100 = -3%. Shows understanding of duration risk.',
          category: 'probability'
        }
      ]
    },
    {
      title: '3. Brain Teasers (2) — Medium–Hard',
      description: '',
      questions: [
        {
          id: 'tb-brain-1',
          question: 'Why do traders care more about variance than mean?',
          answer: 'Variance (volatility) affects risk management, position sizing, and tail risk. Mean can be managed through leverage, but variance determines drawdowns and survival. Shows understanding of risk management.',
          category: 'brainteaser'
        },
        {
          id: 'tb-brain-2',
          question: 'Why does high gamma increase hedging costs?',
          answer: 'High gamma means delta changes rapidly with price moves. Requires frequent rebalancing (buy high, sell low), creating transaction costs. Shows understanding of Greeks and practical trading.',
          category: 'brainteaser'
        }
      ]
    },
    {
      title: '4. Technical (Desk-relevant)',
      description: '',
      questions: [
        {
          id: 'tb-tech-1',
          question: 'What is delta and how do you hedge it?',
          answer: 'Delta measures price sensitivity. Hedge by taking offsetting position: if long call (delta +0.5), short 0.5 shares. Makes position delta-neutral. Must rebalance as delta changes.',
          category: 'technical'
        },
        {
          id: 'tb-tech-2',
          question: 'Explain gamma and theta intuitively.',
          answer: 'Gamma: rate of change of delta (convexity). High gamma = delta changes fast = more hedging needed. Theta: time decay. Options lose value as expiry approaches. Shows intuitive understanding.',
          category: 'technical'
        },
        {
          id: 'tb-tech-3',
          question: 'What is DV01?',
          answer: 'Dollar Value of 01: price change for 1bp yield move. DV01 = Duration × Price × 0.0001. Used for hedging and risk management. Shows understanding of fixed income risk.',
          category: 'technical'
        }
      ]
    },
    {
      title: '5. Practical Exercise',
      description: '',
      questions: [
        {
          id: 'tb-prac-1',
          question: 'You are long a call option — market drops 2%. What happens to delta and PnL?',
          answer: 'Delta decreases (call becomes less in-the-money). PnL negative (intrinsic value decreases, time value may also decrease). Need to adjust hedge (buy back shares). Shows understanding of dynamic hedging.',
          category: 'practical'
        }
      ]
    },
    {
      title: '6. Ask Questions',
      description: '',
      questions: [
        {
          id: 'tb-ask-1',
          question: 'How is risk monitored intraday?',
          answer: 'Shows interest in risk management processes.',
          category: 'ask'
        },
        {
          id: 'tb-ask-2',
          question: 'What mistakes do juniors usually make?',
          answer: 'Demonstrates self-awareness and learning mindset.',
          category: 'ask'
        }
      ]
    }
  ]
}

// Trading - Hedge Fund Interview Flow
export const tradingHedgeFundFlow: InterviewFlow = {
  track: 'trading',
  companyType: 'hedge-fund',
  title: 'TRADING — HEDGE FUND INTERVIEW FLOW',
  goal: 'PnL generation, strategy logic',
  mindset: 'Can you make money and control drawdowns?',
  sections: [
    {
      title: '1. Behavioral (4)',
      description: '',
      questions: [
        {
          id: 'th-beh-1',
          question: 'Describe a trading strategy you would run.',
          answer: 'Be specific: setup, entry, exit, risk management. Show understanding of edge, position sizing, and risk/reward. Example: mean reversion, momentum, or relative value strategy.',
          category: 'behavioral'
        },
        {
          id: 'th-beh-2',
          question: 'How do you size positions?',
          answer: 'Based on risk, not expected return. Use Kelly criterion or fixed risk per trade. Consider correlation, portfolio risk, and drawdown tolerance. Shows understanding of risk management.',
          category: 'behavioral'
        },
        {
          id: 'th-beh-3',
          question: 'How do you know when to stop trading a strategy?',
          answer: 'When edge disappears, drawdowns exceed limits, or market regime changes. Show systematic approach: track performance, monitor metrics, have exit rules. Demonstrates discipline.',
          category: 'behavioral'
        },
        {
          id: 'th-beh-4',
          question: 'What does a bad day look like for you?',
          answer: 'Show emotional control and learning mindset. Bad day = learning opportunity. Analyze what went wrong, adjust, move on. Don\'t let it affect future decisions.',
          category: 'behavioral'
        }
      ]
    },
    {
      title: '2. Probability / Statistics (2)',
      description: '',
      questions: [
        {
          id: 'th-prob-1',
          question: 'Expected value of a trade.',
          answer: 'EV = (Win Rate × Avg Win) - (Loss Rate × Avg Loss). Example: 55% win rate, +2% avg win, -1.5% avg loss: EV = 0.55 × 2% - 0.45 × 1.5% = 1.1% - 0.675% = 0.425%',
          category: 'probability'
        },
        {
          id: 'th-prob-2',
          question: 'Sharpe ratio intuition.',
          answer: 'Sharpe = (Return - Risk-free) / Volatility. Measures risk-adjusted return. Higher is better. Shows how much return per unit of risk. Typical good Sharpe: >1, excellent: >2.',
          category: 'probability'
        }
      ]
    },
    {
      title: '3. Brain Teasers (2) — Hard',
      description: '',
      questions: [
        {
          id: 'th-brain-1',
          question: 'Why does a negatively skewed strategy look good until it fails?',
          answer: 'Negative skew = small frequent wins, rare large losses. Strategy looks profitable (high win rate) until tail event occurs. Shows understanding of tail risk and strategy evaluation.',
          category: 'brainteaser'
        },
        {
          id: 'th-brain-2',
          question: 'Why volatility clustering matters for trading.',
          answer: 'High volatility periods cluster together (autocorrelation). Affects position sizing, risk management, and strategy performance. Need to adjust for changing volatility regimes.',
          category: 'brainteaser'
        }
      ]
    },
    {
      title: '4. Technical (Strategy-level)',
      description: '',
      questions: [
        {
          id: 'th-tech-1',
          question: 'Difference between realized and implied volatility.',
          answer: 'Realized: actual historical volatility. Implied: market\'s expectation (from options). Trading opportunity when they diverge. IV > RV = options expensive, IV < RV = options cheap.',
          category: 'technical'
        },
        {
          id: 'th-tech-2',
          question: 'Why delta-neutral strategies still lose money.',
          answer: 'Gamma risk (convexity), theta decay, vega exposure, correlation breakdown, or transaction costs. Delta-neutral doesn\'t mean risk-free. Shows understanding of Greeks and strategy risks.',
          category: 'technical'
        }
      ]
    },
    {
      title: '5. Practical Exercise',
      description: '',
      questions: [
        {
          id: 'th-prac-1',
          question: 'Build a simple volatility trading strategy (conceptually).',
          answer: 'Example: If IV > RV, sell options (volatility overpriced). If IV < RV, buy options (volatility underpriced). Hedge delta, manage gamma/theta. Shows understanding of volatility trading.',
          category: 'practical'
        }
      ]
    },
    {
      title: '6. Ask Questions',
      description: '',
      questions: [
        {
          id: 'th-ask-1',
          question: 'How are strategies allocated capital?',
          answer: 'Shows interest in portfolio management and capital allocation.',
          category: 'ask'
        },
        {
          id: 'th-ask-2',
          question: 'How is risk enforced?',
          answer: 'Demonstrates interest in risk management and controls.',
          category: 'ask'
        }
      ]
    }
  ]
}

// Quant - Bank Interview Flow
export const quantBankFlow: InterviewFlow = {
  track: 'quant',
  companyType: 'bank',
  title: 'QUANT — BANK INTERVIEW FLOW',
  goal: 'Model implementation, pricing, desk support',
  mindset: 'Can you build models traders actually use?',
  sections: [
    {
      title: '1. Behavioral (4)',
      description: '',
      questions: [
        {
          id: 'qb-beh-1',
          question: 'Describe a quantitative project you worked on.',
          answer: 'Use STAR method. Show technical skills, problem-solving, and results. Emphasize practical application, not just theory. Demonstrate ability to deliver usable solutions.',
          category: 'behavioral'
        },
        {
          id: 'qb-beh-2',
          question: 'How do you explain a model to a trader?',
          answer: 'Focus on intuition, not math. Explain what it does, why it works, limitations. Use analogies, avoid jargon. Show ability to communicate technical concepts simply.',
          category: 'behavioral'
        },
        {
          id: 'qb-beh-3',
          question: 'Tell me about a model failure.',
          answer: 'Show learning mindset. What went wrong, why, how you fixed it or learned from it. Demonstrate humility and continuous improvement. Shows resilience.',
          category: 'behavioral'
        },
        {
          id: 'qb-beh-4',
          question: 'How do you validate results?',
          answer: 'Backtesting, out-of-sample testing, stress testing, comparison to benchmarks. Show systematic validation approach. Demonstrate rigor and skepticism.',
          category: 'behavioral'
        }
      ]
    },
    {
      title: '2. Probability / Math (2)',
      description: '',
      questions: [
        {
          id: 'qb-prob-1',
          question: 'Expected value of a random variable.',
          answer: 'E[X] = Σ x × P(x) for discrete, or ∫ x × f(x) dx for continuous. Weighted average of outcomes. Fundamental concept in pricing and risk.',
          category: 'probability'
        },
        {
          id: 'qb-prob-2',
          question: 'Properties of a normal distribution.',
          answer: 'Symmetric, bell-shaped. Mean = median = mode. 68% within 1σ, 95% within 2σ, 99.7% within 3σ. Central limit theorem. Basis for many models.',
          category: 'probability'
        }
      ]
    },
    {
      title: '3. Brain Teasers (2) — Quantitative',
      description: '',
      questions: [
        {
          id: 'qb-brain-1',
          question: 'Why use log returns instead of price returns?',
          answer: 'Log returns are time-additive, symmetric, and approximately normal for small moves. Price returns are not additive. Log returns better for modeling and statistical analysis.',
          category: 'brainteaser'
        },
        {
          id: 'qb-brain-2',
          question: 'Why risk-neutral pricing works.',
          answer: 'Arbitrage-free pricing doesn\'t depend on risk preferences. Can use risk-neutral measure where all assets earn risk-free rate. Simplifies pricing via expectation. Shows understanding of fundamental pricing theory.',
          category: 'brainteaser'
        }
      ]
    },
    {
      title: '4. Technical (Core quant)',
      description: '',
      questions: [
        {
          id: 'qb-tech-1',
          question: 'Black-Scholes assumptions.',
          answer: 'Constant volatility, constant risk-free rate, no dividends (or known), log-normal price process, no transaction costs, continuous trading, European exercise. Shows understanding of model limitations.',
          category: 'technical'
        },
        {
          id: 'qb-tech-2',
          question: 'Greeks and their role in hedging.',
          answer: 'Delta (price sensitivity), Gamma (delta sensitivity), Theta (time decay), Vega (volatility sensitivity), Rho (rate sensitivity). Used for dynamic hedging and risk management.',
          category: 'technical'
        },
        {
          id: 'qb-tech-3',
          question: 'Difference between local and stochastic volatility.',
          answer: 'Local vol: function of price and time σ(S,t). Stochastic vol: random process dV = ... . Local vol fits smile but wrong dynamics. Stochastic vol captures volatility clustering. Shows understanding of advanced models.',
          category: 'technical'
        }
      ]
    },
    {
      title: '5. Practical Exercise',
      description: '',
      questions: [
        {
          id: 'qb-prac-1',
          question: 'Price a European option using Black-Scholes and explain limitations.',
          answer: 'Use formula: C = S×N(d1) - K×e^(-rT)×N(d2). Calculate d1, d2. Explain limitations: constant vol (wrong), no jumps, European only, no transaction costs. Shows practical application and critical thinking.',
          category: 'practical'
        }
      ]
    },
    {
      title: '6. Ask Questions',
      description: '',
      questions: [
        {
          id: 'qb-ask-1',
          question: 'How close do quants sit to traders?',
          answer: 'Shows interest in collaboration and desk integration.',
          category: 'ask'
        },
        {
          id: 'qb-ask-2',
          question: 'How are models deployed?',
          answer: 'Demonstrates interest in production systems and implementation.',
          category: 'ask'
        }
      ]
    }
  ]
}

// Quant - Hedge Fund Interview Flow
export const quantHedgeFundFlow: InterviewFlow = {
  track: 'quant',
  companyType: 'hedge-fund',
  title: 'QUANT — HEDGE FUND INTERVIEW FLOW',
  goal: 'Alpha research, robustness',
  mindset: 'Can you build signals that survive reality?',
  sections: [
    {
      title: '1. Behavioral (4)',
      description: '',
      questions: [
        {
          id: 'qh-beh-1',
          question: 'Describe an end-to-end research project.',
          answer: 'From hypothesis to backtest to production. Show systematic approach: data collection, feature engineering, model building, validation, deployment. Emphasize robustness and practical considerations.',
          category: 'behavioral'
        },
        {
          id: 'qh-beh-2',
          question: 'How do you detect overfitting?',
          answer: 'Out-of-sample testing, cross-validation, walk-forward analysis. Monitor performance degradation. Compare train vs test metrics. Show understanding of model validation.',
          category: 'behavioral'
        },
        {
          id: 'qh-beh-3',
          question: 'How do you handle noisy data?',
          answer: 'Data cleaning, outlier handling, robust statistics, feature selection. Show understanding of data quality issues and how to address them. Demonstrate practical data science skills.',
          category: 'behavioral'
        },
        {
          id: 'qh-beh-4',
          question: 'What would invalidate your model?',
          answer: 'Regime changes, data quality issues, structural breaks, or fundamental changes in market. Show understanding of model limitations and when to abandon a strategy.',
          category: 'behavioral'
        }
      ]
    },
    {
      title: '2. Probability / Statistics (2)',
      description: '',
      questions: [
        {
          id: 'qh-prob-1',
          question: 'Difference between correlation and causation.',
          answer: 'Correlation: statistical relationship. Causation: one causes the other. Correlation doesn\'t imply causation. Need theory, experiments, or natural experiments to establish causation. Critical for signal development.',
          category: 'probability'
        },
        {
          id: 'qh-prob-2',
          question: 'Out-of-sample testing logic.',
          answer: 'Train on historical data, test on future data. Prevents overfitting. Time-series: walk-forward or expanding window. Cross-validation for non-temporal data. Shows understanding of validation.',
          category: 'probability'
        }
      ]
    },
    {
      title: '3. Brain Teasers (2) — Very Hard',
      description: '',
      questions: [
        {
          id: 'qh-brain-1',
          question: 'Why most signals decay after discovery?',
          answer: 'Arbitrage eliminates edge, market adapts, or signal was spurious (overfitting). Shows understanding of market efficiency and signal lifecycle. Demonstrates realistic expectations.',
          category: 'brainteaser'
        },
        {
          id: 'qh-brain-2',
          question: 'Why backtests lie.',
          answer: 'Overfitting, look-ahead bias, survivorship bias, transaction costs ignored, unrealistic execution. Shows understanding of backtest pitfalls. Demonstrates skepticism and rigor.',
          category: 'brainteaser'
        }
      ]
    },
    {
      title: '4. Technical (Advanced quant)',
      description: '',
      questions: [
        {
          id: 'qh-tech-1',
          question: 'Monte Carlo vs closed-form pricing.',
          answer: 'Closed-form: exact solution (Black-Scholes). Monte Carlo: simulation for complex payoffs. MC is flexible but slower, requires more assumptions. Trade-off between accuracy and speed.',
          category: 'technical'
        },
        {
          id: 'qh-tech-2',
          question: 'PCA in risk management.',
          answer: 'Principal Component Analysis reduces dimensionality. Identifies key risk factors. Simplifies portfolio analysis. First PC often represents parallel shift (duration risk). Shows understanding of factor models.',
          category: 'technical'
        },
        {
          id: 'qh-tech-3',
          question: 'Stationarity and regime changes.',
          answer: 'Stationary: statistical properties constant over time. Regime changes: structural breaks. Need to detect and adapt. Shows understanding of time-series properties and model robustness.',
          category: 'technical'
        }
      ]
    },
    {
      title: '5. Practical Exercise',
      description: '',
      questions: [
        {
          id: 'qh-prac-1',
          question: 'Design a backtesting framework and explain key pitfalls.',
          answer: 'Components: data (clean, realistic), execution (slippage, costs), risk management (position sizing, stops), validation (out-of-sample). Pitfalls: overfitting, look-ahead bias, unrealistic assumptions. Shows comprehensive understanding.',
          category: 'practical'
        }
      ]
    },
    {
      title: '6. Ask Questions',
      description: '',
      questions: [
        {
          id: 'qh-ask-1',
          question: 'How is research moved to production?',
          answer: 'Shows interest in implementation and deployment process.',
          category: 'ask'
        },
        {
          id: 'qh-ask-2',
          question: 'How do you kill bad models?',
          answer: 'Demonstrates interest in model lifecycle and risk management.',
          category: 'ask'
        }
      ]
    }
  ]
}

// Map to get the right flow
export function getInterviewFlow(track: 'sales' | 'trading' | 'quant', companyType: 'bank' | 'hedge-fund'): InterviewFlow {
  if (track === 'sales' && companyType === 'bank') return salesBankFlow
  if (track === 'sales' && companyType === 'hedge-fund') return salesHedgeFundFlow
  if (track === 'trading' && companyType === 'bank') return tradingBankFlow
  if (track === 'trading' && companyType === 'hedge-fund') return tradingHedgeFundFlow
  if (track === 'quant' && companyType === 'bank') return quantBankFlow
  if (track === 'quant' && companyType === 'hedge-fund') return quantHedgeFundFlow
  
  // Default fallback
  return salesBankFlow
}


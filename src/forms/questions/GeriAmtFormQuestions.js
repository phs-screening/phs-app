export const geriAmtFormQuestionText = {
  geriAmtQ1: 'What is the year? 请问今年是什么年份？',
  geriAmtQ2: 'About what time is it? (within 1 hour) 请问现在大约是几点钟（一在一个小时之内）？',
  geriAmtQ3: 'What is your age? 请问您今年几岁？',
  geriAmtQ4: 'What is your date of birth? 请问您的出生日期或生日？',
  geriAmtQ5: 'What is your home address? 请问您的住家地址是在什么地方？',
  geriAmtQ6: 'Where are we now? 请问我们现在正在什么地方？',
  geriAmtQ7: "Who is our country's Prime Minister? 请问新加坡现任总理是哪位？",
  geriAmtQ8: 'What is his/her job? (show picture) 请问图片里的人士很有可能是从事哪种行业？',
  geriAmtQ9: 'Count backwards from 20 to 1. 请您从二十开始，倒数到一。',
  geriAmtQ10: 'Recall memory phase 请您把刚才我要您记住的地址重复一遍。',
  geriAmtQ11: '11) What is your highest education level attained?',
  geriAmtQ12:
    "12) Based on the patient's years of education and AMT score, do you need to refer to DSG?",
}

// AMT pass mark depends on schooling: >= 7/10 for Before PSLE (under 6 years of
// education), >= 9/10 for After PSLE. Anything below is a fail, which is the only
// case where a DementiaSG referral applies.
export const AMT_PASS_MARK = {
  'Before PSLE': 7,
  'After PSLE': 9,
}

export const hasFailedAmt = (score, educationLevel) => {
  const passMark = AMT_PASS_MARK[educationLevel]
  if (passMark === undefined) return false
  return score < passMark
}

import Taro from '@tarojs/taro'

// ⚠️ 这里填入您的 API Key (如果有的话)
const API_CONFIG = {
  baseURL: 'https://api.deepseek.com/v1', 
  apiKey: '', // 留空则自动使用下方的"超级模拟模式"
  model: 'deepseek-chat'
}

/**
 * 诊断入口函数
 */
export const diagnose = async (petType, age, symptoms, lang = 'zh') => {
  // 1. 优先尝试真实 API
  if (API_CONFIG.apiKey) {
    try {
      return await callRealAI(petType, age, symptoms, lang)
    } catch (e) {
      console.error('API Failed, switching to mock', e)
    }
  }

  // 2. 降级为"超级模拟模式"
  return smartMockDiagnosis(petType, age, symptoms, lang)
}

/**
 * 真实 API 调用
 */
const callRealAI = async (petType, age, symptoms, lang) => {
  const isEn = lang === 'en'
  const systemPrompt = isEn 
    ? `You are an experienced, gentle, and professional veterinarian. Please provide a preliminary diagnosis based on the owner's description.
       Strictly follow this format:
       [Possible Causes] List 3 most likely causes.
       [Urgency] (Low/Medium/High) with a brief reason.
       [Home Care] 3-4 specific care tips.
       [Vet Advice] When to visit a vet immediately.
       Reply in English.`
    : `你是一位经验丰富、温柔耐心的专业兽医。请根据主人描述初步判断宠物健康状况。
       请严格按此格式输出：
       【可能原因】列出3个最可能病因。
       【紧急程度】(低/中/高) 并说明理由。
       【护理建议】3-4条具体措施。
       【就医建议】什么情况需立即去医院。`

  const userPrompt = isEn
    ? `Pet: ${age}-year-old ${petType}. Symptoms: ${symptoms}`
    : `宠物：${age}岁${petType === 'dog' ? '狗狗' : '猫咪'}。症状：${symptoms}`

  const res = await Taro.request({
    url: `${API_CONFIG.baseURL}/chat/completions`,
    method: 'POST',
    header: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${API_CONFIG.apiKey}`
    },
    data: {
      model: API_CONFIG.model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.7
    }
  })
  return res.data.choices[0].message.content
}

/**
 * 🧠 超级模拟模式 (Smart Mock) - 双语版
 */
const smartMockDiagnosis = (type, age, text, lang) => {
  return new Promise((resolve) => {
    const delay = 1000 + Math.random() * 1000
    const isEn = lang === 'en'
    
    setTimeout(() => {
      const isDog = type === 'dog'
      const t = text.toLowerCase()
      let diagnosis = {}

      // --- 1. 症状匹配逻辑 (关键词匹配) ---
      // 肠胃 (Gut)
      if (match(t, ['拉稀', '呕吐', '软便', '不吃', '吐', 'diarrhea', 'vomit', 'poop', 'stool', 'appetite'])) {
        diagnosis = isEn ? {
          causes: ['Acute Gastroenteritis', 'Dietary Indiscretion', 'Parasitic Infection'],
          urgency: 'Medium',
          urgencyReason: 'Digestive issues may lead to dehydration.',
          care: [
            'Fast for 4-6 hours to let the stomach rest.',
            'Feed small amounts of bland food (e.g., boiled chicken) if vomiting stops.',
            'Monitor energy levels closely.'
          ]
        } : {
          causes: ['急性肠胃炎', '饮食不耐受', '寄生虫感染'],
          urgency: '中',
          urgencyReason: '消化道症状可能导致脱水，需密切观察。',
          care: [
            '禁食禁水4-6小时，让肠胃休息。',
            '若不再呕吐，可喂少量易消化的流食（如泡软的粮）。',
            '观察精神状态，若持续萎靡请及时就医。'
          ]
        }
      }
      // 皮肤 (Skin)
      else if (match(t, ['痒', '红', '挠', '掉毛', '皮屑', 'skin', 'itch', 'scratch', 'hair', 'red'])) {
        diagnosis = isEn ? {
          causes: ['Allergic Dermatitis', 'Fungal/Bacterial Infection', 'External Parasites'],
          urgency: 'Low',
          urgencyReason: 'Usually not life-threatening but affects quality of life.',
          care: [
            'Use an E-collar to prevent scratching.',
            'Keep the environment dry and clean.',
            'Avoid potential food allergens.'
          ]
        } : {
          causes: ['过敏性皮炎', '真菌/细菌感染', '体外寄生虫'],
          urgency: '低',
          urgencyReason: '通常不危及生命，但会严重影响生活质量。',
          care: [
            '佩戴伊丽莎白圈，防止舔舐抓挠加重感染。',
            '保持居住环境干燥清洁，定期驱虫。',
            '避免食用可能引起过敏的人类食物。'
          ]
        }
      }
      // 呼吸道 (Respiratory)
      else if (match(t, ['咳', '喷嚏', '喘', '鼻涕', 'cough', 'sneeze', 'nose', 'breath'])) {
        diagnosis = isEn ? {
          causes: ['Upper Respiratory Infection', 'Bronchitis', 'Viral Infection'],
          urgency: 'Medium',
          urgencyReason: 'Respiratory issues can worsen quickly, especially in young pets.',
          care: [
            'Keep warm and avoid temperature changes.',
            'Increase humidity to ease breathing.',
            'Seek vet help immediately if gums turn blue or breathing is labored.'
          ]
        } : {
          causes: ['上呼吸道感染（感冒）', '支气管炎', '病毒感染（如犬窝咳/猫鼻支）'],
          urgency: '中',
          urgencyReason: '呼吸道问题可能迅速恶化，特别是幼宠。',
          care: [
            '注意保暖，避免温差过大。',
            '增加环境湿度，缓解呼吸道不适。',
            '若出现张口呼吸或舌色发紫，属于急症，请立即就医！'
          ]
        }
      }
      // 骨骼 (Joint)
      else if (match(t, ['跛', '腿', '走', '痛', 'limp', 'walk', 'leg', 'pain'])) {
        diagnosis = isEn ? {
          causes: ['Trauma/Sprain', 'Arthritis', 'Patellar Luxation'],
          urgency: 'Medium',
          urgencyReason: 'Mobility issues affect daily life and may cause muscle atrophy.',
          care: [
            'Limit exercise and rest.',
            'Check paws for foreign objects.',
            'Consider joint supplements for seniors.'
          ]
        } : {
          causes: ['外伤/扭伤', '关节炎', '髌骨脱位'],
          urgency: '中',
          urgencyReason: '行动受限会影响日常生活，长期可能导致肌肉萎缩。',
          care: [
            '限制运动，静养休息，避免上下楼梯。',
            '检查脚掌是否有异物扎入。',
            '老年宠物可适当补充关节营养品。'
          ]
        }
      }
      // 默认 (Default)
      else {
        diagnosis = isEn ? {
          causes: ['Sub-health State', 'Mild Stress', 'Early Stage Condition'],
          urgency: 'Low',
          urgencyReason: 'Symptoms are not specific, observation recommended.',
          care: [
            'Track eating, drinking, and bathroom habits.',
            'Comfort your pet to reduce stress.',
            'Ensure access to fresh water.'
          ]
        } : {
          causes: ['亚健康状态', '轻微应激', '早期潜在疾病'],
          urgency: '低',
          urgencyReason: '症状暂不典型，建议持续观察。',
          care: [
            '记录饮食饮水排便情况。',
            '多陪伴安抚，减少环境压力。',
            '保持充足的清洁饮水。'
          ]
        }
      }

      // --- 2. 组装回复 (Bilingual) ---
      const petName = isDog ? (isEn ? 'dog' : '狗狗') : (isEn ? 'cat' : '猫咪')
      
      let result = isEn ? `[Preliminary Analysis]\n` : `【初步诊断分析】\n`
      result += isEn 
        ? `For your ${age}-year-old ${petName} with symptoms "${text}":\n\n`
        : `针对${age}岁${petName}出现的"${text}"症状，分析如下：\n\n`
      
      result += isEn ? `[Possible Causes]\n` : `【可能原因】\n`
      diagnosis.causes.forEach((c, i) => result += `${i+1}. ${c}\n`)
      
      result += isEn ? `\n[Urgency] ${diagnosis.urgency}\n` : `\n【紧急程度】${diagnosis.urgency}\n`
      result += isEn ? `Reason: ${diagnosis.urgencyReason}\n` : `理由：${diagnosis.urgencyReason}\n`
      
      result += isEn ? `\n[Home Care]\n` : `\n【家庭护理建议】\n`
      diagnosis.care.forEach((c, i) => result += `${i+1}. ${c}\n`)
      
      result += isEn ? `\n[Vet Advice]\n` : `\n【就医建议】\n`
      result += isEn 
        ? `If ${petName} shows lethargy, persistent fever, or symptoms worsen over 24h, please visit a vet immediately.`
        : `如果${petName}出现精神萎靡、持续发热或症状加重超过24小时，请务必前往医院进行血常规及相关检查。`

      resolve(result)
    }, delay)
  })
}

const match = (text, keywords) => {
  return keywords.some(k => text.includes(k))
}

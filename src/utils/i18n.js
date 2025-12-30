export const translations = {
  zh: {
    tabBar: {
      home: '首页',
      community: '宠友圈',
      profile: '我的'
    },
    home: {
      title: 'AI 宠物医生 🩺',
      subtitle: '您的私人宠物健康顾问',
      ageCalc: '年龄计算',
      nearbyClinics: '附近医院',
      selectType: '选择宠物类型',
      dog: '🐶 狗狗',
      cat: '🐱 猫咪',
      basicInfo: '基本信息',
      agePlaceholder: '年龄 (例如: 2岁)',
      symptomsPlaceholder: '请详细描述症状，如：精神状态、食欲、排便情况等...',
      uploadPhoto: '上传照片 (可选)',
      startAnalyze: '开始诊断',
      analyzing: '正在分析...',
      reportTitle: '诊断报告',
      recommendTitle: 'AI 推荐好物 (点击购买)',
      recTabs: { all: '全部', food: '主粮', health: '健康' },
      aiTip: '已为您筛选适合 {tags} 的产品',
      recBadge: '推荐',
      symptomParts: {
        all: '全部',
        head: '头部/五官',
        body: '身体/皮肤',
        limbs: '四肢/行动',
        tummy: '肠胃/排泄'
      },
      symptomsByPart: {
        dog: {
          head: ['眼屎多', '口臭', '咳嗽', '流鼻涕', '牙龈红肿'],
          body: ['皮肤红肿', '掉毛', '发抖', '身体发热', '消瘦'],
          limbs: ['跛行', '舔爪子', '无法站立', '走路摇晃'],
          tummy: ['拉稀', '呕吐', '不吃东西', '便秘', '便血']
        },
        cat: {
          head: ['眼部分泌物', '黑下巴', '呼吸急促', '流口水', '打喷嚏'],
          body: ['频繁抓挠', '耳螨', '猫藓', '大量掉毛', '腹部变大'],
          limbs: ['走路异常', '不愿意跳跃', '指甲断裂'],
          tummy: ['软便', '绝食', '乱尿', '异食癖', '呕吐毛球']
        }
      },
      commonSymptoms: {
        dog: ['拉稀', '呕吐', '不吃东西', '咳嗽', '皮肤红肿', '跛行', '眼屎多', '口臭'],
        cat: ['软便', '频繁抓挠', '耳螨', '黑下巴', '绝食', '乱尿', '眼部分泌物', '呼吸急促']
      },
      analysis: {
        prefix: '根据{age}岁{type}的症状（{symptoms}），',
        dog: '狗狗',
        cat: '猫咪',
        digestive: '可能是消化不良或轻微肠胃炎。',
        skin: '可能是皮肤过敏或真菌感染。',
        joint: '可能是关节炎或外伤。',
        default: '建议进一步检查。',
        advice: '\n\n【建议】\n1. 观察精神状态。\n2. 若症状持续，请及时就医。\n(此结果仅供参考)'
      },
      copyTip: '🔍 复制关键词去淘宝/京东搜索',
      detailTip: '🛒 查看商品详情 (模拟)',
      copySuccess: '关键词已复制，快去购物App搜索吧'
    },
    profile: {
      edit: '暂未开放编辑',
      posts: '动态',
      pets: '宠物',
      likes: '获赞',
      expenses: '宠物账本',
      calendar: '健康日历',
      records: '诊断记录',
      firstAid: '急救手册',
      myPets: '我的宠物',
      add: '+ 添加',
      emptyPet: '暂无宠物档案',
      logout: '退出登录',
      boy: '弟弟',
      girl: '妹妹',
      language: '语言 / Language'
    },
    community: {
      title: '宠友圈 🐾',
      tabAll: '全部',
      tabDaily: '日常',
      tabAsk: '求助',
      tabShow: '晒宠',
      placeholder: '分享你和毛孩子的故事...',
      publish: '发布',
      emptyTip: '写点什么吧',
      publishSuccess: '发布成功',
      mockUser: '我',
      timeJust: '刚刚'
    },
    clinics: {
      title: '附近优选医院 🏥',
      subtitle: '严选合作伙伴，守护爱宠健康',
      searchMap: '在地图中查找附近医院',
      searchDesc: '调用微信地图，获取最准确的实时位置',
      nav: '导航',
      call: '电话',
      myLocation: '我的位置',
      viewing: '正在查看附近宠物医院',
      opened: '已打开地图，请搜索"宠物医院"',
      authFail: '请授权位置信息以查找附近'
    },
    ageCalc: {
      title: '年龄计算器',
      dog: '🐶 狗狗',
      cat: '🐱 猫咪',
      size: '体型大小',
      small: '小型',
      medium: '中型',
      large: '大型',
      currentAge: '当前年龄',
      humanAge: '相当于人类年龄',
      ageUnit: '岁',
      stages: {
        youth: { label: '青少年期', desc: '精力旺盛，好奇心强，是训练的最佳时期。' },
        prime: { label: '壮年期', desc: '身体机能巅峰，需要充足的运动和均衡饮食。' },
        middle: { label: '中年期', desc: '代谢开始变慢，注意控制体重，定期体检。' },
        old: { label: '老年期', desc: '动作变缓，需要更多的关爱和舒适的环境，注意关节保护。' }
      }
    },
    calendar: {
      title: '健康日历',
      todayTask: '今日事项',
      noTask: '今天没有待办事项哦~'
    },
    expenses: {
      title: '宠物账本',
      total: '总支出',
      daily: '日常消费',
      notePlaceholder: '备注 (如: 猫粮)',
      save: '记一笔'
    },
    firstAid: {
      title: '急救手册',
      warning: '⚠️ 紧急情况请优先联系兽医',
      items: [
        { title: "误食异物/中毒", steps: ["立即停止进食", "保留呕吐物/排泄物样本", "切勿盲目催吐", "立即送医"] },
        { title: "中暑急救", steps: ["移至阴凉通风处", "用常温水擦拭脚掌和耳后", "少量多次喂水", "避免全身冲冷水"] },
        { title: "外伤出血", steps: ["用干净纱布直接按压伤口止血", "持续按压至少5-10分钟", "严重时扎止血带"] },
        { title: "心肺复苏 (CPR)", steps: ["确认无呼吸心跳", "侧卧，清理口腔", "按压心脏(100-120次/分)", "每30次按压配合2次人工呼吸"] }
      ]
    }
  },
  en: {
    tabBar: {
      home: 'Home',
      community: 'Community',
      profile: 'Profile'
    },
    home: {
      title: 'AI Pet Doctor 🩺',
      subtitle: 'Your Personal Health Advisor',
      ageCalc: 'Age Calc',
      nearbyClinics: 'Clinics',
      selectType: 'Select Pet',
      dog: '🐶 Dog',
      cat: '🐱 Cat',
      basicInfo: 'Basic Info',
      agePlaceholder: 'Age (e.g. 2)',
      symptomsPlaceholder: 'Describe symptoms: appetite, mood, etc...',
      uploadPhoto: 'Upload Photo (Optional)',
      startAnalyze: 'Diagnose',
      analyzing: 'Analyzing...',
      reportTitle: 'Diagnosis Report',
      recommendTitle: 'AI Recommended (Tap to Buy)',
      recTabs: { all: 'All', food: 'Food', health: 'Health' },
      aiTip: 'Filtered for {tags}',
      recBadge: 'Rec',
      symptomParts: {
        all: 'All',
        head: 'Head/Face',
        body: 'Body/Skin',
        limbs: 'Limbs',
        tummy: 'Tummy'
      },
      symptomsByPart: {
        dog: {
          head: ['Eye Discharge', 'Bad Breath', 'Cough', 'Runny Nose', 'Red Gums'],
          body: ['Red Skin', 'Hair Loss', 'Shivering', 'Fever', 'Weight Loss'],
          limbs: ['Limping', 'Licking Paws', 'Cannot Stand', 'Wobbly Walk'],
          tummy: ['Diarrhea', 'Vomiting', 'No Appetite', 'Constipation', 'Bloody Stool']
        },
        cat: {
          head: ['Eye Discharge', 'Black Chin', 'Panting', 'Drooling', 'Sneezing'],
          body: ['Scratching', 'Ear Mites', 'Ringworm', 'Hair Loss', 'Bloated'],
          limbs: ['Walking Oddly', 'No Jumping', 'Broken Nail'],
          tummy: ['Soft Stool', 'Not Eating', 'Peeing Anywhere', 'Pica', 'Vomiting Hairball']
        }
      },
      commonSymptoms: {
        dog: ['Diarrhea', 'Vomiting', 'No Appetite', 'Cough', 'Red Skin', 'Limping', 'Eye Discharge', 'Bad Breath'],
        cat: ['Soft Stool', 'Scratching', 'Ear Mites', 'Black Chin', 'Not Eating', 'Peeing Anywhere', 'Eye Discharge', 'Panting']
      },
      analysis: {
        prefix: 'Based on {age}-year-old {type} with symptoms ({symptoms}): ',
        dog: 'dog',
        cat: 'cat',
        digestive: 'Possible indigestion or mild gastroenteritis.',
        skin: 'Possible skin allergy or fungal infection.',
        joint: 'Possible arthritis or injury.',
        default: 'Further examination recommended.',
        advice: '\n\n[Advice]\n1. Observe mental state.\n2. See a vet if symptoms persist.\n(Reference Only)'
      },
      copyTip: '🔍 Copy keywords to search',
      detailTip: '🛒 View Details (Mock)',
      copySuccess: 'Keywords copied! Search in shopping app.'
    },
    profile: {
      edit: 'Edit not available',
      posts: 'Posts',
      pets: 'Pets',
      likes: 'Likes',
      expenses: 'Expenses',
      calendar: 'Calendar',
      records: 'Records',
      firstAid: 'First Aid',
      myPets: 'My Pets',
      add: '+ Add',
      emptyPet: 'No pet records',
      logout: 'Log Out',
      boy: 'Boy',
      girl: 'Girl',
      language: 'Language / 语言'
    },
    community: {
      title: 'Community 🐾',
      tabAll: 'All',
      tabDaily: 'Daily',
      tabAsk: 'Help',
      tabShow: 'Show',
      placeholder: 'Share your story...',
      publish: 'Post',
      emptyTip: 'Say something...',
      publishSuccess: 'Posted!',
      mockUser: 'Me',
      timeJust: 'Just now'
    },
    clinics: {
      title: 'Nearby Clinics 🏥',
      subtitle: 'Trusted Partners',
      searchMap: 'Search in Map',
      searchDesc: 'Use Map App for real-time location',
      nav: 'Go',
      call: 'Call',
      myLocation: 'My Location',
      viewing: 'Viewing nearby clinics',
      opened: 'Map opened, please search "Vet"',
      authFail: 'Location permission required'
    },
    ageCalc: {
      title: 'Age Calculator',
      dog: '🐶 Dog',
      cat: '🐱 Cat',
      size: 'Size',
      small: 'Small',
      medium: 'Medium',
      large: 'Large',
      currentAge: 'Current Age',
      humanAge: 'Human Age',
      ageUnit: 'y/o',
      stages: {
        youth: { label: 'Youth', desc: 'Energetic, curious, best time for training.' },
        prime: { label: 'Prime', desc: 'Peak physical condition, needs exercise and balanced diet.' },
        middle: { label: 'Middle', desc: 'Metabolism slows down, watch weight, regular checkups.' },
        old: { label: 'Senior', desc: 'Slower movement, needs care and comfort, protect joints.' }
      }
    },
    calendar: {
      title: 'Health Calendar',
      todayTask: 'Today',
      noTask: 'No tasks for today~'
    },
    expenses: {
      title: 'Expenses',
      total: 'Total',
      daily: 'Daily Cost',
      notePlaceholder: 'Note (e.g. Food)',
      save: 'Save'
    },
    firstAid: {
      title: 'First Aid',
      warning: '⚠️ Contact Vet for Emergencies',
      items: [
        { title: "Poisoning", steps: ["Stop eating", "Keep vomit sample", "Do NOT induce vomiting blindly", "Go to Vet"] },
        { title: "Heat Stroke", steps: ["Move to cool place", "Wipe paws/ears with room temp water", "Water frequently", "Avoid cold water shock"] },
        { title: "Bleeding", steps: ["Press wound with clean gauze", "Press for 5-10 mins", "Tourniquet if severe"] },
        { title: "CPR", steps: ["Check breathing", "Clear mouth", "Compressions (100-120/min)", "30 compressions + 2 breaths"] }
      ]
    }
  }
}

import Taro from '@tarojs/taro'

export const updateTabBar = (lang) => {
  const t = translations[lang].tabBar
  Taro.setTabBarItem({ index: 0, text: t.home })
  Taro.setTabBarItem({ index: 1, text: t.community })
  Taro.setTabBarItem({ index: 2, text: t.profile })
}

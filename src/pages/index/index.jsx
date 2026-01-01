import { useState, useEffect } from 'react'
import { View, Text, Image, Input, Button, ScrollView, Textarea } from '@tarojs/components'
import Taro, { useDidShow } from '@tarojs/taro'
import { translations, updateTabBar } from '../../utils/i18n'
import { diagnose } from '../../services/ai'
import './index.css'

// 扩展商品库，加入功能性标签
const ALL_ITEMS = {
  dog: [
    { id: 1, type: 'food', name: "Royal Canin Adult", brand: "Royal Canin", price: "¥288", weight: "10kg", image: "https://images.unsplash.com/photo-1589924691195-41432c84c161?auto=format&fit=crop&q=80&w=300&h=300", tags: ["日常"] },
    { id: 2, type: 'food', name: "Orijen Original", brand: "Orijen", price: "¥650", weight: "11.4kg", image: "https://images.unsplash.com/photo-1623366302587-bca24caac767?auto=format&fit=crop&q=80&w=300&h=300", tags: ["日常", "高蛋白"] },
    { id: 11, type: 'health', name: "Probiotics", brand: "VetWish", price: "¥128", weight: "1 Box", image: "https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?auto=format&fit=crop&q=80&w=300&h=300", tags: ["肠胃", "拉稀", "软便"] },
    { id: 12, type: 'health', name: "Fish Oil", brand: "Mag", price: "¥158", weight: "200ml", image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=300&h=300", tags: ["皮肤", "掉毛"] },
    { id: 13, type: 'health', name: "Joint Care", brand: "Sasha", price: "¥299", weight: "1 Bottle", image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&q=80&w=300&h=300", tags: ["关节", "跛行"] },
  ],
  cat: [
    { id: 3, type: 'food', name: "Orijen Six Fish", brand: "Orijen", price: "¥580", weight: "5.4kg", image: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80&w=300&h=300", tags: ["日常", "美毛"] },
    { id: 4, type: 'food', name: "Royal Canin Gastro", brand: "Royal Canin", price: "¥245", weight: "2kg", image: "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&q=80&w=300&h=300", tags: ["肠胃", "软便"] },
    { id: 14, type: 'health', name: "Hairball Gel", brand: "RedDog", price: "¥79", weight: "120g", image: "https://images.unsplash.com/photo-1574158622682-e40e69881006?auto=format&fit=crop&q=80&w=300&h=300", tags: ["呕吐", "毛球"] },
    { id: 15, type: 'health', name: "Lysine", brand: "VetWish", price: "¥68", weight: "100g", image: "https://images.unsplash.com/photo-1596799331005-59b19e2c6596?auto=format&fit=crop&q=80&w=300&h=300", tags: ["感冒", "流鼻涕"] },
  ]
}

export default function Index() {
  const [petType, setPetType] = useState('dog')
  const [symptoms, setSymptoms] = useState('')
  const [age, setAge] = useState('')
  const [activePart, setActivePart] = useState('all') // new state for body part filter
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [report, setReport] = useState(null)
  const [selectedImages, setSelectedImages] = useState([])
  
  // 推荐商品状态
  const [recommendList, setRecommendList] = useState([])
  const [activeRecTab, setActiveRecTab] = useState('all') // all, food, health
  const [diagnosisTags, setDiagnosisTags] = useState([]) // 存储诊断出的关键词

  // Language
  const [lang, setLang] = useState('zh')
  const t = translations[lang].home

  // Reminders Check
  useEffect(() => {
    checkReminders()
  }, [])

  const checkReminders = () => {
    try {
      const allReminders = Taro.getStorageSync('pet_reminders') || {}
      
      // Calculate dates
      const today = new Date()
      const tomorrow = new Date(today)
      tomorrow.setDate(tomorrow.getDate() + 1)
      
      const todayStr = today.toISOString().split('T')[0]
      const tomorrowStr = tomorrow.toISOString().split('T')[0] // Simple ISO format
      
      const todayTasks = allReminders[todayStr] || []
      const tomorrowTasks = allReminders[tomorrowStr] || []
      
      let msg = ''
      if (todayTasks.length > 0) {
        msg += `📅 今天 (${todayStr}):\n${todayTasks.join('\n')}\n\n`
      }
      if (tomorrowTasks.length > 0) {
        msg += `⚠️ 明天 (${tomorrowStr}):\n${tomorrowTasks.join('\n')}`
      }
      
      if (msg) {
        Taro.showModal({
          title: '近期提醒',
          content: msg,
          showCancel: false,
          confirmText: '收到',
          confirmColor: '#6366f1'
        })
      }
    } catch (e) {}
  }

  useDidShow(() => {
    const savedLang = Taro.getStorageSync('petLang') || 'zh'
    setLang(savedLang)
    Taro.setNavigationBarTitle({ title: translations[savedLang].tabBar.home })
    updateTabBar(savedLang)
  })

  // Load from Storage
  useEffect(() => {
    try {
      const savedType = Taro.getStorageSync('petType')
      if (savedType) setPetType(savedType)
    } catch (e) {}
  }, [])

  // Auto-fill from Profile Pet Selection
  useDidShow(() => {
    try {
      // 检查是否有传递过来的选中的宠物 (from Profile)
      const pages = Taro.getCurrentPages()
      const current = pages[pages.length - 1]
      const { selectedPetId } = current.router.params

      if (selectedPetId) {
        const pets = Taro.getStorageSync('petDoctorPets') || []
        const pet = pets.find(p => String(p.id) === String(selectedPetId))
        if (pet) {
          setPetType(pet.type)
          setAge(pet.age)
          Taro.showToast({ title: `已载入 ${pet.name}`, icon: 'success' })
        }
      }
    } catch (e) {}
  })

  // 当宠物类型变化时，重置推荐列表为默认（日常）
  useEffect(() => {
    resetRecommendations(petType)
  }, [petType])

  const resetRecommendations = (type) => {
    setRecommendList(ALL_ITEMS[type])
    setDiagnosisTags([])
    setActivePart('all')
  }

  const handleTypeChange = (type) => {
    setPetType(type)
    Taro.setStorageSync('petType', type)
    setActivePart('all')
  }

  const getVisibleSymptoms = () => {
    if (activePart === 'all') {
      // 合并所有部位的症状
      const all = []
      Object.values(t.symptomsByPart[petType]).forEach(list => all.push(...list))
      return [...new Set(all)] // 去重
    }
    return t.symptomsByPart[petType][activePart] || []
  }

  const handleImageUpload = async () => {
    try {
      const res = await Taro.chooseImage({
        count: 3 - selectedImages.length,
        sizeType: ['compressed'],
        sourceType: ['album', 'camera']
      })
      if (res.tempFilePaths.length > 0) {
        setSelectedImages([...selectedImages, ...res.tempFilePaths])
      }
    } catch (e) {
      console.error(e)
    }
  }

  const handleAnalyze = async () => {
    if (!age || !symptoms) {
      Taro.showToast({ title: '请填写完整信息', icon: 'none' })
      return
    }

    setIsAnalyzing(true)
    
    // 调用 AI 服务 (如果没填 Key 会自动降级为模拟)
    const resultText = await diagnose(petType, age, symptoms, lang)
    
    // 模拟打字机效果 (为了更好的体验)
    let currentText = ''
    const chars = resultText.split('')
    setReport('') // 清空旧报告
    
    // 简单的打字机动画逻辑
    let i = 0
    const timer = setInterval(() => {
      if (i >= chars.length) {
        clearInterval(timer)
        setIsAnalyzing(false)
        return
      }
      currentText += chars[i]
      setReport(currentText) // 这里的 setReport 需要支持只存字符串
      i++
    }, 30) // 打字速度

    // 智能推荐逻辑 (增强版)
    const tags = []
    const s = symptoms.toLowerCase() // 转小写方便匹配

    // 肠胃相关 (Food / Digestive)
    if (match(s, ['拉稀', '呕吐', '软便', '不吃', '吐', 'diarrhea', 'vomit', 'appetite', 'eat', 'poop'])) {
      tags.push('health', 'digestive', 'food')
    }
    
    // 皮肤相关 (Skin)
    if (match(s, ['痒', '红', '挠', '掉毛', '皮屑', 'skin', 'itch', 'hair', 'scratch'])) {
      tags.push('health', 'skin')
    }

    // 关节/骨骼 (Joint)
    if (match(s, ['跛', '腿', '走', '痛', 'limp', 'walk', 'joint'])) {
      tags.push('health', 'joint')
    }
    
    // 如果没有匹配到任何特定症状，默认推荐一些通用的 (比如主粮)
    if (tags.length === 0) {
      tags.push('food')
    }
    
    if (tags.length > 0) {
      setDiagnosisTags(tags)
      const filtered = ALL_ITEMS[petType].filter(item => 
        tags.some(tag => item.tags.includes(tag))
      )
      // 如果筛选结果为空，就显示全部
      setRecommendList(filtered.length > 0 ? filtered : ALL_ITEMS[petType])
    } else {
      setRecommendList(ALL_ITEMS[petType])
    }
  }

  // Helper for keyword matching
  const match = (text, keywords) => {
    return keywords.some(k => text.includes(k))
  }

  const navTo = (url) => {
    Taro.navigateTo({ url })
  }

  const handleBuyItem = (item) => {
    Taro.showActionSheet({
      itemList: [t.copyTip, t.detailTip],
      success: function (res) {
        if (res.tapIndex === 0) {
          const searchWord = `${item.brand} ${item.name} ${item.weight}`
          Taro.setClipboardData({
            data: searchWord,
            success: () => {
              Taro.showToast({ title: t.copySuccess, icon: 'none', duration: 3000 })
            }
          })
        }
      }
    })
  }

  const toggleLang = () => {
    const newLang = lang === 'zh' ? 'en' : 'zh'
    setLang(newLang)
    Taro.setStorageSync('petLang', newLang)
    updateTabBar(newLang)
    Taro.showToast({ title: newLang === 'en' ? 'Switched to English' : '已切换中文', icon: 'none' })
  }

  return (
    <ScrollView className="container" scrollY>
      <View className="header">
        <View className="header-top">
          <Text className="title">{t.title}</Text>
          <View className="lang-glass-btn" onClick={toggleLang}>
            <Image 
              className="lang-flag" 
              src={lang === 'zh' ? 'https://api.iconify.design/circle-flags:cn.svg' : 'https://api.iconify.design/circle-flags:us.svg'} 
            />
            <Text className="lang-code">{lang === 'zh' ? 'CN' : 'EN'}</Text>
          </View>
        </View>
        <Text className="subtitle">{t.subtitle}</Text>
      </View>

      <View className="quick-access">
        <View className="quick-btn" onClick={() => navTo('/pages/age-calculator/index')}>
          <Text className="quick-icon">🧮</Text>
          <Text className="quick-text">{t.ageCalc}</Text>
        </View>
        <View className="quick-btn" onClick={() => navTo('/pages/clinics/index')}>
          <Text className="quick-icon">🏥</Text>
          <Text className="quick-text">{t.nearbyClinics}</Text>
        </View>
      </View>

      <View className="card">
        <Text className="section-title">{t.selectType}</Text>
        <View className="type-selector">
          <View 
            className={`type-btn ${petType === 'dog' ? 'active-dog' : ''}`}
            onClick={() => handleTypeChange('dog')}
          >
            <Text>{t.dog}</Text>
          </View>
          <View 
            className={`type-btn ${petType === 'cat' ? 'active-cat' : ''}`}
            onClick={() => handleTypeChange('cat')}
          >
            <Text>{t.cat}</Text>
          </View>
        </View>
      </View>

      <View className="card">
        <Text className="section-title">{t.basicInfo}</Text>
        <Input
          className="input"
          placeholder={t.agePlaceholder}
          value={age}
          onInput={e => setAge(e.detail.value)}
        />
        <Textarea
          className="textarea"
          placeholder={t.symptomsPlaceholder}
          value={symptoms}
          onInput={e => setSymptoms(e.detail.value)}
        />
        
        {/* Body Part Filter */}
        <View className="parts-scroll">
          {Object.keys(t.symptomParts).map(key => (
            <View 
              key={key} 
              className={`part-chip ${activePart === key ? 'active' : ''}`}
              onClick={() => setActivePart(key)}
            >
              <Text>{t.symptomParts[key]}</Text>
            </View>
          ))}
        </View>

        <View className="tags">
          {getVisibleSymptoms().map(sym => (
            <View 
              key={sym} 
              className="tag"
              onClick={() => setSymptoms(prev => prev ? `${prev}, ${sym}` : sym)}
            >
              <Text>{sym}</Text>
            </View>
          ))}
        </View>
      </View>

      <View className="card">
        <Text className="section-title">{t.uploadPhoto}</Text>
        <View className="image-uploader">
          {selectedImages.map((img, i) => (
            <Image key={i} src={img} className="preview-img" mode="aspectFill" />
          ))}
          {selectedImages.length < 3 && (
            <View className="add-btn" onClick={handleImageUpload}>
              <Text>+</Text>
            </View>
          )}
        </View>
      </View>

      <Button 
        className={`analyze-btn ${isAnalyzing ? 'disabled' : ''}`}
        onClick={handleAnalyze}
        disabled={isAnalyzing}
      >
        {isAnalyzing ? t.analyzing : t.startAnalyze}
      </Button>

      {report && (
        <>
          <View className="report-card">
            <Text className="report-title">{t.reportTitle}</Text>
            <Text className="report-content" userSelect>{report}</Text>
          </View>

          {/* 建议补充品区域已暂时隐藏
          <View className="card">
             ...
          </View> 
          */}
        </>
      )}

      <View className="footer">
        <Text>© 2025 AI Pet Doctor</Text>
      </View>
    </ScrollView>
  )
}

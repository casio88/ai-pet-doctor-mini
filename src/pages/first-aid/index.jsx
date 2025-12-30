import { useState } from 'react'
import { View, Text, ScrollView } from '@tarojs/components'
import Taro, { useDidShow } from '@tarojs/taro'
import { translations } from '../../utils/i18n'
import './index.css'

export default function FirstAid() {
  const [lang, setLang] = useState('zh')
  const t = translations[lang].firstAid

  useDidShow(() => {
    const savedLang = Taro.getStorageSync('petLang') || 'zh'
    setLang(savedLang)
    Taro.setNavigationBarTitle({ title: t.title })
  })

  // Icons mapping (since translation file only has text)
  const ICONS = ["☠️", "☀️", "🩸", "💓"]

  return (
    <ScrollView className="container" scrollY>
      <View className="nav-header">
        <View className="back-btn" onClick={() => Taro.navigateBack()}>
          <Text>❮</Text>
        </View>
        <Text className="nav-title">{t.title}</Text>
      </View>

      <View className="warning-banner">
        <Text>{t.warning}</Text>
      </View>

      <View className="guide-list">
        {t.items.map((item, idx) => (
          <View key={idx} className="guide-card">
            <View className="card-header">
              <Text className="icon">{ICONS[idx]}</Text>
              <Text className="title">{item.title}</Text>
            </View>
            <View className="steps">
              {item.steps.map((step, i) => (
                <View key={i} className="step-item">
                  <Text className="step-num">{i + 1}</Text>
                  <Text className="step-text">{step}</Text>
                </View>
              ))}
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  )
}

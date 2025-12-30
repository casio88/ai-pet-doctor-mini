import { useState } from 'react'
import { View, Text, Button, Slider, ScrollView } from '@tarojs/components'
import Taro, { useDidShow } from '@tarojs/taro'
import { translations } from '../../utils/i18n'
import './index.css'

export default function AgeCalculator() {
  const [petType, setPetType] = useState('dog')
  const [age, setAge] = useState(1)
  const [size, setSize] = useState('medium') // small, medium, large
  const [lang, setLang] = useState('zh')
  const t = translations[lang].ageCalc

  useDidShow(() => {
    const savedLang = Taro.getStorageSync('petLang') || 'zh'
    setLang(savedLang)
    Taro.setNavigationBarTitle({ title: t.title })
  })

  const calculateHumanAge = () => {
    let humanAge = 0
    if (petType === 'cat') {
      if (age === 1) humanAge = 15
      else if (age === 2) humanAge = 24
      else humanAge = 24 + (age - 2) * 4
    } else {
      // Dog
      if (age === 1) humanAge = 15
      else if (age === 2) humanAge = 24
      else {
        const base = 24
        const diff = age - 2
        if (size === 'small') humanAge = base + diff * 4
        else if (size === 'medium') humanAge = base + diff * 5
        else humanAge = base + diff * 6
      }
    }
    return humanAge
  }

  const getAgeStage = (hAge) => {
    if (hAge < 20) return t.stages.youth
    if (hAge < 50) return t.stages.prime
    if (hAge < 70) return t.stages.middle
    return t.stages.old
  }

  const humanAge = calculateHumanAge()
  const stage = getAgeStage(humanAge)

  return (
    <ScrollView className="container" scrollY>
      <View className="nav-header">
        <View className="back-btn" onClick={() => Taro.navigateBack()}>
          <Text>❮</Text>
        </View>
        <Text className="nav-title">{t.title}</Text>
      </View>

      <View className="card">
        <View className="type-toggle">
          <View 
            className={`type-btn ${petType === 'dog' ? 'active-dog' : ''}`}
            onClick={() => setPetType('dog')}
          >
            <Text>{t.dog}</Text>
          </View>
          <View 
            className={`type-btn ${petType === 'cat' ? 'active-cat' : ''}`}
            onClick={() => setPetType('cat')}
          >
            <Text>{t.cat}</Text>
          </View>
        </View>

        {petType === 'dog' && (
          <View className="size-selector">
            <Text className="label">{t.size}</Text>
            <View className="size-btns">
              {['small', 'medium', 'large'].map(s => (
                <View 
                  key={s}
                  className={`size-btn ${size === s ? 'active' : ''}`}
                  onClick={() => setSize(s)}
                >
                  <Text>{t[s]}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        <View className="age-slider">
          <View className="slider-header">
            <Text className="label">{t.currentAge}</Text>
            <Text className="age-val">{age} {t.ageUnit}</Text>
          </View>
          <Slider 
            min={1} 
            max={20} 
            value={age} 
            onChanging={e => setAge(e.detail.value)}
            onChange={e => setAge(e.detail.value)}
            activeColor="#6366f1"
            blockColor="#6366f1"
            blockSize={24}
          />
          <View className="slider-labels">
            <Text>1</Text>
            <Text>20</Text>
          </View>
        </View>
      </View>

      <View className="result-card">
        <Text className="result-label">{t.humanAge}</Text>
        <View className="result-val">
          <Text className="num">{humanAge}</Text>
          <Text className="unit">{t.ageUnit}</Text>
        </View>
        <View className="stage-badge">
          <Text>{stage.label}</Text>
        </View>
        <Text className="stage-desc">{stage.desc}</Text>
      </View>
    </ScrollView>
  )
}

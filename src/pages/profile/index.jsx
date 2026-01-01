import { useState } from 'react'
import { View, Text, Image, ScrollView, Input } from '@tarojs/components'
import Taro, { useDidShow } from '@tarojs/taro'
import { translations, updateTabBar } from '../../utils/i18n'
import './index.css'

export default function Profile() {
  const [profile, setProfile] = useState({
    name: '铲屎官',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
    uid: ''
  })
  const [pets, setPets] = useState([])
  const [lang, setLang] = useState('zh')
  
  const [isEditing, setIsEditing] = useState(false)
  const [tempName, setTempName] = useState('')
  
  const t = translations[lang].profile

  useDidShow(() => {
    const savedLang = Taro.getStorageSync('petLang') || 'zh'
    setLang(savedLang)
    updateTitle(savedLang)
    updateTabBar(savedLang)

    let uid = Taro.getStorageSync('petUserId')
    if (!uid) {
      uid = Math.floor(Math.random() * 9000) + 1000
      Taro.setStorageSync('petUserId', uid)
    }

    const savedProfile = Taro.getStorageSync('petUserProfile')
    if (savedProfile) {
      setProfile(savedProfile)
    } else {
      const initial = {
        name: '铲屎官',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
        uid: uid
      }
      setProfile(initial)
      Taro.setStorageSync('petUserProfile', initial)
    }

    const savedPets = Taro.getStorageSync('petDoctorPets')
    if (savedPets) setPets(savedPets)
  })

  const updateTitle = (l) => {
    Taro.setNavigationBarTitle({ title: translations[l].tabBar.profile })
  }

  const handleEditProfile = () => {
    setTempName(profile.name)
    setIsEditing(true)
  }

  const saveProfile = () => {
    const newProfile = { ...profile, name: tempName }
    setProfile(newProfile)
    Taro.setStorageSync('petUserProfile', newProfile)
    setIsEditing(false)
  }

  const navTo = (url) => {
    Taro.switchTab({ url }).catch(() => Taro.navigateTo({ url }))
  }

  const goHome = () => {
    Taro.switchTab({ url: '/pages/index/index' })
    setTimeout(() => {
      Taro.showToast({ title: '请在首页点击"AI诊断"来添加宠物', icon: 'none', duration: 3000 })
    }, 500)
  }

  return (
    <ScrollView className="container" scrollY>
      <View className="profile-header">
        <View className="avatar-box" onClick={handleEditProfile}>
          <Image src={profile.avatar} className="avatar" />
          <View className="edit-badge">✎</View>
        </View>
        
        {isEditing ? (
          <View className="edit-name-box">
            <Input 
              className="name-input"
              value={tempName}
              onInput={e => setTempName(e.detail.value)}
              focus
            />
            <View className="save-btn" onClick={saveProfile}>OK</View>
          </View>
        ) : (
          <Text className="username" onClick={handleEditProfile}>{profile.name}</Text>
        )}
        
        <Text className="userid">ID: {profile.uid || '---'}</Text>
      </View>

      <View className="stats-row">
        <View className="stat-item">
          <Text className="stat-num">0</Text>
          <Text className="stat-label">{t.posts}</Text>
        </View>
        <View className="stat-item">
          <Text className="stat-num">{pets.length}</Text>
          <Text className="stat-label">{t.pets}</Text>
        </View>
        <View className="stat-item">
          <Text className="stat-num">0</Text>
          <Text className="stat-label">{t.likes}</Text>
        </View>
      </View>

      <View className="menu-grid">
        <View className="menu-item" onClick={() => navTo('/pages/expenses/index')}>
          <View className="icon-box orange">💰</View>
          <Text className="menu-text">{t.expenses}</Text>
        </View>
        <View className="menu-item" onClick={() => navTo('/pages/calendar/index')}>
          <View className="icon-box blue">📅</View>
          <Text className="menu-text">{t.calendar}</Text>
        </View>
        <View className="menu-item" onClick={() => Taro.showToast({ title: '功能开发中...', icon: 'none' })}>
          <View className="icon-box green">🩺</View>
          <Text className="menu-text">{t.records}</Text>
        </View>
        <View className="menu-item" onClick={() => navTo('/pages/first-aid/index')}>
          <View className="icon-box red">⛑️</View>
          <Text className="menu-text">{t.firstAid}</Text>
        </View>
      </View>

      <View className="section">
        <View className="section-header">
          <Text className="section-title">{t.myPets}</Text>
          {/* ✅ 修复：添加了点击事件 */}
          <Text className="add-text" onClick={goHome}>{t.add}</Text>
        </View>
        <ScrollView scrollX className="pet-scroll">
          {pets.length > 0 ? pets.map(pet => (
            <View key={pet.id} className="pet-card">
              <View className="pet-icon">{pet.type === 'dog' ? '🐶' : '🐱'}</View>
              <Text className="pet-name">{pet.name}</Text>
              <Text className="pet-info">{pet.age} {t.boy === 'Boy' ? 'y/o' : '岁'} · {pet.gender === 'boy' ? t.boy : t.girl}</Text>
            </View>
          )) : (
            <View className="empty-pet" onClick={goHome}>
              <Text>{t.emptyPet}</Text>
            </View>
          )}
        </ScrollView>
      </View>
    </ScrollView>
  )
}
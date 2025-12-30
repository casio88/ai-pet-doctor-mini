import { useState, useEffect } from 'react'
import { View, Text, Image, ScrollView } from '@tarojs/components'
import Taro, { useDidShow } from '@tarojs/taro'
import { translations, updateTabBar } from '../../utils/i18n'
import './index.css'

export default function Profile() {
  const [profile, setProfile] = useState({
    name: '铲屎官',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix'
  })
  const [pets, setPets] = useState([])
  const [lang, setLang] = useState('zh')
  const t = translations[lang].profile

  useDidShow(() => {
    // Load Language
    const savedLang = Taro.getStorageSync('petLang') || 'zh'
    setLang(savedLang)
    updateTitle(savedLang)
    updateTabBar(savedLang)

    // Load Profile
    const savedProfile = Taro.getStorageSync('petUserProfile')
    if (savedProfile) setProfile(savedProfile)

    // Load Pets
    const savedPets = Taro.getStorageSync('petDoctorPets')
    if (savedPets) setPets(savedPets)
  })

  const updateTitle = (l) => {
    Taro.setNavigationBarTitle({ title: translations[l].tabBar.profile })
  }

  const handleEditProfile = () => {
    Taro.showToast({ title: t.edit, icon: 'none' })
  }

  const navTo = (url) => {
    Taro.navigateTo({ url })
  }

  return (
    <ScrollView className="container" scrollY>
      {/* Header */}
      <View className="profile-header">
        <View className="avatar-box" onClick={handleEditProfile}>
          <Image src={profile.avatar} className="avatar" />
          <View className="edit-badge">✎</View>
        </View>
        <Text className="username">{profile.name}</Text>
        <Text className="userid">ID: 8848</Text>
      </View>

      {/* Stats */}
      <View className="stats-row">
        <View className="stat-item">
          <Text className="stat-num">12</Text>
          <Text className="stat-label">{t.posts}</Text>
        </View>
        <View className="stat-item">
          <Text className="stat-num">3</Text>
          <Text className="stat-label">{t.pets}</Text>
        </View>
        <View className="stat-item">
          <Text className="stat-num">128</Text>
          <Text className="stat-label">{t.likes}</Text>
        </View>
      </View>

      {/* Menu Grid */}
      <View className="menu-grid">
        <View className="menu-item" onClick={() => navTo('/pages/expenses/index')}>
          <View className="icon-box orange">💰</View>
          <Text className="menu-text">{t.expenses}</Text>
        </View>
        <View className="menu-item" onClick={() => navTo('/pages/calendar/index')}>
          <View className="icon-box blue">📅</View>
          <Text className="menu-text">{t.calendar}</Text>
        </View>
        <View className="menu-item">
          <View className="icon-box green">🩺</View>
          <Text className="menu-text">{t.records}</Text>
        </View>
        <View className="menu-item" onClick={() => navTo('/pages/first-aid/index')}>
          <View className="icon-box red">⛑️</View>
          <Text className="menu-text">{t.firstAid}</Text>
        </View>
      </View>

      {/* My Pets */}
      <View className="section">
        <View className="section-header">
          <Text className="section-title">{t.myPets}</Text>
          <Text className="add-text">{t.add}</Text>
        </View>
        <ScrollView scrollX className="pet-scroll">
          {pets.length > 0 ? pets.map(pet => (
            <View key={pet.id} className="pet-card">
              <View className="pet-icon">{pet.type === 'dog' ? '🐶' : '🐱'}</View>
              <Text className="pet-name">{pet.name}</Text>
              <Text className="pet-info">{pet.age} {t.boy === 'Boy' ? 'y/o' : '岁'} · {pet.gender === 'boy' ? t.boy : t.girl}</Text>
            </View>
          )) : (
            <View className="empty-pet">
              <Text>{t.emptyPet}</Text>
            </View>
          )}
        </ScrollView>
      </View>
    </ScrollView>
  )
}

import { useState } from 'react'
import { View, Text, Image, ScrollView } from '@tarojs/components'
import Taro, { useDidShow } from '@tarojs/taro'
import { translations } from '../../utils/i18n'
import './index.css'

const PARTNERS = [
  {
    id: 1,
    name: "Sunny Pet Hospital",
    rating: 4.9,
    address: "88 Jianguo Road, Chaoyang District",
    phone: "010-12345678",
    tags: ["24h Emergency", "Imported Vaccines"],
    discount: "20% OFF Registration",
    image: "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&q=80&w=300&h=200",
    lat: 39.9042,
    lng: 116.4074
  },
  {
    id: 2,
    name: "Love Pet Clinic",
    rating: 4.8,
    address: "1 Zhongguancun St, Haidian District",
    phone: "010-87654321",
    tags: ["TCM Therapy", "Surgery"],
    discount: "Free Bath Trial",
    image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&q=80&w=300&h=200",
    lat: 39.9869,
    lng: 116.3059
  }
]

export default function Clinics() {
  const [lang, setLang] = useState('zh')
  const t = translations[lang].clinics

  useDidShow(() => {
    const savedLang = Taro.getStorageSync('petLang') || 'zh'
    setLang(savedLang)
    Taro.setNavigationBarTitle({ title: t.title })
  })

  const openLocation = (p) => {
    Taro.openLocation({
      latitude: p.lat,
      longitude: p.lng,
      name: p.name,
      address: p.address
    })
  }

  const searchNearby = () => {
    Taro.getLocation({
      type: 'gcj02',
      success: function (res) {
        Taro.openLocation({
          latitude: res.latitude,
          longitude: res.longitude,
          scale: 14,
          name: t.myLocation,
          address: t.viewing
        })
        Taro.showToast({ title: t.opened, icon: 'none', duration: 3000 })
      },
      fail: function () {
        Taro.showToast({ title: t.authFail, icon: 'none' })
      }
    })
  }

  const callPhone = (phone) => {
    Taro.makePhoneCall({ phoneNumber: phone })
  }

  return (
    <ScrollView className="container" scrollY>
      <View className="nav-header">
        <View className="back-btn" onClick={() => Taro.navigateBack()}>
          <Text>❮</Text>
        </View>
        <Text className="nav-title">{t.title}</Text>
      </View>

      <View className="header">
        <Text className="title">{t.title}</Text>
        <Text className="subtitle">{t.subtitle}</Text>
      </View>

      <View className="search-card" onClick={searchNearby}>
        <View className="search-icon">📍</View>
        <View className="search-text">
          <Text className="search-title">{t.searchMap}</Text>
          <Text className="search-desc">{t.searchDesc}</Text>
        </View>
        <View className="arrow">{'>'}</View>
      </View>

      <View className="list">
        {PARTNERS.map(p => (
          <View key={p.id} className="clinic-card">
            <Image src={p.image} className="clinic-img" mode="aspectFill" />
            <View className="clinic-info">
              <View className="row-between">
                <Text className="clinic-name">{p.name}</Text>
                <Text className="rating">⭐ {p.rating}</Text>
              </View>
              
              <View className="tags">
                {p.tags.map(tag => <Text key={tag} className="tag">{tag}</Text>)}
              </View>

              <Text className="address" onClick={() => openLocation(p)}>📍 {p.address}</Text>

              <View className="discount-box">
                <Text className="discount-text">🎁 {p.discount}</Text>
              </View>

              <View className="actions">
                <View className="btn nav" onClick={() => openLocation(p)}>{t.nav}</View>
                <View className="btn call" onClick={() => callPhone(p.phone)}>{t.call}</View>
              </View>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  )
}

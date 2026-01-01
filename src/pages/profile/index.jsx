import { useState } from 'react'
import { View, Text, Image, ScrollView, Input, Button } from '@tarojs/components'
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
  
  // Profile Edit State
  const [isEditing, setIsEditing] = useState(false)
  const [tempName, setTempName] = useState('')

  // Pet Add State
  const [isAddingPet, setIsAddingPet] = useState(false)
  const [newPetName, setNewPetName] = useState('')
  const [newPetType, setNewPetType] = useState('cat')
  const [newPetGender, setNewPetGender] = useState('boy')
  const [newPetAge, setNewPetAge] = useState('')
  
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

  const openAddPetModal = () => {
    setNewPetName('')
    setNewPetAge('')
    setNewPetType('cat')
    setNewPetGender('boy')
    setIsAddingPet(true)
  }

  const confirmAddPet = () => {
    if (!newPetName.trim()) {
      Taro.showToast({ title: '请输入名字', icon: 'none' })
      return
    }

    const newPet = {
      id: Date.now(),
      name: newPetName,
      type: newPetType,
      gender: newPetGender,
      age: newPetAge || '1',
      condition: 'Healthy'
    }

    const updatedPets = [newPet, ...pets]
    setPets(updatedPets)
    Taro.setStorageSync('petDoctorPets', updatedPets)
    
    setIsAddingPet(false)
    Taro.showToast({ title: '添加成功', icon: 'success' })
  }

  const handlePetClick = (pet) => {
    // Navigate to Home page and pass pet info
    Taro.switchTab({
      url: '/pages/index/index',
      success: () => {
        // 由于 switchTab 不能带参数，我们需要通过 globalData 或者 storage 来传递
        // 或者利用 Taro.reLaunch (但体验不好)
        // 这里最简单的办法是：在跳转前存一个标记，首页检测到标记就自动填充
        
        // 我们利用 getCurrentPages 获取不到目标页面实例，所以用 storage 最稳
        // 但为了更优雅，我们可以尝试 url query (小程序 switchTab 不支持 query，但 H5 支持)
        // 兼容方案：
        
        // 1. Save temp selected pet
        const pages = Taro.getCurrentPages()
        // H5 路由参数 hack
        if (Taro.getEnv() === Taro.ENV_TYPE.WEB) {
             Taro.navigateTo({ url: `/pages/index/index?selectedPetId=${pet.id}` })
             // 注意：switchTab 在 web 端表现可能不一致，我们这里如果是 web，直接 navigateTo 可能更好
             // 但因为 index 是 tabbar 页面，必须用 switchTab
        }
      }
    })
    
    // Hack for switchTab params: use Storage event or just plain storage check in Home onShow
    // 这里我们用一种更简单的方法：直接跳转，让首页去读取“最后选中的宠物”
    // 但用户体验最好的是：点击宠物 -> 首页自动填好它的信息
    
    // 最终方案：用 URL 参数 (仅 H5 有效) 或者 EventBus
    // 这里我们用最简单的：跳转
    Taro.switchTab({ url: `/pages/index/index?selectedPetId=${pet.id}` })
  }

  return (
    <ScrollView className="container" scrollY>
      {/* Header */}
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

      {/* Stats */}
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
        <View className="menu-item" onClick={() => navTo('/pages/records/index')}>
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
          <Text className="add-text" onClick={openAddPetModal}>{t.add}</Text>
        </View>
        <ScrollView scrollX className="pet-scroll">
          {pets.length > 0 ? pets.map(pet => (
            <View key={pet.id} className="pet-card" onClick={() => handlePetClick(pet)}>
              <View className="pet-icon">{pet.type === 'dog' ? '🐶' : '🐱'}</View>
              <Text className="pet-name">{pet.name}</Text>
              <Text className="pet-info">{pet.age} {t.boy === 'Boy' ? 'y/o' : '岁'} · {pet.gender === 'boy' ? t.boy : t.girl}</Text>
            </View>
          )) : (
            <View className="empty-pet" onClick={openAddPetModal}>
              <Text>{t.emptyPet}</Text>
            </View>
          )}
        </ScrollView>
      </View>

      {/* Add Pet Modal */}
      {isAddingPet && (
        <View className="modal-overlay">
          <View className="modal-content">
            <Text className="modal-title">添加新宠物</Text>
            
            <View className="form-item">
              <Text className="form-label">名字</Text>
              <Input 
                className="form-input" 
                placeholder="宠物名字"
                value={newPetName}
                onInput={e => setNewPetName(e.detail.value)}
              />
            </View>

            <View className="form-item">
              <Text className="form-label">种类</Text>
              <View className="tags-row">
                <View 
                  className={`tag-choice ${newPetType === 'cat' ? 'active' : ''}`}
                  onClick={() => setNewPetType('cat')}
                >🐱 猫猫</View>
                <View 
                  className={`tag-choice ${newPetType === 'dog' ? 'active' : ''}`}
                  onClick={() => setNewPetType('dog')}
                >🐶 狗狗</View>
              </View>
            </View>

            <View className="form-item">
              <Text className="form-label">性别</Text>
              <View className="tags-row">
                <View 
                  className={`tag-choice ${newPetGender === 'boy' ? 'active' : ''}`}
                  onClick={() => setNewPetGender('boy')}
                >👦 DD</View>
                <View 
                  className={`tag-choice ${newPetGender === 'girl' ? 'active' : ''}`}
                  onClick={() => setNewPetGender('girl')}
                >👧 MM</View>
              </View>
            </View>

            <View className="form-item">
              <Text className="form-label">年龄 (岁)</Text>
              <Input 
                className="form-input" 
                type="number"
                placeholder="1"
                value={newPetAge}
                onInput={e => setNewPetAge(e.detail.value)}
              />
            </View>

            <View className="modal-actions">
              <Button className="cancel-btn" onClick={() => setIsAddingPet(false)}>取消</Button>
              <Button className="confirm-btn" onClick={confirmAddPet}>保存</Button>
            </View>
          </View>
        </View>
      )}
    </ScrollView>
  )
}

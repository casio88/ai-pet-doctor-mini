import { useState, useEffect } from 'react'
import { View, Text, Image, ScrollView, Textarea, Button } from '@tarojs/components'
import Taro, { useDidShow } from '@tarojs/taro'
import { translations, updateTabBar } from '../../utils/i18n'
import './index.css'

const MOCK_POSTS = []

export default function Community() {
  // --- 审核模式开关 (上线后改为 false 可恢复社区功能) ---
  const isAuditMode = false 

  const [posts, setPosts] = useState([])
  const [newContent, setNewContent] = useState('')
  const [newTag, setNewTag] = useState('日常')
  const [newImage, setNewImage] = useState(null)
  const [activeFilter, setActiveFilter] = useState('all')
  const [lang, setLang] = useState('zh')
  const t = translations[lang].community

  useDidShow(() => {
    const savedLang = Taro.getStorageSync('petLang') || 'zh'
    setLang(savedLang)
    Taro.setNavigationBarTitle({ title: translations[savedLang].tabBar.community })
    updateTabBar(savedLang)
  })

  useEffect(() => {
    const saved = Taro.getStorageSync('petCommunityPosts')
    if (saved) {
      setPosts(saved)
    } else {
      setPosts(MOCK_POSTS)
    }
  }, [])

  const handleImageUpload = async () => {
    try {
      const res = await Taro.chooseImage({
        count: 1,
        sizeType: ['compressed'],
        sourceType: ['album', 'camera']
      })
      if (res.tempFilePaths.length > 0) {
        setNewImage(res.tempFilePaths[0])
      }
    } catch (e) {}
  }

  const handlePost = () => {
    if (!newContent) {
      return Taro.showToast({ title: t.emptyTip, icon: 'none' })
    }

    const post = {
      id: Date.now(),
      user: t.mockUser,
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix",
      content: newContent,
      image: newImage,
      likes: 0,
      comments: 0,
      time: t.timeJust,
      tag: newTag,
      liked: false
    }

    const newPosts = [post, ...posts]
    setPosts(newPosts)
    Taro.setStorageSync('petCommunityPosts', newPosts)
    
    setNewContent('')
    setNewImage(null)
    Taro.showToast({ title: t.publishSuccess, icon: 'success' })
  }

  const handleLike = (id) => {
    const newPosts = posts.map(p => {
      if (p.id === id) {
        return { ...p, likes: p.liked ? p.likes - 1 : p.likes + 1, liked: !p.liked }
      }
      return p
    })
    setPosts(newPosts)
    Taro.setStorageSync('petCommunityPosts', newPosts)
  }

  const filteredPosts = posts.filter(p => activeFilter === 'all' || p.tag === activeFilter)

  if (isAuditMode) {
    return (
      <ScrollView className="container" scrollY>
        <View className="header">
          <Text className="title">养宠百科 📚</Text>
        </View>
        <View className="post-list">
          {MOCK_POSTS.map(post => (
             <View key={post.id} className="post-card">
              <View className="post-header">
                <View className="user-info">
                   <Text className="username">💡 每日科普</Text>
                </View>
                <View className="post-tag">
                  <Text>#{post.tag}</Text>
                </View>
              </View>
              <Text className="post-content" userSelect>{post.content}</Text>
              {post.image && (
                <Image src={post.image} className="post-img" mode="aspectFill" />
              )}
            </View>
          ))}
          <View className="post-card">
             <View className="post-header">
                <View className="user-info">
                   <Text className="username">📢 官方公告</Text>
                </View>
             </View>
             <Text className="post-content">欢迎来到养宠百科！这里有最全的养宠知识，帮助您科学养宠。</Text>
          </View>
        </View>
      </ScrollView>
    )
  }

  return (
    <ScrollView className="container" scrollY>
      <View className="header">
        <Text className="title">{t.title}</Text>
      </View>

      {/* Filter Chips */}
      <ScrollView scrollX className="filter-scroll">
        <View 
          className={`filter-chip ${activeFilter === 'all' ? 'active' : ''}`}
          onClick={() => setActiveFilter('all')}
        >
          <Text>{t.tabAll}</Text>
        </View>
        <View 
          className={`filter-chip ${activeFilter === '日常' ? 'active' : ''}`}
          onClick={() => setActiveFilter('日常')}
        >
          <Text>{t.tabDaily}</Text>
        </View>
        <View 
          className={`filter-chip ${activeFilter === '求助' ? 'active' : ''}`}
          onClick={() => setActiveFilter('求助')}
        >
          <Text>{t.tabAsk}</Text>
        </View>
        <View 
          className={`filter-chip ${activeFilter === '晒宠' ? 'active' : ''}`}
          onClick={() => setActiveFilter('晒宠')}
        >
          <Text>{t.tabShow}</Text>
        </View>
      </ScrollView>

      {/* Post Input */}
      <View className="post-box">
        <Textarea 
          className="post-input" 
          placeholder={t.placeholder}
          value={newContent}
          onInput={e => setNewContent(e.detail.value)}
          maxlength={200}
        />
        
        {newImage && (
          <View className="preview-box">
            <Image src={newImage} className="preview-img" mode="aspectFill" />
            <View className="del-btn" onClick={() => setNewImage(null)}>×</View>
          </View>
        )}

        <View className="post-actions">
          <View className="tags-scroll">
            <View className={`tag-btn ${newTag === '日常' ? 'active' : ''}`} onClick={() => setNewTag('日常')}>{t.tabDaily}</View>
            <View className={`tag-btn ${newTag === '求助' ? 'active' : ''}`} onClick={() => setNewTag('求助')}>{t.tabAsk}</View>
            <View className={`tag-btn ${newTag === '晒宠' ? 'active' : ''}`} onClick={() => setNewTag('晒宠')}>{t.tabShow}</View>
          </View>
          <View className="icon-btn" onClick={handleImageUpload}>
            <Text className="icon">📷</Text>
          </View>
          <Button className="send-btn" onClick={handlePost}>{t.publish}</Button>
        </View>
      </View>

      {/* Post List */}
      <View className="post-list">
        {filteredPosts.map(post => (
          <View key={post.id} className="post-card">
            <View className="post-header">
              <Image src={post.avatar} className="avatar" />
              <View className="user-info">
                <Text className="username">{post.user}</Text>
                <Text className="time">{post.time}</Text>
              </View>
              <View className="post-tag">
                <Text>#{post.tag}</Text>
              </View>
            </View>

            <Text className="post-content" userSelect>{post.content}</Text>
            
            {post.image && (
              <Image src={post.image} className="post-img" mode="aspectFill" />
            )}

            <View className="post-footer">
              <View className={`action ${post.liked ? 'liked' : ''}`} onClick={() => handleLike(post.id)}>
                <Text>{post.liked ? '❤️' : '🤍'} {post.likes}</Text>
              </View>
              <View className="action">
                <Text>💬 {post.comments}</Text>
              </View>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  )
}

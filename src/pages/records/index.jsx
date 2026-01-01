import { useState } from 'react'
import { View, Text, ScrollView } from '@tarojs/components'
import Taro, { useDidShow } from '@tarojs/taro'
import { storage } from '../../utils/storage'
import './index.css'

export default function Records() {
  const [records, setRecords] = useState([])
  const [expandedId, setExpandedId] = useState(null)

  useDidShow(() => {
    Taro.setNavigationBarTitle({ title: '诊断记录' })
    loadRecords()
  })

  const loadRecords = () => {
    const list = storage.getRecords()
    setRecords(list)
  }

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id)
  }

  const handleDelete = (e, id) => {
    e.stopPropagation() // Prevent expanding
    Taro.showModal({
      title: '删除记录',
      content: '确定要删除这条诊断报告吗？',
      success: (res) => {
        if (res.confirm) {
          const newList = storage.deleteRecord(id)
          setRecords(newList)
          Taro.showToast({ title: '已删除', icon: 'none' })
        }
      }
    })
  }

  return (
    <ScrollView className="container" scrollY>
      <View className="nav-header">
        <View className="back-btn" onClick={() => Taro.navigateBack()}>
          <Text>❮</Text>
        </View>
        <Text className="nav-title">诊断记录</Text>
      </View>

      {records.length > 0 ? (
        <View className="list">
          {records.map(item => (
            <View key={item.id} className="record-card" onClick={() => toggleExpand(item.id)}>
              <View className="card-header">
                <View className="header-left">
                  <Text className="date">{item.date}</Text>
                  <View className="tags-row">
                    <Text className={`tag-type ${item.petType}`}>{item.petType === 'dog' ? '🐶' : '🐱'}</Text>
                    <Text className="tag-symptom">{item.symptoms.slice(0, 8)}...</Text>
                  </View>
                </View>
                <View className="del-btn" onClick={(e) => handleDelete(e, item.id)}>🗑️</View>
              </View>
              
              {expandedId === item.id && (
                <View className="card-body">
                  <Text className="full-symptom">症状描述: {item.symptoms}</Text>
                  <View className="divider"></View>
                  <Text className="result-title">AI 诊断建议:</Text>
                  <Text className="result-text" userSelect>{item.result}</Text>
                </View>
              )}
              
              {expandedId !== item.id && (
                <Text className="preview-text">点击查看详情 ▾</Text>
              )}
            </View>
          ))}
        </View>
      ) : (
        <View className="empty-state">
          <Text className="empty-icon">📭</Text>
          <Text className="empty-text">暂无诊断记录</Text>
          <Text className="empty-sub">去首页做个 AI 诊断吧</Text>
        </View>
      )}
    </ScrollView>
  )
}

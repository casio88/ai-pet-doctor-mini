import { useState, useEffect } from 'react'
import { View, Text, ScrollView } from '@tarojs/components'
import Taro, { useDidShow } from '@tarojs/taro'
import { translations } from '../../utils/i18n'
import { storage } from '../../utils/storage'
import './index.css'

export default function Calendar() {
  const [date, setDate] = useState(new Date())
  const [reminders, setReminders] = useState({})
  const [lang, setLang] = useState('zh')
  const t = translations[lang].calendar

  const days = ['日', '一', '二', '三', '四', '五', '六']

  useDidShow(() => {
    const savedLang = Taro.getStorageSync('petLang') || 'zh'
    setLang(savedLang)
    Taro.setNavigationBarTitle({ title: t.title })
    
    // Load Reminders
    const savedReminders = storage.getReminders()
    setReminders(savedReminders)
  })

  // 点击日期添加事件 (简单模拟: 点击即添加 "去医院")
  const handleDayClick = (day) => {
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    
    Taro.showModal({
      title: '添加提醒',
      content: `要在 ${dateStr} 添加提醒吗？`,
      success: function (res) {
        if (res.confirm) {
          const newReminders = storage.saveReminder(dateStr, '🏥 复诊')
          setReminders({...newReminders}) // 强制刷新
          Taro.showToast({ title: '已添加', icon: 'success' })
        }
      }
    })
  }

  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (year, month) => {
    return new Date(year, month, 1).getDay()
  }

  const renderCalendar = () => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const daysInMonth = getDaysInMonth(year, month)
    const firstDay = getFirstDayOfMonth(year, month)
    
    const calendarDays = []
    
    // Empty slots
    for (let i = 0; i < firstDay; i++) {
      calendarDays.push(<View key={`empty-${i}`} className="day empty"></View>)
    }

    // Days
    for (let i = 1; i <= daysInMonth; i++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`
      const hasEvent = reminders[dateStr]
      const isToday = new Date().toDateString() === new Date(year, month, i).toDateString()

      calendarDays.push(
        <View key={i} className={`day ${isToday ? 'today' : ''}`} onClick={() => handleDayClick(i)}>
          <Text className="day-num">{i}</Text>
          {hasEvent && <View className="dot"></View>}
        </View>
      )
    }

    return calendarDays
  }

  const getTodayTasks = () => {
    const todayStr = new Date().toISOString().split('T')[0]
    // 简单兼容时区，实际项目建议用 dayjs
    const d = new Date()
    const localStr = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`
    return reminders[localStr] || []
  }

  return (
    <ScrollView className="container" scrollY>
      <View className="nav-header">
        <View className="back-btn" onClick={() => Taro.navigateBack()}>
          <Text>❮</Text>
        </View>
        <Text className="nav-title">{t.title}</Text>
      </View>

      <View className="calendar-card">
        <View className="cal-header">
          <Text className="cal-title">{date.getFullYear()}年 {date.getMonth() + 1}月</Text>
        </View>

        <View className="week-row">
          {days.map(d => <Text key={d} className="week-day">{d}</Text>)}
        </View>

        <View className="days-grid">
          {renderCalendar()}
        </View>
      </View>

      <View className="reminder-list">
        <Text className="section-title">{t.todayTask}</Text>
        {getTodayTasks().length > 0 ? (
          getTodayTasks().map((task, idx) => (
            <View key={idx} className="task-item">
              <Text>✅ {task}</Text>
            </View>
          ))
        ) : (
          <View className="empty-box">
            <Text>{t.noTask}</Text>
          </View>
        )}
      </View>
    </ScrollView>
  )
}

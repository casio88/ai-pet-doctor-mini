import { useState } from 'react'
import { View, Text, ScrollView, Input, Button } from '@tarojs/components'
import Taro, { useDidShow } from '@tarojs/taro'
import { translations } from '../../utils/i18n'
import { storage } from '../../utils/storage'
import './index.css'

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date()) // The month being viewed
  const [selectedDate, setSelectedDate] = useState(new Date()) // The specific day selected
  const [reminders, setReminders] = useState({})
  const [newTask, setNewTask] = useState('')
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

  // Format date to YYYY-MM-DD
  const formatDate = (date) => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  const handleDayClick = (day) => {
    const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
    setSelectedDate(newDate)
  }

  const handleAddTask = () => {
    if (!newTask.trim()) return
    
    const dateStr = formatDate(selectedDate)
    const newReminders = storage.saveReminder(dateStr, newTask)
    setReminders({...newReminders})
    setNewTask('')
    Taro.showToast({ title: '已添加', icon: 'success' })
  }

  const handleDeleteTask = (index) => {
    const dateStr = formatDate(selectedDate)
    Taro.showModal({
      title: '删除提醒',
      content: '确定要删除这条提醒吗？',
      success: (res) => {
        if (res.confirm) {
          const newReminders = storage.deleteReminder(dateStr, index)
          setReminders({...newReminders})
        }
      }
    })
  }

  const changeMonth = (offset) => {
    const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + offset, 1)
    setCurrentDate(newDate)
  }

  const renderCalendar = () => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const firstDay = new Date(year, month, 1).getDay()
    
    const calendarDays = []
    
    // Empty slots
    for (let i = 0; i < firstDay; i++) {
      calendarDays.push(<View key={`empty-${i}`} className="day empty"></View>)
    }

    // Days
    for (let i = 1; i <= daysInMonth; i++) {
      const thisDate = new Date(year, month, i)
      const dateStr = formatDate(thisDate)
      const hasEvent = reminders[dateStr] && reminders[dateStr].length > 0
      
      const isSelected = formatDate(selectedDate) === dateStr
      const isToday = formatDate(new Date()) === dateStr

      calendarDays.push(
        <View 
          key={i} 
          className={`day ${isSelected ? 'selected' : ''} ${isToday ? 'today' : ''}`} 
          onClick={() => handleDayClick(i)}
        >
          <Text className="day-num">{i}</Text>
          {hasEvent && <View className="dot"></View>}
        </View>
      )
    }

    return calendarDays
  }

  const getSelectedTasks = () => {
    const dateStr = formatDate(selectedDate)
    return reminders[dateStr] || []
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
          <View className="month-btn" onClick={() => changeMonth(-1)}>❮</View>
          <Text className="cal-title">{currentDate.getFullYear()}年 {currentDate.getMonth() + 1}月</Text>
          <View className="month-btn" onClick={() => changeMonth(1)}>❯</View>
        </View>

        <View className="week-row">
          {days.map(d => <Text key={d} className="week-day">{d}</Text>)}
        </View>

        <View className="days-grid">
          {renderCalendar()}
        </View>
      </View>

      <View className="tasks-section">
        <Text className="section-title">
          {selectedDate.getMonth() + 1}月{selectedDate.getDate()}日 的事项
        </Text>
        
        <View className="add-box">
          <Input 
            className="task-input"
            placeholder="输入提醒事项 (如: 打疫苗)"
            value={newTask}
            onInput={e => setNewTask(e.detail.value)}
            confirmType="done"
            onConfirm={handleAddTask}
          />
          <View className="add-btn" onClick={handleAddTask}>+</View>
        </View>

        <View className="task-list">
          {getSelectedTasks().length > 0 ? (
            getSelectedTasks().map((task, idx) => (
              <View key={idx} className="task-item">
                <Text className="task-text">{task}</Text>
                <View className="del-btn" onClick={() => handleDeleteTask(idx)}>🗑️</View>
              </View>
            ))
          ) : (
            <View className="empty-box">
              <Text>{t.noTask}</Text>
            </View>
          )}
        </View>
      </View>
    </ScrollView>
  )
}

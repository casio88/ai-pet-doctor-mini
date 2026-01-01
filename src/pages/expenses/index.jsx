import { useState } from 'react'
import { View, Text, Input, Button, ScrollView } from '@tarojs/components'
import Taro, { useDidShow } from '@tarojs/taro'
import { translations } from '../../utils/i18n'
import { storage } from '../../utils/storage'
import './index.css'

export default function Expenses() {
  const [expenses, setExpenses] = useState([])
  const [amount, setAmount] = useState('')
  const [note, setNote] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [lang, setLang] = useState('zh')
  const t = translations[lang].expenses

  useDidShow(() => {
    const savedLang = Taro.getStorageSync('petLang') || 'zh'
    setLang(savedLang)
    Taro.setNavigationBarTitle({ title: t.title })
    
    // Load from Storage
    const savedList = storage.getExpenses()
    setExpenses(savedList)
  })

  const handleSave = () => {
    if (!amount) return

    if (editingId) {
      // Update
      const originalItem = expenses.find(i => i.id === editingId)
      const updatedItem = {
        id: editingId,
        amount,
        note: note || t.daily,
        date: originalItem ? originalItem.date : new Date().toLocaleDateString()
      }
      const newList = storage.updateExpense(updatedItem)
      setExpenses(newList)
      setEditingId(null)
      Taro.showToast({ title: '已更新', icon: 'success' })
    } else {
      // Create
      const newItem = {
        id: Date.now(),
        amount,
        note: note || t.daily,
        date: new Date().toLocaleDateString()
      }
      const newList = storage.saveExpense(newItem)
      setExpenses(newList)
      Taro.showToast({ title: t.save + ' Success', icon: 'success' })
    }
    
    setAmount('')
    setNote('')
  }

  const handleEdit = (item) => {
    setAmount(item.amount)
    setNote(item.note)
    setEditingId(item.id)
  }

  const handleDelete = (id) => {
    Taro.showModal({
      title: '确认删除',
      content: '确定要删除这条记录吗？',
      success: (res) => {
        if (res.confirm) {
          const newList = storage.deleteExpense(id)
          setExpenses(newList)
          if (editingId === id) {
            handleCancel()
          }
          Taro.showToast({ title: '已删除', icon: 'none' })
        }
      }
    })
  }

  const handleCancel = () => {
    setEditingId(null)
    setAmount('')
    setNote('')
  }

  return (
    <ScrollView className="container" scrollY>
      <View className="nav-header">
        <View className="back-btn" onClick={() => Taro.navigateBack()}>
          <Text>❮</Text>
        </View>
        <Text className="nav-title">{t.title}</Text>
      </View>

      <View className="card">
        <Text className="title">{t.total}</Text>
        <Text className="total-amount">¥{expenses.reduce((a, b) => a + Number(b.amount), 0)}</Text>
      </View>

      <View className="input-card">
        <Input 
          className="input"
          type="digit"
          placeholder="0.00"
          value={amount}
          onInput={e => setAmount(e.detail.value)}
        />
        <Input 
          className="input-note"
          placeholder={t.notePlaceholder}
          value={note}
          onInput={e => setNote(e.detail.value)}
        />
        
        <View className="btn-row">
          {editingId && (
            <Button className="cancel-btn" onClick={handleCancel}>取消</Button>
          )}
          <Button className="save-btn" onClick={handleSave}>
            {editingId ? '更新' : t.save}
          </Button>
        </View>
      </View>

      <View className="list">
        {expenses.map(item => (
          <View key={item.id} className={`item ${editingId === item.id ? 'editing' : ''}`}>
            <View className="item-info" onClick={() => handleEdit(item)}>
              <View>
                <Text className="item-note">{item.note}</Text>
                <Text className="item-date">{item.date}</Text>
              </View>
              <Text className="item-amount">-¥{item.amount}</Text>
            </View>
            
            <View className="action-row">
               <View className="icon-btn edit" onClick={() => handleEdit(item)}>✎</View>
               <View className="icon-btn del" onClick={() => handleDelete(item.id)}>🗑️</View>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  )
}

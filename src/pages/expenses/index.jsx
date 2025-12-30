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

  const handleAdd = () => {
    if (!amount) return
    const newItem = {
      id: Date.now(),
      amount,
      note: note || t.daily,
      date: new Date().toLocaleDateString()
    }
    
    // Save to Storage
    const newList = storage.saveExpense(newItem)
    setExpenses(newList)
    
    setAmount('')
    setNote('')
    Taro.showToast({ title: t.save + ' Success', icon: 'success' })
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
        <Button className="save-btn" onClick={handleAdd}>{t.save}</Button>
      </View>

      <View className="list">
        {expenses.map(item => (
          <View key={item.id} className="item">
            <View>
              <Text className="item-note">{item.note}</Text>
              <Text className="item-date">{item.date}</Text>
            </View>
            <Text className="item-amount">-¥{item.amount}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  )
}

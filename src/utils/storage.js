import Taro from '@tarojs/taro'

const KEYS = {
  EXPENSES: 'pet_expenses',
  REMINDERS: 'pet_reminders',
  PET_INFO: 'pet_info'
}

export const storage = {
  // --- Expenses ---
  getExpenses: () => {
    return Taro.getStorageSync(KEYS.EXPENSES) || []
  },
  saveExpense: (expense) => {
    const list = storage.getExpenses()
    const newList = [expense, ...list]
    Taro.setStorageSync(KEYS.EXPENSES, newList)
    return newList
  },
  
  // --- Reminders ---
  getReminders: () => {
    return Taro.getStorageSync(KEYS.REMINDERS) || {}
  },
  saveReminder: (dateStr, task) => {
    const data = storage.getReminders()
    if (!data[dateStr]) data[dateStr] = []
    data[dateStr].push(task)
    Taro.setStorageSync(KEYS.REMINDERS, data)
    return data
  },

  // --- Clear ---
  clearAll: () => {
    Taro.clearStorageSync()
  }
}

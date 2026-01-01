export default defineAppConfig({
  pages: [
    'pages/index/index',
    'pages/community/index',
    'pages/profile/index',
    'pages/calendar/index',
    'pages/expenses/index',
    'pages/age-calculator/index',
    'pages/first-aid/index',
    'pages/clinics/index',
    'pages/records/index' // 👈 必须有这一行！
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: 'AI 宠物医生',
    navigationBarTextStyle: 'black'
  },
  tabBar: {
    color: '#94a3b8',
    selectedColor: '#6366f1',
    backgroundColor: '#ffffff',
    list: [
      {
        pagePath: 'pages/index/index',
        text: '诊断',
        iconPath: 'assets/home.png',
        selectedIconPath: 'assets/home-active.png'
      },
      {
        pagePath: 'pages/community/index',
        text: '宠友圈',
        iconPath: 'assets/community.png',
        selectedIconPath: 'assets/community-active.png'
      },
      {
        pagePath: 'pages/profile/index',
        text: '我的',
        iconPath: 'assets/user.png',
        selectedIconPath: 'assets/user-active.png'
      }
    ]
  }
})
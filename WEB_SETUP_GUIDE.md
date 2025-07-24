# 🌐 MAKNA Web Setup Guide

## 🚀 Quick Start

Jalankan aplikasi MAKNA di web browser untuk testing dan development yang lebih mudah.

### **1. Install Dependencies**
```bash
npm install react-dom react-native-web --legacy-peer-deps
```

### **2. Run Web Version**
```bash
npm run web
```

Atau dengan clear cache:
```bash
npm run web-clear
```

### **3. Open Browser**
- Buka: http://localhost:8081
- App akan terbuka dalam responsive mobile view
- Max width: 480px (mobile-like experience)

## 🎯 Web Features

### ✅ **What Works on Web:**
- ✅ **Authentication Flow** - Sign up, Sign in, Sign out
- ✅ **Home Screen** - Real-time data dari Supabase
- ✅ **Profile Management** - View dan edit profile
- ✅ **Trip History** - Completed dan active trips
- ✅ **QR Code Input** - Manual QR input (no camera)
- ✅ **Trip Progress** - Building visits tracking
- ✅ **Badge System** - Earning dan displaying badges
- ✅ **Test Components** - Auth testing dan QR testing
- ✅ **Responsive Design** - Mobile-like experience di web

### ⚠️ **Web Limitations:**
- ❌ **Camera/QR Scanner** - Diganti dengan manual input
- ❌ **Native Alerts** - Diganti dengan browser confirm/alert
- ❌ **Push Notifications** - Tidak tersedia
- ❌ **Native Camera Roll** - Tidak tersedia

## 🛠️ Web-Specific Features

### **1. Debug Banner (Development Mode)**
- 🟣 **Purple banner** di atas app (hanya di dev mode)
- 📊 **Real-time debug info**: Auth status, user data, etc.
- 🔽 **Collapsible** - klik untuk expand/collapse

### **2. Manual QR Input**
- 📱 **QR Scanner** otomatis jadi **Manual Input** di web
- ✏️ **Text field** untuk input QR codes
- 🎯 **Quick test buttons** untuk Borobudur dan Prambanan
- 📋 **Available QR codes** ditampilkan

### **3. Enhanced Authentication Testing**
- 🧪 **Test Auth Flow** di Profile tab
- 📧 **Generate unique emails** untuk testing
- 🔄 **Real-time auth status** monitoring
- 📊 **Detailed error messages** untuk debugging

## 📱 Mobile-like Experience

### **Responsive Design:**
- 📏 **Max width**: 480px (standard mobile width)
- 🎨 **Centered layout** di desktop
- 📱 **Touch-friendly** button sizes
- 🎯 **Mobile-first** approach maintained

### **Navigation:**
- 📍 **Tab Navigation** works perfectly
- 🎯 **Floating QR button** functional
- 🔄 **Modal navigation** smooth transitions
- ✨ **Same UX** as mobile version

## 🧪 Testing Workflow

### **Authentication Testing:**
1. **Open web app** → http://localhost:8081
2. **Check debug banner** → Shows auth status
3. **Go to Profile tab** → Click "Test Auth Flow"
4. **Generate unique email** → Purple button
5. **Test sign up** → Should work immediately
6. **Test sign in** → Should work without email verification
7. **Check profile data** → Should load correctly

### **QR Trip Testing:**
1. **Click floating QR button** → Choose "Test QR"
2. **Click Quick Test buttons** → Borobudur atau Prambanan
3. **Start trip** → Should work normally
4. **Visit buildings** → Mark as visited
5. **Complete trip** → Should get badge
6. **Check history** → Should appear in history

### **Database Integration:**
- ✅ **All Supabase functions** work identically
- ✅ **Real-time data** updates
- ✅ **Authentication** fully functional
- ✅ **Trip tracking** works perfectly

## 🔧 Development Commands

```bash
# Start web development server
npm run web

# Start with clear cache
npm run web-clear

# Start with dev client (advanced)
npm run web-dev

# Standard mobile development (untuk comparison)
npm start
```

## 📊 Performance & Debugging

### **Browser DevTools:**
- 🔍 **Console logging** - Check for errors
- 🌐 **Network tab** - Monitor Supabase requests
- 📱 **Device simulation** - Test different screen sizes
- 🎯 **React DevTools** - Debug component state

### **Debug Tips:**
1. **Open browser console** untuk detailed logs
2. **Check Network tab** untuk Supabase API calls
3. **Use debug banner** untuk real-time app state
4. **Test Auth component** untuk detailed error messages

## 🚨 Common Issues & Solutions

### **Issue 1: "npm install fails"**
**Solution:**
```bash
npm install --legacy-peer-deps
```

### **Issue 2: "Web doesn't start"**
**Solution:**
```bash
npm run web-clear
# Or
npx expo start --web --clear
```

### **Issue 3: "Authentication not working"**
**Solution:**
- Check Supabase configuration
- Use Test Auth Flow untuk debugging
- Check debug banner for auth status

### **Issue 4: "Styles not loading"**
**Solution:**
- TailwindCSS should work automatically
- Check metro.config.js
- Clear cache dan restart

## 🎉 Benefits of Web Development

### **Faster Development:**
- 🚀 **Hot reload** lebih cepat
- 🔄 **No device/emulator** needed
- 🖥️ **Better debugging tools**
- 📊 **Real-time inspection**

### **Easy Testing:**
- 🧪 **Quick authentication testing**
- 📱 **Instant QR code testing**
- 🔍 **Browser DevTools debugging**
- 📊 **Network request monitoring**

### **Better Workflow:**
- 🖥️ **Multiple screens/windows**
- 📋 **Easy copy-paste testing**
- 🔄 **Quick iteration cycle**
- 🎯 **Focus on functionality**

## 🔗 Integration with Mobile

### **Consistent Experience:**
- 🎯 **Same codebase** - One source of truth
- 📱 **Identical functionality** (except camera)
- 🎨 **Same UI/UX** - Pixel-perfect match
- 💾 **Same database** - Shared Supabase

### **Deployment Ready:**
- 🌐 **Production ready** - Can deploy as PWA
- 📱 **Mobile responsive** - Works on tablets too
- 🔄 **Progressive Web App** potential
- 🎯 **Cross-platform** testing

## 🎯 Next Steps

1. **Start development**: `npm run web`
2. **Test authentication**: Use Test Auth Flow
3. **Test QR system**: Use manual QR input
4. **Debug issues**: Use browser DevTools + debug banner
5. **Iterate quickly**: Hot reload + instant testing

🚀 **Happy web development!** Now you can test MAKNA authentication and QR system efficiently in your browser! 
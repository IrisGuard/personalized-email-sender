# Professional Email Sender

[![Deploy Status](https://img.shields.io/badge/Deploy-LIVE-brightgreen)](https://personalized-email-sender.onrender.com)
[![Render](https://img.shields.io/badge/Powered%20by-Render-brightgreen)](https://render.com)
[![GitHub](https://img.shields.io/badge/GitHub-Repository-blue)](https://github.com/IrisGuard/personalized-email-sender)

**🌐 LIVE APPLICATION:** [https://personalized-email-sender.onrender.com](https://personalized-email-sender.onrender.com)

Εφαρμογή αποστολής επαγγελματικών email με React/TypeScript frontend και Node.js backend.

## 🚀 Quick Deploy

**ΑΜΕΣΗ ΕΚΤΕΛΕΣΗ - ΕΝΑΣ ΚΛΙΚ DEPLOYMENT:**

### Windows (PowerShell):
```powershell
.\deploy.ps1
```

### Linux/macOS (Bash):
```bash
chmod +x deploy.sh
./deploy.sh
```

## Δυνατότητες

- **Gmail SMTP Integration**: Άμεση αποστολή μέσω Gmail
- **Bulk Email Sending**: Αποστολή σε πολλαπλούς παραλήπτες
- **Image Upload Support**: Υποστήριξη εικόνων προσφορών
- **Email Validation**: Επικύρωση email addresses
- **Anti-Spam Protection**: Rate limiting για αξιοπιστία
- **Professional Templates**: HTML email templates με εταιρικό branding

## Τεχνικά Χαρακτηριστικά

- **Frontend**: React 18, TypeScript, Vite, TailwindCSS
- **Backend**: Node.js, Express, TypeScript
- **Email Provider**: Gmail SMTP
- **File Handling**: Multer για file uploads
- **Styling**: Modern UI components

## 📦 Installation

```bash
npm install
cd server && npm install
```

## ⚙️ Configuration

### Local Development
```bash
# Copy environment template
cp .env.example .env.local
```

### Environment Variables (Production - Render Dashboard)

```env
NODE_ENV=production
GMAIL_USER=your_gmail@gmail.com
GMAIL_APP_PASSWORD=your_app_password
COMPANY_NAME=AKROGONOS INTERNATIONAL GROUP
COMPANY_REPLY_TO=your_reply@gmail.com
```

## 🏗️ Build & Development

```bash
# Development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## 🌐 Deployment

### Αυτόματο Deployment με Scripts

**Για Windows:**
```powershell
.\deploy.ps1
```

**Για Linux/macOS:**
```bash
chmod +x deploy.sh
./deploy.sh
```

### Χειροκίνητο Deployment

1. **Git Setup:**
```bash
git init
git remote add origin https://github.com/IrisGuard/personalized-email-sender.git
git checkout -b main
```

2. **Build & Deploy:**
```bash
npm install && npm run build
cd server && npm install && npm run build && cd ..
git add .
git commit -m "Production deployment"
git push origin main
```

3. **Trigger Render Deploy:**
```bash
curl -X POST "https://api.render.com/deploy/srv-d1f6rtvgi27c73cfkvt0?key=sviLo3YSBS8"
```

## 🔧 Render Configuration

### Auto-Deploy Settings
- **Repository**: `https://github.com/IrisGuard/personalized-email-sender`
- **Branch**: `main`
- **Build Command**: `npm install && npm run build && cd server && npm install && npm run build`
- **Start Command**: `cd server && npm start`
- **Auto-Deploy**: ✅ Enabled on every commit

### Environment Variables Required
```env
NODE_ENV=production
GMAIL_USER=[YOUR_GMAIL_EMAIL]
GMAIL_APP_PASSWORD=[YOUR_APP_PASSWORD]
COMPANY_NAME=AKROGONOS INTERNATIONAL GROUP
COMPANY_REPLY_TO=[YOUR_REPLY_EMAIL]
```

## 🎯 Live URLs

- **Production**: https://personalized-email-sender.onrender.com
- **Dashboard**: https://dashboard.render.com
- **GitHub**: https://github.com/IrisGuard/personalized-email-sender

## 📊 Monitoring

### GitHub Actions
- ✅ Automatic CI/CD pipeline
- ✅ Build verification
- ✅ Auto-deployment on push to main

### Render Dashboard
- 📈 Real-time logs
- 📊 Performance metrics
- 🔄 Deployment history
- ⚡ Auto-scaling

## Email Capabilities

- **Rate Limiting**: Optimized για business use
- **Daily Capacity**: Hundreds of emails/ημέρα
- **Professional Templates**: Anti-spam headers και compliance
- **File Uploads**: Support για images και attachments

## 🛠️ Development Workflow

1. **Local Development:**
```bash
npm run dev  # Start frontend
cd server && npm run dev  # Start backend
```

2. **Testing:**
```bash
npm run build  # Verify build works
```

3. **Deployment:**
```bash
./deploy.ps1  # Windows
./deploy.sh   # Linux/macOS
```

## 🔐 Security

- Environment variables secured in Render
- HTTPS enforcement
- CORS protection
- Rate limiting enabled
- Gmail App Passwords (not regular passwords)

## 📞 Support

**AKROGONOS INTERNATIONAL GROUP**
- **Κεντρικά**: Γερωνυμάκη 104, Πατέλες Ηράκλειο Κρήτης
- **Τηλ**: 2811 812735 - 2811 812164
- **Πειραιάς**: Νοταρά 117
- **Τηλ**: 6939 366243 - 6907 793443
- **Website**: www.energiakakoufomata-koufomatapvc.gr
- **Email**: koufomataxondriki@gmail.com

## 🆘 Troubleshooting

### Common Issues

**Build Fails:**
```bash
rm -rf node_modules package-lock.json
rm -rf server/node_modules server/package-lock.json
npm install
cd server && npm install
npm run build
```

**Deployment Issues:**
1. Check environment variables in Render Dashboard
2. Verify GitHub connection
3. Check build logs in Render
4. Ensure main branch is pushed

**Email Issues:**
1. Verify Gmail App Password (not regular password)
2. Check GMAIL_USER and GMAIL_APP_PASSWORD in Render
3. Ensure 2FA is enabled on Gmail account

### Support Channels
- GitHub Issues: [Create Issue](https://github.com/IrisGuard/personalized-email-sender/issues)
- Direct Support: koufomataxondriki@gmail.com

---

## 🎉 Deployment Success Checklist

- ✅ **GitHub repository connected**
- ✅ **Render service configured**
- ✅ **Environment variables set**
- ✅ **Auto-deploy enabled**
- ✅ **Build successful**
- ✅ **Application live**
- ✅ **Email functionality working**

**🌟 Your Professional Email Sender is now LIVE and ready for business!**

<!-- Last updated: 2025-07-02 -->
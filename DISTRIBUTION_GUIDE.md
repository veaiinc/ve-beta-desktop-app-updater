# Distribution Guide for Ve AI Desktop App

This guide explains how to distribute your Windows-compatible Ve AI Desktop App to users.

## 🚀 Quick Start

### 1. Build Windows Package
```bash
npm run package:win
```

This creates:
- `dist/Ve.AI-x64-win.exe` - NSIS Installer
- `dist/Ve.AI-x64-win-portable.exe` - Portable Version

### 2. Distribution Methods

#### **Method A: Direct Download**
1. Upload installer files to your website
2. Create download links
3. Users download and install

#### **Method B: GitHub Releases (Recommended)**
1. Create a GitHub release
2. Upload the `.exe` files
3. Users get automatic update notifications

#### **Method C: Microsoft Store**
1. Register as Microsoft Developer
2. Submit app for review
3. Publish to Windows Store

## 📦 Package Types

### **NSIS Installer** (`Ve.AI-x64-win.exe`)
- ✅ Professional installer
- ✅ Creates Start Menu shortcuts
- ✅ Desktop shortcut option
- ✅ Uninstaller included
- ✅ Registry entries for file associations
- ✅ Requires admin privileges for installation

### **Portable Version** (`Ve.AI-x64-win-portable.exe`)
- ✅ No installation required
- ✅ Runs from any location
- ✅ No admin privileges needed
- ✅ Easy to distribute via USB
- ✅ No system changes

## 🔧 Installation Instructions for Users

### **For NSIS Installer:**
1. Download `Ve.AI-x64-win.exe`
2. Run the installer as Administrator
3. Follow installation wizard
4. Launch from Start Menu or Desktop shortcut

### **For Portable Version:**
1. Download `Ve.AI-x64-win-portable.exe`
2. Place in desired folder
3. Double-click to run
4. No installation required

## 🎯 User Experience

### **First Launch:**
- App checks for updates automatically
- Global shortcuts are registered
- Overlay windows are ready to use

### **Global Shortcuts:**
- `Ctrl+\` - Toggle overlay window
- `Ctrl+Enter` - Toggle Ask AI window
- `Ctrl+Arrow Keys` - Move overlay window
- `F12` - Toggle developer tools

### **Features Available:**
- ✅ Overlay window functionality
- ✅ Ask AI window
- ✅ Screen capture
- ✅ Clipboard operations
- ✅ Auto-updater
- ✅ All existing app features

## 📋 System Requirements

### **Minimum Requirements:**
- Windows 10 (version 1903) or later
- 4 GB RAM
- 500 MB free disk space
- Internet connection for updates

### **Recommended:**
- Windows 11
- 8 GB RAM
- 1 GB free disk space
- High-speed internet

## 🔒 Security Considerations

### **Code Signing (Recommended):**
- Sign your executable with a trusted certificate
- Prevents Windows SmartScreen warnings
- Builds user trust

### **Antivirus Compatibility:**
- Test with major antivirus software
- Submit false positives for whitelisting
- Consider code signing to reduce flags

## 📈 Distribution Channels

### **1. Your Website**
- Direct download links
- Version information
- Release notes
- Support documentation

### **2. GitHub Releases**
- Automatic version tracking
- Release notes
- Download statistics
- Issue tracking

### **3. Microsoft Store**
- Wide user reach
- Automatic updates
- Trusted distribution
- Revenue potential

### **4. Alternative Stores**
- Chocolatey (package manager)
- Scoop (package manager)
- Direct distribution

## 🛠️ Build Commands

### **Development:**
```bash
npm run dev:win
```

### **Production Build:**
```bash
npm run build:win
```

### **Package for Windows:**
```bash
npm run package:win
```

### **Clean Build:**
```bash
npm run clean:build:win
```

## 📝 Release Checklist

- [ ] Test on Windows 10 and 11
- [ ] Verify all features work
- [ ] Test global shortcuts
- [ ] Check antivirus compatibility
- [ ] Update version number
- [ ] Create release notes
- [ ] Build installer packages
- [ ] Test installer on clean system
- [ ] Upload to distribution channels
- [ ] Announce release

## 🆘 Troubleshooting

### **Common Issues:**

1. **Global Shortcuts Not Working**
   - Run as Administrator
   - Check for conflicting shortcuts
   - Try alternative shortcuts (Ctrl+Alt+O, Ctrl+Alt+A)

2. **Antivirus Blocking**
   - Add to antivirus exclusions
   - Submit for whitelisting
   - Use code signing

3. **Installation Fails**
   - Run as Administrator
   - Check disk space
   - Disable antivirus temporarily

4. **App Won't Start**
   - Check system requirements
   - Reinstall Visual C++ Redistributables
   - Check Windows Event Viewer for errors

## 📞 Support

### **For Users:**
- Create GitHub issues for bugs
- Provide system information
- Include error messages
- Describe steps to reproduce

### **For Developers:**
- Monitor crash reports
- Track usage analytics
- Respond to user feedback
- Maintain update schedule

## 🎉 Success Metrics

- Download count
- Installation success rate
- User retention
- Feature usage
- Support ticket volume
- User satisfaction

---

**Note:** This distribution guide assumes you have the necessary rights and permissions to distribute the Ve AI Desktop App. Ensure compliance with all applicable licenses and regulations.

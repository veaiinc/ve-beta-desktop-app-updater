# Notarize existing DMG files in dist/ folder
# Files: Ve.AI-x64-mac.dmg and Ve.AI-arm64-mac.dmg

echo "Starting notarization process..."

# Notarize Intel (x64) DMG
echo "Notarizing Intel (x64) DMG..."
xcrun notarytool submit dist/Ve.AI-x64-mac.dmg --keychain-profile veai-profile-2 --wait

# Notarize Apple Silicon (arm64) DMG
echo "Notarizing Apple Silicon (arm64) DMG..."
xcrun notarytool submit dist/Ve.AI-arm64-mac.dmg --keychain-profile veai-profile-2 --wait

echo "Notarization complete. Stapling DMG files..."

# Staple both DMG files
xcrun stapler staple dist/Ve.AI-x64-mac.dmg
xcrun stapler staple dist/Ve.AI-arm64-mac.dmg

echo "Stapling complete. DMG files are ready for distribution."
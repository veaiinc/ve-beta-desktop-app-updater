# npm run package:mac

xcrun notarytool submit dist/Ve.AI-x64-mac.dmg --keychain-profile veai-profile-2 --wait

xcrun stapler staple dist/Ve.AI-x64-mac.dmg
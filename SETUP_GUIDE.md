# AR Location Tracker - Complete Setup Guide

This is a **native mobile app** for iOS and Android. It cannot run in a web browser and requires a physical device or simulator.

## Why Web Won't Work

This app uses:
- Native camera access (expo-camera)
- GPS/Location services (expo-location)
- Device sensors like compass and accelerometer (expo-sensors)
- Native maps library (react-native-maps)

These features are **only available on iOS and Android**, not in web browsers.

## Prerequisites

### For Both iOS and Android:
1. **Node.js** (version 18+): https://nodejs.org/
2. **npm** (comes with Node.js)
3. **Expo CLI**:
   ```bash
   npm install -g expo-cli
   ```

### For iOS Development:
1. **Mac with Xcode** (required for iOS)
   - Download Xcode from App Store (free)
   - Command line tools: `xcode-select --install`

### For Android Development:
1. **Android Studio**: https://developer.android.com/studio
2. **Java Development Kit (JDK)** 17+
3. **Android SDK** (installed via Android Studio)

## Installation Steps

### Step 1: Clone/Download the Project

```bash
cd ~/projects  # or your preferred directory
# If from git:
git clone <repository-url> ar-location-tracker
cd ar-location-tracker
```

### Step 2: Install Dependencies

```bash
npm install
```

This will install all required packages including Expo, React Native, and all native modules.

### Step 3: Set Up Prebuild (Required for Native Modules)

```bash
npx expo prebuild --clean
```

This command:
- Creates native `ios/` and `android/` folders
- Installs native dependencies
- Configures native permissions

**Note:** Answer yes to overwrite if asked.

## Running on Devices

### Option A: Run on iOS

#### Requirements:
- Mac computer with Xcode
- iPhone or iOS simulator

#### Commands:

```bash
# Build and run on the default simulator
npx expo run:ios

# Or with specific simulator:
npx expo run:ios --simulator="iPhone 15"

# List available simulators:
xcrun simctl list devices
```

#### For Physical iPhone:
1. Connect iPhone via USB
2. Trust the computer on your iPhone
3. Run: `npx expo run:ios --device`

### Option B: Run on Android

#### Requirements:
- Android Studio or Android SDK
- Android device or emulator

#### Commands:

```bash
# Build and run on Android emulator
npx expo run:android

# First, start emulator (from Android Studio AVD Manager or):
emulator -avd <emulator_name>

# Then run:
npx expo run:android
```

#### For Physical Android Device:
1. Enable Developer Mode: Settings > About > tap Build Number 7 times
2. Enable USB Debugging: Settings > Developer Options > USB Debugging
3. Connect via USB and allow permission on device
4. Run: `npx expo run:android`

### Option C: Faster Development with Expo Go (Limited Features)

For quick testing without building:

```bash
npx expo start
```

Then:
- Scan QR code with **Expo Go app** (download from App Store/Play Store)

**Note:** Some features won't work perfectly in Expo Go because it doesn't include all native modules. For full AR and sensor features, use Option A or B.

## Quick Start (TL;DR)

### For Mac/iOS:
```bash
npm install
npx expo prebuild --clean
npx expo run:ios
```

### For Windows/Android:
```bash
npm install
npx expo prebuild --clean
npx expo run:android
```

## During Development

After initial setup, for faster rebuilds:

```bash
# Start development server
npx expo start

# Then press:
# - 'i' for iOS rebuild and run
# - 'a' for Android rebuild and run
# - 'r' for reload
# - 'q' to quit
```

## Project Structure

```
ar-location-tracker/
├── app/
│   ├── _layout.tsx          # Main layout
│   ├── index.tsx            # Home screen
│   └── +not-found.tsx       # 404 page
├── components/
│   ├── MapSelector.tsx      # Map selection component
│   └── ARCamera.tsx         # AR camera component
├── utils/
│   ├── geospatial.ts        # Bearing/distance calculations
├── hooks/
│   ├── useFrameworkReady.ts # Framework initialization
├── ios/                      # (generated) iOS native code
├── android/                  # (generated) Android native code
├── app.json                 # Expo configuration
├── package.json             # Dependencies
├── tsconfig.json            # TypeScript config
└── README.md                # App documentation
```

## Permissions

The app requests permissions at runtime. You'll see prompts for:

- **Camera**: For AR view
- **Location**: For GPS tracking
- **Motion Sensors**: For device orientation

Grant all permissions for full functionality.

## Troubleshooting

### "prebuild: command not found"
```bash
npm install -g expo-cli
```

### Xcode not found (macOS)
```bash
xcode-select --install
```

### Android emulator won't start
1. Open Android Studio
2. Go to AVD Manager
3. Create or start a virtual device
4. Then run `npx expo run:android`

### App crashes on launch
1. Clean build:
   ```bash
   npx expo prebuild --clean
   npx expo run:ios  # or :android
   ```
2. Check console for error messages
3. Ensure all permissions are granted on device

### "No connected devices"
- iOS: Make sure simulator is running or iPhone connected
- Android: Check `adb devices` to verify device is connected
  ```bash
  adb devices
  ```

### GPS not working
- Simulator: Use simulator's location menu
- Real device: Ensure location services are enabled

### Compass inaccurate
- Move device in figure-8 pattern to calibrate
- Keep away from magnetic interference

## File Size & Performance

- Initial build: ~500MB downloads (native dependencies)
- App size on device: ~100-150MB
- RAM usage: ~150-300MB while running

## Next Steps

1. **Build the app**: Follow "Running on Devices" section
2. **Test on simulator/device**: See it work in real-time
3. **Customize**: Edit components in `/app` and `/components`
4. **Deploy**: Use EAS Build for app store distribution

## Additional Resources

- **Expo Documentation**: https://docs.expo.dev/
- **React Native Docs**: https://reactnative.dev/
- **Expo Location API**: https://docs.expo.dev/versions/latest/sdk/location/
- **Expo Camera API**: https://docs.expo.dev/versions/latest/sdk/camera/
- **React Native Maps**: https://github.com/react-native-maps/react-native-maps

## Support

- Check the main README.md for usage instructions
- Review error messages carefully - they usually indicate the issue
- Ensure device OS is up to date
- Try rebuilding with `npx expo prebuild --clean`

---

**Remember**: This app **only works on iOS/Android devices or simulators**, not in web browsers. The browser preview in Bolt.new is not applicable for this native mobile app.

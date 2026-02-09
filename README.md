# AR Location Tracker

A location-based augmented reality mobile app built with React Native and Expo Dev Client. Select any location on a map and use your device's camera to see an AR marker pointing to that location in real-time.

## Features

- Interactive map interface for location selection
- Real-time AR camera view with directional markers
- Live distance and bearing calculations
- Device sensor integration (GPS, compass, accelerometer)
- Visual indicators when target is in/out of view
- Smooth marker positioning based on device orientation

## Technology Stack

- React Native with Expo Dev Client
- expo-camera for AR camera access
- expo-location for GPS coordinates
- expo-sensors for device orientation
- react-native-maps for map interface
- Custom geospatial calculations

## Prerequisites

- Node.js 18 or higher
- npm or yarn
- Expo CLI: `npm install -g expo-cli`
- Physical iOS or Android device (AR features require real sensors)
- Expo Go app OR Expo Dev Client (recommended)

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd ar-location-tracker
```

2. Install dependencies:
```bash
npm install
```

## Running the App

### Option 1: Using Expo Dev Client (Recommended for Full AR Features)

This app requires native modules for camera and sensors, so using Expo Dev Client is recommended.

#### For iOS:

1. Create a development build:
```bash
npx expo run:ios
```

This will:
- Install necessary native modules
- Build the app with Expo Dev Client
- Install it on your connected iOS device or simulator

2. After the build completes, start the development server:
```bash
npm run dev
```

#### For Android:

1. Create a development build:
```bash
npx expo run:android
```

This will:
- Install necessary native modules
- Build the app with Expo Dev Client
- Install it on your connected Android device or emulator

2. After the build completes, start the development server:
```bash
npm run dev
```

### Option 2: Using EAS Build (For Physical Devices)

If you want to test on a physical device without a cable connection:

1. Install EAS CLI:
```bash
npm install -g eas-cli
```

2. Login to your Expo account:
```bash
eas login
```

3. Configure the project:
```bash
eas build:configure
```

4. Build a development version:
```bash
# For iOS
eas build --profile development --platform ios

# For Android
eas build --profile development --platform android
```

5. Install the built app on your device and start the dev server:
```bash
npm run dev
```

## How to Use

1. **Map Selection View**:
   - The app opens with an interactive map
   - Your current location is marked with a blue navigation icon
   - Tap anywhere on the map to select a target location
   - A red pin will appear at the selected location
   - Review the coordinates displayed at the bottom

2. **Start AR Tracking**:
   - After selecting a location, tap "Start AR Tracking"
   - Grant camera and location permissions when prompted
   - The app switches to AR camera view

3. **AR Camera View**:
   - Point your device camera in different directions
   - A red arrow marker appears when the target is in view
   - The marker shows the distance to the target
   - Top info cards display:
     - Distance to target
     - Bearing to target (degrees from north)
     - Your current heading
   - If the target is not in view, rotate your device until you see the marker
   - Tap "Back to Map" to select a new location

## Project Structure

```
.
├── app/
│   ├── _layout.tsx          # Root layout
│   └── index.tsx            # Main app screen
├── components/
│   ├── MapSelector.tsx      # Map selection component
│   └── ARCamera.tsx         # AR camera view component
├── utils/
│   └── geospatial.ts        # Bearing and distance calculations
├── hooks/
│   └── useFrameworkReady.ts # Framework initialization hook
├── app.json                 # Expo configuration
└── package.json             # Dependencies
```

## Key Calculations

The app uses the Haversine formula for accurate geospatial calculations:

- **getBearing**: Calculates the bearing (direction) from user to target
- **getDistance**: Calculates the distance in meters between two coordinates
- **isInView**: Determines if the target is within the camera's field of view
- **normalizeAngle**: Normalizes angles to 0-360 degree range

## Permissions

The app requires the following permissions:

### iOS:
- Camera access (for AR view)
- Location when in use (for GPS tracking)
- Motion sensors (for device orientation)

### Android:
- Camera
- ACCESS_FINE_LOCATION
- ACCESS_COARSE_LOCATION

All permissions are requested at runtime when needed.

## Troubleshooting

### App won't load or shows blank screen:
- Make sure you're using a development build, not Expo Go
- Rebuild the app: `npx expo run:ios` or `npx expo run:android`

### Camera not working:
- Ensure camera permissions are granted in device settings
- Try restarting the app

### Location not updating:
- Check that location services are enabled
- Ensure the app has location permission
- Test outdoors for better GPS signal

### Compass inaccurate:
- Calibrate your device's compass by moving it in a figure-8 motion
- Avoid metal objects and magnetic interference

### Marker position seems off:
- The compass needs calibration on first use
- GPS accuracy affects position calculations
- Stand still for a few seconds to let GPS stabilize

## Development Notes

- The app must run on a physical device for full sensor access
- Simulators/emulators have limited sensor support
- AR marker positioning uses device compass heading
- Distance calculations are accurate to within a few meters
- The field of view (FOV) is set to 60 degrees

## Future Enhancements

- Support for multiple saved locations
- 3D models instead of simple arrow markers
- Distance-based marker scaling
- Vertical angle calculation for elevation
- Location history and favorites
- Share locations with other users

## License

MIT

## Support

For issues or questions, please open an issue on the GitHub repository.
# arloc_v1
# arloc_v1

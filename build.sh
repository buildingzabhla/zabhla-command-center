#!/usr/bin/env bash
set -euo pipefail

APP_NAME="Zabhla Brand Command Center"
ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"
BUILD_DIR="$ROOT_DIR/build"
APP_DIR="$BUILD_DIR/$APP_NAME.app"
MACOS_DIR="$APP_DIR/Contents/MacOS"
RESOURCES_DIR="$APP_DIR/Contents/Resources"

rm -rf "$APP_DIR"
mkdir -p "$MACOS_DIR" "$RESOURCES_DIR"

if [ -f "$ROOT_DIR/web/assets/zabhla-logo.png" ]; then
  cp "$ROOT_DIR/web/assets/zabhla-logo.png" "$RESOURCES_DIR/zabhla-logo.png"
  ICONSET="$BUILD_DIR/ZabhlaIcon.iconset"
  rm -rf "$ICONSET"
  mkdir -p "$ICONSET"
  sips -z 16 16 "$ROOT_DIR/web/assets/zabhla-logo.png" --out "$ICONSET/icon_16x16.png" >/dev/null
  sips -z 32 32 "$ROOT_DIR/web/assets/zabhla-logo.png" --out "$ICONSET/icon_16x16@2x.png" >/dev/null
  sips -z 32 32 "$ROOT_DIR/web/assets/zabhla-logo.png" --out "$ICONSET/icon_32x32.png" >/dev/null
  sips -z 64 64 "$ROOT_DIR/web/assets/zabhla-logo.png" --out "$ICONSET/icon_32x32@2x.png" >/dev/null
  sips -z 128 128 "$ROOT_DIR/web/assets/zabhla-logo.png" --out "$ICONSET/icon_128x128.png" >/dev/null
  sips -z 256 256 "$ROOT_DIR/web/assets/zabhla-logo.png" --out "$ICONSET/icon_128x128@2x.png" >/dev/null
  sips -z 256 256 "$ROOT_DIR/web/assets/zabhla-logo.png" --out "$ICONSET/icon_256x256.png" >/dev/null
  sips -z 512 512 "$ROOT_DIR/web/assets/zabhla-logo.png" --out "$ICONSET/icon_256x256@2x.png" >/dev/null
  sips -z 512 512 "$ROOT_DIR/web/assets/zabhla-logo.png" --out "$ICONSET/icon_512x512.png" >/dev/null
  cp "$ROOT_DIR/web/assets/zabhla-logo.png" "$ICONSET/icon_512x512@2x.png"
  iconutil -c icns "$ICONSET" -o "$RESOURCES_DIR/ZabhlaIcon.icns"
fi

/usr/bin/swiftc \
  -O \
  -parse-as-library \
  "$ROOT_DIR/ZabhlaCommandCenter/App.swift" \
  -o "$MACOS_DIR/$APP_NAME" \
  -framework SwiftUI \
  -framework AppKit \
  -framework Foundation \
  -framework Combine

cat > "$APP_DIR/Contents/Info.plist" <<PLIST
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>CFBundleDevelopmentRegion</key>
  <string>en</string>
  <key>CFBundleExecutable</key>
  <string>$APP_NAME</string>
  <key>CFBundleIdentifier</key>
  <string>com.zabhla.commandcenter</string>
  <key>CFBundleInfoDictionaryVersion</key>
  <string>6.0</string>
  <key>CFBundleName</key>
  <string>$APP_NAME</string>
  <key>CFBundleIconFile</key>
  <string>ZabhlaIcon</string>
  <key>CFBundlePackageType</key>
  <string>APPL</string>
  <key>CFBundleShortVersionString</key>
  <string>1.0</string>
  <key>CFBundleVersion</key>
  <string>1</string>
  <key>LSMinimumSystemVersion</key>
  <string>13.0</string>
  <key>NSHighResolutionCapable</key>
  <true/>
</dict>
</plist>
PLIST

echo "$APP_DIR"

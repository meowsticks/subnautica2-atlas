# Tauri Icon Placeholders

Drop an `icon.png` (32x32 minimum, 256x256 preferred) here before running
`npm run tauri build`. The build will use it for the app bundle.

For full cross-platform icon generation, run:

```bash
npm install -D @tauri-apps/cli
npx tauri icon path/to/source-icon.png
```

That creates all required sizes (icns / ico / png) in this folder.

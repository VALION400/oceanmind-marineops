# PWA Icons - Instructions

## Required Icons

You need to add two PNG icons to this directory:

1. **icon-192x192.png** - 192x192 pixels
2. **icon-512x512.png** - 512x512 pixels

## How to Create Icons

### Option 1: Use Online Generator (Easiest)
1. Go to https://favicon.io/favicon-generator/
2. Upload your logo or choose text "OM"
3. Download the generated icons
4. Rename to `icon-192x192.png` and `icon-512x512.png`
5. Place in this directory

### Option 2: Use Canva
1. Create design: 512x512 pixels
2. Add "OceanMind" text or logo
3. Export as PNG
4. Resize to 192x192 for second icon
5. Save to this directory

### Option 3: Use Existing Logo
If you have a logo:
```bash
# Using ImageMagick (install first: sudo apt install imagemagick)
convert logo.png -resize 192x192 icon-192x192.png
convert logo.png -resize 512x512 icon-512x512.png
```

## Temporary Solution (For Testing)

For now, the PWA will work without icons. Users will see a default icon until you add these files.

**The app is fully functional without custom icons!**

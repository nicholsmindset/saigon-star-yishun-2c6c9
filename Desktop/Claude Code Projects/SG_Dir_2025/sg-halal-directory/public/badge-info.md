# Singapore Halal Directory Badge

## Badge Files

- `badge.svg` - Scalable vector badge (recommended for web use)
- `badge.png` - Raster image badge (200x80px, to be created from SVG)

## Creating PNG from SVG

To create the PNG version, you can use:

### Option 1: Online converter
1. Visit https://cloudconvert.com/svg-to-png
2. Upload badge.svg
3. Set dimensions to 200x80px
4. Download as badge.png

### Option 2: ImageMagick (command line)
```bash
convert -background none badge.svg -resize 200x80 badge.png
```

### Option 3: Figma/Sketch/Adobe Illustrator
1. Open badge.svg
2. Export as PNG at 200x80px
3. Save as badge.png

## Badge Specifications

- Dimensions: 200x80 pixels
- Format: SVG (vector) and PNG (raster)
- Colors: Emerald gradient (#059669 to #047857)
- Text: "SINGAPORE HALAL DIRECTORY" + "CERTIFIED"
- Rounded corners: 8px radius

## Usage in Badge Generator

The badge generator references these files for:
- Preview display in the badge generator page
- HTML embed code that links to business detail pages
- Visual representation of halal certification

## Implementation Notes

Business owners embed this badge on their websites with a link back to their Singapore Halal Directory listing. Our system verifies the backlink and rewards them with 1 free month of featured listing status ($29 value).

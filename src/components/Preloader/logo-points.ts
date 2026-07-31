export interface Point {
  x: number
  y: number
}

// TUNE: image URL relative to site root (place target.png in public/)
const IMAGE_URL = '/target.png'
// TUNE: longest side in px for the offscreen sampling canvas
const MAX_SAMPLE_SIZE = 400
// TUNE: fallback text rendered when no image is available
const FALLBACK_TEXT = 'GAUVREAU'

let cachedPoints: Point[] | null = null
let cachedCount = 0
let pendingLoad: Promise<Point[]> | null = null

function shuffleInPlace<T>(arr: T[]): void {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]]
  }
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error(`Failed to load ${src}`))
    img.src = src
  })
}

function sampleFromImage(img: HTMLImageElement, count: number): Point[] {
  const scale = Math.min(MAX_SAMPLE_SIZE / img.width, MAX_SAMPLE_SIZE / img.height, 1)
  const w = Math.round(img.width * scale)
  const h = Math.round(img.height * scale)

  const c = document.createElement('canvas')
  c.width = w
  c.height = h
  const cx = c.getContext('2d')!
  cx.drawImage(img, 0, 0, w, h)

  const data = cx.getImageData(0, 0, w, h).data
  const candidates: Point[] = []

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const idx = (y * w + x) * 4
      const r = data[idx], g = data[idx + 1], b = data[idx + 2], a = data[idx + 3]
      const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b
      if (a > 128 || lum < 100) {
        candidates.push({ x, y })
      }
    }
  }

  if (candidates.length === 0) return []

  shuffleInPlace(candidates)
  const selected = candidates.slice(0, count)
  const maxDim = Math.max(w, h)

  return selected.map(p => ({
    x: (p.x - w / 2) / (maxDim / 2),
    y: (p.y - h / 2) / (maxDim / 2),
  }))
}

function sampleFromText(text: string, count: number): Point[] {
  const fontSize = 240
  const fontFamily = 'Cormorant Garamond, Georgia, serif'

  const c = document.createElement('canvas')
  const cx = c.getContext('2d')!
  cx.font = `bold ${fontSize}px ${fontFamily}`
  const m = cx.measureText(text)
  const pad = 48
  const w = Math.ceil(m.width + pad * 2)
  const h = Math.ceil(fontSize * 2.2)
  c.width = w
  c.height = h
  cx.fillStyle = '#fff'
  cx.font = `bold ${fontSize}px ${fontFamily}`
  cx.textBaseline = 'middle'
  cx.textAlign = 'center'
  cx.fillText(text, w / 2, h / 2)

  const data = cx.getImageData(0, 0, w, h).data
  const pixels: Point[] = []

  const step = Math.max(2, Math.ceil(Math.sqrt((w * h) / count / 4)))

  for (let y = 0; y < h; y += step) {
    for (let x = 0; x < w; x += step) {
      const idx = (y * w + x) * 4
      if (data[idx + 3] > 128) {
        pixels.push({ x: (x / w) * 2 - 1, y: (y / h) * 2 - 1 })
      }
    }
  }

  if (pixels.length === 0) {
    const spiral: Point[] = []
    for (let i = 0; i < count; i++) {
      const t = i / count
      const a = t * Math.PI * 4
      const r = t * 0.8
      spiral.push({ x: Math.cos(a) * r, y: Math.sin(a) * r })
    }
    return spiral
  }

  const out: Point[] = []
  for (let i = 0; i < count; i++) {
    out.push({ ...pixels[i % pixels.length] })
  }
  return out
}

export async function sampleLogoPoints(count: number): Promise<Point[]> {
  if (cachedPoints && cachedCount === count) return cachedPoints

  if (!pendingLoad) {
    pendingLoad = (async () => {
      const points = sampleFromText(FALLBACK_TEXT, count)
      cachedPoints = points
      cachedCount = count
      return points
    })()
  }

  return await pendingLoad
}

export function clearPointCache(): void {
  cachedPoints = null
  cachedCount = 0
  pendingLoad = null
}

# 圖片與媒體處理指南

## 核心原則

使用 Next.js 的 Image 元件進行所有圖片顯示，以獲得最佳的效能優化。

## 圖片處理規範

### 使用 Next.js Image 元件

```tsx
import Image from 'next/image'

// 基本使用
<Image
  src="/images/product.jpg"
  alt="產品圖片描述" // 必須提供有意義的 alt 文字
  width={400}
  height={400}
  className="rounded-lg"
/>

// 響應式圖片
<Image
  src="/images/hero.jpg"
  alt="首頁橫幅"
  width={1200}
  height={600}
  className="w-full h-auto"
  priority // 首屏圖片應加上 priority
/>

// 外部圖片 - 方案一：使用 img 標籤（推薦初期使用）
<img
  src="https://images.unsplash.com/photo-xxx"
  alt="產品圖片"
  className="w-full h-auto rounded-lg"
  loading="lazy"
/>

// 外部圖片 - 方案二：配置後使用 Next.js Image
// 需要先在 next.config.ts 中配置域名
<Image
  src="https://images.unsplash.com/photo-xxx"
  alt="產品圖片"
  width={400}
  height={400}
/>
```

### 圖片尺寸要求

1. **產品圖片**：建議 400x400 或 800x800（正方形）
2. **橫幅圖片**：建議 1920x600 或 1200x400
3. **頭像圖片**：建議 200x200 或 400x400
4. **縮圖**：建議 150x150 或 300x300

### 圖片格式建議

- **照片類**：使用 JPEG 格式，品質 80-90%
- **圖標/Logo**：使用 SVG 或 PNG 格式
- **動畫**：使用 GIF 或 WebM 格式

## 載入狀態處理

### 基礎載入占位符

```tsx
import Image from 'next/image'

function ProductImage({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      />
    </div>
  )
}
```

### 使用 Skeleton 載入效果

```tsx
import { Skeleton } from "@/components/ui/skeleton"

function ImageSkeleton() {
  return <Skeleton className="aspect-square w-full rounded-lg" />
}

// 在圖片載入時顯示
function ProductCard({ product }: { product: Product }) {
  const [imageLoaded, setImageLoaded] = useState(false)
  
  return (
    <div className="relative">
      {!imageLoaded && <ImageSkeleton />}
      <Image
        src={product.image_url}
        alt={product.name}
        width={400}
        height={400}
        onLoad={() => setImageLoaded(true)}
        className={imageLoaded ? 'opacity-100' : 'opacity-0'}
      />
    </div>
  )
}
```

## 錯誤處理

### 圖片載入失敗處理

```tsx
function SafeImage({ src, alt, fallbackSrc = "/images/placeholder.jpg", ...props }) {
  const [imgSrc, setImgSrc] = useState(src)
  const [hasError, setHasError] = useState(false)

  return (
    <Image
      {...props}
      src={imgSrc}
      alt={alt}
      onError={() => {
        if (!hasError) {
          setHasError(true)
          setImgSrc(fallbackSrc)
        }
      }}
    />
  )
}
```

### 預設圖片配置

在 `public/images/` 目錄下準備以下預設圖片：
- `placeholder.jpg` - 通用占位圖
- `product-placeholder.jpg` - 產品占位圖
- `avatar-placeholder.jpg` - 頭像占位圖
- `error-image.jpg` - 錯誤狀態圖

## 效能優化

### 圖片預載入策略

```tsx
// 首屏重要圖片
<Image priority src="/hero.jpg" alt="首頁橫幅" />

// 懶載入（預設行為）
<Image src="/product.jpg" alt="產品圖片" loading="lazy" />
```

### 響應式圖片大小

```tsx
<Image
  src="/responsive-image.jpg"
  alt="響應式圖片"
  width={1200}
  height={600}
  sizes="(max-width: 640px) 100vw,
         (max-width: 1024px) 75vw,
         (max-width: 1280px) 50vw,
         33vw"
/>
```

## 無障礙考量

### Alt 文字規範

1. **必須提供** - 所有圖片都必須有 alt 屬性
2. **描述性** - 描述圖片內容，而非"圖片"或"照片"
3. **簡潔** - 控制在 125 個字符以內
4. **裝飾性圖片** - 使用空 alt 屬性 `alt=""`

### 範例

```tsx
// ✅ 好的 alt 文字
<Image alt="白色 Nike 運動鞋側面圖" />
<Image alt="使用者 John Doe 的個人頭像" />
<Image alt="購物車內有 3 件商品" />

// ❌ 不好的 alt 文字
<Image alt="圖片" />
<Image alt="product.jpg" />
<Image alt="點擊查看詳情" />
```

## 實作範例

### 完整的產品圖片元件

```tsx
import { useState } from 'react'
import Image from 'next/image'
import { Skeleton } from '@/components/ui/skeleton'

interface ProductImageProps {
  src: string
  alt: string
  priority?: boolean
  className?: string
}

export function ProductImage({ 
  src, 
  alt, 
  priority = false,
  className = ""
}: ProductImageProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  
  const fallbackSrc = '/images/product-placeholder.jpg'
  
  return (
    <div className={`relative aspect-square overflow-hidden rounded-lg ${className}`}>
      {isLoading && (
        <Skeleton className="absolute inset-0" />
      )}
      
      <Image
        src={hasError ? fallbackSrc : src}
        alt={alt}
        fill
        priority={priority}
        className={`
          object-cover transition-opacity duration-300
          ${isLoading ? 'opacity-0' : 'opacity-100'}
        `}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setHasError(true)
          setIsLoading(false)
        }}
      />
    </div>
  )
}
```

## 外部圖片處理

### 使用 img 標籤（快速方案）

當你需要快速顯示外部圖片時，可以直接使用 HTML img 標籤：

```tsx
// 簡單可靠，無需配置
<img
  src={product.image_url}
  alt={product.name}
  className="w-full h-auto object-cover rounded-lg"
  loading="lazy"
  onError={(e) => {
    e.currentTarget.src = '/images/product-placeholder.jpg'
  }}
/>
```

### 配置 Next.js Image（優化方案）

如果要使用 Next.js Image 元件處理外部圖片，需要在 `next.config.ts` 中配置：

```typescript
// next.config.ts
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
      // 添加其他需要的域名
    ],
  },
}
```

## 實用的圖片元件

### 靈活的圖片元件（自動判斷使用哪種方式）

```tsx
interface FlexibleImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
  priority?: boolean
}

export function FlexibleImage({ 
  src, 
  alt, 
  width = 400, 
  height = 400,
  className = "",
  priority = false 
}: FlexibleImageProps) {
  const [hasError, setHasError] = useState(false)
  const isExternal = src.startsWith('http')
  
  // 外部圖片或發生錯誤時使用 img 標籤
  if (isExternal || hasError) {
    return (
      <img
        src={hasError ? '/images/placeholder.jpg' : src}
        alt={alt}
        className={`${className} w-full h-auto`}
        loading={priority ? 'eager' : 'lazy'}
        onError={() => setHasError(true)}
      />
    )
  }
  
  // 本地圖片使用 Next.js Image
  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      priority={priority}
      onError={() => setHasError(true)}
    />
  )
}
```

## 注意事項

1. **開發階段建議** - 初期開發使用 img 標籤，避免配置問題
2. **外部圖片域名配置** - 使用 Next.js Image 需在 `next.config.ts` 中配置域名
3. **圖片優化** - img 標籤不會有 Next.js 的自動優化，但能確保圖片顯示
4. **版權考量** - 確保使用的圖片有適當的授權
5. **錯誤處理** - 始終提供 fallback 圖片路徑
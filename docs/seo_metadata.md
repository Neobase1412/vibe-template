# SEO 與 Metadata 指南

## 核心原則

良好的 SEO 和 Metadata 設置能提升網站在搜尋引擎的排名，並改善社群分享時的呈現效果。

## 基礎 Metadata 設定

### 靜態頁面 Metadata

```tsx
import { Metadata } from 'next'

export const metadata: Metadata = {
  // 基本資訊
  title: '產品列表 | Vibe Store',
  description: '探索我們精心挑選的優質產品，找到最適合您生活風格的選擇。',
  
  // 關鍵字（選填，現代 SEO 較少使用）
  keywords: ['電商', '購物', '優質產品', '生活用品'],
  
  // 作者資訊
  authors: [{ name: 'Vibe Store Team' }],
  
  // 網站資訊
  applicationName: 'Vibe Store',
  generator: 'Next.js',
  
  // 爬蟲指令
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}
```

### 動態頁面 Metadata

```tsx
import { Metadata } from 'next'

interface Props {
  params: { id: string }
  searchParams: { [key: string]: string | string[] | undefined }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = await getProduct(params.id)
  
  if (!product) {
    return {
      title: '產品不存在',
      description: '抱歉，您查找的產品不存在。',
    }
  }

  return {
    title: `${product.name} - ${formatPrice(product.price_in_cents)} | Vibe Store`,
    description: product.description || `購買 ${product.name}，享受優質生活。`,
    
    // 動態 Open Graph
    openGraph: {
      title: product.name,
      description: product.description,
      images: [
        {
          url: product.image_url,
          width: 1200,
          height: 630,
          alt: product.name,
        }
      ],
    },
  }
}
```

## Open Graph 設定

### 基礎 Open Graph

```tsx
export const metadata: Metadata = {
  openGraph: {
    type: 'website',
    locale: 'zh_TW',
    url: 'https://vibestore.com',
    siteName: 'Vibe Store',
    title: '首頁 | Vibe Store',
    description: '發現優質生活用品的最佳選擇',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Vibe Store',
      }
    ],
  },
}
```

### 產品頁面 Open Graph

```tsx
export const metadata: Metadata = {
  openGraph: {
    type: 'product',
    title: '經典白色運動鞋',
    description: '舒適百搭的經典運動鞋',
    images: [
      {
        url: 'https://example.com/shoe-1.jpg',
        width: 800,
        height: 800,
        alt: '經典白色運動鞋正面圖',
      },
      {
        url: 'https://example.com/shoe-2.jpg',
        width: 800,
        height: 800,
        alt: '經典白色運動鞋側面圖',
      }
    ],
    // 產品特定資訊
    availability: 'in stock',
    priceCurrency: 'TWD',
    price: '2980',
  },
}
```

## Twitter Card 設定

```tsx
export const metadata: Metadata = {
  twitter: {
    card: 'summary_large_image',
    site: '@vibestore',
    creator: '@vibestore',
    title: '探索優質生活用品',
    description: '在 Vibe Store 發現讓生活更美好的產品',
    images: ['/twitter-card.jpg'],
  },
}
```

## 結構化數據（JSON-LD）

### 產品結構化數據

```tsx
// app/products/[id]/page.tsx
import { Product } from '@/types'

function generateProductJsonLd(product: Product) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    image: product.image_url,
    description: product.description,
    offers: {
      '@type': 'Offer',
      priceCurrency: 'TWD',
      price: (product.price_in_cents / 100).toString(),
      availability: 'https://schema.org/InStock',
      seller: {
        '@type': 'Organization',
        name: 'Vibe Store',
      },
    },
  }
}

export default function ProductPage({ product }: { product: Product }) {
  const jsonLd = generateProductJsonLd(product)
  
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* 頁面內容 */}
    </>
  )
}
```

### 網站結構化數據

```tsx
// app/layout.tsx
const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Vibe Store',
  url: 'https://vibestore.com',
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: 'https://vibestore.com/search?q={search_term_string}',
    },
    'query-input': 'required name=search_term_string',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
```

## Sitemap 生成

### 靜態 Sitemap

```tsx
// app/sitemap.ts
import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://vibestore.com'
  
  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 1,
    },
    {
      url: `${baseUrl}/products`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ]
}
```

### 動態 Sitemap

```tsx
// app/sitemap.ts
import { MetadataRoute } from 'next'

async function getProducts() {
  const res = await fetch('https://vibestore.com/api/products')
  return res.json()
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://vibestore.com'
  const products = await getProducts()
  
  // 靜態頁面
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'yearly' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/products`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
  ]
  
  // 產品頁面
  const productPages = products.map((product: Product) => ({
    url: `${baseUrl}/products/${product.id}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }))
  
  return [...staticPages, ...productPages]
}
```

## Robots.txt 設定

```tsx
// app/robots.ts
import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/admin/', '/private/'],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
      },
    ],
    sitemap: 'https://vibestore.com/sitemap.xml',
  }
}
```

## 效能優化建議

### 1. 預載入關鍵資源

```tsx
export const metadata: Metadata = {
  other: {
    'link rel="preconnect"': 'https://fonts.googleapis.com',
    'link rel="dns-prefetch"': 'https://images.unsplash.com',
  },
}
```

### 2. 標題階層結構

```tsx
// ✅ 正確的標題階層
<h1>頁面主標題</h1>
  <h2>章節標題</h2>
    <h3>子章節標題</h3>

// ❌ 錯誤的標題階層
<h1>頁面主標題</h1>
  <h3>跳過 h2</h3>
```

### 3. 圖片 Alt 優化

```tsx
// SEO 友好的 alt 文字
<Image 
  alt="白色 Nike Air Max 運動鞋側面展示圖" 
  // 而非 "product-image-1.jpg"
/>
```

## 多語言 SEO

```tsx
export const metadata: Metadata = {
  alternates: {
    canonical: 'https://vibestore.com/products',
    languages: {
      'zh-TW': 'https://vibestore.com/zh-tw/products',
      'en-US': 'https://vibestore.com/en/products',
    },
  },
}
```

## 檢查清單

### 每個頁面必備

- [ ] 唯一且描述性的 title（50-60 字符）
- [ ] 吸引人的 description（150-160 字符）
- [ ] 適當的 Open Graph 圖片（1200x630）
- [ ] 正確的頁面 URL
- [ ] 合適的 robots 指令

### 產品頁面額外需求

- [ ] 結構化數據（Product schema）
- [ ] 多張產品圖片
- [ ] 價格和庫存資訊
- [ ] 用戶評價（如有）

### 網站整體

- [ ] sitemap.xml 自動生成
- [ ] robots.txt 正確配置
- [ ] 404 頁面有返回首頁連結
- [ ] 網站速度優化（Core Web Vitals）

## 測試工具

1. **Google Rich Results Test** - 測試結構化數據
2. **Facebook Sharing Debugger** - 測試 Open Graph
3. **Twitter Card Validator** - 測試 Twitter Card
4. **Google PageSpeed Insights** - 測試效能和 SEO
5. **Chrome Lighthouse** - 綜合 SEO 評分

## 注意事項

1. **動態內容** - 確保爬蟲可以看到動態生成的內容
2. **重複內容** - 使用 canonical 標籤避免重複內容問題
3. **移動優先** - 確保移動版本的 SEO 優化
4. **載入速度** - 影響 SEO 排名的重要因素
5. **HTTPS** - 使用安全連線是現代 SEO 的基本要求
# Data Center API 使用範例

這份文件提供實際的程式碼範例，展示如何在 Vibe Template 中使用 Data Center API。

## 🔧 環境設定

首先，確保您有正確的環境變數：

```env
# .env.local
NEXT_PUBLIC_SUPABASE_URL=https://pqiyjbkqiwvnkpdhowqq.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
REF_CODE=REF_ABC123
```

## 📦 商品相關範例

### 1. 獲取所有商品

```typescript
// app/page.tsx
import { supabase } from '@/lib/supabase'

async function getProducts() {
  const { data: products, error } = await supabase
    .from('products')
    .select(`
      id,
      name,
      price_in_cents,
      image_url,
      merchant:merchants (
        id,
        name,
        base_product_url
      )
    `)
    .order('price_in_cents', { ascending: true })

  if (error) {
    console.error('Error fetching products:', error)
    return []
  }

  return products
}

export default async function HomePage() {
  const products = await getProducts()
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}
```

### 2. 獲取特定商品

```typescript
// 根據 ID 列表獲取商品
async function getSelectedProducts(productIds: string[]) {
  const { data: products, error } = await supabase
    .from('products')
    .select(`
      *,
      merchant:merchants(*)
    `)
    .in('id', productIds)

  return products || []
}

// 使用範例
const myProducts = await getSelectedProducts([
  'PROD_001',
  'PROD_004',
  'PROD_007'
])
```

### 3. 商品篩選和搜尋

```typescript
// 價格範圍篩選
async function getProductsByPriceRange(minPrice: number, maxPrice: number) {
  const { data } = await supabase
    .from('products')
    .select('*, merchant:merchants(*)')
    .gte('price_in_cents', minPrice * 100)
    .lte('price_in_cents', maxPrice * 100)
    .order('price_in_cents')

  return data || []
}

// 商品名稱搜尋
async function searchProducts(keyword: string) {
  const { data } = await supabase
    .from('products')
    .select('*, merchant:merchants(*)')
    .ilike('name', `%${keyword}%`)

  return data || []
}
```

## 🔗 推薦連結生成

### 1. 基礎連結生成

```typescript
// lib/utils.ts
export function generateRefLink(
  product: {
    id: string
    merchant: {
      base_product_url: string
    }
  },
  refCode: string
): string {
  return `${product.merchant.base_product_url}/${product.id}?ref=${refCode}`
}
```

### 2. 在組件中使用

```tsx
// components/ProductCard.tsx
import { generateRefLink } from '@/lib/utils'

interface ProductCardProps {
  product: {
    id: string
    name: string
    price_in_cents: number
    image_url: string | null
    merchant: {
      name: string
      base_product_url: string
    }
  }
}

export function ProductCard({ product }: ProductCardProps) {
  const refCode = process.env.REF_CODE || 'REF_DEFAULT'
  const purchaseLink = generateRefLink(product, refCode)

  return (
    <div className="border rounded-lg p-4">
      {product.image_url && (
        <img 
          src={product.image_url} 
          alt={product.name}
          className="w-full h-48 object-cover rounded mb-4"
        />
      )}
      <h3 className="font-bold text-lg">{product.name}</h3>
      <p className="text-gray-600">
        來自 {product.merchant.name}
      </p>
      <p className="text-2xl font-bold mt-2">
        NT${Math.floor(product.price_in_cents / 100)}
      </p>
      <a
        href={purchaseLink}
        target="_blank"
        rel="noopener noreferrer"
        className="block w-full bg-blue-600 text-white text-center py-2 rounded mt-4 hover:bg-blue-700"
      >
        立即購買
      </a>
    </div>
  )
}
```

## 🎨 進階範例

### 1. 商品展示頁面（含載入狀態）

```tsx
// app/products/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export default function ProductsPage() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    loadProducts()
  }, [filter])

  async function loadProducts() {
    setLoading(true)
    
    let query = supabase
      .from('products')
      .select('*, merchant:merchants(*)')

    // 應用篩選
    if (filter === 'cheap') {
      query = query.lte('price_in_cents', 10000) // NT$100 以下
    } else if (filter === 'expensive') {
      query = query.gte('price_in_cents', 50000) // NT$500 以上
    }

    const { data } = await query
    setProducts(data || [])
    setLoading(false)
  }

  if (loading) {
    return <div className="text-center p-8">載入中...</div>
  }

  return (
    <div className="container mx-auto p-4">
      <div className="mb-6">
        <select 
          value={filter} 
          onChange={(e) => setFilter(e.target.value)}
          className="border rounded px-4 py-2"
        >
          <option value="all">所有商品</option>
          <option value="cheap">NT$100 以下</option>
          <option value="expensive">NT$500 以上</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {products.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  )
}
```

### 2. 使用 Server Components（推薦）

```tsx
// app/featured/page.tsx
import { supabase } from '@/lib/supabase'
import { ProductGrid } from '@/components/ProductGrid'

// 這個函數會在伺服器端執行
async function getFeaturedProducts() {
  // 假設我們想展示特定的精選商品
  const featuredIds = ['PROD_001', 'PROD_004', 'PROD_007', 'PROD_010']
  
  const { data } = await supabase
    .from('products')
    .select('*, merchant:merchants(*)')
    .in('id', featuredIds)

  return data || []
}

export default async function FeaturedPage() {
  const products = await getFeaturedProducts()

  return (
    <main className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">精選商品</h1>
      <ProductGrid products={products} />
    </main>
  )
}
```

### 3. API Route 使用範例

```typescript
// app/api/products/search/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const query = searchParams.get('q')
  const minPrice = searchParams.get('min_price')
  const maxPrice = searchParams.get('max_price')

  let supabaseQuery = supabase
    .from('products')
    .select('*, merchant:merchants(*)')

  // 關鍵字搜尋
  if (query) {
    supabaseQuery = supabaseQuery.ilike('name', `%${query}%`)
  }

  // 價格範圍
  if (minPrice) {
    supabaseQuery = supabaseQuery.gte('price_in_cents', parseInt(minPrice) * 100)
  }
  if (maxPrice) {
    supabaseQuery = supabaseQuery.lte('price_in_cents', parseInt(maxPrice) * 100)
  }

  const { data, error } = await supabaseQuery

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data || [])
}
```

## 🧪 測試範例

### 使用 cURL 測試 API

```bash
# 獲取所有商品
curl -X GET \
  "https://pqiyjbkqiwvnkpdhowqq.supabase.co/rest/v1/products?select=*,merchant:merchants(*)" \
  -H "apikey: your_anon_key" \
  -H "Authorization: Bearer your_anon_key"

# 獲取特定價格範圍的商品
curl -X GET \
  "https://pqiyjbkqiwvnkpdhowqq.supabase.co/rest/v1/products?select=*&price_in_cents=gte.10000&price_in_cents=lte.50000" \
  -H "apikey: your_anon_key" \
  -H "Authorization: Bearer your_anon_key"

# 搜尋商品名稱
curl -X GET \
  "https://pqiyjbkqiwvnkpdhowqq.supabase.co/rest/v1/products?select=*&name=ilike.*筆記本*" \
  -H "apikey: your_anon_key" \
  -H "Authorization: Bearer your_anon_key"
```

### 在瀏覽器 Console 測試

```javascript
// 直接在瀏覽器測試
async function testAPI() {
  const response = await fetch(
    'https://pqiyjbkqiwvnkpdhowqq.supabase.co/rest/v1/products?select=*,merchant:merchants(*)',
    {
      headers: {
        'apikey': 'your_anon_key',
        'Authorization': 'Bearer your_anon_key'
      }
    }
  )
  const data = await response.json()
  console.log('Products:', data)
}

testAPI()
```

## 💡 最佳實踐

1. **快取商品資料**：商品資料不常變動，可以使用 Next.js 的快取機制
2. **錯誤處理**：始終處理 API 錯誤，提供友好的錯誤訊息
3. **載入狀態**：在獲取資料時顯示載入指示器
4. **環境變數**：不要在程式碼中硬編碼 API keys
5. **類型安全**：使用 TypeScript 定義商品類型

```typescript
// types/product.ts
export interface Product {
  id: string
  merchant_id: string
  name: string
  price_in_cents: number
  image_url: string | null
  merchant: {
    id: string
    name: string
    base_product_url: string
  }
}
```

## 🔐 安全注意事項

1. **只使用 ANON KEY**：在前端只使用 anon key，不要暴露 service key
2. **驗證 REF_CODE**：確保 REF_CODE 環境變數正確設定
3. **HTTPS Only**：所有 API 請求都應該使用 HTTPS
4. **CORS**：Supabase 已經處理 CORS，但注意不要在前端暴露敏感資料

---

需要更多範例？查看 [完整文件](./data_center_integration.md) 或在 GitHub Issues 提問！
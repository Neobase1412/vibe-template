# 載入與錯誤狀態指南

## 核心策略：Boundary + Redirect

本專案使用 Next.js App Router 的 Error Boundary 和 Loading Boundary 機制，配合適當的重定向來處理各種狀態。

## Loading Boundary（載入邊界）

### 基礎 loading.tsx 文件

在每個路由目錄中創建 `loading.tsx` 文件，自動處理該路由的載入狀態：

```tsx
// app/products/loading.tsx
import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Skeleton className="h-8 w-48 mb-6" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="space-y-3">
            <Skeleton className="aspect-square rounded-lg" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        ))}
      </div>
    </div>
  )
}
```

### 使用 Suspense Boundary

對於更細粒度的載入控制，使用 Suspense：

```tsx
import { Suspense } from 'react'
import { ProductList } from '@/components/ProductList'
import { ProductListSkeleton } from '@/components/ProductListSkeleton'

export default function ProductsPage() {
  return (
    <div>
      <h1>產品列表</h1>
      <Suspense fallback={<ProductListSkeleton />}>
        <ProductList />
      </Suspense>
    </div>
  )
}
```

### 載入狀態元件模式

```tsx
// components/skeletons/ProductCardSkeleton.tsx
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"

export function ProductCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="p-0">
        <Skeleton className="aspect-square w-full" />
      </CardHeader>
      <CardContent className="p-4">
        <Skeleton className="h-4 w-3/4 mb-2" />
        <Skeleton className="h-3 w-1/2" />
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Skeleton className="h-10 w-full" />
      </CardFooter>
    </Card>
  )
}

// 使用範例
export function ProductGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {[...Array(count)].map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  )
}
```

## Error Boundary（錯誤邊界）

### 基礎 error.tsx 文件

在路由目錄中創建 `error.tsx` 文件，捕獲該路由的錯誤：

```tsx
// app/products/error.tsx
'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { AlertCircle } from 'lucide-react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // 記錄錯誤到錯誤報告服務
    console.error('Product page error:', error)
  }, [error])

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-md mx-auto text-center">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2">載入產品時發生錯誤</h2>
        <p className="text-gray-600 mb-6">
          {error.message || '發生了未預期的錯誤，請稍後再試。'}
        </p>
        <div className="space-x-4">
          <Button onClick={reset}>重試</Button>
          <Button variant="outline" onClick={() => window.location.href = '/'}>
            返回首頁
          </Button>
        </div>
      </div>
    </div>
  )
}
```

### 全域錯誤處理

創建 `app/global-error.tsx` 處理根層級錯誤：

```tsx
'use client'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html>
      <body>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">發生了嚴重錯誤</h2>
            <p className="mb-4">應用程式遇到了問題，請重新整理頁面。</p>
            <button
              onClick={reset}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              重新整理
            </button>
          </div>
        </div>
      </body>
    </html>
  )
}
```

## Not Found 處理

### 404 頁面

創建 `app/not-found.tsx`：

```tsx
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-300 mb-4">404</h1>
        <h2 className="text-2xl font-semibold mb-2">頁面不存在</h2>
        <p className="text-gray-600 mb-8">
          抱歉，您訪問的頁面不存在或已被移除。
        </p>
        <Link href="/">
          <Button>返回首頁</Button>
        </Link>
      </div>
    </div>
  )
}
```

### 動態路由 404 處理

使用 `notFound()` 函數進行重定向：

```tsx
import { notFound } from 'next/navigation'

async function getProduct(id: string) {
  const res = await fetch(`/api/products/${id}`)
  if (!res.ok) {
    return null
  }
  return res.json()
}

export default async function ProductPage({ 
  params 
}: { 
  params: { id: string } 
}) {
  const product = await getProduct(params.id)
  
  if (!product) {
    notFound() // 自動重定向到 not-found.tsx
  }
  
  return <ProductDetail product={product} />
}
```

## 重定向模式

### 條件重定向

```tsx
import { redirect } from 'next/navigation'

export default async function ProtectedPage() {
  const user = await getUser()
  
  if (!user) {
    redirect('/login') // 伺服器端重定向
  }
  
  return <ProtectedContent user={user} />
}
```

### 錯誤後重定向

```tsx
// 在 Server Action 中
async function deleteProduct(id: string) {
  try {
    await db.products.delete(id)
    revalidatePath('/products')
    redirect('/products') // 成功後重定向
  } catch (error) {
    // 錯誤會被 error boundary 捕獲
    throw new Error('刪除產品失敗')
  }
}
```

## 最佳實踐

### 1. 分層錯誤處理

```
app/
├── error.tsx              # 根層級錯誤
├── loading.tsx            # 根層級載入
├── products/
│   ├── error.tsx          # 產品頁錯誤
│   ├── loading.tsx        # 產品頁載入
│   └── [id]/
│       ├── error.tsx      # 產品詳情錯誤
│       └── loading.tsx    # 產品詳情載入
```

### 2. 自定義錯誤類型

```tsx
export class ProductNotFoundError extends Error {
  constructor(id: string) {
    super(`Product with id ${id} not found`)
    this.name = 'ProductNotFoundError'
  }
}

export class UnauthorizedError extends Error {
  constructor(message = '未授權的訪問') {
    super(message)
    this.name = 'UnauthorizedError'
  }
}

// 在 error.tsx 中處理不同錯誤
export default function Error({ error }: { error: Error }) {
  if (error instanceof UnauthorizedError) {
    return <UnauthorizedErrorUI />
  }
  
  if (error instanceof ProductNotFoundError) {
    return <ProductNotFoundUI />
  }
  
  return <GenericErrorUI error={error} />
}
```

### 3. 載入狀態的層次

```tsx
// 粗粒度載入（整頁）
export default function Loading() {
  return <FullPageSkeleton />
}

// 細粒度載入（部分內容）
<Suspense fallback={<ProductListSkeleton />}>
  <ProductList />
</Suspense>

// 更細粒度（單個元件）
<Suspense fallback={<PriceSkeleton />}>
  <ProductPrice productId={id} />
</Suspense>
```

### 4. 優雅降級

```tsx
// 部分內容載入失敗不影響整頁
export default function ProductPage() {
  return (
    <>
      <ProductHeader />
      
      <ErrorBoundary fallback={<div>推薦產品載入失敗</div>}>
        <Suspense fallback={<RecommendationsSkeleton />}>
          <Recommendations />
        </Suspense>
      </ErrorBoundary>
      
      <ProductFooter />
    </>
  )
}
```

## 實用工具函數

### 延遲載入模擬

```tsx
// utils/delay.ts
export const delay = (ms: number) => 
  new Promise(resolve => setTimeout(resolve, ms))

// 開發環境模擬載入
async function fetchProducts() {
  if (process.env.NODE_ENV === 'development') {
    await delay(1000) // 模擬網路延遲
  }
  return fetch('/api/products')
}
```

### 錯誤重試邏輯

```tsx
// utils/retry.ts
export async function retry<T>(
  fn: () => Promise<T>,
  maxAttempts = 3,
  delay = 1000
): Promise<T> {
  let lastError: Error
  
  for (let i = 0; i < maxAttempts; i++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error as Error
      if (i < maxAttempts - 1) {
        await new Promise(resolve => setTimeout(resolve, delay))
      }
    }
  }
  
  throw lastError!
}

// 使用範例
const products = await retry(() => fetch('/api/products'), 3, 2000)
```

## 注意事項

1. **Error Boundary 限制** - 只能捕獲客戶端錯誤，伺服器端錯誤需要 try-catch
2. **Loading 優先級** - 離用戶操作最近的 loading.tsx 會優先顯示
3. **Suspense 串流** - 使用 Suspense 可以實現漸進式渲染
4. **錯誤邊界重置** - reset 函數會重新渲染錯誤邊界內的組件樹
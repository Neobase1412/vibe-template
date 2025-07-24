# 導航與連結指南

## 重要提醒：內部連結驗證

本專案已啟用 Next.js 的 `typedRoutes` 實驗性功能，這提供了編譯時期的連結驗證，確保所有內部導航連結都指向實際存在的頁面。

### 什麼是 typedRoutes？

`typedRoutes` 是 Next.js 的一項功能，它會：
1. 在 build 時自動掃描所有的路由
2. 為 `<Link>` 元件的 `href` 屬性提供類型檢查
3. 如果連結指向不存在的頁面，TypeScript 會報錯並且 build 會失敗

### 範例

```tsx
import Link from 'next/link'

// ✅ 正確 - 首頁存在
<Link href="/">Home</Link>

// ❌ 錯誤 - 如果 /about 頁面不存在，build 會失敗
<Link href="/about">About</Link>

// 錯誤訊息範例：
// Type error: "/about" is not an existing route. 
// If it is intentional, please type it explicitly with `as Route`.
```

### 開發建議

1. **先創建頁面，再添加連結**
   - 在添加任何導航連結之前，請確保目標頁面已經存在
   - 例如：先創建 `app/about/page.tsx`，然後才能使用 `<Link href="/about">`

2. **使用 TypeScript 的自動完成**
   - 在輸入 href 時，TypeScript 會提供可用路由的建議

3. **處理動態路由**
   - 動態路由如 `/products/[id]` 需要提供實際的參數
   - 例如：`<Link href="/products/123">`

4. **外部連結**
   - 外部連結不受此限制，可以正常使用
   - 例如：`<Link href="https://example.com">`

### 常見錯誤與解決方法

#### 錯誤 1：連結到不存在的頁面
```tsx
// 錯誤
<Link href="/contact">Contact</Link>
// 如果 app/contact/page.tsx 不存在
```

**解決方法**：創建對應的頁面檔案
```bash
mkdir -p app/contact
touch app/contact/page.tsx
```

#### 錯誤 2：拼寫錯誤
```tsx
// 錯誤
<Link href="/prodcuts">Products</Link>  // 注意拼寫錯誤
```

**解決方法**：修正拼寫或使用 TypeScript 的自動完成功能

### 注意事項

1. 此功能目前為實驗性功能，可能會有一些限制
2. 在開發過程中，如果添加了新頁面，可能需要重啟開發伺服器
3. Build 失敗時，請仔細檢查錯誤訊息中提到的連結路徑

### 相關配置

此功能在 `next.config.ts` 中啟用：
```typescript
const nextConfig: NextConfig = {
  experimental: {
    typedRoutes: true,
  },
  // ... 其他配置
};
```

## 導航元件實作規範

### 核心原則

實作導航元件（NavBar、Menu、Sidebar）時，必須遵循「頁面優先」原則：

1. **先有頁面，後有連結** - 永遠先創建頁面，再添加指向該頁面的連結
2. **完整內容，拒絕空殼** - 每個頁面都必須有實際內容，不接受純佔位頁面
3. **編譯驗證，確保正確** - 利用 TypeScript 的編譯時檢查，確保所有連結有效

### 標準實作流程

#### 步驟 1：規劃導航架構
```typescript
// 範例：導航架構規劃
interface NavigationStructure {
  home: '/'
  products: {
    list: '/products'
    detail: '/products/[id]'
    categories: '/products/categories'
  }
  about: {
    company: '/about'
    team: '/about/team'
    history: '/about/history'
  }
  contact: '/contact'
}
```

#### 步驟 2：批量創建頁面
```bash
# 使用 Bash 指令批量創建頁面結構
mkdir -p app/products/categories app/about/team app/about/history app/contact
touch app/products/page.tsx app/products/[id]/page.tsx app/products/categories/page.tsx
touch app/about/page.tsx app/about/team/page.tsx app/about/history/page.tsx
touch app/contact/page.tsx
```

#### 步驟 3：實現頁面內容
每個頁面都應該包含：
- 頁面標題（使用 Metadata）
- 主要內容區塊
- 適當的 UI 元件
- 必要的數據獲取邏輯

```tsx
// 範例：完整的頁面實現
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: '關於我們',
  description: '了解我們的公司歷史與使命'
}

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">關於我們</h1>
      <div className="prose max-w-none">
        {/* 實際內容 */}
      </div>
    </div>
  )
}
```

#### 步驟 4：實現導航元件

##### 基礎導航列
```tsx
// components/navigation/navbar.tsx
import Link from 'next/link'
import { cn } from '@/lib/utils'

const navigationItems = [
  { href: '/', label: '首頁' },
  { href: '/products', label: '產品' },
  { href: '/about', label: '關於我們' },
  { href: '/contact', label: '聯絡我們' },
]

export function NavBar() {
  return (
    <nav className="border-b">
      <div className="container mx-auto px-4">
        <ul className="flex space-x-8 h-16 items-center">
          {navigationItems.map((item) => (
            <li key={item.href}>
              <Link 
                href={item.href}
                className="hover:text-primary transition-colors"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  )
}
```

##### 帶有下拉選單的導航
```tsx
// components/navigation/dropdown-nav.tsx
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger } from "@/components/ui/navigation-menu"

const menuStructure = [
  {
    trigger: '產品',
    items: [
      { href: '/products', title: '所有產品', description: '瀏覽完整產品目錄' },
      { href: '/products/categories', title: '產品分類', description: '按類別查看產品' },
    ]
  },
  {
    trigger: '關於',
    items: [
      { href: '/about', title: '公司簡介', description: '了解我們的故事' },
      { href: '/about/team', title: '團隊成員', description: '認識我們的團隊' },
      { href: '/about/history', title: '發展歷程', description: '公司發展里程碑' },
    ]
  }
]
```

### 最佳實踐

1. **使用 TypeScript 自動完成**
   - 輸入 href 時會自動提示可用路由
   - 錯誤的路由會立即顯示紅色下劃線

2. **處理動態路由**
   ```tsx
   // 正確：提供具體參數
   <Link href="/products/123">產品詳情</Link>
   
   // 或使用模板字串
   <Link href={`/products/${productId}`}>產品詳情</Link>
   ```

3. **響應式導航設計**
   - 桌面版：水平導航列
   - 移動版：漢堡選單 + 側邊欄
   - 平板版：簡化的導航項目

4. **無障礙性考量**
   - 使用語義化 HTML（`<nav>`、`<ul>`、`<li>`）
   - 添加適當的 ARIA 標籤
   - 確保鍵盤導航可用

### 常見錯誤與解決方案

#### 錯誤：連結到不存在的頁面
```tsx
// ❌ 錯誤：如果 /services 頁面不存在
<Link href="/services">服務</Link>

// ✅ 解決：先創建頁面
// 1. mkdir -p app/services
// 2. touch app/services/page.tsx
// 3. 實現頁面內容
// 4. 然後才添加連結
```

#### 錯誤：空白佔位頁面
```tsx
// ❌ 錯誤：空內容頁面
export default function Page() {
  return <div>即將推出</div>
}

// ✅ 正確：有意義的內容
export default function Page() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">服務項目</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* 實際的服務內容 */}
      </div>
    </div>
  )
}
```

### 測試檢查清單

在完成導航實作後，請確保：

- [ ] 所有連結都能正常點擊並導航到正確頁面
- [ ] `pnpm build` 能夠成功執行，沒有 TypeScript 錯誤
- [ ] 每個頁面都有適當的標題和內容
- [ ] 導航在不同裝置上都能正常顯示和使用
- [ ] 使用瀏覽器的返回/前進按鈕能正常導航

遵循這些指南可以確保你的應用程式沒有無效連結，提供更好的使用者體驗。
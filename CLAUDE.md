# Claude AI 專案指南

## 角色定義

你是一位資深的前端工程師，專精於 Next.js、TypeScript 和現代前端開發實踐。你的任務是根據 `PRD.md` 文件中的需求描述，實現一個功能完整、視覺精美的網頁應用程式。

## 核心工作流程

1. **閱讀需求** - 仔細閱讀 `PRD.md` 文件，理解設計意圖和功能需求
2. **遵循規範** - 嚴格遵守 `/docs` 目錄下的所有技術規範和指南
3. **實現功能** - 使用專案既有的技術棧和元件庫實現所需功能
4. **創建測試** - 為關鍵功能編寫適當的測試用例

## 開發規則與權責

### 必須遵守的規則 (MUST)

1. **優先使用 Shadcn/UI 元件** - 專案已預安裝 Button、Card、Input 等元件，必須優先使用這些元件來構建 UI
2. **通過 API 獲取數據** - 所有商品數據必須通過 `fetch('/api/products')` 來獲取，不得直接引入 JSON 文件
3. **遵循 TypeScript 規範** - 所有新增程式碼必須有適當的類型定義
4. **創建測試** - 為新增的核心功能創建相應的測試文件
5. **保持程式碼風格一致** - 遵循 `docs/coding_style.md` 中定義的規範
6. **檢查內部連結有效性** - 專案已啟用 Next.js `typedRoutes` 功能，所有內部連結都會在 build 時進行檢查。任何指向不存在頁面的連結（如 `/about` 頁面不存在卻有連結指向它）都會導致 TypeScript 編譯錯誤和 build 失敗
7. **程式碼品質檢查** - 完成功能後必須執行以下檢查：
   - 執行 `pnpm lint` 檢查程式碼風格（修復所有錯誤，警告可暫時保留）
   - 執行 `pnpm build` 確保專案能正常構建
   - 只有通過所有檢查才能提交代碼
8. **導航元件完整性** - 當實現 Menu bar、NavBar、Side Bar 等導航元件時：
   - 必須確保所有連結指向的頁面都已存在
   - 必須為每個連結創建對應的頁面文件（即使是基礎內容）
   - 每個頁面都應包含有意義的內容，避免空白頁面

### 禁止的操作 (FORBIDDEN)

1. **禁止修改數據源** - 不得修改 `/public/products.json` 文件的內容或結構
2. **禁止修改規範文件** - 不得修改 `/docs` 目錄下的任何文件
3. **禁止修改核心配置** - 不得修改 `package.json`、`tsconfig.json` 等核心配置文件（除非明確需要安裝新依賴）
4. **禁止硬編碼數據** - 不得在元件中硬編碼商品數據，必須從 API 獲取

## 技術棧參考

- **框架**: Next.js 15+ (App Router)
- **語言**: TypeScript
- **樣式**: Tailwind CSS
- **UI 元件**: Shadcn/UI
- **數據獲取**: Fetch API

## 專案結構

```
vibe-template/
├── app/                 # Next.js App Router 頁面
│   ├── api/            # API 路由
│   └── test/           # 測試頁面
├── components/          # React 元件
│   └── ui/             # Shadcn/UI 元件
├── lib/                # 工具函數和共用邏輯
├── public/             # 靜態資源
│   └── products.json   # 商品數據（只讀）
├── docs/               # 專案文檔
├── PRD.md             # 產品需求文檔
└── CLAUDE.md          # 本文件
```

## 開發建議

1. 先仔細閱讀所有文檔，充分理解專案架構和規範
2. 使用增量開發方式，先實現核心功能，再逐步優化
3. 充分利用 Shadcn/UI 提供的元件，避免重複造輪
4. 保持程式碼的可讀性和可維護性
5. 適當添加註釋，但避免過度註釋
6. 開發流程：
   - 實現功能 → 執行 `pnpm lint` → 修復錯誤 → 執行 `pnpm build` → 確認成功 → 提交代碼
   - 如果 lint 有警告但無錯誤，可以繼續進行
   - 如果 build 失敗，必須修復後才能提交

## 多頁面應用開發指南

### 導航設計原則

當你需要實現具有導航功能的多頁面應用時，請遵循以下原則：

1. **頁面優先原則** - 在實現任何導航元件（NavBar、Menu、Sidebar）之前，先創建所有需要的頁面
2. **內容完整性** - 每個頁面都應該有實際的內容，不要創建空白佔位頁面
3. **導航一致性** - 確保所有頁面都能通過導航元件互相訪問

### 實作步驟

當 PRD 中要求實現導航元件時：

1. **分析導航結構**
   - 仔細閱讀需求，列出所有需要的頁面
   - 規劃頁面層級結構（如 `/products`、`/products/[id]`）

2. **創建頁面文件**
   ```bash
   # 範例：創建基礎頁面結構
   app/
   ├── page.tsx          # 首頁
   ├── about/
   │   └── page.tsx      # 關於我們
   ├── products/
   │   ├── page.tsx      # 產品列表
   │   └── [id]/
   │       └── page.tsx  # 產品詳情
   └── contact/
       └── page.tsx      # 聯絡我們
   ```

3. **實現頁面內容**
   - 每個頁面都應包含與其功能相關的實際內容
   - 使用 Shadcn/UI 元件保持視覺一致性
   - 確保頁面包含適當的標題和說明

4. **實現導航元件**
   - 只有在所有頁面都已創建後，才開始實現導航元件
   - 使用 `<Link>` 元件並確保 href 指向存在的路由
   - TypeScript 會自動檢查連結的有效性

### 範例：導航元件實現

```tsx
// components/navbar.tsx
import Link from 'next/link'

export function NavBar() {
  return (
    <nav>
      <Link href="/">首頁</Link>
      <Link href="/products">產品</Link>
      <Link href="/about">關於我們</Link>
      <Link href="/contact">聯絡我們</Link>
    </nav>
  )
}
```

### 常見場景處理

1. **動態路由導航**
   - 產品列表頁應包含實際的產品連結
   - 使用從 API 獲取的數據生成動態連結

2. **多層級導航**
   - 可以實現下拉選單或側邊欄
   - 確保所有子頁面都已創建

3. **條件性導航**
   - 某些連結可能基於用戶狀態顯示
   - 但對應的頁面仍需存在

## 標準頁面結構

### 頁面 Metadata 設定

每個頁面都必須包含適當的 metadata，這對 SEO 和使用者體驗至關重要：

```tsx
import { Metadata } from 'next'

// 靜態 Metadata
export const metadata: Metadata = {
  title: '產品列表 | 您的商店名稱',
  description: '瀏覽我們精選的優質產品，找到最適合您的選擇',
  keywords: '產品, 購物, 電商', // 選填
  openGraph: {
    title: '產品列表',
    description: '瀏覽我們精選的優質產品',
    type: 'website',
    images: ['/og-image.jpg'], // 建議尺寸 1200x630
  }
}

// 動態 Metadata（用於動態路由）
export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const product = await getProduct(params.id)
  
  return {
    title: `${product.name} | 您的商店名稱`,
    description: product.description || `購買 ${product.name}`,
    openGraph: {
      title: product.name,
      description: product.description,
      images: [product.image_url],
    }
  }
}
```

### 完整頁面結構範例

```tsx
import { Metadata } from 'next'
import { Suspense } from 'react'

// 1. Metadata 設定
export const metadata: Metadata = {
  title: '頁面標題',
  description: '頁面描述',
}

// 2. 載入元件
function LoadingState() {
  return <div className="container mx-auto px-4 py-8">載入中...</div>
}

// 3. 頁面元件
export default function Page() {
  return (
    <div className="min-h-screen">
      {/* 頁面標題區 */}
      <header className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold">頁面標題</h1>
        <p className="text-gray-600 mt-2">頁面副標題或說明</p>
      </header>

      {/* 主要內容區 */}
      <main className="container mx-auto px-4 py-8">
        <Suspense fallback={<LoadingState />}>
          {/* 實際內容 */}
        </Suspense>
      </main>

      {/* 相關操作或 CTA */}
      <section className="container mx-auto px-4 py-8">
        {/* 操作按鈕或相關連結 */}
      </section>
    </div>
  )
}
```

### Metadata 必填欄位

1. **title** - 頁面標題（建議 50-60 字符）
2. **description** - 頁面描述（建議 150-160 字符）

### Metadata 選填但建議欄位

1. **openGraph** - 社群分享資訊
2. **keywords** - SEO 關鍵字（現代 SEO 較少使用）
3. **authors** - 作者資訊
4. **robots** - 搜尋引擎爬蟲指令

## 如何開始

1. 閱讀 `PRD.md` 了解具體需求
2. 查看 `/docs` 目錄下的所有規範文件
3. 檢查現有的元件和工具函數
4. 開始實現功能，記得遵守所有規則

記住：你的目標是創建一個既符合需求、又遵守規範的高品質應用程式。

## V0.dev 整合說明

如果需要生成複雜的 UI 元件，你可以在心中構思使用 v0.dev 的設計，但請直接在專案中實現程式碼，確保：
- 使用已安裝的 Shadcn/UI 元件
- 遵循專案的 Tailwind CSS 配置
- 符合 TypeScript 類型定義

祝你開發順利！
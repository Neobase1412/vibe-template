# Claude AI 專案指南

## 角色定義

你是一位資深的前端工程師，專精於 Next.js、TypeScript 和現代前端開發實踐。你的任務是根據 `PRD.md` 文件中的需求描述，實現一個功能完整、視覺精美的網頁應用程式。

## 核心工作流程

1. **閱讀需求** - 仔細閱讀 `PRD.md` 文件，理解設計意圖和功能需求
   - 特別注意「商品選擇」章節中列出的商品 ID
   - 解析出要展示的商品 ID 列表（如 PROD_001、PROD_002）
2. **遵循規範** - 嚴格遵守 `/docs` 目錄下的所有技術規範和指南
3. **實現功能** - 使用專案既有的技術棧和元件庫實現所需功能
4. **創建測試** - 為關鍵功能編寫適當的測試用例

## 開發規則與權責

### 必須遵守的規則 (MUST)

1. **優先使用 Shadcn/UI 元件** - 專案已預安裝 Button、Card、Input 等元件，必須優先使用這些元件來構建 UI
2. **通過 API 獲取數據** - 所有商品數據必須通過 `fetch('/api/products')` 來獲取，不得直接引入 JSON 文件
   - API 會自動從 Supabase Data Center 獲取真實商品資料
   - 支援透過 `?ids=PROD_001,PROD_002` 參數篩選特定商品
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
9. **實作推薦連結** - 所有購買按鈕必須使用 `generateRefLink` 函數生成正確的推薦連結

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
- **資料來源**: Supabase (Data Center API)

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

每個頁面都應該包含適當的 metadata。請根據 PRD 的需求，為每個頁面設定合適的標題和描述：

```tsx
import { Metadata } from 'next'

// 基本 Metadata（每個頁面都應該有）
export const metadata: Metadata = {
  title: '頁面標題 - 根據 PRD 設定',
  description: '頁面描述 - 根據 PRD 設定',
}

// 如果需要更豐富的 SEO，可以加入：
export const metadata: Metadata = {
  title: '具體的頁面標題',
  description: '吸引人的頁面描述',
  keywords: '相關, 關鍵字',
  openGraph: {
    title: '社群分享標題',
    description: '社群分享描述',
    type: 'website',
    images: ['/分享圖片.jpg'], // 如果有的話
  }
}

// 動態頁面的 Metadata
export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  // 根據動態內容生成 metadata
  const data = await getData(params.id)
  
  return {
    title: data.title,
    description: data.description,
  }
}
```

**重要**：不要使用預設的 "Create Next App" 標題，請根據實際內容設定有意義的 metadata。

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

## 重要文件參考

實作功能時，請特別參考以下指南：

- **表單實作** → 參考 `docs/form_guidelines.md`（使用 React Hook Form + Zod）
- **圖片處理** → 參考 `docs/media_handling.md`（外部圖片使用 img 標籤）
- **錯誤處理** → 參考 `docs/loading_error_states.md`（使用 Boundary）
- **SEO 設定** → 參考 `docs/seo_metadata.md`（每頁都需要 metadata）
- **導航實作** → 參考 `docs/navigation_guide.md`（確保連結有效）

## SEO 實作指引

當 PRD 需要 SEO 功能時，請實作以下內容：

### 1. 頁面 Metadata（必須實作）
每個頁面都應該有合適的 metadata：
- 根據頁面內容設定標題和描述
- 不要保留預設的 "Create Next App"
- 參考 `docs/seo_metadata.md` 了解完整選項

### 2. Sitemap（需要時實作）
如果 PRD 要求搜尋引擎優化：
- 創建 `app/sitemap.ts`
- 列出所有公開頁面
- 參考 Next.js 文檔的 sitemap 格式

### 3. Robots.txt（需要時實作）
如果需要控制爬蟲行為：
- 創建 `app/robots.ts`
- 設定允許/禁止的路徑
- 連結到 sitemap

### 4. 結構化數據（進階 SEO）
如果需要豐富搜尋結果：
- 使用 JSON-LD 格式
- 根據內容類型選擇適當的 schema
- 參考 `docs/seo_metadata.md` 的範例

**原則**：根據 PRD 的實際需求來決定要實作哪些 SEO 功能，不要預設實作所有功能。

記住：你的目標是創建一個既符合需求、又遵守規範的高品質應用程式。

## V0.dev 整合說明

如果需要生成複雜的 UI 元件，你可以在心中構思使用 v0.dev 的設計，但請直接在專案中實現程式碼，確保：
- 使用已安裝的 Shadcn/UI 元件
- 遵循專案的 Tailwind CSS 配置
- 符合 TypeScript 類型定義

## 商品資料整合說明

### 資料來源
專案已整合 Supabase Data Center，所有商品資料都從真實的資料庫獲取：

1. **API 端點** - `/api/products` 會自動從 Supabase 獲取商品資料
2. **資料格式** - 商品資料包含以下欄位：
   ```typescript
   interface Product {
     id: string              // 商品 ID (如 PROD_001)
     merchant_id: string     // 商家 ID
     name: string           // 商品名稱
     price_in_cents: number // 價格（以分為單位）
     image_url: string | null // 商品圖片 URL
     product_url?: string | null // 完整產品 URL（優先使用）
     merchant?: {           // 商家資訊（當沒有 product_url 時使用）
       id: string
       name: string
       base_product_url: string // 商家銷售頁面基礎 URL
     }
   }
   ```

### 獲取商品資料

```typescript
// 獲取所有商品
const response = await fetch('/api/products')
const products = await response.json()

// 獲取特定商品（根據 PRD 中指定的商品 ID）
const response = await fetch('/api/products?ids=PROD_001,PROD_002,PROD_003')
const products = await response.json()
```

### 使用範例

```tsx
// 方式一：使用 API route（適用於 Client Component）
'use client'

export default function ProductsPage() {
  const [products, setProducts] = useState([])
  
  useEffect(() => {
    // 從 PRD.md 讀取的商品 ID
    const productIds = ['PROD_001', 'PROD_002', 'PROD_003']
    
    fetch(`/api/products?ids=${productIds.join(',')}`)
      .then(res => res.json())
      .then(setProducts)
  }, [])

  return (
    <div className="grid grid-cols-3 gap-6">
      {products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}

// 方式二：直接使用 Supabase（推薦，用於 Server Component）
import { supabase } from '@/lib/supabase'

export default async function ProductsPage() {
  // 從 PRD.md 讀取商品 ID 列表
  const productIds = ['PROD_001', 'PROD_002', 'PROD_003']
  
  if (!supabase) {
    return <div>無法連接資料庫</div>
  }
  
  const { data: products } = await supabase
    .from('products')
    .select('*, merchant:merchants(*)')
    .in('id', productIds)

  return (
    <div className="grid grid-cols-3 gap-6">
      {(products || []).map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}
```

### 重要說明

當 PRD.md 中指定了商品 ID 列表時，你需要：
1. 從 PRD.md 的「商品選擇」章節解析商品 ID 列表
   - 商品 ID 格式為 PROD_001 到 PROD_009
   - 通常會列在「我要展示的商品 ID」標題下方
2. 使用這些 ID 透過 API 獲取商品資料
   ```typescript
   // 範例：從 PRD 中讀取到 PROD_001, PROD_002, PROD_003
   const productIds = ['PROD_001', 'PROD_002', 'PROD_003'];
   const response = await fetch(`/api/products?ids=${productIds.join(',')}`);
   ```
3. 系統會自動從 Supabase 獲取完整的商品資訊，包括名稱、價格、圖片、商家資訊等
4. 使用 `generateRefLink` 函數為每個商品生成正確的推薦連結
   - 確保使用環境變數 `process.env.REF_CODE`
   - 每個購買按鈕都必須包含推薦連結

## REF Link 整合說明

### 重要：引流連結生成
當實現商品購買按鈕時，必須確保所有「購買」或「查看詳情」連結都包含正確的 ref 參數：

1. **環境變數 `REF_CODE`** - 每個 Vibe Coder 都有專屬的 REF_CODE（透過 GitHub Action 自動生成）
2. **生成連結格式** - 使用以下函數生成正確的引流連結：

```typescript
import { generateRefLink } from '@/lib/supabase'

// 使用方式
const refCode = process.env.REF_CODE || 'DEFAULT'
const buyLink = generateRefLink(product, refCode)
```

3. **實作範例**：
```tsx
// 購買按鈕元件
<Button asChild>
  <a href={generateRefLink(product, process.env.REF_CODE || 'DEFAULT')} 
     target="_blank" 
     rel="noopener noreferrer">
    立即購買
  </a>
</Button>
```

### 注意事項
- 所有商品連結都必須包含 `?ref=` 參數
- 商品資料必須包含 merchant 資訊才能生成正確連結
- 連結會指向商家的實際銷售頁面
- PRD 中指定的商品 ID 必須是真實存在的商品

祝你開發順利！
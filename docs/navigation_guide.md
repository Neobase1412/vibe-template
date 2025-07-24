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

遵循這些指南可以確保你的應用程式沒有無效連結，提供更好的使用者體驗。
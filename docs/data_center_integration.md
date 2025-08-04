# Data Center 整合說明

本文件說明 Vibe Template 如何與 Shopaify Data Center 整合，讓 Vibe Coders 能夠獲取真實的商品資料並生成推薦連結。

## 🏗️ 系統架構

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│  Vibe Template  │────▶│  Data Center API │────▶│    Supabase     │
│   (Your Site)   │     │  (Edge Functions)│     │   (Database)    │
└─────────────────┘     └──────────────────┘     └─────────────────┘
        │                                                  │
        │                                                  │
        └──────────── Public Read Access ─────────────────┘
                    (Products & Merchants)
```

## 📡 API 端點

### 1. 獲取商品資料

**Supabase REST API（公開讀取）**

```bash
GET {SUPABASE_URL}/rest/v1/products?select=*,merchant:merchants(*)
Headers:
  - apikey: {SUPABASE_ANON_KEY}
  - Authorization: Bearer {SUPABASE_ANON_KEY}
```

**回應格式**：
```json
[
  {
    "id": "PROD_001",
    "merchant_id": "uuid",
    "name": "極簡風格筆記本",
    "price_in_cents": 35000,
    "image_url": "https://...",
    "merchant": {
      "id": "uuid",
      "name": "生活美學店",
      "base_product_url": "https://shop.example.com/products"
    }
  }
]
```

### 2. 註冊 Vibe Coder（取得 REF_CODE）

**RPC Function**

```javascript
const { data, error } = await supabase.rpc('register_vibe_coder', {
  github_username: 'your_github_username'
})

// 回應: { ref_code: "REF_ABC123" }
```

## 🔗 推薦連結生成

### 連結格式

推薦連結的格式為：
```
{merchant.base_product_url}/{product.id}?ref={ref_code}
```

### 範例

商品資料：
- merchant.base_product_url: `https://shop.example.com/products`
- product.id: `PROD_001`
- ref_code: `REF_ABC123`

生成的推薦連結：
```
https://shop.example.com/products/PROD_001?ref=REF_ABC123
```

## 💰 分潤機制

當客戶透過您的推薦連結完成購買後：

1. **電商平台**會記錄 ref_code
2. **訂單完成**時，電商平台呼叫 Data Center API
3. **系統自動計算**：
   - Vibe Coder 佣金：10%
   - 平台佣金：5%
   - 商家收入：85%

### 分潤範例

| 商品售價 | Vibe Coder 佣金 | 平台佣金 | 商家收入 |
|---------|----------------|----------|----------|
| NT$1,000 | NT$100 | NT$50 | NT$850 |
| NT$5,000 | NT$500 | NT$250 | NT$3,750 |

## 🔄 資料更新

### 目前狀態

- ✅ 商品資料從 Supabase 即時獲取
- ✅ 支援動態商品選擇
- ❌ 尚未移除 `public/products.json`（備用）

### 資料來源優先順序

1. **Supabase API**（主要來源）
2. **本地 products.json**（備用/測試）

## 🛠️ 環境變數設定

在 `.env.local` 或部署平台設定：

```env
# Supabase 設定（公開）
NEXT_PUBLIC_SUPABASE_URL=https://pqiyjbkqiwvnkpdhowqq.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key

# 您的推薦碼
REF_CODE=REF_ABC123
```

## 📝 實作細節

### 1. 獲取商品資料 (`app/api/products/route.ts`)

```typescript
// 從 Supabase 獲取商品
const { data: products } = await supabase
  .from('products')
  .select(`
    *,
    merchant:merchants(*)
  `)
```

### 2. 生成推薦連結

```typescript
function generateRefLink(product: Product, refCode: string): string {
  const { merchant, id } = product
  return `${merchant.base_product_url}/${id}?ref=${refCode}`
}
```

### 3. 在頁面中使用

```tsx
// 獲取商品
const response = await fetch('/api/products')
const products = await response.json()

// 生成購買按鈕
<a href={generateRefLink(product, process.env.REF_CODE)}>
  立即購買
</a>
```

## 🔍 商品資料查詢

### 查看所有商品

```bash
curl -X GET \
  "https://pqiyjbkqiwvnkpdhowqq.supabase.co/rest/v1/products?select=*,merchant:merchants(*)" \
  -H "apikey: your_anon_key" \
  -H "Authorization: Bearer your_anon_key"
```

### 查詢特定商品

```bash
# 單一商品
?id=eq.PROD_001

# 多個商品
?id=in.(PROD_001,PROD_002,PROD_003)

# 價格範圍
?price_in_cents=gte.10000&price_in_cents=lte.50000
```

## ⚠️ 注意事項

1. **不要修改商品資料**：所有商品資料由 Data Center 統一管理
2. **保護您的 REF_CODE**：這是您的收益來源
3. **測試連結**：確保推薦連結正確包含 ref 參數
4. **追蹤銷售**：目前需要聯繫管理員查看銷售統計

## 🚀 未來功能

- [ ] Vibe Coder 儀表板（查看銷售統計）
- [ ] 即時佣金通知
- [ ] 商品篩選 API
- [ ] 分潤提領系統

## 📞 技術支援

如有問題，請查看：
1. [Data Center 系統文件](https://github.com/Neobase1412/shopaify-data-center/docs)
2. 在 GitHub Issues 回報問題
3. 聯繫平台管理員
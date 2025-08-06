# API 文檔

## 商品 API

### 獲取商品資料

**端點**: `GET /api/products`

**描述**: 從 Supabase 資料庫獲取商品資料

**請求方法**: GET

**請求參數**: 
- `ids` (可選): 逗號分隔的商品 ID 列表，例如 `?ids=PROD_001,PROD_002,PROD_003`
- 如果沒有提供 `ids` 參數，API 會自動從 `selected-products.json` 讀取商品 ID

**成功響應**:
- **狀態碼**: 200 OK
- **內容類型**: application/json
- **響應格式**:

```json
[
  {
    "id": "PROD_001",
    "merchant_id": "merchant-1",
    "name": "極簡風格水瓶",
    "price_in_cents": 2900,
    "image_url": "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400&h=400&fit=crop",
    "product_url": "https://shop.example.com/products/water-bottle-001",
    "merchant": {
      "id": "merchant-1",
      "name": "優質生活選品店",
      "base_product_url": "https://shop.example.com/products"
    }
  },
  {
    "id": "PROD_002",
    "merchant_id": "merchant-1",
    "name": "有機棉環保袋",
    "price_in_cents": 1500,
    "image_url": "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=400&h=400&fit=crop",
    "product_url": "https://shop.example.com/products/eco-bag-002",
    "merchant": {
      "id": "merchant-1",
      "name": "優質生活選品店",
      "base_product_url": "https://shop.example.com/products"
    }
  }
  // ... 更多商品
]
```

**錯誤響應**:
- **狀態碼**: 500 Internal Server Error
- **內容**:
```json
{
  "error": "Failed to load products"
}
```

### 使用範例

#### 獲取所有商品
```typescript
async function fetchAllProducts() {
  try {
    const response = await fetch('/api/products');
    if (!response.ok) {
      throw new Error('Failed to fetch products');
    }
    const products = await response.json();
    return products;
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}
```

#### 獲取特定商品（覆蓋預設值）
```typescript
async function fetchSelectedProducts(productIds: string[]) {
  try {
    const response = await fetch(`/api/products?ids=${productIds.join(',')}`);
    if (!response.ok) {
      throw new Error('Failed to fetch products');
    }
    const products = await response.json();
    return products;
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

// 使用範例
const products = await fetchSelectedProducts(['PROD_001', 'PROD_002', 'PROD_003']);
```

#### React Hook 範例
```typescript
import { useEffect, useState } from 'react';

interface Product {
  id: string;
  merchant_id: string;
  name: string;
  price_in_cents: number;
  image_url: string | null;
  product_url?: string | null;
  merchant?: {
    id: string;
    name: string;
    base_product_url: string;
  };
}

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadProducts() {
      try {
        const response = await fetch('/api/products');
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        const data = await response.json();
        setProducts(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, []);

  return { products, loading, error };
}
```

## 注意事項

1. **資料來源**: 商品資料來自 Supabase 資料庫，非本地 JSON 檔案
2. **商品 ID**: 使用格式如 `PROD_001` 的字串 ID，而非數字
3. **價格單位**: 所有價格都以分為單位（cents），顯示時需要轉換為元
4. **推薦連結**: 使用 `generateRefLink` 函數生成包含 ref 參數的購買連結
5. **環境變數**: 需要設定 `NEXT_PUBLIC_SUPABASE_URL` 和 `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## 商品選擇說明

商品選擇現在由 `selected-products.json` 檔案管理。檔案格式：

```json
{
  "productIds": [
    "PROD_001",
    "PROD_002",
    "PROD_003"
  ]
}
```

## 商品 ID 清單

目前系統中可用的商品 ID：
- PROD_001 - 極簡風格水瓶
- PROD_002 - 有機棉環保袋
- PROD_003 - 竹製餐具組
- PROD_004 - 智慧溫控保溫杯
- PROD_005 - 無線充電滑鼠墊
- PROD_006 - 藍牙追蹤器套組
- PROD_007 - 天然精油擴香組
- PROD_008 - 膠原蛋白面膜組
- PROD_009 - 瑜珈按摩滾輪
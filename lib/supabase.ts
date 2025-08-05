import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

function getSupabaseClient() {
  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Supabase environment variables are not set. API will return empty data.')
    return null
  }
  return createClient(supabaseUrl, supabaseAnonKey)
}

export const supabase = getSupabaseClient()

// 定義資料類型
export interface Merchant {
  id: string
  name: string
  base_product_url: string
}

export interface Product {
  id: string
  merchant_id: string
  name: string
  price_in_cents: number
  image_url: string | null
  product_url?: string | null  // 新增：完整產品 URL
  merchant?: Merchant
}

export interface VibeCoder {
  id: string
  github_username: string
  ref_code: string
}

// 輔助函數：生成 REF Link
export function generateRefLink(product: Product, refCode: string): string {
  // 優先使用 product_url
  if (product.product_url) {
    return `${product.product_url}?ref=${refCode}`
  }
  
  // fallback: 使用舊的邏輯（組合 base_url + id）
  if (!product.merchant) {
    throw new Error('Product must include merchant data or product_url')
  }
  return `${product.merchant.base_product_url}/${product.id}?ref=${refCode}`
}
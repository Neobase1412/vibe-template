import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

/**
 * 商品 API 端點
 * 
 * 使用方式：
 * - GET /api/products - 獲取所有商品
 * - GET /api/products?ids=PROD_001,PROD_002,PROD_003 - 獲取指定商品
 * 
 * 返回資料包含完整的商品資訊和商家資訊
 */
export async function GET(request: Request) {
  try {
    // 檢查 Supabase 是否可用
    if (!supabase) {
      console.warn('Supabase client is not initialized. Returning empty array.')
      return NextResponse.json([])
    }
    
    // 獲取查詢參數
    const { searchParams } = new URL(request.url)
    const idsParam = searchParams.get('ids')
    
    // 構建查詢
    let query = supabase
      .from('products')
      .select(`
        *,
        merchant:merchants(*)
      `)
    
    // 如果有指定 ids，則過濾
    // 這是從 PRD.md 中讀取商品 ID 後使用的主要方式
    if (idsParam) {
      const ids = idsParam.split(',').map(id => id.trim())
      query = query.in('id', ids)
    }
    
    // 執行查詢
    const { data: products, error } = await query
    
    if (error) {
      throw error
    }
    
    // 返回成功響應
    return NextResponse.json(products || [])
  } catch (error) {
    // 錯誤處理
    if (process.env.NODE_ENV === 'development') {
      console.error('Failed to load products from Supabase:', error)
    }
    return NextResponse.json(
      { error: 'Failed to load products' },
      { status: 500 }
    )
  }
}
import { NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

export async function GET() {
  try {
    // 讀取 public/products.json 文件
    const jsonPath = path.join(process.cwd(), 'public', 'products.json')
    const fileContents = await fs.readFile(jsonPath, 'utf8')
    const products = JSON.parse(fileContents)
    
    // 返回成功響應
    return NextResponse.json(products)
  } catch (error) {
    // 錯誤處理
    if (process.env.NODE_ENV === 'development') {
      console.error('Failed to load products:', error)
    }
    return NextResponse.json(
      { error: 'Failed to load products' },
      { status: 500 }
    )
  }
}
import { GET } from './route'
import { NextResponse } from 'next/server'

// Mock Supabase
const mockSelect = jest.fn()
const mockIn = jest.fn()
const mockFrom = jest.fn(() => ({
  select: mockSelect
}))

jest.mock('@/lib/supabase', () => ({
  supabase: {
    from: mockFrom
  }
}))

describe('/api/products', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should return all products successfully', async () => {
    const mockProducts = [
      {
        id: "PROD_001",
        merchant_id: "merchant-1",
        name: "Test Product 1",
        price_in_cents: 1000,
        image_url: "https://example.com/test1.jpg",
        merchant: {
          id: "merchant-1",
          name: "Test Merchant",
          base_product_url: "https://shop.example.com/products"
        }
      },
      {
        id: "PROD_002",
        merchant_id: "merchant-1",
        name: "Test Product 2",
        price_in_cents: 2000,
        image_url: "https://example.com/test2.jpg",
        merchant: {
          id: "merchant-1",
          name: "Test Merchant",
          base_product_url: "https://shop.example.com/products"
        }
      }
    ]

    mockSelect.mockReturnValue(Promise.resolve({ 
      data: mockProducts, 
      error: null 
    }))

    const request = new Request('http://localhost:3000/api/products')
    const response = await GET(request)
    const data = await response.json()

    expect(response).toBeInstanceOf(NextResponse)
    expect(mockFrom).toHaveBeenCalledWith('products')
    expect(mockSelect).toHaveBeenCalledWith(expect.stringContaining('merchant:merchants(*)'))
    expect(data).toEqual(mockProducts)
  })

  it('should return filtered products when ids parameter is provided', async () => {
    const mockProducts = [
      {
        id: "PROD_001",
        merchant_id: "merchant-1",
        name: "Test Product 1",
        price_in_cents: 1000,
        image_url: "https://example.com/test1.jpg",
        merchant: {
          id: "merchant-1",
          name: "Test Merchant",
          base_product_url: "https://shop.example.com/products"
        }
      }
    ]

    mockIn.mockReturnValue(Promise.resolve({ 
      data: mockProducts, 
      error: null 
    }))

    mockSelect.mockReturnValue({ in: mockIn })

    const request = new Request('http://localhost:3000/api/products?ids=PROD_001,PROD_002')
    const response = await GET(request)
    const data = await response.json()

    expect(response).toBeInstanceOf(NextResponse)
    expect(mockIn).toHaveBeenCalledWith('id', ['PROD_001', 'PROD_002'])
    expect(data).toEqual(mockProducts)
  })

  it('should return empty array when Supabase is not initialized', async () => {
    // Temporarily mock supabase as null
    jest.resetModules()
    jest.doMock('@/lib/supabase', () => ({
      supabase: null
    }))

    const { GET: GETWithoutSupabase } = require('./route')
    const request = new Request('http://localhost:3000/api/products')
    const response = await GETWithoutSupabase(request)
    const data = await response.json()

    expect(response).toBeInstanceOf(NextResponse)
    expect(data).toEqual([])
  })

  it('should return error when Supabase query fails', async () => {
    mockSelect.mockReturnValue(Promise.resolve({ 
      data: null, 
      error: new Error('Database error') 
    }))

    const request = new Request('http://localhost:3000/api/products')
    const response = await GET(request)
    const data = await response.json()

    expect(response.status).toBe(500)
    expect(data).toEqual({ error: 'Failed to load products' })
  })
})
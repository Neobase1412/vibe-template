import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Home, Search } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full text-center">
        {/* 404 大標題 */}
        <h1 className="text-9xl font-bold text-gray-200 mb-4">404</h1>
        
        {/* 錯誤標題 */}
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          找不到頁面
        </h2>
        
        {/* 錯誤描述 */}
        <p className="text-gray-600 mb-8 leading-relaxed">
          抱歉，您訪問的頁面不存在或已被移除。請檢查網址是否正確，或返回首頁瀏覽其他內容。
        </p>
        
        {/* 操作按鈕 */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/">
            <Button className="inline-flex items-center w-full sm:w-auto">
              <Home className="w-4 h-4 mr-2" />
              返回首頁
            </Button>
          </Link>
          
          <Link href="/">
            <Button 
              variant="outline" 
              className="inline-flex items-center w-full sm:w-auto"
            >
              <Search className="w-4 h-4 mr-2" />
              開始探索
            </Button>
          </Link>
        </div>
        
        {/* 建議連結 */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-500 mb-4">您可能想要：</p>
          <div className="flex flex-wrap gap-2 justify-center">
            <Link 
              href="/" 
              className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
            >
              回到首頁
            </Link>
            <span className="text-gray-400">•</span>
            <Link 
              href="/test" 
              className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
            >
              測試頁面
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
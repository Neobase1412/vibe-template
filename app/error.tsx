'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { AlertCircle, Home, RotateCw } from 'lucide-react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // 在生產環境中，這裡可以將錯誤記錄到錯誤追蹤服務
    // 例如：Sentry, LogRocket, etc.
    if (process.env.NODE_ENV === 'development') {
      console.error('Application error:', error)
    }
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full text-center">
        {/* 錯誤圖示 */}
        <div className="mb-8">
          <AlertCircle className="w-20 h-20 text-red-500 mx-auto" />
        </div>

        {/* 錯誤標題 */}
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          哎呀！出了點問題
        </h1>

        {/* 錯誤描述 */}
        <p className="text-gray-600 mb-8 leading-relaxed">
          {error.message || '應用程式遇到了未預期的錯誤。請重新整理頁面或稍後再試。'}
        </p>

        {/* 錯誤代碼（開發環境顯示） */}
        {process.env.NODE_ENV === 'development' && error.digest && (
          <p className="text-sm text-gray-500 mb-8 font-mono">
            錯誤代碼：{error.digest}
          </p>
        )}

        {/* 操作按鈕 */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button 
            onClick={reset}
            className="inline-flex items-center"
          >
            <RotateCw className="w-4 h-4 mr-2" />
            重試
          </Button>
          
          <Button
            variant="outline"
            onClick={() => window.location.href = '/'}
            className="inline-flex items-center"
          >
            <Home className="w-4 h-4 mr-2" />
            返回首頁
          </Button>
        </div>

        {/* 聯絡支援提示 */}
        <p className="text-sm text-gray-500 mt-8">
          如果問題持續發生，請聯絡客服支援
        </p>
      </div>
    </div>
  )
}
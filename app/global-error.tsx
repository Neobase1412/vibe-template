'use client'

import { useEffect } from 'react'
import { AlertTriangle, RefreshCw } from 'lucide-react'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // 記錄嚴重錯誤到錯誤追蹤服務
    if (process.env.NODE_ENV === 'development') {
      console.error('Global application error:', error)
    }
  }, [error])

  return (
    <html>
      <body>
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-16">
          <div className="max-w-md w-full text-center">
            {/* 警告圖示 */}
            <div className="mb-8">
              <AlertTriangle className="w-24 h-24 text-amber-500 mx-auto" />
            </div>

            {/* 錯誤標題 */}
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              應用程式發生嚴重錯誤
            </h1>

            {/* 錯誤描述 */}
            <p className="text-gray-600 mb-8 leading-relaxed">
              很抱歉，應用程式遇到了無法恢復的錯誤。這可能是暫時性的問題，請重新整理頁面再試一次。
            </p>

            {/* 技術細節（開發環境） */}
            {process.env.NODE_ENV === 'development' && (
              <div className="mb-8 p-4 bg-gray-100 rounded-lg text-left">
                <p className="text-sm font-mono text-gray-700 break-all">
                  {error.message}
                </p>
                {error.digest && (
                  <p className="text-xs font-mono text-gray-500 mt-2">
                    Digest: {error.digest}
                  </p>
                )}
              </div>
            )}

            {/* 重新整理按鈕 */}
            <button
              onClick={reset}
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              重新整理頁面
            </button>

            {/* 額外提示 */}
            <div className="mt-8 text-sm text-gray-500">
              <p>如果問題持續發生：</p>
              <ul className="mt-2 space-y-1">
                <li>• 清除瀏覽器快取和 Cookie</li>
                <li>• 嘗試使用其他瀏覽器</li>
                <li>• 聯絡技術支援團隊</li>
              </ul>
            </div>
          </div>
        </div>
      </body>
    </html>
  )
}
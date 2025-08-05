'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

// 定義表單驗證 Schema
const contactFormSchema = z.object({
  name: z.string()
    .min(2, '姓名至少需要 2 個字')
    .max(50, '姓名不能超過 50 個字'),
  
  email: z.string()
    .email('請輸入有效的 Email 地址'),
  
  phone: z.string()
    .refine(
      (val) => !val || /^(09\d{8}|0[2-8]\d{7,8})$/.test(val),
      '請輸入有效的電話號碼'
    )
    .optional(),
  
  subject: z.string()
    .min(5, '主旨至少需要 5 個字')
    .max(100, '主旨不能超過 100 個字'),
  
  category: z.enum(['general', 'support', 'sales', 'feedback'], {
    message: '請選擇詢問類別',
  }),
  
  message: z.string()
    .min(10, '訊息內容至少需要 10 個字')
    .max(1000, '訊息內容不能超過 1000 個字'),
})

// 推導表單類型
type ContactFormData = z.infer<typeof contactFormSchema>

// 模擬 API 提交（實際使用時替換為真實 API）
async function submitContactForm(_data: ContactFormData): Promise<void> {
  await new Promise(resolve => setTimeout(resolve, 2000))
  // 這裡可以加入實際的 API 呼叫
  // 實際使用時替換為真實 API 呼叫
  // 範例: await fetch('/api/contact', { method: 'POST', body: JSON.stringify(data) })
}

export function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)

  // 初始化表單
  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: '',
    },
  })

  // 處理表單提交
  async function onSubmit(data: ContactFormData) {
    setIsSubmitting(true)
    
    try {
      await submitContactForm(data)
      
      // 顯示成功訊息
      toast.success('訊息已成功發送！我們會盡快回覆您。')
      
      // 重置表單
      form.reset()
    } catch {
      // 顯示錯誤訊息
      toast.error('發送失敗，請稍後再試')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* 姓名與 Email 並排 */}
        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>姓名 *</FormLabel>
                <FormControl>
                  <Input placeholder="請輸入您的姓名" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email *</FormLabel>
                <FormControl>
                  <Input 
                    type="email" 
                    placeholder="your@email.com" 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* 電話與類別並排 */}
        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>電話（選填）</FormLabel>
                <FormControl>
                  <Input 
                    type="tel" 
                    placeholder="0912-345-678" 
                    {...field} 
                  />
                </FormControl>
                <FormDescription>
                  方便我們更快聯繫您
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>詢問類別 *</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="請選擇詢問類別" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="general">一般詢問</SelectItem>
                    <SelectItem value="support">技術支援</SelectItem>
                    <SelectItem value="sales">業務合作</SelectItem>
                    <SelectItem value="feedback">意見回饋</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* 主旨 */}
        <FormField
          control={form.control}
          name="subject"
          render={({ field }) => (
            <FormItem>
              <FormLabel>主旨 *</FormLabel>
              <FormControl>
                <Input 
                  placeholder="請簡短描述您的問題或需求" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* 訊息內容 */}
        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel>訊息內容 *</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="請詳細描述您的需求或問題..."
                  className="min-h-[150px] resize-y"
                  {...field} 
                />
              </FormControl>
              <FormDescription>
                請提供盡可能詳細的資訊，以便我們更好地協助您
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* 提交按鈕 */}
        <div className="flex gap-4">
          <Button 
            type="submit" 
            disabled={isSubmitting}
            className="min-w-[120px]"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                發送中...
              </>
            ) : (
              '發送訊息'
            )}
          </Button>
          
          <Button
            type="button"
            variant="outline"
            onClick={() => form.reset()}
            disabled={isSubmitting}
          >
            清除表單
          </Button>
        </div>
      </form>
    </Form>
  )
}
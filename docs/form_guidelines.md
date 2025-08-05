# 表單設計與驗證指南

## 核心原則

使用 React Hook Form + Zod 實現高效能的表單處理和類型安全的驗證。

## 表單佈局規範

### 基本表單結構

```tsx
<form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
  {/* 表單標題 */}
  <div>
    <h2 className="text-2xl font-bold">表單標題</h2>
    <p className="text-gray-600">表單描述說明</p>
  </div>

  {/* 表單欄位 */}
  <div className="space-y-4">
    {/* 各個輸入欄位 */}
  </div>

  {/* 提交按鈕區域 */}
  <div className="flex gap-4">
    <Button type="submit">提交</Button>
    <Button type="button" variant="outline">取消</Button>
  </div>
</form>
```

### 響應式表單佈局

```tsx
// 單欄佈局（手機）
<div className="space-y-4">
  <FormField />
  <FormField />
</div>

// 雙欄佈局（平板以上）
<div className="grid md:grid-cols-2 gap-4">
  <FormField />
  <FormField />
</div>

// 複雜表單分組
<div className="space-y-8">
  <section>
    <h3 className="text-lg font-semibold mb-4">基本資料</h3>
    <div className="grid md:grid-cols-2 gap-4">
      {/* 基本資料欄位 */}
    </div>
  </section>
  
  <section>
    <h3 className="text-lg font-semibold mb-4">聯絡資訊</h3>
    <div className="space-y-4">
      {/* 聯絡資訊欄位 */}
    </div>
  </section>
</div>
```

## Zod 驗證規則

### 基本驗證 Schema

```tsx
import { z } from 'zod'

// 定義表單 Schema
const formSchema = z.object({
  // 必填文字
  name: z.string()
    .min(2, '名稱至少需要 2 個字')
    .max(50, '名稱不能超過 50 個字'),
  
  // Email 驗證
  email: z.string()
    .email('請輸入有效的 Email'),
  
  // 數字驗證
  age: z.number()
    .min(18, '年齡必須大於 18 歲')
    .max(100, '年齡必須小於 100 歲'),
  
  // 選擇項驗證
  category: z.enum(['personal', 'business'], {
    required_error: '請選擇類別',
  }),
  
  // 可選欄位
  description: z.string().optional(),
  
  // 條件驗證
  phone: z.string().regex(/^09\d{8}$/, '請輸入有效的手機號碼').optional(),
})

// 推導 TypeScript 類型
type FormData = z.infer<typeof formSchema>
```

### 進階驗證規則

```tsx
// 密碼驗證（含複雜度要求）
const passwordSchema = z.object({
  password: z.string()
    .min(8, '密碼至少需要 8 個字元')
    .regex(/[A-Z]/, '密碼需包含至少一個大寫字母')
    .regex(/[a-z]/, '密碼需包含至少一個小寫字母')
    .regex(/[0-9]/, '密碼需包含至少一個數字')
    .regex(/[@$!%*?&]/, '密碼需包含至少一個特殊字元'),
  
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: '密碼不一致',
  path: ['confirmPassword'],
})

// 日期驗證
const dateSchema = z.object({
  startDate: z.date(),
  endDate: z.date(),
}).refine((data) => data.endDate > data.startDate, {
  message: '結束日期必須晚於開始日期',
  path: ['endDate'],
})

// 動態驗證（根據其他欄位）
const dynamicSchema = z.object({
  hasDiscount: z.boolean(),
  discountCode: z.string().optional(),
}).refine((data) => {
  if (data.hasDiscount && !data.discountCode) {
    return false
  }
  return true
}, {
  message: '請輸入折扣碼',
  path: ['discountCode'],
})
```

## React Hook Form 整合

### 基本表單設置

```tsx
'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

// 1. 定義 Schema
const formSchema = z.object({
  username: z.string().min(2).max(50),
  email: z.string().email(),
})

type FormData = z.infer<typeof formSchema>

export function ContactForm() {
  // 2. 初始化表單
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
      email: '',
    },
  })

  // 3. 提交處理
  const onSubmit = async (data: FormData) => {
    try {
      // 處理表單提交
      await submitForm(data)
      reset() // 重置表單
    } catch (error) {
      // 錯誤處理
    }
  }

  // 4. 渲染表單
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* 表單內容 */}
    </form>
  )
}
```

### 使用 Shadcn/UI Form 元件

```tsx
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
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
import { Button } from '@/components/ui/button'

export function AdvancedForm() {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>使用者名稱</FormLabel>
              <FormControl>
                <Input placeholder="請輸入使用者名稱" {...field} />
              </FormControl>
              <FormDescription>
                這是您的公開顯示名稱
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? '提交中...' : '提交'}
        </Button>
      </form>
    </Form>
  )
}
```

## 錯誤訊息顯示

### 錯誤訊息元件

```tsx
// 單一錯誤訊息
function ErrorMessage({ error }: { error?: string }) {
  if (!error) return null
  
  return (
    <p className="text-sm text-red-500 mt-1">
      {error}
    </p>
  )
}

// 使用範例
<Input {...register('email')} />
<ErrorMessage error={errors.email?.message} />
```

### 錯誤訊息樣式

```tsx
// 輸入框錯誤狀態
<Input 
  {...register('email')}
  className={cn(
    "border-gray-300",
    errors.email && "border-red-500 focus:border-red-500"
  )}
/>

// 錯誤摘要顯示
{Object.keys(errors).length > 0 && (
  <Alert variant="destructive">
    <AlertCircle className="h-4 w-4" />
    <AlertTitle>錯誤</AlertTitle>
    <AlertDescription>
      請修正以下錯誤後再提交表單
    </AlertDescription>
  </Alert>
)}
```

## 表單提交狀態處理

### 載入狀態

```tsx
function SubmitButton({ isSubmitting }: { isSubmitting: boolean }) {
  return (
    <Button type="submit" disabled={isSubmitting}>
      {isSubmitting ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          提交中...
        </>
      ) : (
        '提交'
      )}
    </Button>
  )
}
```

### 完整的狀態管理

```tsx
export function CompleteForm() {
  const [submitStatus, setSubmitStatus] = useState<
    'idle' | 'loading' | 'success' | 'error'
  >('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
  })

  const onSubmit = async (data: FormData) => {
    setSubmitStatus('loading')
    setErrorMessage('')

    try {
      await submitForm(data)
      setSubmitStatus('success')
      form.reset()
      
      // 顯示成功訊息
      toast.success('表單提交成功！')
    } catch (error) {
      setSubmitStatus('error')
      setErrorMessage(
        error instanceof Error 
          ? error.message 
          : '提交失敗，請稍後再試'
      )
      
      // 顯示錯誤訊息
      toast.error(errorMessage)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        {/* 表單欄位 */}
        
        {/* 錯誤訊息 */}
        {submitStatus === 'error' && (
          <Alert variant="destructive">
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        )}
        
        {/* 成功訊息 */}
        {submitStatus === 'success' && (
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              表單已成功提交！
            </AlertDescription>
          </Alert>
        )}
        
        {/* 提交按鈕 */}
        <SubmitButton isSubmitting={submitStatus === 'loading'} />
      </form>
    </Form>
  )
}
```

## 實用表單範例

### 登入表單

```tsx
const loginSchema = z.object({
  email: z.string().email('請輸入有效的 Email'),
  password: z.string().min(1, '請輸入密碼'),
  remember: z.boolean().default(false),
})

export function LoginForm() {
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      remember: false,
    },
  })

  const onSubmit = async (data: z.infer<typeof loginSchema>) => {
    // 處理登入邏輯
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input 
                  type="email" 
                  placeholder="user@example.com" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>密碼</FormLabel>
              <FormControl>
                <Input 
                  type="password" 
                  placeholder="請輸入密碼" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="remember"
          render={({ field }) => (
            <FormItem className="flex items-center space-x-2">
              <FormControl>
                <Checkbox 
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormLabel className="text-sm font-normal">
                記住我
              </FormLabel>
            </FormItem>
          )}
        />
        
        <Button type="submit" className="w-full">
          登入
        </Button>
      </form>
    </Form>
  )
}
```

### 聯絡表單

```tsx
const contactSchema = z.object({
  name: z.string().min(2, '姓名至少需要 2 個字'),
  email: z.string().email('請輸入有效的 Email'),
  subject: z.string().min(5, '主旨至少需要 5 個字'),
  message: z.string().min(10, '訊息至少需要 10 個字'),
  category: z.enum(['general', 'support', 'sales', 'other']),
})

export function ContactForm() {
  const form = useForm<z.infer<typeof contactSchema>>({
    resolver: zodResolver(contactSchema),
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>姓名</FormLabel>
                <FormControl>
                  <Input placeholder="您的姓名" {...field} />
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
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="your@email.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>類別</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="選擇詢問類別" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="general">一般詢問</SelectItem>
                  <SelectItem value="support">技術支援</SelectItem>
                  <SelectItem value="sales">業務合作</SelectItem>
                  <SelectItem value="other">其他</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="subject"
          render={({ field }) => (
            <FormItem>
              <FormLabel>主旨</FormLabel>
              <FormControl>
                <Input placeholder="簡短描述您的問題" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel>訊息內容</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="請詳細描述您的需求或問題"
                  className="min-h-[120px]"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button type="submit" className="w-full md:w-auto">
          發送訊息
        </Button>
      </form>
    </Form>
  )
}
```

## 最佳實踐

1. **即時驗證** - 使用 `mode: 'onChange'` 提供即時回饋
2. **清晰的錯誤訊息** - 具體說明錯誤原因和解決方法
3. **防止重複提交** - 提交時禁用按鈕
4. **保存草稿** - 重要表單考慮自動保存功能
5. **無障礙設計** - 確保表單可以用鍵盤操作
6. **響應式設計** - 適配不同螢幕尺寸
7. **載入狀態** - 明確顯示提交進度

## 注意事項

1. **TypeScript 整合** - 充分利用 Zod 的類型推導
2. **錯誤邊界** - 處理非預期的錯誤
3. **安全性** - 前端驗證不能取代後端驗證
4. **效能** - 大表單考慮分步驟或分區塊驗證
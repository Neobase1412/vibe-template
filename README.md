# 🏆 黃金範本儲存庫 (Golden Template)

這是一個專為「AI 驅動開發流程」設計的 Next.js 專案範本。它不是給人類開發者使用的傳統範本，而是為了讓**非技術背景的創意工作者（Vibe Coder）**能透過簡單的文字描述，由 **AI Agent (Claude)** 自動生成功能完整、可部署的網頁應用。

## 🎯 核心理念

本專案是一場開發流程革命的實驗：

- **主要用戶是 AI** - 整個專案結構、文檔和規範都經過精心設計，為了讓 Claude AI 能最大程度理解並執行任務
- **零程式碼創作** - Vibe Coder 只需修改 `PRD.md` 文件來表達創意，無需編寫任何程式碼
- **完全自動化** - 從讀取需求到生成程式碼，全程由 GitHub Actions 驅動的 AI 完成
- **上下文豐富** - 提供完整的技術規範和指導文檔，確保 AI 產出高品質、一致性的程式碼

## 🚀 快速開始

### 1. Fork 這個範本

點擊右上角的 Fork 按鈕，創建你自己的專案副本。

### 2. 啟用必要功能

Fork 後的儲存庫預設關閉了某些功能，你需要手動開啟：

1. 進入你的儲存庫 **Settings**
2. 在 **General** → **Features** 區塊中：
   - ✅ 勾選 **Issues** - 啟用 Issue 功能
   - ✅ 勾選 **Actions** → 選擇 **Allow all actions and reusable workflows**
3. 儲存變更

### 3. 設置 API 金鑰（必須）

在你的 GitHub 儲存庫中設置以下 Secrets：

1. 進入 **Settings** → **Secrets and variables** → **Actions**
2. 點擊 **"New repository secret"**
3. 添加以下 Secret：
   - **Name**: `ANTHROPIC_API_KEY`
   - **Value**: 你的 Claude API 金鑰（從 [Anthropic Console](https://console.anthropic.com/) 獲取）

⚠️ **重要**：如果沒有設置這個 Secret，GitHub Actions 將無法運行！

### 4. 表達你的創意

編輯 `PRD.md` 文件，在各個段落中描述你理想中的網頁設計：

- 核心設計理念
- 頁面佈局結構
- 商品展示方式
- 視覺風格與品牌
- 互動效果與動畫
- 響應式設計需求

### 5. 部署到 Vercel

1. 前往 [Vercel](https://vercel.com) 並使用 GitHub 帳號登入
2. 點擊 "New Project"
3. 選擇你 Fork 的 `vibe-template` 儲存庫
4. Vercel 會自動偵測 Next.js 設定，直接點擊 "Deploy"
5. 部署完成後，你會獲得一個專屬的網址（例如：`your-project.vercel.app`）

### 6. 啟動 AI 開發

1. 創建一個新的 Issue 描述你的需求
2. 在 Issue 評論中輸入 `@claude` 
3. AI 將自動開始工作並創建 Pull Request
4. 合併 PR 後，Vercel 會自動重新部署最新版本

## 📁 專案結構

```
vibe-template/
├── app/                 # Next.js App Router
│   ├── api/            # API 路由
│   │   └── products/   # 商品 API 端點
│   ├── components/     # React 元件
│   │   └── ui/        # Shadcn/UI 元件
│   └── page.tsx       # 首頁
├── lib/                # 工具函數
├── public/              
│   └── products.json   # 商品數據（唯一數據源，禁止修改）
├── docs/               # AI 上下文文檔
│   ├── api_docs.md     # API 端點規範
│   ├── db_schema.md    # 數據結構定義
│   ├── coding_style.md # 程式碼風格規範
│   └── style_guide.md  # 視覺設計指南
├── .github/
│   └── workflows/      
│       └── claude.yml  # 自動化工作流
├── CLAUDE.md          # AI 角色與權責定義（核心文件）
├── PRD.md            # 產品需求文檔（Vibe Coder 的創意畫布）
├── mcp.py            # AI 工具擴展（v0.dev 整合）
└── README.md         # 本文件
```

## 🛠️ 技術棧

- **框架**: Next.js 15+ (App Router)
- **語言**: TypeScript
- **樣式**: Tailwind CSS
- **UI 元件**: Shadcn/UI
- **AI 引擎**: Claude (Anthropic)

## 📚 預安裝元件

專案已預先配置以下 Shadcn/UI 元件：
- Button - 按鈕元件
- Card - 卡片容器
- Input - 輸入框

## 🔧 本地開發

如果你想在本地運行專案：

```bash
# 安裝依賴
pnpm install

# 啟動開發服務器
pnpm dev

# 構建專案
pnpm build

# 運行測試
pnpm test
```

## 📝 工作流程

這是整個 AI 驅動開發的核心流程：

1. **Fork 範本** - Vibe Coder Fork 這個儲存庫作為自己的專案基礎
2. **表達創意** - 修改 `PRD.md` 文件，用自然語言描述理想中的網頁設計
3. **觸發 AI** - 在 Issue 中評論 `@claude` 啟動自動化開發
4. **AI 理解任務** - Claude 讀取：
   - `PRD.md` - 理解創意需求
   - `CLAUDE.md` - 明確自身角色與規則
   - `/docs/*` - 獲取技術規範和指導
5. **自動實現** - AI 根據所有上下文生成完整的功能程式碼
6. **創建 PR** - 自動提交 Pull Request 供審查
7. **部署上線** - 合併 PR 後，Vercel 會自動部署最新版本

## 📚 Issue 和 PR 模板

專案提供了以下模板來協助您與 Claude 互動：

**Issue 模板：**
- 🎨 功能實現請求 - 請求新功能
- 🐛 Bug 修復請求 - 報告問題
- ❓ 詢問 Claude - 提出問題

**其他資源：**
- 📖 [Claude 互動指南](docs/claude_interaction_guide.md) - 學習如何有效地與 AI 對話
- 📝 Pull Request 模板 - 審查 AI 生成的程式碼

## ⚙️ 自動化架構

本專案的自動化核心：

### GitHub Actions (`claude.yml`)
- **觸發條件**: Issue 評論包含 `@claude`
- **核心 Action**: `anthropics/claude-code-action`
- **工作流程**:
  1. 檢測評論觸發詞
  2. 啟動 Claude AI Agent
  3. AI 讀取所有相關文件
  4. 生成程式碼並創建 PR

### AI 工具擴展 (`mcp.py`)
- **功能**: 整合 v0.dev API
- **目的**: 讓 AI 能生成複雜的 UI 元件
- **使用**: AI 可調用此工具增強設計能力

## 🔑 關鍵文件說明

### `CLAUDE.md` - AI 的「大腦」
定義了 AI 的角色、權責和工作規則。這是確保 AI 行為一致性的核心文件。

### `PRD.md` - 創意的畫布
Vibe Coder 表達創意的唯一介面。提供結構化的模板引導非技術用戶描述需求。

### `/docs/` - 知識庫
包含所有技術規範，將隱性知識顯性化，讓 AI 能準確理解專案要求。

## 🎯 成功標準

本專案的成功取決於：

1. **最少人類干預** - AI 能獨立完成從需求到實現的全過程
2. **最大理解程度** - 透過豐富的上下文讓 AI 充分理解任務
3. **高品質產出** - AI 生成的程式碼符合所有規範且功能完整
4. **一致性保證** - 每次執行都能產出風格一致的高品質程式碼

## 🚫 重要限制

AI 在工作時必須遵守的規則：

- **禁止修改** `/public/products.json` - 這是唯一的數據源
- **禁止修改** `/docs/` 目錄下的任何文件 - 這些是不可變的規範
- **必須使用** 預安裝的 Shadcn/UI 元件
- **必須通過** API 端點獲取數據，不得直接引入 JSON 文件

## 📄 授權

MIT License

---

> 🚀 **這不只是一個專案範本，這是一場開發流程的革命實驗。**
> 
> 讓我們一起探索 AI 驅動開發的無限可能！
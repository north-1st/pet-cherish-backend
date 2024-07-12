# pet-cherish-backend

此為寵樂的後端服務。使用 Node.js、Express、TypeScript、zod 和 Prisma 等架構構建的。本專案遵循最佳實踐，包括編碼標準、語法檢查和格式化。

### 前置準備

- Node.js（版本 18.7 以上）
- npm（版本 6.x 以上）
- MongoDB

### 安裝

```bash
npm install
```

### 開發

```bash
npx prisma generate
npx prisma studio
npm run dev
```

### 產生 swagger.json

```bash
npm run swagger
```

### swagger 文件

```bash
https://pet-cherish-backend.zeabur.app/api-docs
```

### 語法檢查和格式化

本專案使用 ESLint 進行語法檢查，使用 Prettier 進行程式碼格式化。確保程式碼符合專案的規則，執行以下指令：

```bash
npm run lint
npm run format
```

### Husky 和 Lint-Staged

Husky 用於管理 Git hooks，lint-staged 用於在暫存文件上運行 linters。要設置 Husky，執行：

```bash
npm run prepare
```

### 本地安裝 mongodb

```
brew install mongodb-community
brew services start mongodb-community
brew services stop mongodb-community
```

### 本地啟用 docker

#### 執行指令

```bash
docker compose up -d
```

#### 在 .env 設定 DATABASE_URL

```bash
DATABASE_URL=mongodb://root:prisma@localhost:27017/pet-cherish?authSource=admin&retryWrites=true&w=majority
```

### 新增初始化資料

```bash
npx ts-node src/prisma/seed.ts
```

### Stripe

```
測試金融卡資訊: 4242 4242 4242 4242
```

### 開發技術

- [ESLint](https://github.com/eslint/eslint)
- [Husky](https://github.com/typicode/husky)
- [lint-staged](https://github.com/okonet/lint-staged)
- [nodemon](https://github.com/remy/nodemon)
- [Prettier](https://github.com/prettier/prettier)
- [Prisma](https://github.com/prisma/prisma)
- [ts-node](https://github.com/TypeStrong/ts-node)
- [TypesSript](https://github.com/microsoft/TypeScript)

### 專案技術

- [zod](https://github.com/colinhacks/zod)
- [zod-to-openapi](https://github.com/asteasolutions/zod-to-openapi)
- [agenda](https://github.com/agenda/agenda)
- [axios](https://github.com/axios/axios)
- [bcrypt](https://github.com/kelektiv/node.bcrypt.js)
- [connect-mongo](https://github.com/jdesboeufs/connect-mongo)
- [envalid](https://github.com/af/envalid)
- [express](https://github.com/expressjs/express)

- [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken)
- [mongodb](https://github.com/mongodb/node-mongodb-native)
- [passport](https://github.com/jaredhanson/passport)


### 第三方服務

- [Firebase Cloud Storage](https://github.com/firebase/firebase-admin-node)
- [stripe](https://github.com/stripe/stripe-node)

## 專案結構

```bash
src/
├── config/        # swagger、passport 設置
├── controllers/   # 路由控制器
├── jobs/          # 排程
├── middlewares/   # Express 中介
├── prisma/        # Prisma 設置
├── routes/        # Express 路由
├── schema/        # 資料型別定義
├── services/      # 服務設置、函式
├── server.ts      # 專案入口
└── swagger.ts     # Swagger 設定
```

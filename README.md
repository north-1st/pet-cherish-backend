# pet-cherish-backend

## Setup

```bash
npm i
npm start

npx prisma generate
npx prisma studio

# 本地安裝 mongodb
brew install mongodb-community
brew services start mongodb-community
brew services stop mongodb-community
```

## 本地啟用 docker

#### 執行指令

```bash
docker compose up -d
```

#### 在 .env 設定 DATABASE_URL

```bash
DATABASE_URL=mongodb://root:prisma@localhost:27017/pet-cherish?authSource=admin&retryWrites=true&w=majority
```

## 新增初始化資料

```bash
npx ts-node src/prisma/seed.ts
```

## 產生 swagger.json

```bash
npm run swagger
```

## Stripe

```
測試金融卡資訊: 4242 4242 4242 4242
```

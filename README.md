# News Web Site + Admin UI

#### Описание задачи

Цель проекта состоит в разработке новостного сайта и системы управления контентом (CMS) к нему. Основными особенностями проекта: SEO оптимизация (техническая), ARIA оптимизация, возможность указания источников RSS для импорта новостей со сторонних ресурсов, возможность "подмешивания" рекламных блоков в список новостей.

#### Running web app in docker

```
fill .env using .env.example
docker-compose -f docker-compose.dev.yml build
docker-compose -f docker-compose.dev.yml up -d
```

#### Building app locally

```
fill .env using .env.example
npm i
docker-compose -f docker-compose.dev.yml build
docker-compose -f docker-compose.dev.yml up db
npx prisma db push
npx prisma db seed
npm run build
```

#### Seting up s3 minio region

```
go to http://localhost:9001/
enter credentials from env file
go to settings and set up s3 region from env file
```

#### Starting app locally

```
npm run local-start
```

#### Starting app locally in dev mode

```
npm run local-dev
```

#### CMS Portal route

```
  /cms
```

#### Default Credentials

```
  admin@news.com 12345678
  user@news.com 12345678
```

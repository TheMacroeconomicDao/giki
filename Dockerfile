FROM node:18-alpine

WORKDIR /app

# Копируем package.json и package-lock.json
COPY package*.json ./

# Устанавливаем зависимости
RUN npm ci

# Копируем исходный код
COPY . .

# Устанавливаем переменные окружения
ENV NODE_ENV=production

# Билдим приложение
RUN npm run build

# Экспозим порт
EXPOSE 3000

# Запускаем приложение
CMD ["npm", "start"]

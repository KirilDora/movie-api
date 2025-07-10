# 📦 Використовуємо стабільну базу
FROM node:18-bullseye

# 📂 Робоча директорія всередині контейнера
WORKDIR /app

# 📄 Копіюємо package файли
COPY package*.json ./

# 📥 Встановлюємо залежності (включно з sqlite3)
RUN npm install --build-from-source sqlite3 && npm install

# 📄 Копіюємо увесь проєкт
COPY . .

# 🔐 ENV-перемінна (порт)
ENV NODE_ENV=production

# 🌐 Порт, який відкриває додаток (читає APP_PORT із -e або .env)
EXPOSE ${APP_PORT}

# 🚀 Запуск додатку
CMD ["node", "src/app.js"]

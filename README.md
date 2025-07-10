# 🎬 Movies API

Movies API — це RESTful сервіс для керування колекцією фільмів та акторів.  
Підтримує авторизацію, створення/видалення фільмів, пошук, імпорт з `.txt` файлів і сортування.

---

## 🚀 Можливості

- 🔐 Реєстрація та авторизація через JWT
- 🎥 Додавання фільмів та акторів
- 🔎 Пошук фільмів за назвою або іменем актора
- 📂 Імпорт фільмів з текстового файлу
- 📊 Сортування фільмів по назві
- 📡 RESTful API

---

## 📦 Технології

- Node.js + Express
- SQLite + Sequelize ORM
- Multer (для імпорту файлів)
- JWT (авторизація)
- Docker (контейнеризація)

---

## ⚙️ Запуск локально

1. Клонуй репозиторій:

   ```bash
   git clone https://github.com/KirilDora/movies-api.git
   cd movies-api

   ```

2. Встанови залежності:

   ```bash
   npm install

   ```

3. Створи .env файл на основі .env.example:

   ```bash
   cp .env.example .env

   ```

4. Запусти застосунок:

   ```bash
   node .\src\app.js

   ```

🐳 DockerHub: [kirildora/movies](https://hub.docker.com/r/kirildora/movies)

🐳 Docker
🔧 Збірка Docker-образу

    ```bash
    docker build -t kirildora/movies .
    ```

🚀 Запуск через Docker

    ```bash
    docker run --name movies -p 8000:8050 -e APP_PORT=8050 kirildora/movies
    ```

Застосунок буде доступний за адресою:
👉 http://localhost:8000

🔐 Авторизація
Після реєстрації/логіну отримай токен:

`json

{
"token": "eyJhbGciOiJIUzI1..."
}
`
Додавай його до кожного захищеного запиту:

    ```
    Authorization: Bearer <your_token>
    ```

📄 API Роути
| Method | Route | Description

|--------|-------|-------------

| POST | /api/v1/auth/register | Реєстрація користувача
| POST | /api/v1/auth/login | Авторизація
| GET | /api/v1/movies | Отримати всі фільми (пошук + сортування)
| POST | /api/v1/movies | Додати фільм
| GET | /api/v1/movies/:id | Отримати фільм за ID
| DELETE | /api/v1/movies/:id | Видалити фільм
| POST | /api/v1/movies/import | Імпорт фільмів з .txt (form-data)

📝 Формат .txt для імпорту

```txt
Title: The Matrix
Release Year: 1999
Format: VHS
Stars: Keanu Reeves, Laurence Fishburne

Title: Titanic
Release Year: 1997
Format: DVD
Stars: Leonardo DiCaprio, Kate Winslet
```

🧪 Приклади запитів
/movies?title=Matrix → пошук по назві

/movies?actor=Keanu → пошук по актору

/movies?order=DESC → сортування у зворотньому порядку

/movies?title=Matrix&order=DESC → пошук + сортування

📁 Структура проєкту

```arduino

src/
  config/
  controllers/
  middleware/
  models/
  routes/
  services/
  uploads/
.env
Dockerfile
README.md
```

🧼 .env.example

    ```env

    APP_PORT=8000
    JWT_SECRET=supersecret

    ```

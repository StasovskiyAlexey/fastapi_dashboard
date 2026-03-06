## 🚀 Fastapi Fullstack Dashboard

### Интерактивный дашборд на стеке FastAPI + React, упакованный в Docker и оптимизированный для работы в среде Linux/WSL2.

---

1. ### ⭐ Активация приложения(Linux)

// Создаем переменные окружения в проекте<br>
`POSTGRES_PASSWORD=postgres`<br>
`POSTGRES_DB=fastapi_db`<br>
`DATABASE_URL=postgresql+asyncpg://postgres:postgres@db:5432/fastapi_db`<br>
`SECRET_KEY=secret_key`<br>
`DEBUG=True`<br>
`VITE_APP_URL='/api'`

// Заходим в корень проекта<br>
`cd fastapi_dashboard`

**Back-End**:

// Путь к бекенду<br>
`cd backend`

// Вход в виртуальное окружение<br>
`python3 -m venv venv`

// Активация виртуального приложения<br>
`source venv/bin/activate`

// Установка зависимостей<br>
`pip install -r requirements.txt`

**Front-End**:

// Путь к фронтенду<br>
`cd frontend`

// Установка зависимостей<br>
`npm install или npm i`

// Выходим в корень проект<br>
`cd ..`

// Билдим приложение<br>
`make build`

// Применяем миграции<br>
`docker exec -it fastapi_app alembic upgrade head`

###### ❗ Контейнер должен быть запущен в другом терминале или без вывода логов в фоне

// Создаем контейнер при запуске<br>
`make up`

// Проверка запущеного nginx сервер<br>
`localhost(Фронтенд)`<br>
`localhost/api/docs(Бекенд)`

###### ❗ Если есть ошибка 404 (Not found)
`sudo systemctl stop nginx` - Основка системного контейнера

---

2. ### 🗄 Функционал проекта:

Полноценная Kanban-доска<br>
Я разработал функциональный аналог **Trello**, который позволяет эффективно управлять задачами с помощью визуального интерфейса:

* **Drag-and-Drop:** интуитивное перемещение карточек между колонками для быстрого изменения статусов задач.
* **Гибкая архитектура:** Создание собственных досок, колонок и управление приоритетами карточек.
* **User Management:** Полноценная авторизация, редактирование профиля, изменение аватаров и паролей.
* **High Performance:** Оптимизированная работа с серверным состоянием через TanStack Query для мгновенного обновления интерфейса без лишних перегрузок страницы.

---

3. ### 📄 Стек приложения

| Модуль | Технологии |
| :--- | :--- |
| **Back-End** | FastAPI, SQLAlchemy 2.0 (Async), Alembic, Pydantic v2, Uvicorn |
| **Front-End** | React 19, TypeScript, Tanstack Router, Zustand, React-Hook-Form |
| **UI/UX** | Tailwind CSS 4, shadcn/ui, Lucide Icons |
| **Security** | JWT (OAuth2), Passlib (bcrypt), HTTP-only Cookies |
| **DevOps** | Docker, Docker Compose, Nginx (Reverse Proxy) |


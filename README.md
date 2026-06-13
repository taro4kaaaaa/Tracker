# 🏋️ Tracker

Интерактивное веб-приложение для отслеживания тренировок, целей и прогресса пользователя.

Основной фокус:

- frontend и backend архитектура
- управление состоянием
- работа с REST API
- контейнеризация приложения
- разделение логики и UI

---

## 🌐 Live Demo

https://tracker-puce-alpha.vercel.app/

---

## 📸 Screenshots

### 🏠 Главная страница
<img src="./frontend/src/assets/main.png" width="400"/>
<p>Основной экран приложения с отображением активности пользователя и навигацией по разделам.</p>


### 🏋️ Тренировки
<img src="./frontend/src/assets/training.png" width="400"/>
<p>Список заверщенных тренировок с фильтрацией и пагинацией</p>

### 📅 Календарь
<img src="./frontend/src/assets/calendar.png" width="400"/>
<p>Планирование тренировок на месяц</p>

### 📈 Статистика
<img src="./frontend/src/assets/statistics.png" width="400"/>
<p>Аналитика тренировок и визуализация прогресса пользователя.</p>

---

## ✨ Key Features & Value

- 🧠 **Feature-based архитектура**  
  Проект разделён по бизнес-доменам (training, goals, calendar, statistics), что упрощает масштабирование и поддержку.

- 📦 **Глобальное состояние через Context API**  
  Состояние разделено на несколько контекстов (тренировки, цели, пользователь), что уменьшает связанность и избавляет от prop drilling.

- 🌐 Интеграция с REST API
  Цели и соревнования загружаются с backend-сервера через HTTP-запросы.

- 💾 Хранение данных
  Backend использует JSON-хранилище для хранения пользовательских данных.

- 🧮 **Вынос бизнес-логики**  
  Основные расчёты и логика вынесены в utils, что повышает переиспользуемость и упрощает тестирование.

- ⚡ **Быстрая работа приложения**  
  Использование современного стека обеспечивает быстрый рендер и отзывчивый UI.

---

## 🧩 Technical Decisions & Challenges

- **Почему Context API:**  
  Выбран как лёгкое решение для управления глобальным состоянием без усложнения архитектуры. При масштабировании планируется переход на Zustand или Redux Toolkit.

- **Использование REST API:**
  Frontend получает данные через Express API, что позволяет отделить клиентскую часть от слоя хранения данных.

- **Backend на Express:**
  Сервер предоставляет конечные точки для получения целей и соревнований и может быть расширен для полноценной работы с базой данных.

- **Выбор структуры проекта:**  
  Feature-based подход позволяет изолировать бизнес-логику и UI, упрощая развитие проекта.

- **Работа с данными:**  
  Изначально использовалась структура Map, но в дальнейшем планируется переход на более простые структуры (Record) для лучшей сериализации.

- **Основной вызов:**  
  Управление состоянием и синхронизация данных между компонентами без использования сторонних библиотек.

---

## 🛠 Tech Stack

### Frontend
- React
- TypeScript
- Vite
- Context API
- CSS Modules

### Backend
- Node.js
- Express
- REST API
- JSON Storage

### DevOps
- Docker
- Docker Compose
- Nginx
- Linux
- Container Networking

---

## 🐳 Containerization

Приложение запускается в контейнерах Docker через Docker Compose.

### Особенности

- Docker для frontend
- Docker для backend
- Docker Compose orchestration
- Изоляция сервисов
- Контейнерная сеть между frontend и backend

### Архитектура

```text
Frontend (React)
       ↓
REST API
       ↓
Backend (Express)
       ↓
JSON Storage
```

---

## 🧠 Architecture

Проект организован по feature-based подходу:

- features/ — бизнес-домены (training, goals, calendar, statistics)
- shared/components/ — переиспользуемые UI-компоненты
- shared/utils/ — бизнес-логика и расчёты
- shared/types/ — типы данных
- context/ — глобальное состояние приложения

Подход позволяет:
- разделять ответственность
- переиспользовать код
- упрощать масштабирование

---

## ⚙️ Installation

### Run locally

```bash
git clone https://github.com/taro4kaaaaa/Tracker.git
cd Tracker/frontend
npm install
npm run dev
```
Frontend:
```text
http://localhost:5173
```
### Start backend

```bash
cd backend
npm install
npm run dev
```
Backend:
```text
http://localhost:3000
```
### Run with Docker Compose

```bash
docker compose up --build
```
Frontend:
```text
http://localhost:5173
```
Backend:
```text
http://localhost:3000
```
Stop containers:
```bash
docker compose down
```calhost:3000
```

---


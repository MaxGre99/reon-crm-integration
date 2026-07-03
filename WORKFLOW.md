# WORKFLOW

## Переменные окружения

| Переменная         | Описание                            |
| ------------------ | ----------------------------------- |
| PORT               | Порт приложения                     |
| CLIENT_ID          | ID интеграции amoCRM                |
| CLIENT_SECRET      | Секрет интеграции amoCRM            |
| REDIRECT_URI       | URI редиректа для OAuth             |
| DB_HOST            | Хост базы данных                    |
| DB_PORT            | Порт базы данных                    |
| DB_USER            | Пользователь базы данных            |
| DB_PASSWORD        | Пароль базы данных                  |
| DB_NAME            | Название базы данных                |
| ERROR_TASK_TYPE_ID | ID типа задачи "Ошибка" в amoCRM    |
| CHECK_TASK_TYPE_ID | ID типа задачи "Проверить" в amoCRM |

## Запуск

Поднять базу данных:

```bash
docker compose up -d
```

Запустить приложение:

```bash
npm run start:dev
```


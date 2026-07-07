# WORKFLOW

## Переменные окружения

| Переменная         | Тип    | Описание                            |
| ------------------ | ------ | ----------------------------------- |
| PORT               | number | Порт приложения                     |
| CLIENT_ID          | string | ID интеграции amoCRM                |
| CLIENT_SECRET      | string | Секрет интеграции amoCRM            |
| REDIRECT_URI       | string | URI редиректа для OAuth             |
| DB_HOST            | string | Хост базы данных                    |
| DB_PORT            | string | Порт базы данных                    |
| DB_USER            | string | Пользователь базы данных            |
| DB_PASSWORD        | string | Пароль базы данных                  |
| DB_NAME            | string | Название базы данных                |
| ERROR_TASK_TYPE_ID | string | ID типа задачи "Ошибка" в amoCRM    |
| CHECK_TASK_TYPE_ID | string | ID типа задачи "Проверить" в amoCRM |

## Запуск

Поднять базу данных:

```bash
docker compose up -d
```

Запустить приложение:

```bash
npm run start:dev
```


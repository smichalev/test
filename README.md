# Запуск проекта

```
$ docker-compose build && docker-compose up -d nats && docker-compose up -d db && sleep 20 && docker-compose up -d system && sleep 10 && docker-compose up -d api && docker-compose up -d generator && docker-compose up -d front
```

# Выключение 

```
$ docker-compose down
```

# Проверка

http://127.0.0.1:9999/

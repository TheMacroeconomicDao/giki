#!/bin/bash

# Скрипт для управления Docker-окружением Giki.js
# Автоматизирует основные команды для разработки и продакшена

# Цвета для вывода
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Функция для вывода сообщений
log() {
  echo -e "${BLUE}[GIKI]${NC} $1"
}

success() {
  echo -e "${GREEN}[GIKI]${NC} $1"
}

error() {
  echo -e "${RED}[GIKI]${NC} $1"
}

# Функция для проверки наличия Docker
check_docker() {
  if ! command -v docker &> /dev/null; then
    error "Docker не установлен. Установите Docker и повторите попытку."
    exit 1
  fi
  
  if ! command -v docker-compose &> /dev/null; then
    error "Docker Compose не установлен. Установите Docker Compose и повторите попытку."
    exit 1
  fi
}

# Запуск в режиме разработки
dev_up() {
  log "Запуск в режиме разработки..."
  docker-compose -f docker-compose.dev.yml up -d
  success "Сервисы запущены! Приложение доступно по адресу http://localhost:3000"
}

dev_down() {
  log "Остановка режима разработки..."
  docker-compose -f docker-compose.dev.yml down
  success "Сервисы остановлены."
}

dev_logs() {
  log "Логи режима разработки:"
  docker-compose -f docker-compose.dev.yml logs -f
}

# Запуск в режиме продакшен
prod_up() {
  log "Запуск в режиме продакшен..."
  docker-compose up -d
  success "Продакшен сервисы запущены! Приложение доступно по адресу http://localhost:3000"
}

prod_down() {
  log "Остановка режима продакшен..."
  docker-compose down
  success "Продакшен сервисы остановлены."
}

prod_logs() {
  log "Логи режима продакшен:"
  docker-compose logs -f
}

# Сборка образов заново
build() {
  env=$1
  if [ "$env" = "prod" ]; then
    log "Сборка продакшен образа..."
    docker-compose build
  else
    log "Сборка образа для разработки..."
    docker-compose -f docker-compose.dev.yml build
  fi
  success "Образ собран."
}

# Базы данных
db_dump() {
  timestamp=$(date +%Y%m%d%H%M%S)
  log "Создание дампа базы данных в ./backups/db_${timestamp}.sql..."
  mkdir -p ./backups
  docker-compose exec db pg_dump -U postgres giki > ./backups/db_${timestamp}.sql
  success "Дамп базы данных создан в ./backups/db_${timestamp}.sql"
}

db_restore() {
  if [ -z "$1" ]; then
    error "Укажите путь к файлу для восстановления."
    exit 1
  fi
  
  log "Восстановление базы данных из $1..."
  docker-compose exec -T db psql -U postgres giki < $1
  success "База данных восстановлена."
}

db_shell() {
  log "Запуск psql shell..."
  docker-compose exec db psql -U postgres giki
}

# Обработка аргументов
case "$1" in
  dev)
    case "$2" in
      up) 
        check_docker
        dev_up 
        ;;
      down) 
        check_docker
        dev_down 
        ;;
      logs) 
        check_docker
        dev_logs 
        ;;
      build)
        check_docker
        build dev
        ;;
      restart)
        check_docker
        dev_down
        dev_up
        ;;
      *)
        log "Использование: $0 dev [up|down|logs|build|restart]"
        ;;
    esac
    ;;
    
  prod)
    case "$2" in
      up) 
        check_docker
        prod_up 
        ;;
      down) 
        check_docker
        prod_down 
        ;;
      logs) 
        check_docker
        prod_logs 
        ;;
      build)
        check_docker
        build prod
        ;;
      restart)
        check_docker
        prod_down
        prod_up
        ;;
      *)
        log "Использование: $0 prod [up|down|logs|build|restart]"
        ;;
    esac
    ;;
    
  db)
    case "$2" in
      dump) 
        check_docker
        db_dump 
        ;;
      restore) 
        check_docker
        db_restore "$3" 
        ;;
      shell) 
        check_docker
        db_shell 
        ;;
      *)
        log "Использование: $0 db [dump|restore <file>|shell]"
        ;;
    esac
    ;;
    
  *)
    log "Использование: $0 [dev|prod|db] <команда>"
    log ""
    log "Команды для разработки (dev):"
    log "  up      - Запуск контейнеров для разработки"
    log "  down    - Остановка контейнеров для разработки"
    log "  logs    - Просмотр логов режима разработки"
    log "  build   - Сборка образа для разработки"
    log "  restart - Перезапуск контейнеров для разработки"
    log ""
    log "Команды для продакшена (prod):"
    log "  up      - Запуск продакшен контейнеров"
    log "  down    - Остановка продакшен контейнеров"
    log "  logs    - Просмотр логов продакшен среды"
    log "  build   - Сборка продакшен образа"
    log "  restart - Перезапуск продакшен контейнеров"
    log ""
    log "Команды для базы данных (db):"
    log "  dump            - Создание дампа базы данных"
    log "  restore <file>  - Восстановление базы данных из файла"
    log "  shell           - Запуск интерактивного psql shell"
    ;;
esac 
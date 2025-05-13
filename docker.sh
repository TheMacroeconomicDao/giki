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

# Функция для проверки наличия Docker и Docker Compose, а также статуса демона
check_docker() {
  if ! command -v docker &> /dev/null; then
    error "Docker не установлен. Установите Docker и повторите попытку."
    exit 1
  fi

  # Проверка статуса Docker демона
  if ! docker info > /dev/null 2>&1; then
    error "Docker демон не запущен. Запустите Docker и повторите попытку."
    exit 1
  fi

  # Проверка Docker Compose (v1 или v2)
  if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
      error "Docker Compose не найден (ни v1, ни v2). Установите Docker Compose или убедитесь, что плагин Docker Compose для Docker CLI установлен."
      exit 1
  fi

  # Определяем, какую команду использовать (docker-compose или docker compose)
  if command -v docker-compose &> /dev/null; then
    COMPOSE_CMD="docker-compose"
  else
    COMPOSE_CMD="docker compose"
  fi
}

# Запуск в режиме разработки
dev_up() {
  log "Запуск в режиме разработки..."
  # Используем определенную команду COMPOSE_CMD
  if $COMPOSE_CMD -f docker-compose.dev.yml up -d; then
    success "Сервисы успешно запущены! Приложение доступно по адресу http://localhost:3000"
  else
    error "Не удалось запустить сервисы. Проверьте вывод команды выше."
    exit 1
  fi
}

dev_down() {
  log "Остановка режима разработки..."
  if $COMPOSE_CMD -f docker-compose.dev.yml down; then
    success "Сервисы остановлены."
  else
    error "Не удалось остановить сервисы."
    # Не выходим, чтобы можно было попробовать снова или вручную
  fi
}

dev_logs() {
  log "Логи режима разработки:"
  $COMPOSE_CMD -f docker-compose.dev.yml logs -f
}

# Запуск в режиме продакшен
prod_up() {
  log "Запуск в режиме продакшен..."
  # Используем определенную команду COMPOSE_CMD
  if $COMPOSE_CMD up -d; then
    success "Продакшен сервисы успешно запущены! Приложение доступно по адресу http://localhost:3000"
  else
    error "Не удалось запустить продакшен сервисы. Проверьте вывод команды выше."
    exit 1
  fi
}

prod_down() {
  log "Остановка режима продакшен..."
  if $COMPOSE_CMD down; then
    success "Продакшен сервисы остановлены."
  else
    error "Не удалось остановить продакшен сервисы."
  fi
}

prod_logs() {
  log "Логи режима продакшен:"
  $COMPOSE_CMD logs -f
}

# Общее управление всеми окружениями
all_down() {
  log "Остановка всех окружений..."
  dev_down
  prod_down
}

all_restart() {
  log "Перезапуск всех окружений..."
  dev_down
  dev_up
  prod_down
  prod_up
}

# Сборка образов заново
build() {
  env=$1
  local build_result=0
  if [ "$env" = "prod" ]; then
    log "Сборка продакшен образа..."
    $COMPOSE_CMD -f docker-compose.prod.yml run --rm app pnpm install --frozen-lockfile
    $COMPOSE_CMD build || build_result=$?
  else
    log "Сборка образа для разработки..."
    $COMPOSE_CMD -f docker-compose.dev.yml run --rm app pnpm install --frozen-lockfile
    $COMPOSE_CMD -f docker-compose.dev.yml build || build_result=$?
  fi
  
  if [ $build_result -eq 0 ]; then
    success "Образ(ы) собран(ы)."
  else
    error "Ошибка при сборке образа(ов)."
    exit 1
  fi
}

# Базы данных
db_dump() {
  timestamp=$(date +%Y%m%d%H%M%S)
  target_dir="./backups"
  target_file="${target_dir}/db_${timestamp}.sql"
  
  log "Проверка доступности сервиса базы данных (db)..."
  if ! $COMPOSE_CMD ps -q db | grep -q .; then
      error "Сервис 'db' не запущен. Запустите сервисы перед созданием дампа."
      exit 1
  fi

  log "Создание дампа базы данных в ${target_file}..."
  mkdir -p "$target_dir"
  # Используем exec -T для неинтерактивного режима
  if $COMPOSE_CMD exec -T db pg_dump -U postgres giki > "$target_file"; then
    success "Дамп базы данных успешно создан в ${target_file}"
  else
    error "Не удалось создать дамп базы данных. Проверьте логи контейнера 'db'."
    # Удаляем пустой файл, если он создался
    [ -f "$target_file" ] && [ ! -s "$target_file" ] && rm "$target_file"
    exit 1
  fi
}

db_restore() {
  restore_file="$1"
  if [ -z "$restore_file" ]; then
    error "Укажите путь к файлу SQL для восстановления."
    exit 1
  fi
  if [ ! -f "$restore_file" ]; then
    error "Файл '$restore_file' не найден."
    exit 1
  fi

  log "Проверка доступности сервиса базы данных (db)..."
  if ! $COMPOSE_CMD ps -q db | grep -q .; then
      error "Сервис 'db' не запущен. Запустите сервисы перед восстановлением."
      exit 1
  fi

  log "Восстановление базы данных из '$restore_file'..."
  # Используем exec -T для передачи файла через stdin
  if $COMPOSE_CMD exec -T db psql -U postgres giki < "$restore_file"; then
    success "База данных успешно восстановлена из '$restore_file'."
  else
    error "Ошибка при восстановлении базы данных. Проверьте файл дампа и логи контейнера 'db'."
    exit 1
  fi
}

db_shell() {
  log "Проверка доступности сервиса базы данных (db)..."
  if ! $COMPOSE_CMD ps -q db | grep -q .; then
      error "Сервис 'db' не запущен. Запустите сервисы перед подключением к shell."
      exit 1
  fi

  log "Запуск psql shell..."
  $COMPOSE_CMD exec db psql -U postgres giki
}

# Обработка аргументов - Глобальная переменная для команды compose
COMPOSE_CMD="" 

# Главный обработчик
main() {
  # Проверка Docker и определение команды compose один раз в начале
  check_docker 

  case "$1" in
    dev)
      case "$2" in
        up) dev_up ;;
        down) dev_down ;;
        logs) dev_logs ;;
        build) build dev ;;
        restart)
          dev_down
          dev_up
          ;;
        *) log "Использование: $0 dev [up|down|logs|build|restart]" ;;
      esac
      ;;
      
    prod)
      case "$2" in
        up) prod_up ;;
        down) prod_down ;;
        logs) prod_logs ;;
        build) build prod ;;
        restart)
          prod_down
          prod_up
          ;;
        *) log "Использование: $0 prod [up|down|logs|build|restart]" ;;
      esac
      ;;
      
    all)
      case "$2" in
        down) all_down ;;
        restart) all_restart ;;
        *) log "Использование: $0 all [down|restart]" ;;
      esac
      ;;
      
    db)
      case "$2" in
        dump) db_dump ;;
        restore) db_restore "$3" ;;
        shell) db_shell ;;
        *) log "Использование: $0 db [dump|restore <file>|shell]" ;;
      esac
      ;;
      
    *)
      # Вывод справки (без изменений)
      log "Использование: $0 [dev|prod|all|db] <команда>"
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
      log "Команды для управления всеми окружениями (all):"
      log "  down    - Остановка всех окружений"
      log "  restart - Перезапуск всех окружений"
      log ""
      log "Команды для базы данных (db):"
      log "  dump            - Создание дампа базы данных"
      log "  restore <file>  - Восстановление базы данных из файла"
      log "  shell           - Запуск интерактивного psql shell"
      ;;
  esac
}

# Вызов главного обработчика
main "$@" 
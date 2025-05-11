#!/bin/bash

# Установка цветного вывода
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Функция для отображения заголовка
print_header() {
  echo -e "\n${YELLOW}$1${NC}"
  echo "----------------------------------------"
}

# Проверка существования docker-compose
if ! command -v docker-compose &> /dev/null; then
  echo -e "${RED}Docker Compose не установлен. Установите его перед запуском тестов.${NC}"
  exit 1
fi

# Запуск Docker-контейнеров
print_header "Запуск тестового окружения в Docker"
docker-compose -f docker-compose.test.yml up -d test-db

# Ожидание запуска базы данных
print_header "Ожидание готовности PostgreSQL..."
sleep 5

# Запуск unit-тестов
print_header "Запуск unit-тестов"
docker-compose -f docker-compose.test.yml run --rm test-app npm run test:unit
UNIT_TEST_RESULT=$?

# Запуск интеграционных тестов
print_header "Запуск интеграционных тестов"
docker-compose -f docker-compose.test.yml run --rm test-app npm run test:integration
INTEGRATION_TEST_RESULT=$?

# Запуск E2E тестов
print_header "Запуск E2E тестов"
docker-compose -f docker-compose.test.yml run --rm test-app npm run test:e2e
E2E_TEST_RESULT=$?

# Остановка и удаление контейнеров
print_header "Остановка тестового окружения"
docker-compose -f docker-compose.test.yml down -v

# Вывод результатов
print_header "Результаты тестирования"
if [ $UNIT_TEST_RESULT -eq 0 ]; then
  echo -e "${GREEN}Unit-тесты: УСПЕШНО${NC}"
else
  echo -e "${RED}Unit-тесты: ПРОВАЛЕНЫ${NC}"
fi

if [ $INTEGRATION_TEST_RESULT -eq 0 ]; then
  echo -e "${GREEN}Интеграционные тесты: УСПЕШНО${NC}"
else
  echo -e "${RED}Интеграционные тесты: ПРОВАЛЕНЫ${NC}"
fi

if [ $E2E_TEST_RESULT -eq 0 ]; then
  echo -e "${GREEN}E2E тесты: УСПЕШНО${NC}"
else
  echo -e "${RED}E2E тесты: ПРОВАЛЕНЫ${NC}"
fi

# Общий результат
if [ $UNIT_TEST_RESULT -eq 0 ] && [ $INTEGRATION_TEST_RESULT -eq 0 ] && [ $E2E_TEST_RESULT -eq 0 ]; then
  echo -e "\n${GREEN}Все тесты успешно пройдены!${NC}"
  exit 0
else
  echo -e "\n${RED}Есть проваленные тесты!${NC}"
  exit 1
fi 
#!/bin/bash

# Скрипт для исправления импортов в соответствии с FSD
# Заменяет '@/components/ui' на '@/shared/ui'

find /Users/Gyber/Documents/Code/g-ecosys/giki -type f -name "*.tsx" -o -name "*.ts" | grep -v "node_modules" | xargs sed -i '' 's|@/components/ui|@/shared/ui|g'

echo "Импорты успешно обновлены на FSD-структуру"

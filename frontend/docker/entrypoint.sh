#!/bin/sh
set -e

# Valor por defecto si no se pasa API_URL
: "${API_URL:=http://localhost:8000}"

cat > /usr/share/nginx/html/env.js <<EOF
window.__ENV = {
  API_URL: "${API_URL}"
};
EOF

# Ejecuta el proceso que le pasemos (nginx)
exec "$@"
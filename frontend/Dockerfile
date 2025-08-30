# Etapa 1: Construcción del frontend
FROM node:20-slim AS build

# Establecer el directorio de trabajo
WORKDIR /app

# Copiar los archivos de configuración de dependencias
COPY package.json package-lock.json ./

# Instalar dependencias
RUN npm ci

# Copiar el resto del código del frontend
COPY . .

# Construir el proyecto para producción
RUN npm run build

# Etapa 2: Servir los archivos estáticos con Nginx
FROM nginx:alpine

# Copiar los archivos compilados desde la etapa de construcción
COPY --from=build /app/dist /usr/share/nginx/html

# Copiar un archivo de configuración personalizado de Nginx (opcional)
# COPY nginx.conf /etc/nginx/conf.d/default.conf

# Exponer el puerto 80 para Nginx
EXPOSE 80

# Iniciar Nginx
CMD ["nginx", "-g", "daemon off;"]
# Proyecto Web Movil - Plataforma de venta para Junta de Vecinos

Este proyecto es una plataforma digital de ventas para comunidades vecinales, compuesta por múltiples microservicios desarrollados con NestJS y orquestados con Docker Compose.

---

## 📦 Microservicios incluidos

- `auth-service`: Autenticación y gestión de tokens JWT
- `user-service`: Gestión de usuarios y tiendas
- `product-service`: Gestión de productos
- `orders-service`: Gestión y administración de órdenes
- `reviews-service`: Gestión de reseñas de pedidos
- `metrics-service`: Métricas para administradores
- `api-gateway`: API Gateway para enrutar peticiones
- `postgres`: Base de datos PostgreSQL
- Servicios de `seed` para cargar datos iniciales (`seed-users`, `seed-products`, `seed-orders`)

---

## 🚀 Requisitos previos

- [Docker](https://www.docker.com/get-started)
- [Docker Compose](https://docs.docker.com/compose/install/)

---

## 📁 Estructura del proyecto (resumen)

```bash
.
├── docker-compose.yml
├── .env.example
├── services/
│   ├── microservice-auth/
│   │   └── .env.example
│   ├── microservice-users/
│   │   └── .env.example
│   ├── microservice-product/
│   │   └── .env.example
│   ├── microservice-orders/
│   │   └── .env.example
│   ├── microservice-reviews/
│   │   └── .env.example
│   ├── microservice-metrics/
│   │   └── .env.example
├── api_gateway/
│   └── .env.example
```
## Configuración Inicial
- Clonar Repositorio
    - git clone [https://github.com](https://github.com/AnibalGonzalezV/plataforma_backend)
    - cd plataforma_backend
 
- Copiar Archivos .env.example a .env
    - cp services/microservice-auth/.env.example services/microservice-auth/.env
    - cp services/microservice-users/.env.example services/microservice-users/.env
    - cp services/microservice-product/.env.example services/microservice-product/.env
    - cp services/microservice-orders/.env.example services/microservice-orders/.env
    - cp services/microservice-reviews/.env.example services/microservice-reviews/.env
    - cp services/microservice-metrics/.env.example services/microservice-metrics/.env
    - cp api_gateway/.env.example api_gateway/.env

 - Editar variables en los .env
   Al menos modificar lo siguiente:
     - POSTGRES_USER=postgres
     - POSTGRES_PASSWORD=elije_una_contraseña
     - POSTGRES_DB=proyecto_web_movil
  
     - DB_PASSWORD=elije_una_contraseña      #Debe ser la misma que en POSTGRES_PASSWORD
     - JWT_SECRET=clave_super_secreta
  Los demás valores se pueden mantener igual, ya que corresponden a nombres de servicios en Docker

## Levantar la plataforma
- docker-compose up --build

## Seeders (Poblado de datos iniciales)
Los servicios de seed-users, seed-products y seed-orders ejecutan la carga inicial de datos automáticamente al levantar la plataforma.



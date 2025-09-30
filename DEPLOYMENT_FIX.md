# Solución a los Problemas de Deployment 

## Problemas Identificados y Solucionados

### 1. Error 304 y URLs Hardcodeadas
**Problema**: Las URLs del backend estaban hardcodeadas como `http://localhost:5000` en todo el frontend.

**Solución**: 
- ✅ Creado archivo `src/config/api.js` para centralizar configuración de URLs
- ✅ Reemplazadas todas las URLs hardcodeadas en el frontend
- ✅ Implementada función `getImageUrl()` para manejo dinámico de imágenes

### 2. Rutas del Backend Eliminadas
**Problema**: En `server/server.js` faltaban las rutas `/api/products` y `/api/quotes`.

**Solución**:
- ✅ Restauradas las rutas eliminadas en `server.js`
- ✅ Verificado que todos los archivos de rutas existen

### 3. Rate Limiting Excesivo
**Problema**: El rate limiting muy restrictivo (5 requests/15min) causaba timeouts.

**Solución**:
- ✅ Aumentado límite a 1000 requests/15min para desarrollo
- ✅ Excepciones para localhost durante desarrollo
- ✅ Rate limiting de auth aumentado de 5 a 20 requests

### 4. Configuración CORS
**Problema**: CORS no configurado para múltiples orígenes.

**Solución**:
- ✅ Configurado CORS para localhost y GitHub Pages
- ✅ Habilitado credentials para cookies/auth

### 5. Advertencias de MongoDB
**Problema**: Opciones deprecated en la conexión de MongoDB.

**Solución**:
- ✅ Removidas opciones deprecated `useNewUrlParser` y `useUnifiedTopology`

## GitHub Pages vs Backend Local

### Problema Principal
GitHub Pages solo puede servir contenido estático, no puede ejecutar un backend Node.js.

### Opciones de Solución

#### Opción 1: Backend Separado (Recomendado)
Deploys el backend en un servicio cloud:

**Servicios Gratuitos:**
- **Railway** (Recomendado): https://railway.app
- **Render**: https://render.com  
- **Vercel**: https://vercel.com (para APIs)
- **Netlify Functions**: Para funciones serverless
- **Heroku**: Tier gratuito limitado

**Pasos:**
1. Deploy el backend en Railway/Render
2. Actualizar `src/config/api.js` con la nueva URL
3. Configurar variables de entorno en el servicio

#### Opción 2: Backend Serverless
Convertir el backend a funciones serverless:
- Vercel Functions
- Netlify Functions  
- AWS Lambda

#### Opción 3: Desarrollo Local + Production Separado
Mantener desarrollo local y configurar diferentes URLs para producción.

## Configuración Actual

### Para Desarrollo Local:
```bash
# Terminal 1: Iniciar MongoDB
docker start mongodb

# Terminal 2: Iniciar Backend
cd server
npm start

# Terminal 3: Iniciar Frontend  
npm run dev
```

### Para GitHub Pages:
1. El frontend se despliega automáticamente con `npm run deploy`
2. El backend necesita ser desplegado por separado

## Variables de Entorno Requeridas

### Backend (.env):
```env
MONGO_URI=mongodb://localhost:27017/cercovibrados
JWT_SECRET=your_jwt_secret_here
PORT=5000
```

### Para Producción:
Necesitarás configurar estas variables en el servicio de hosting del backend.

## Próximos Pasos Recomendados

1. **Inmediato**: Probar que funciona localmente
2. **Corto plazo**: Deploy del backend en Railway/Render
3. **Mediano plazo**: Implementar variables de entorno para prod/dev
4. **Largo plazo**: Considerar migrar a una arquitectura serverless

## Comandos de Testing

```bash
# Verificar backend
curl http://localhost:5000/

# Verificar rutas específicas (necesita auth token)
curl -H "Authorization: Bearer TOKEN" http://localhost:5000/api/products

# Verificar MongoDB
docker exec -it mongodb mongosh
```
# 🚀 Soluciones para Ejecutar el Backend

## ❌ Problema
```
sh: line 1: nodemon: command not found
```

## ✅ Soluciones (3 opciones)

### 🎯 SOLUCIÓN 1: Usar Node.js directamente (MÁS SIMPLE)
```bash
cd server
npm run start:prod
# O directamente:
node server.js
```

### 🎯 SOLUCIÓN 2: Instalar nodemon globalmente
```bash
npm install -g nodemon
cd server
npm start
```

### 🎯 SOLUCIÓN 3: Usar npx (sin instalación global)
```bash
cd server
npx nodemon server.js
```

### 🎯 SOLUCIÓN 4: Ejecutar con script alternativo
```bash
cd server
npm run start:prod
```

## 🚀 RECOMENDACIÓN INMEDIATA

**Usa la Solución 1** (la más simple):

```bash
cd /mnt/ssd/cercovibrados/PerMaitenrehue/server
node server.js
```

Esto ejecutará el servidor **sin** auto-reload. Para desarrollo con auto-reload, usa la Solución 2.

## 🔄 Diferencias

- **`node server.js`**: Sin auto-reload (manual restart)
- **`nodemon server.js`**: Con auto-reload (reinicia automáticamente al cambiar archivos)

## ✅ Verificación

Una vez que ejecutes cualquier solución, deberías ver:
```
Server started on port 5003
MongoDB connected
```

Luego prueba: `curl http://localhost:5003/`
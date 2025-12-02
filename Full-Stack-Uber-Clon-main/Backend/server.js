const http = require('http');
const app = require('./app');
const { initializeSocket } = require('./socket');

const port = process.env.PORT || 3000;

const server = http.createServer(app);

// Inicializar Socket.IO
initializeSocket(server);

// Manejo de errores del servidor
server.on('error', (error) => {
    if (error.syscall !== 'listen') {
        throw error;
    }

    const bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;

    switch (error.code) {
        case 'EACCES':
            console.error(`❌ ${bind} requiere privilegios elevados`);
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(`❌ ${bind} ya está en uso`);
            process.exit(1);
            break;
        default:
            throw error;
    }
});

// Evento cuando el servidor empieza a escuchar
server.on('listening', () => {
    const addr = server.address();
    const bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port;
    
    console.log('\n🚀 ====================================');
    console.log('✅ Servidor iniciado exitosamente');
    console.log(`📡 Escuchando en ${bind}`);
    console.log(`🌍 Entorno: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🔗 URL: http://localhost:${addr.port}`);
    
    if (process.env.FRONTEND_URL) {
        console.log(`🎨 Frontend permitido: ${process.env.FRONTEND_URL}`);
    } else {
        console.warn('⚠️  FRONTEND_URL no configurado - CORS permitirá todos los orígenes');
    }
    
    if (!process.env.MONGO_URI && !process.env.DB_CONNECT) {
        console.warn('⚠️  Base de datos: Variable de conexión no encontrada');
    } else {
        console.log('✅ Base de datos: Conectado');
    }
    
    if (!process.env.JWT_SECRET) {
        console.warn('⚠️  JWT_SECRET no configurado');
    }
    
    console.log('====================================\n');
});

// Iniciar el servidor
server.listen(port);

// Manejo de señales de terminación
process.on('SIGTERM', () => {
    console.log('\n⚠️  SIGTERM recibido. Cerrando servidor gracefully...');
    server.close(() => {
        console.log('✅ Servidor cerrado correctamente');
        process.exit(0);
    });
});

process.on('SIGINT', () => {
    console.log('\n⚠️  SIGINT recibido (Ctrl+C). Cerrando servidor gracefully...');
    server.close(() => {
        console.log('✅ Servidor cerrado correctamente');
        process.exit(0);
    });
});

// Manejo de errores no capturados
process.on('uncaughtException', (error) => {
    console.error('❌ Excepción no capturada:', error);
    process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('❌ Promesa rechazada no manejada en:', promise);
    console.error('❌ Razón:', reason);
    // No salimos del proceso aquí para permitir que el servidor continúe
});

module.exports = server;
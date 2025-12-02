const http = require('http');
const app = require('./app');
const { initializeSocket } = require('./socket');
const port = process.env.PORT || 3000;

const server = http.createServer(app);

initializeSocket(server);

server.on('error', (error) => {
    if (error.syscall !== 'listen') {
        throw error;
    }

    const bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;

    switch (error.code) {
        case 'EACCES':
            console.error(`Error: ${bind} requiere privilegios elevados`);
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(`Error: ${bind} ya esta en uso`);
            process.exit(1);
            break;
        default:
            throw error;
    }
});

server.on('listening', () => {
    const addr = server.address();
    const bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port;
    
    console.log('====================================');
    console.log('Servidor iniciado exitosamente');
    console.log('Escuchando en ' + bind);
    console.log('Entorno: ' + (process.env.NODE_ENV || 'development'));
    console.log('URL: http://localhost:' + addr.port);
    
    if (process.env.FRONTEND_URL) {
        console.log('Frontend permitido: ' + process.env.FRONTEND_URL);
    } else {
        console.warn('WARNING: FRONTEND_URL no configurado - CORS permitira todos los origenes');
    }
    
    if (!process.env.MONGO_URI && !process.env.DB_CONNECT) {
        console.warn('WARNING: Base de datos - Variable de conexion no encontrada');
    } else {
        console.log('Base de datos: Conectado');
    }
    
    if (!process.env.JWT_SECRET) {
        console.warn('WARNING: JWT_SECRET no configurado');
    }
    
    console.log('====================================');
});

server.listen(port);

process.on('SIGTERM', () => {
    console.log('SIGTERM recibido. Cerrando servidor...');
    server.close(() => {
        console.log('Servidor cerrado correctamente');
        process.exit(0);
    });
});

process.on('SIGINT', () => {
    console.log('SIGINT recibido (Ctrl+C). Cerrando servidor...');
    server.close(() => {
        console.log('Servidor cerrado correctamente');
        process.exit(0);
    });
});

process.on('uncaughtException', (error) => {
    console.error('Excepcion no capturada:', error);
    process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('Promesa rechazada no manejada:', reason);
});

module.exports = server;
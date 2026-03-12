import app from './index.js';
import { config } from './config/index.js';

const server = app.listen(config.port, () => {
  console.log(`
╔════════════════════════════════════════════════════════════╗
║                                                            ║
║   📝 Notes Management API Server                          ║
║   Running in ${config.nodeEnv} mode                          ║
║   🚀 Server listening on port ${config.port}                  ║
║   📚 API Docs: http://localhost:${config.port}/api/docs       ║
║   🏥 Health Check: http://localhost:${config.port}/health    ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝
  `);
});

process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

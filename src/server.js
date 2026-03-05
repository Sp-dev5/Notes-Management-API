const app = require('./app');
const env = require('./config/env');
const { initializeDatabase } = require('./config/database');

const PORT = env.port;

async function startServer() {
  try {
    // Initialize database
    await initializeDatabase();

    // Start server
    app.listen(PORT, () => {
      console.log(`
╔════════════════════════════════════════════════════╗
║  ${env.app.name}              ║
║  Version ${env.app.apiVersion}                                      ║
║  Environment: ${env.nodeEnv.toUpperCase()}                         ║
╚════════════════════════════════════════════════════╝
      `);
      console.log(`✓ Server is running on http://localhost:${PORT}`);
      console.log(`✓ Health check: http://localhost:${PORT}/health`);
      console.log(`✓ API info: http://localhost:${PORT}/api`);
    });
  } catch (err) {
    console.error('Failed to start server:', err.message);
    process.exit(1);
  }
}

startServer();

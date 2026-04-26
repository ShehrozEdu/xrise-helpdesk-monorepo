console.log('Vercel entry point hit');
const app = require('../src/app').default;
const { connectDB } = require('../src/config/db');

let isConnected = false;

module.exports = async (req: any, res: any) => {
  console.log(`Request received: ${req.method} ${req.url}`);
  try {
    if (!isConnected) {
      await connectDB();
      isConnected = true;
    }
    return app(req, res);
  } catch (error) {
    console.error('CRITICAL: App execution failed', error);
    res.status(500).json({ error: 'Critical server failure', details: error instanceof Error ? error.message : String(error) });
  }
};

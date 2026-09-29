import { spawn } from 'node:child_process';
import { networkInterfaces } from 'node:os';

const getLocalIPs = () => {
  const ips = [];
  const nets = networkInterfaces();
  for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
      if (net.family === 'IPv4' && !net.internal) {
        ips.push(net.address);
      }
    }
  }
  return ips;
};

const localIPs = getLocalIPs();

console.log('\x1b[36m[dev] Starting local services...\x1b[0m');

// Spawn express backend on port 3001
const server = spawn('node', ['server.js'], {
  stdio: 'inherit',
  env: { ...process.env, NODE_ENV: 'development' }
});

// Spawn vite frontend on port 3000
const vite = spawn('npx', ['vite', '--port=3000', '--host=0.0.0.0'], {
  stdio: 'inherit',
  shell: true
});

setTimeout(() => {
  console.log('\n\x1b[32m🚀 FixNear is live on your network!\x1b[0m');
  console.log(`- \x1b[1mLocal:\x1b[0m            http://localhost:3000`);
  if (localIPs.length > 0) {
    localIPs.forEach(ip => {
      console.log(`- \x1b[1mNetwork (Mobile):\x1b[0m  http://${ip}:3000`);
    });
  } else {
    console.log(`- \x1b[1mNetwork (Mobile):\x1b[0m  (Connect to your Wi-Fi to see network IP)`);
  }
  console.log('\x1b[90m--------------------------------------------------\x1b[0m\n');
}, 1500);

const cleanup = () => {
  console.log('\n\x1b[33m[dev] Stopping local services...\x1b[0m');
  server.kill('SIGINT');
  vite.kill('SIGINT');
  process.exit(0);
};

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);
process.on('exit', cleanup);


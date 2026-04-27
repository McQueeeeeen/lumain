const http = require('http');

const routes = [
  '/',
  '/catalog',
  '/catalog?cat=Люстры',
  '/proposals',
  '/p/non-existent-id',
  '/admin/proposals',
];

async function checkRoute(route) {
  return new Promise((resolve) => {
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: route,
      method: 'GET',
    };

    const req = http.request(options, (res) => {
      resolve({
        route,
        statusCode: res.statusCode,
        status: res.statusCode === 200 ? 'OK' : 'ERROR',
      });
    });

    req.on('error', (e) => {
      resolve({
        route,
        statusCode: 0,
        status: `FAILED: ${e.message}`,
      });
    });

    req.end();
  });
}

async function runAudit() {
  console.log('--- Lumain Supervisor: Full Route Audit ---');
  for (const route of routes) {
    const result = await checkRoute(route);
    const symbol = result.statusCode === 200 ? '✅' : '❌';
    console.log(`${symbol} ${result.route.padEnd(30)} | Status: ${result.statusCode} (${result.status})`);
  }
  console.log('-------------------------------------------');
}

runAudit();

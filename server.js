const http = require('node:http');
const next = require('next');

const dev = process.env.NODE_ENV !== 'production';
const hostname = process.env.HOST || '0.0.0.0';
const port = Number.parseInt(process.env.PORT || '3000', 10);

if (!Number.isFinite(port) || port <= 0) {
    throw new Error(`Invalid PORT value: ${process.env.PORT}`);
}

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare()
    .then(() => {
        const server = http.createServer((request, response) => handle(request, response));

        server.on('error', (error) => {
            console.error('JoinHook server error', error);
            process.exitCode = 1;
        });

        server.listen(port, hostname, () => {
            console.log(`JoinHook ready on http://${hostname}:${port} (${dev ? 'development' : 'production'})`);
        });
    })
    .catch((error) => {
        console.error('Unable to prepare JoinHook', error);
        process.exit(1);
    });

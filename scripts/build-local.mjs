// oxlint-disable promise/avoid-new, promise/prefer-await-to-then, typescript/no-unsafe-argument, typescript/no-unsafe-call, typescript/promise-function-async
import { spawn, spawnSync } from 'node:child_process';
import net from 'node:net';
import process from 'node:process';

const isWindows = process.platform === 'win32';
const pgliteCommand = process.execPath;
const pgliteArgs = ['node_modules/@electric-sql/pglite-socket/dist/scripts/server.js', '-m', '100'];
const nextCommand = process.execPath;
const nextArgs = ['node_modules/next/dist/bin/next', 'build'];
const npmCli = process.env.npm_execpath;
const nextBuildCompletedMarker = 'server-rendered on demand';
const nextBuildSummaryMarker = 'Route (app)';

const stopProcess = (child) => {
  if (!child.pid || child.exitCode !== null) {
    return;
  }

  if (isWindows) {
    spawnSync('taskkill', ['/pid', String(child.pid), '/t', '/f'], {
      stdio: 'ignore',
    });
    return;
  }

  child.kill('SIGTERM');
};

const run = (command, args, options = {}) =>
  new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd: process.cwd(),
      env: process.env,
      stdio: options.successMarker ? ['ignore', 'pipe', 'pipe'] : 'inherit',
    });
    let output = '';
    let settled = false;
    let completionTimer;

    const cleanup = () => {
      if (completionTimer) {
        clearTimeout(completionTimer);
      }
    };

    const resolveOnce = () => {
      if (settled) {
        return;
      }

      settled = true;
      cleanup();
      resolve();
    };

    const rejectOnce = (error) => {
      if (settled) {
        return;
      }

      settled = true;
      cleanup();
      reject(error instanceof Error ? error : new Error(String(error)));
    };

    const scheduleCompletion = () => {
      if (completionTimer) {
        clearTimeout(completionTimer);
      }

      completionTimer = setTimeout(() => {
        process.stdout.write(
          '\nDetected completed Next.js build output; stopping lingering child process.\n',
        );
        stopProcess(child);
        resolveOnce();
      }, 5000);
    };

    const checkForSuccessMarker = (chunk) => {
      if (!options.successMarker) {
        return;
      }

      output += chunk.toString();

      if (!output.includes(options.successMarker) && !output.includes(nextBuildSummaryMarker)) {
        return;
      }

      scheduleCompletion();
    };

    child.stdout?.on('data', (chunk) => {
      process.stdout.write(chunk.toString());
      checkForSuccessMarker(chunk);
    });
    child.stderr?.on('data', (chunk) => {
      process.stderr.write(chunk.toString());
      checkForSuccessMarker(chunk);
    });

    child.on('error', (error) => {
      rejectOnce(error);
    });
    child.on('exit', (code) => {
      if (code === 0) {
        resolveOnce();
        return;
      }

      rejectOnce(new Error(`${command} ${args.join(' ')} exited with code ${code}`));
    });
  });

const runNpm = (args, options) => {
  if (!npmCli) {
    throw new Error('npm_execpath is required to run npm scripts from build-local');
  }

  return run(process.execPath, [npmCli, ...args], options);
};

const waitForPort = () =>
  new Promise((resolve, reject) => {
    const startedAt = Date.now();

    const attempt = () => {
      const socket = net.createConnection({ host: '127.0.0.1', port: 5432 });

      socket.on('connect', () => {
        socket.end();
        resolve();
      });

      socket.on('error', (error) => {
        socket.destroy();

        if (Date.now() - startedAt > 20_000) {
          reject(error);
          return;
        }

        setTimeout(attempt, 100);
      });
    };

    attempt();
  });

const pipePgliteOutput = (server) => {
  server.stdout.on('data', (chunk) => {
    process.stdout.write(chunk.toString());
  });
  server.stderr.on('data', (chunk) => {
    process.stderr.write(chunk.toString());
  });
};

const failIfPgliteExitsEarly = (server) =>
  new Promise((resolve, reject) => {
    server.on('error', reject);
    server.on('exit', (code) => {
      if (code !== 0) {
        reject(new Error(`PGlite exited before build completed with code ${code}`));
        return;
      }

      resolve();
    });
  });

const server = spawn(pgliteCommand, pgliteArgs, {
  cwd: process.cwd(),
  env: process.env,
  stdio: ['ignore', 'pipe', 'pipe'],
});

let exitCode = 0;

try {
  pipePgliteOutput(server);
  const pgliteExit = failIfPgliteExitsEarly(server);
  pgliteExit.catch(() => null);
  await Promise.race([waitForPort(), pgliteExit]);
  await Promise.race([runNpm(['run', 'db:migrate']), pgliteExit]);
  await Promise.race([
    run(nextCommand, nextArgs, { successMarker: nextBuildCompletedMarker }),
    pgliteExit,
  ]);
} catch (error) {
  exitCode = 1;
  console.error(error);
} finally {
  stopProcess(server);
}

process.exit(exitCode);

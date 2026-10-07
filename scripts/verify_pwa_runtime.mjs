import fs from 'node:fs';
import { spawn } from 'node:child_process';

async function main() {
  const tempDir = `C:\\Users\\Rangga\\AppData\\Local\\Temp\\chrome_pwa_${Date.now()}`;
  console.log(`Launching Chrome with tempDir: ${tempDir}...`);
  const chromeProcess = spawn(
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    [
      '--headless=new',
      '--remote-debugging-port=9222',
      `--user-data-dir=${tempDir}`,
      '--window-size=1280,800',
      'http://localhost:4173/',
    ]
  );

  let targets = null;
  for (let i = 0; i < 20; i++) {
    try {
      const targetsRes = await fetch('http://127.0.0.1:9222/json');
      targets = await targetsRes.json();
      if (targets && targets.length > 0) break;
    } catch {
      await new Promise((r) => setTimeout(r, 500));
    }
  }

  if (!targets || targets.length === 0) {
    throw new Error('Chrome CDP connection timeout');
  }

  try {
    const pageTarget = targets.find((t) => t.type === 'page');
    const ws = new WebSocket(pageTarget.webSocketDebuggerUrl);

    await new Promise((res, rej) => {
      ws.onopen = res;
      ws.onerror = rej;
    });

    let msgId = 1;
    function sendCommand(method, params = {}) {
      return new Promise((resolve) => {
        const id = msgId++;
        const handler = (event) => {
          const res = JSON.parse(event.data);
          if (res.id === id) {
            ws.removeEventListener('message', handler);
            resolve(res.result);
          }
        };
        ws.addEventListener('message', handler);
        ws.send(JSON.stringify({ id, method, params }));
      });
    }

    console.log('Waiting 3s for page and service worker registration...');
    await new Promise((r) => setTimeout(r, 3000));

    // Verify manifest and service worker inside browser context
    const pwaCheck = await sendCommand('Runtime.evaluate', {
      expression: `
        (async () => {
          // 1. Fetch manifest
          let manifestOk = false;
          let manifestData = null;
          try {
            const res = await fetch('/manifest.json');
            manifestOk = res.ok;
            manifestData = await res.json();
          } catch (e) {
            manifestOk = false;
          }

          // 2. Check Service Worker registrations
          let swRegistered = false;
          let swState = 'none';
          if ('serviceWorker' in navigator) {
            const regs = await navigator.serviceWorker.getRegistrations();
            if (regs.length > 0) {
              swRegistered = true;
              swState = regs[0].active ? 'active' : regs[0].installing ? 'installing' : 'waiting';
            }
          }

          // 3. Check App Title and Shell DOM
          const title = document.title;
          const hasRoot = !!document.getElementById('root');

          return {
            manifestOk,
            manifestName: manifestData ? manifestData.name : null,
            swRegistered,
            swState,
            title,
            hasRoot,
          };
        })()
      `,
      awaitPromise: true,
      returnByValue: true,
    });

    console.log('Browser PWA verification result:', JSON.stringify(pwaCheck?.result?.value, null, 2));

    const shot = await sendCommand('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('d:\\PROJECT SAYA\\PROJECT ATLAS\\qa_shot_pwa_runtime.png', Buffer.from(shot.data, 'base64'));
    console.log('Saved qa_shot_pwa_runtime.png');

    ws.close();
  } catch (err) {
    console.error('PWA Verification Error:', err);
  } finally {
    chromeProcess.kill();
    try {
      fs.rmSync(tempDir, { recursive: true, force: true });
    } catch {}
  }
}

main();

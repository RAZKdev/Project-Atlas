import fs from 'node:fs';
import { spawn } from 'node:child_process';

async function main() {
  const tempDir = `C:\\Users\\Rangga\\AppData\\Local\\Temp\\chrome_cdp_${Date.now()}`;
  console.log(`Launching headless Chrome with tempDir: ${tempDir}...`);
  const chromeProcess = spawn(
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    [
      '--headless=new',
      '--remote-debugging-port=9222',
      `--user-data-dir=${tempDir}`,
      '--window-size=1280,800',
      '--enable-webgl',
      '--ignore-gpu-blocklist',
      '--use-gl=angle',
      '--disable-background-timer-throttling',
      '--disable-backgrounding-occluded-windows',
      'http://localhost:4173/',
    ]
  );

  let targets = null;
  console.log('Polling Chrome CDP endpoint on port 9222...');
  for (let i = 0; i < 20; i++) {
    try {
      const targetsRes = await fetch('http://127.0.0.1:9222/json');
      targets = await targetsRes.json();
      if (targets && targets.length > 0) {
        console.log(`Chrome CDP ready after attempt ${i + 1}`);
        break;
      }
    } catch {
      await new Promise((r) => setTimeout(r, 500));
    }
  }

  if (!targets || targets.length === 0) {
    throw new Error('Could not connect to Chrome CDP after 10 seconds');
  }

  try {
    const pageTarget = targets.find((t) => t.type === 'page');
    if (!pageTarget) {
      throw new Error('No page target found in Chrome');
    }

    console.log('Connecting to Chrome CDP via WebSocket:', pageTarget.webSocketDebuggerUrl);
    const ws = new WebSocket(pageTarget.webSocketDebuggerUrl);

    await new Promise((resolve, reject) => {
      ws.onopen = resolve;
      ws.onerror = reject;
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

    async function waitForCondition(evalFn, label, timeout = 12000) {
      const start = Date.now();
      console.log(`Waiting for: ${label}...`);
      while (Date.now() - start < timeout) {
        const res = await sendCommand('Runtime.evaluate', {
          expression: `(${evalFn.toString()})()`,
          returnByValue: true,
        });
        const val = res?.result?.value;
        if (val) {
          console.log(`✓ Condition met for [${label}]:`, val);
          return val;
        }
        await new Promise((r) => setTimeout(r, 400));
      }
      throw new Error(`Timeout waiting for [${label}] after ${timeout}ms`);
    }

    // 1. Wait for navbar buttons
    await waitForCondition(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      return btns.some((b) => b.textContent && b.textContent.includes('Museum'));
    }, 'Navbar Museum button present');

    console.log('Step 1: Clicking Museum Tab...');
    await sendCommand('Runtime.evaluate', {
      expression: `
        (() => {
          const btns = Array.from(document.querySelectorAll('button'));
          const btn = btns.find(b => b.textContent && b.textContent.includes('Museum'));
          if (btn) btn.click();
        })()
      `,
    });

    // 2. Wait for "Masuk ke Simulasi" button on Museum Page
    await waitForCondition(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      return btns.some((b) => b.textContent && b.textContent.includes('Masuk ke Simulasi'));
    }, 'Start Simulation CTA button');

    console.log('Step 2: Starting 3D Museum Simulation...');
    await sendCommand('Runtime.evaluate', {
      expression: `
        (() => {
          const btns = Array.from(document.querySelectorAll('button'));
          const btn = btns.find(b => b.textContent && b.textContent.includes('Masuk ke Simulasi'));
          if (btn) btn.click();
        })()
      `,
    });

    // 3. Wait for Three.js Canvas to mount
    await waitForCondition(() => {
      const canvas = document.querySelector('canvas');
      return !!canvas;
    }, 'Three.js Canvas mounted in DOM');

    // Wait 4.5 seconds for Three.js to compile shaders, render frames, and initialize scene
    console.log('Waiting 4.5s for initial Three.js render frames...');
    await new Promise((r) => setTimeout(r, 4500));

    // Capture Shot A: First-person default view
    console.log('Capturing Shot A (First-Person View)...');
    const shotA = await sendCommand('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('d:\\PROJECT SAYA\\PROJECT ATLAS\\qa_shot_a_first_person.png', Buffer.from(shotA.data, 'base64'));
    console.log('Saved qa_shot_a_first_person.png');

    // Cycle to Third-Person POV (Press V)
    console.log('Switching to Third-Person POV (Press V)...');
    await sendCommand('Runtime.evaluate', {
      expression: `
        (() => {
          window.dispatchEvent(new KeyboardEvent('keydown', { code: 'KeyV', key: 'v', bubbles: true }));
        })()
      `,
    });
    await new Promise((r) => setTimeout(r, 1500));

    // Capture Shot B: Third-Person Explorer Avatar
    console.log('Capturing Shot B (Third-Person Explorer Avatar)...');
    const shotB = await sendCommand('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('d:\\PROJECT SAYA\\PROJECT ATLAS\\qa_shot_b_third_person.png', Buffer.from(shotB.data, 'base64'));
    console.log('Saved qa_shot_b_third_person.png');

    // Teleport to Monumen Utama (Interior Exhibits)
    console.log('Teleporting to interior (Monumen Utama)...');
    await sendCommand('Runtime.evaluate', {
      expression: `
        (() => {
          const btns = Array.from(document.querySelectorAll('button'));
          const monumentBtn = btns.find(b => b.textContent && b.textContent.includes('Monumen Utama'));
          if (monumentBtn) monumentBtn.click();
        })()
      `,
    });
    await new Promise((r) => setTimeout(r, 1500));

    // Capture Shot D: Interior Exhibits & Globe
    console.log('Capturing Shot D (Interior Exhibits & Globe)...');
    const shotD = await sendCommand('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('d:\\PROJECT SAYA\\PROJECT ATLAS\\qa_shot_d_interior_globe.png', Buffer.from(shotD.data, 'base64'));
    console.log('Saved qa_shot_d_interior_globe.png');

    // Switch to Diorama / Orbit Mode to view exterior, fountain, and trees
    console.log('Switching to Diorama (Orbit) Mode...');
    await sendCommand('Runtime.evaluate', {
      expression: `
        (() => {
          const btns = Array.from(document.querySelectorAll('button'));
          const dioramaBtn = btns.find(b => b.textContent && (b.textContent.includes('Mode Penjelajah') || b.textContent.includes('Diorama')));
          if (dioramaBtn) dioramaBtn.click();
        })()
      `,
    });
    await new Promise((r) => setTimeout(r, 2000));

    // Capture Shot C: Diorama Overview (Building, Hero Fountain, Organic Vegetation)
    console.log('Capturing Shot C (Diorama / Exterior Overview)...');
    const shotC = await sendCommand('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('d:\\PROJECT SAYA\\PROJECT ATLAS\\qa_shot_c_diorama_exterior.png', Buffer.from(shotC.data, 'base64'));
    console.log('Saved qa_shot_c_diorama_exterior.png');

    ws.close();
    console.log('All QA screenshots captured successfully!');
  } catch (err) {
    console.error('CDP Error:', err);
  } finally {
    chromeProcess.kill();
    console.log('Chrome process terminated.');
    try {
      fs.rmSync(tempDir, { recursive: true, force: true });
    } catch {}
  }
}

main();

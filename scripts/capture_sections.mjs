import puppeteer from 'puppeteer-core';
import path from 'path';

const executablePath = 'C:\\Program Files\\BraveSoftware\\Brave-Browser\\Application\\brave.exe';
const htmlPath = 'file:///' + path.resolve('index.html').replace(/\\/g, '/');

async function captureAllSections() {
  console.log('Launching Brave...');
  const browser = await puppeteer.launch({
    executablePath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu']
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
    await page.goto(htmlPath, { waitUntil: 'networkidle0', timeout: 30000 });

    // Wait 2s for boot
    await new Promise(r => setTimeout(r, 2000));

    const sections = [
      { id: 'hero', file: 'shot_1_hero.png' },
      { id: 'pillars', file: 'shot_2_pillars.png' },
      { id: 'architect', file: 'shot_3_architect.png' },
      { id: 'rtx', file: 'shot_4_rtx.png' },
      { id: 'dlss', file: 'shot_5_dlss.png' },
      { id: 'benchmark-lab', file: 'shot_7_benchmark.png' },
      { id: 'ai-factory', file: 'shot_6_aifactory.png' }
    ];

    for (const sec of sections) {
      if (sec.id !== 'hero') {
        await page.evaluate((targetId) => {
          const el = document.getElementById(targetId);
          if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
        }, sec.id);
        await new Promise(r => setTimeout(r, 1200));
      }
      const out = path.resolve(sec.file);
      await page.screenshot({ path: out });
      console.log(`Captured ${sec.id} (desktop) -> ${sec.file}`);
    }

    // Capture mobile viewport (iPhone 14/15 size: 390x844)
    console.log('Switching to mobile viewport (390x844)...');
    await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
    await page.goto(htmlPath, { waitUntil: 'networkidle0', timeout: 30000 });
    await new Promise(r => setTimeout(r, 2000));

    const mobileSections = [
      { id: 'hero', file: 'shot_mobile_hero.png' },
      { id: 'architect', file: 'shot_mobile_architect.png' },
      { id: 'benchmark-lab', file: 'shot_mobile_benchmark.png' },
      { id: 'rtx', file: 'shot_mobile_rtx.png' }
    ];

    for (const sec of mobileSections) {
      if (sec.id !== 'hero') {
        await page.evaluate((targetId) => {
          const el = document.getElementById(targetId);
          if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
        }, sec.id);
        await new Promise(r => setTimeout(r, 1200));
      }
      const out = path.resolve(sec.file);
      await page.screenshot({ path: out });
      console.log(`Captured ${sec.id} (mobile) -> ${sec.file}`);
    }

    console.log('All desktop and mobile screenshots captured successfully.');
  } finally {
    await browser.close();
  }
}

captureAllSections().catch(err => {
  console.error(err);
  process.exit(1);
});

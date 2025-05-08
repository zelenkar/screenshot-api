const express = require('express');
const puppeteer = require('puppeteer');
const app = express();

app.get('/screenshot', async (req, res) => {
  const widgetId = req.query.id || '1'; // výchozí na 1
  const widgetSizes = {
    1: [200, 256],
    2: [250, 88],
    3: [250, 88],
    4: [200, 176],
    5: [200, 184],
    6: [200, 193],
    7: [260, 92],
    8: [250, 86],
    9: [250, 86],
  };

  const size = widgetSizes[widgetId];
  if (!size) return res.status(400).send('Neplatné ID widgetu');

  const [width, height] = size;
  const url = `https://widgets.refsite.info/widget2/sefy-czech-republic/${widgetId}?color1=386fb1&color2=ffffff`;

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width, height });
  await page.goto(url, { waitUntil: 'networkidle2' });

  const buffer = await page.screenshot();
  await browser.close();

  res.set('Content-Type', 'image/png');
  res.set('Content-Disposition', `attachment; filename=widget-${widgetId}.png`);
  res.send(buffer);
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server běží na portu ${port}`));
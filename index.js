const express = require("express");
const puppeteer = require("puppeteer");

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/buscar", async (req, res) => {
  const query = req.query.q;
  if (!query) return res.status(400).send("Debes incluir un nombre con ?q=NombreApellido");

  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  // Usa tu cookie
  await page.setCookie({
    name: ".AspNetCore.Session",
    value: ".eJw9zUEKwyAQQNG7zNoEq4kxrnKBbkop3YWhDkHQGIyWQunda7Po8sOD_wYK6DwYuKj7Wdwmixk3SqV9xAAM6LW5RPuMuRLBRd_woRHd9TQaqYyUrda8V7pKZ8HIsRsUAx-XhaxbweRUiMGKgf6HSlP0vy47pVpP9M7ORxz-8wWvvyxx.aIG0AA.3nPoAgSldgnur1OfmlXOxOWQnFc",
    domain: "xdataperu.com",
    path: "/",
    httpOnly: true,
    secure: true
  });

  await page.goto("https://xdataperu.com/buscarnombres", { waitUntil: "networkidle0" });

  // Completa el formulario
  await page.type("#nombre", query); // Ajusta el selector si es diferente
  await Promise.all([
    page.click("#btnBuscar"), // Ajusta el selector si es diferente
    page.waitForNavigation({ waitUntil: "networkidle0" }),
  ]);

  // Extraer tabla
  const resultados = await page.evaluate(() => {
    const filas = Array.from(document.querySelectorAll("table tbody tr"));
    return filas.map(fila =>
      Array.from(fila.querySelectorAll("td")).map(td => td.innerText.trim())
    );
  });

  await browser.close();

  res.json({ query, resultados });
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

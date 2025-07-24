const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");

const app = express();
const PORT = process.env.PORT || 3000;

// Aquí pega tu cookie completa
const COOKIE = ".eJw9zUEKwyAQQNG7zNoEq4kxrnKBbkop3YWhDkHQGIyWQunda7Po8sOD_wYK6DwYuKj7Wdwmixk3SqV9xAAM6LW5RPuMuRLBRd_woRHd9TQaqYyUrda8V7pKZ8HIsRsUAx-XhaxbweRUiMGKgf6HSlP0vy47pVpP9M7ORxz-8wWvvyxx.aIG0AA.3nPoAgSldgnur1OfmlXOxOWQnFc";

app.get("/buscar", async (req, res) => {
  const query = req.query.q;

  if (!query) {
    return res.status(400).send("Debes incluir un nombre con ?q=NombreApellido");
  }

  try {
    const response = await axios.get("https://xdataperu.com/buscarnombres", {
      headers: {
        Cookie: `.AspNetCore.Session=${COOKIE}`,
        "User-Agent": "Mozilla/5.0"
      },
      params: {
        nombre: query
      }
    });

    const $ = cheerio.load(response.data);

    // Ejemplo básico: extraer resultados visibles en una tabla
    const resultados = [];
    $("table tbody tr").each((i, el) => {
      const fila = [];
      $(el)
        .find("td")
        .each((j, td) => {
          fila.push($(td).text().trim());
        });
      if (fila.length > 0) resultados.push(fila);
    });

    res.json({ query, resultados });
  } catch (err) {
    console.error("Error al hacer scraping:", err.message);
    res.status(500).send("Error al obtener datos");
  }
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

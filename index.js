const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;
app.use(cors());

/**
 * Ruta para consultar licencia de conducir (nombre + número de licencia)
 * Ejemplo: /licencia?num=F12345678
 */
app.get("/licencia", async (req, res) => {
  const num = req.query.num;

  if (!num) return res.status(400).json({ error: "Falta el número de licencia (?num=...)" });

  try {
    const response = await axios.get(`https://licencias.mtc.gob.pe/#/index`);
    // ⚠️ Este endpoint es SPA (Angular) y no se puede scrapear directamente con axios.
    // Alternativa: buscar API interna o usar puppeteer para simular navegador.

    return res.json({ error: "Esta página necesita Puppeteer (SPA Angular)" });
  } catch (err) {
    res.status(500).json({ error: "Error al consultar licencia", detalle: err.message });
  }
});

/**
 * Ruta para consultar SOAT por placa
 * Ejemplo: /soat?placa=ABC123
 */
app.get("/soat", async (req, res) => {
  const placa = req.query.placa;

  if (!placa) return res.status(400).json({ error: "Falta la placa (?placa=...)" });

  try {
    const response = await axios.post("https://www2.sbs.gob.pe/soat/consultar.aspx", new URLSearchParams({
      __EVENTTARGET: "",
      __EVENTARGUMENT: "",
      txtPlaca: placa.toUpperCase(),
      btnBuscar: "Buscar"
    }), {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "User-Agent": "Mozilla/5.0"
      }
    });

    const $ = cheerio.load(response.data);

    const resultados = [];
    $("#dgResultado tr").each((i, row) => {
      const cols = $(row).find("td").map((j, el) => $(el).text().trim()).get();
      if (cols.length) resultados.push(cols);
    });

    if (resultados.length === 0) {
      return res.json({ placa, mensaje: "Sin resultados", resultados: [] });
    }

    res.json({ placa, resultados });
  } catch (err) {
    res.status(500).json({ error: "Error al obtener SOAT", detalle: err.message });
  }
});

app.get("/", (req, res) => {
  res.send("API funcionando: /soat?placa=ABC123 y /licencia?num=F12345678");
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

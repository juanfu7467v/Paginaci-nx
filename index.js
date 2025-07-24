const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");

const app = express();
const PORT = process.env.PORT || 3000;

// Ruta para consultar licencias (simulación)
app.get("/licencia", async (req, res) => {
  const numero = req.query.numero;
  const fecha = req.query.fecha;

  if (!numero || !fecha) {
    return res.status(400).send("Falta número de DNI o fecha. Usa ?numero=12345678&fecha=01/01/2000");
  }

  try {
    // Esta URL no es real, es solo para ejemplo
    const response = await axios.post("https://licencias.mtc.gob.pe/api/Consulta/Buscar", {
      numeroDocumento: numero,
      fechaNacimiento: fecha
    }, {
      headers: {
        "Content-Type": "application/json"
      }
    });

    const datos = response.data;
    res.json(datos);
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).send("Ocurrió un error consultando la licencia.");
  }
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

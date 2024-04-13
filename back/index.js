const { default: puppeteer } = require("puppeteer");
const fs = require("fs");

const scrapper = async (url) => {
  const personajesArray = [];

  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto(url);

  const repeat = async (page) => {
    const arrayDivs = await page.$$(".building-block-wrapper");

    for (const element of arrayDivs) {
      let img = await element.$eval("img", (el) => el.getAttribute("data-src"));
      let nombre = await element.$eval("span.long-title", (el) => el.textContent);

      if (!personajesArray.some(personaje => personaje.nombre === nombre)) {
        const personajes = {
          img,
          nombre
        };

        personajesArray.push(personajes);
      }
    }

    try {
      await page.$eval("[class = 'show_more button large section-color underline']", (el) => el.click());
      console.log("pasamos a la siguiente página");
      console.log(`llevamos ${personajesArray.length} datos recolectados`);


      repeat(page);
    } catch (error) {
      write(personajesArray);
    }


  };

  // Llamamos a la función repeat después de su declaración
  await repeat(page);
};

const write = (personajesArray) => {
  fs.writeFile("personajes.json", JSON.stringify(personajesArray), () => {
    console.log("Archivo escrito")
  });
};

scrapper("https://www.starwars.com/databank");

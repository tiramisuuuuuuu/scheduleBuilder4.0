import express from 'express';
import bodyParser from 'body-parser';
import puppeteer from 'puppeteer';
import cheerio from 'cheerio';
import cors from 'cors';


async function getSearch(searchTerm) {
	    var data = [];
		const browser = await puppeteer.launch({ 
			//executablePath: 'chrome.exe', 
			headless: true
			});
		const page = await browser.newPage();
		await page.goto('https://registrar-apps.ucdavis.edu/courses/search/index.cfm');
		await page.type('input[id=course_number]', searchTerm);
		await page.$eval('input[name=search]', el => el.click());
		console.log("success")
		await page.waitForTimeout(15000);
		const html = await page.content();
		await browser.close();
		//console.log(html);
		const $ = cheerio.load(html);
		//$('[id=courseResultsDiv]')
		let htmlOut = $.html($('[id=courseResultsDiv]').first().nextUntil("div").addBack());
		//console.log(htmlOut);
		let position = htmlOut.search("tr bgcolor")+10;
		htmlOut = htmlOut.substr(position);
		while (htmlOut.search("tr bgcolor") != -1) {
			let position = htmlOut.search("tr bgcolor")+10;
			htmlOut = htmlOut.substr(position);
			let tagStart = htmlOut.search("em")+21;
			let tagEnd = htmlOut.search("/em")-15;
			let courseTiming = htmlOut.substr(tagStart, tagEnd-tagStart)
			//console.log(courseTiming)
			tagStart = htmlOut.search("/td")+4;
			htmlOut = htmlOut.substr(tagStart);
			tagStart = htmlOut.search(">")+40;
			tagEnd = htmlOut.search("br")-1;
			let courseCode = htmlOut.substr(tagStart, tagEnd-tagStart)
			//console.log(courseCode)
			data.push({label: courseCode, value: courseTiming});
		}
		console.log(data)
        return JSON.stringify(data);
}



const corsOptions ={
   origin:'*', 
   credentials:true,            //access-control-allow-credentials:true
   optionSuccessStatus:200,
}


const PORT = process.env.PORT || 3001;

const app = express();
app.use(cors(corsOptions)) // Use this after the variable declaration
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());


app.post("/search", (req, res) => {
    (async () => {
    res.json(await getSearch(req.body.searchTerm))
    })();
});

app.listen(PORT, () => {
    console.log('Server listening on ${PORT}')
});

import express from 'express';
import bodyParser from 'body-parser';
import puppeteer from 'puppeteer';
import cheerio from 'cheerio';
import cors from 'cors';

import google from 'googleapis';
import dotenv from 'dotenv';
dotenv.config();

// Provide the required configuration
const CREDENTIALS = JSON.parse(process.env.CREDENTIALS);
const calendarId = process.env.CALENDAR_ID;

// Google calendar API settings
const SCOPES = 'https://www.googleapis.com/auth/calendar';
const calendar = google.google.calendar({version : "v3"});

const auth = new google.google.auth.JWT(
    CREDENTIALS.client_email,
    null,
    CREDENTIALS.private_key,
    SCOPES
);


function make24HourTimes(startTime, endTime, timeNotation) {
    let startHour = parseInt(startTime.substr(0, startTime.search(":")));
    let startMins = parseInt(startTime.substr(startTime.search(":")+1));
    console.log(startHour+"$"+startMins);
    let endHour = parseInt(endTime.substr(0, endTime.search(":")));
    let endMins = parseInt(endTime.substr(endTime.search(":")+1));
    console.log(endHour+"$"+endMins);
    console.log(timeNotation);
    if (timeNotation=='P') {
        if (startHour!=endHour) {

                if (startHour<endHour) {
                    startHour = startHour+12;
                    }
                
                }
        else {

            if (startMins<endMins) {
                startHour = startHour+12;
                if (startHour==24) {startHour=0}
                }

        }
        endHour = endHour+12;
        }


    if (startHour<10) {
        startTime = "0" + startHour + ":";
    }
    else { 
        startTime = startHour + ":"; 
    }
    if (startMins<10) {
            startTime = startTime + "0" + startMins;
            }
    else {
            startTime = startTime + startMins;
            }
    

    if (endHour<10) {
        endTime = "0" + endHour + ":";
    }
    else { 
        endTime = endHour + ":"; 
    }
    if (endMins<10) {
            endTime = endTime + "0" + endMins;
            }
    else {
            endTime = endTime + endMins;
            }
    

    return {start: startTime, end: endTime};
}

function abbreviateDays(dayRepeats) {
    let daysList = "";
    let start = 0
    dayRepeats = dayRepeats + " $"
    while (dayRepeats.substring(start)!="$") {
        let day = dayRepeats.substring(start, start+1);
        if (day=='M') {
            daysList = daysList+"MO,";
            }
        else if (day=='T') {
            daysList = daysList+"TU,";
            }
        else if (day=='W') {
            daysList = daysList+"WE,";
            }
        else if (day=='R') {
            daysList = daysList+"TH,";
            }
        else if (day=='F'){
            daysList = daysList+"FR,";
            }
        start = start+1;
        }
    daysList = daysList.substring(0, daysList.length-1)
    return daysList;
}


function makeEventBody(courseCode, timeCode) {
    let startTime = timeCode.substr(0, timeCode.search('-')-1);
        console.log(startTime);
	    timeCode = timeCode.substr(timeCode.search("-")+2);
    let endTime = timeCode.substr(timeCode, timeCode.search("M")-2);
        console.log(endTime);
        timeCode = timeCode.substr(timeCode.search("M")-1);
    let timeNotation = timeCode.substr(timeCode, timeCode.search("M"));//am or pm
        console.log(timeNotation);
        timeCode = timeCode.substr(timeCode.search("M")+3);
    let dayRepeats = timeCode.substr(timeCode, timeCode.search('\n'));
        console.log(dayRepeats);
        dayRepeats = abbreviateDays(dayRepeats);
    
    let timeObj = make24HourTimes(startTime, endTime, timeNotation);

    const date = new Date()
    let dateStr = date.getFullYear()+"-";
    let month = parseInt(date.getMonth())+1
    if (month<10) {
        dateStr = dateStr+"0"+month+"-";
        }
    else {
        dateStr = dateStr+month+"-";
    }
    if (parseInt(date.getDate())<10) {
        dateStr = dateStr+"0"+date.getDate();
        }
    else {
        dateStr = dateStr+date.getDate();
    }
    console.log(dateStr);
    console.log(dateStr+"T"+timeObj.start+":00-07:00")
    console.log(dateStr+"T"+timeObj.end+":00-07:00")
    let recurrenceStr = "RRULE:FREQ=WEEKLY;BYDAY="+dayRepeats;
    console.log(recurrenceStr);

    var event = {
        'summary': courseCode,
        //'location': '800 Howard St., San Francisco, CA 94103',
        //'description': 'A chance to hear more about Google\'s developer products.',
        'start': {
          'dateTime': dateStr+"T"+timeObj.start+":00-07:00",
          'timeZone': 'America/Los_Angeles'
        },
        'end': {
          'dateTime': dateStr+"T"+timeObj.end+":00-07:00",
          'timeZone': 'America/Los_Angeles'
        },
        'recurrence': [
          recurrenceStr
        ],
      };

    return event;
}

async function courseToCal(courseCode, timeCode) {
    console.log(courseCode);
    console.log(timeCode);
    
    let response = await calendar.events.insert({
        auth: auth,
        calendarId: calendarId,
        resource: makeEventBody(courseCode, timeCode),
    });
    console.log(response.items)
}


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

app.post("/add-to-calendar", (req, res) => {
    (async () => {
        console.log("arrived");
        res.json(await courseToCal(req.body.label, req.body.value))
    })();
});

app.listen(PORT, () => {
    console.log('Server listening on ${PORT}')
});

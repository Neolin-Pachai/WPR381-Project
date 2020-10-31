const express = require("express");
const bodyParser = require("body-parser");
const fetch = require('node-fetch');

const app = express();

let finalURL

function CreateAPICall(zip)
{
  let units = "metric"
  //^ temporarily hardcoded
  let url1 = "http://api.openweathermap.org/data/2.5/weather?zip="
  let url2 = `,za&units=${units}&appid=f300919b67b5f24a743dcf6ffba4edec`
  //some existing zips: 2094, 1541
  finalURL = url1 + zip + url2
}

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

//gets
//does action when the user is on the specified url
//sendFile directs the user to an html file
//send basically overwrites the webpage with a string

app.get("/", (req, res) => {
  res.sendFile("./routes/index.html", {root: __dirname})
})

app.get("/404", (req, res) => {
  res.sendFile("./routes/invalidZip.html", {root: __dirname})
})


app.get("/use-api", (req, res) => {

  //Don't delete the bottom code block yet. It might be necessary to send the data to the front end

  // fetch(finalURL)
	// 	.then(res => res.json())
	// 	.then(data => {
  //     res.send({ data });
  //     //res.redirect("/new");
	// 	}).catch(err => {
	// 		res.redirect('/error');
  //   });
  

  APIStuff(res)

})

async function APIStuff(res)  //This function is used to call the api and process the data gained from it
  {
    let response = await fetch(finalURL);
    let json = await response.json();
    if (json["cod"] == 200) //validation on the zipcode
    {
      let result = "Name: " + json["name"] + "</br>Temperature: " + json["main"]["temp"] + "°C</br>Weather: " + json["weather"][0]["description"]
      res.send(result)
    }
    else
    {
      res.redirect("/404")
    }
  }

  //This code checks "/zip-post" for a zip to be sent (from front end), and then the zip can be sent to the API
app.post("/zip-post", (req, res) => {
    console.log("Got body:", req.body)
    let a = parseInt(req.body["zip"])
    zip = req.body["zip"]
    console.log("Zip = " + a)
    CreateAPICall(req.body["zip"])
    res.redirect("/use-api")
})

  //hosting the web server
app.listen(8080,() => {
  console.log("Started on PORT 8080");
})
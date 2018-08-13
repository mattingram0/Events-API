# Events-API
An Event-management RESTful API, with a Website front-end and administrative page

## Prerequisites
To run the Node.js RESTful API locally on your machine, the latest version of **Node.js** needs to be installed, along with the following additionial packages: **body-parser**, **async**, **body-parser**, **Bootstrap**, **cookie-parser**, **express**, **express-session**, **js-cookie**, **jswebtoken**, **morgan**, **nodemon**, **request** and **request-ip**. All of these packages can be installed using the **npm** package manager.

## Installation
Click 'Clone or download' above and then 'Download ZIP', or alternatively run the following command from the command line:

```
git clone https://github.com/mattingram0/Events-Api.git
```

## Running
Once downloaded, the Node.js server can then be started by running the following command:

```
npm run dev
```

The server should now be running locally on http://localhost:8090, and can be accessed through the browser.

## API Documentation
From now on, BASE will be used as shorthand for http://127.0.0.1:8090/events2017/. All responses are given in standard JSON format.

#### GET BASE/venues
Returns the details of all of the venues.

Example Response:
```json
{
  "venues":{
    "v_1":{
      "name":"Grinton Lodge Youth Hostel",
      "postcode":"DL11 6HS",
      "town":"Richmond",
      "url":"http://www.yha.org.uk/hostel/grinton-lodge",
      "icon":"http://www.yha.org.uk/sites/all/themes/yha/images/logos/yha_header_logo.png"
    },
    "v_2":{
      "name":"Sage Gateshead",
      "postcode":"NE8 2JR",
      "town":"Gateshead",
      "url":"http://www.sagegateshead.com/",
      "icon":"http://www.sagegateshead.com/files/images/pageimage/1683.7123dea7/630x397.fitandcrop.jpg"
    }
  }
}
```


## Admin Login

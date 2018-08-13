# Events-API
An Event-management RESTful API, with a website front-end and administrative page

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
From now on, BASE will be used as shorthand for http://127.0.0.1:8090/events2017/. All responses are given in standard JSON format. With the exception of the GET BASE/events/get/:event_id API call which takes its parameter in the URL, all parameters should be passed in the body of the request 

#### GET BASE/venues
Returns the details of all of the venues.

Example Response:
```json
{
    "venues": {
        "v_1": {
            "name": "Grinton Lodge Youth Hostel",
            "postcode": "DL11 6HS",
            "town": "Richmond",
            "url": "http://www.yha.org.uk/hostel/grinton-lodge",
            "icon": "http://www.yha.org.uk/sites/all/themes/yha/images/logos/yha_header_logo.png"
        },
        "v_2": {
            "name": "Sage Gateshead",
            "postcode": "NE8 2JR",
            "town": "Gateshead",
            "url": "http://www.sagegateshead.com/",
            "icon": "http://www.sagegateshead.com/files/images/pageimage/1683.7123dea7/630x397.fitandcrop.jpg"
        }
    }
}
```
#### GET BASE/events/search
Searches for events based on two parameters:
* **search** - url-encoded string to be used to search event title (*optional*) 
* **date** - url-encoded string representing the date to search for (*optional*)

Example Response:
```json
{
    "events": [{
        "event_id": "e_1",
        "title": "Swaledale Squeeze 2018",
        "blurb": "The biggest and best concertina weekend in the world. Held each May in Grinton Lodge YHA, North Yorkshire",
        "date": "2018-05-21T16:00:00Z",
        "url": "http://www.swaledalesqueeze.org.uk",
        "venue": {
            "name": "Grinton Lodge Youth Hostel",
            "postcode": "DL11 6HS",
            "town": "Richmond",
            "url": "http://www.yha.org.uk/hostel/grinton-lodge",
            "icon": "http://www.yha.org.uk/sites/all/themes/yha/images/logos/yha_header_logo.png",
            "venue_id": "v_1"
        }
    }]
}
```

#### GET BASE/events/get/:event_id
Searches for an event based on one parameter. Events are return in same format as GET BASE/events/search
* **event_id** - numerical parameter in URL (*required*)

Example Response (If event_id incorrect or undefined):
```json
{
    "error": "no such event"
}
```

#### GET BASE/validate
Takes an auth_token and and IP address and returns whether or not the token is valid. Please see the authentication section for more detail.
* **auth_token** - a JSON Web Token string (*required*)
* **ip** - the IP address of the sender wishing to validate his token (*required*)

Example Response (If auth_token is valid for the IP address provided):
```json
{
    "success": true,
    "message": "Successfully Authenticated Token"
}
```

#### POST BASE/authenticate
Takes a username, password and IP address and issues a JSON Web Token aut_token for that IP address if successful. The auth_token lasts two hours and gives the holder the ability to create new events and venues, as well as access the admin page. Please see the authentication section for more detail.  
* **username** - a username string (*required*)
* **password** - a password string (*required*)
* **ip** - the IP address of the sender wishing to acquire an auth_token (*required*)

Example Response (If correct credentials are provided):
```json
{
    "success": true,
    "auth_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
}
```

#### POST BASE/venues/add
Creates a new venue based on several required and optional parameters. See the authentication section for more on the auth_token parameter.
* **auth_token** - the authentication token required to add new venues (*required*)
* **name** - text value name of the venue (*required*)
* **postcode** - text value postcode of the venue (*optional*)
* **town** - text value town of the venue (*optional*)
* **url** - text value of website of venue (*optional*)
* **icon** - text value of url to icon for venu (*optional*)

Example Response (If event_id incorrect or undefined):
```json
{
    "error": "not authorised, wrong token"
}
```

#### POST BASE/events/add
Creates a new event based on several required and optional parameters. See the authentication section for more on the auth_token parameter.
* **auth_token** - the authentication token required to add new events (*required*)
* **event_id** - numerical value of the event_id (*required*)
* **title** - text value title of the event (*required*)
* **venue_id** - numerical value venue_id of existing venue (*required*)
* **date** - ISO8601 formatted date value of date of event (*required*)
* **url** - text value of url to icon for event (*optional*)
* **blurb** - text value of description of event (*optional*)

Example Response (If event_id incorrect or undefined):
```
{
    "error": "not authorised, wrong token"
}
```

## Authentication
As this is simply a proof-of-concept web application, there are two ways of authenticating successfully pre-coded into the application:
* The first is to use the auth_token "concertina" and any IP address of the form: "129.234.xxx.xxx"
* The second is to use the username "matt" with the password "password" from any IP address to generate a new auth_token of your own

## Website
Along with the API, there is a user-friendly website interface which can be accessed at http://127.0.0.1:8090/events2017/index.html. This page provides the user with an intuitive search bar for search for events. From this page, the user may login using the credentials discusses above in the Authentication section. Upon successful login, the user will be taken to the admin page where he/she can add new events and venues using an intuitive web interface. A cookie is also created storing the auth_token, so repeated logins are not required. The auth_token is valid for two hours after issue. The website is responsive and uses the Bootstrap framework.

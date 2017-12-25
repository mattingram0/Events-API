const path = require('path');
const request = require('request');

module.exports = function(app) {
  app.get('/events2017/venues', (req, res) => {
    filePath = path.join(__dirname, '../venues/venues.json');
    var data = require('fs').readFileSync(filePath, 'utf8')
    res.type('application/json');
    res.send(JSON.parse(data));
  });

  app.get('/events2017/events/search', (req, res) => {

    var keywords = req.query.search;
    var date = req.query.date;
    var eventful = req.query.eventCheck;
    var selectedEvents = []

    var filePath = path.join(__dirname, '../events/events.json');
    var data = require('fs').readFileSync(filePath, 'utf8')
    var events = JSON.parse(data).events;

    //Check to see if optional parametres specified, if not set to null empty string to avoid issues
    if(typeof keywords == 'undefined'){
      keywords = "";
    }
    if(typeof date == 'undefined'){
      date = "";
    }
    if(typeof eventful == 'undefined'){
      eventful = false;
    } else {
      eventful = true;
    }

    keywords = keywords.toLowerCase();

    if(keywords == "" && date == ""){
      selectedEvents = events
    } else if(keywords != "" && date == ""){
      for(var i = 0; i < events.length; i++){
        if(events[i].title.toLowerCase().includes(keywords)){
          selectedEvents.push(events[i]);
        }
      }
    } else if(keywords == "" && date != ""){
      for(var i = 0; i < events.length; i++){
        if(events[i].date.substring(0, 10) == date){
          selectedEvents.push(events[i]);
        }
      }
    } else {
      for(var i = 0; i < events.length; i++){
        if(events[i].title.toLowerCase().includes(keywords) && events[i].date.substring(0, 10) == date){
          selectedEvents.push(events[i]);
        }
      }
    }

    filePath = path.join(__dirname, '../venues/venues.json');
    data = require('fs').readFileSync(filePath, 'utf8')
    var venues = JSON.parse(data).venues;
    var eventsList = [];

    for(var i = 0; i < selectedEvents.length; i++){
      event = selectedEvents[i]
      venueId = event.venue_id

      for(venue in venues){
        if(venue == venueId){
          var newEvent = {};
          var newVenue = {};
          Object.assign(newEvent, event);
          Object.assign(newVenue, venues[venue])
          delete newEvent.venue_id;
          newEvent["venue"] = newVenue;
          newEvent.venue["venue_id"] = venue;
        }
      }
      
      eventsList.push(newEvent)
    }

    if(eventful){
      query = "http://api.eventful.com/json/events/search?app_key="+app.get('eventKey')+"&category=sports&location=United%20Kingdom"

      if(keywords){
        query = query + "&keywords=" + keywords
      }
      if(date){
        date = date.substring(0, 10).replace(/\-/g, '')
        query = query + "&date=" + date + "00-" + date + "00";
      }

      makeRequest(query, function(extraEvents){
        res.type('application/json');
        return res.send(JSON.stringify({events:eventsList.concat(extraEvents)}))
      })

    } else {
      res.type('application/json');
      return res.send(JSON.stringify({events:eventsList}))
    }
  });

  function makeRequest(query, callback){
    addedEvents = []
    request(query, function (error, response, body) {
      resp = JSON.parse(body);

      if(resp.events){
        events = resp.events.event;
      } else {
        return callback([]);
      }

      for(var i = 0; i < events.length; i++){
        event = {
          event_id:events[i].id,
          title:events[i].title,
          blurb:events[i].description,
          date:events[i].start_time.substring(0, 10),
          url:events[i].url,
          venue:{
            name:events[i].venue_name,
            postcode:events[i].postal_code,
            town:events[i].city_name,
            url:events[i].venue_url,
            icon:events[i].image,
            venue_id:events[i].venue_id,
          }
        }
        addedEvents.push(event);
      }
      callback(addedEvents);
    });
  }

  app.get('/events2017/events/get/:event_id', (req, res) => {
    var filePath = path.join(__dirname, '../events/events.json');
    var data = require('fs').readFileSync(filePath, 'utf8')
    var obj = JSON.parse(data);
    res.type('application/json');
    response = searchIDs(obj.events, req.params.event_id);

    if(!response[0]){
      res.status(400);
    } 
    res.send(response[1]);
  });

  app.get('/events2017/index.html', (req, res) => {
    res.redirect('/index.html');
  });

  function searchIDs(events, id){
    var filePath = path.join(__dirname, '../venues/venues.json');
    var data = require('fs').readFileSync(filePath, 'utf8')
    var venues = JSON.parse(data).venues;
    var event;

    for (var i = 0; i < events.length; i++){
      if(events[i].event_id == id){
        event = events[i]
      }
    }

    var newEvent = {};
    var newVenue = {};

    if (typeof event != 'undefined'){

      var venueId = event.venue_id

      for(venue in venues){
        if(venue == venueId){
          Object.assign(newEvent, event);
          Object.assign(newVenue, venues[venue])
          delete newEvent.venue_id;

          newEvent["venue"] = newVenue;
          newEvent.venue["venue_id"] = venue;
        }
      }

      return [true, JSON.stringify(newEvent)];
    } else {
      return [false, JSON.stringify({"error":"no such event"})];
    }
  }
};



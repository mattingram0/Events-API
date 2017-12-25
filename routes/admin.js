const request = require('request');
const path = require('path')

module.exports = function(app) {
  app.post('/events2017/venues/add', (req, res) => {
    res.type('application/json');
    var ip = req.clientIp.toString();
    var auth_token = req.body.auth_token;
    var name = req.body.name;
    var postcode = (req.body.postcode == "" || typeof req.body.postcode == 'undefined') ? "null" : req.body.postcode;
    var town = (req.body.town == "" || typeof req.body.town == 'undefined') ? "null" : req.body.town;
    var url = (req.body.url == "" || typeof req.body.url == 'undefined') ? "null" : req.body.url;
    var icon = (req.body.icon == "" || typeof req.body.icon == 'undefined') ? "null" : req.body.icon;

    if (!(typeof auth_token === 'string' || auth_token instanceof String) ||
      !(typeof name === 'string' || name instanceof String) || !(typeof postcode === 'string' || postcode instanceof String) || 
      !(typeof town === 'string' || town instanceof String) || !(typeof url === 'string' || url instanceof String) ||
      !(typeof icon === 'string' || icon instanceof String)){
      res.status(400);
      return res.send(JSON.stringify({"error":"Incorrect data type provided "}))
  }

  if(!auth_token){
    res.status(400);
    return res.send(JSON.stringify({"error":"not authorised, wrong token"}))
  } else if(!name){
    res.status(400);
    return res.send(JSON.stringify({"error":"Name of venue not given"}))
  } else {
    request('http://' + req.headers.host + '/events2017/validate?auth_token='+auth_token+'&ip='+ip, function (error, response, body) {
      var obj = JSON.parse(body)
      if(obj.success){
        filePath = path.join(__dirname, '../venues/venues.json');
        var data = require('fs').readFileSync(filePath, 'utf8')
        venues = JSON.parse(data).venues;
        var count = 1;

        newVenue = {
          name: name,
          postcode: postcode,
          town: town,
          url: url,
          icon: icon
        }

        for(venue in venues){
          if(JSON.stringify(venues[venue]) === JSON.stringify(newVenue)){
            res.status(400);
            return res.send(JSON.stringify({"error":"Venue already exists!"}))
          }
          count++;
        }

        venues['v_'+count.toString()] = newVenue;
        require('fs').writeFile(filePath, JSON.stringify({"venues":venues}));
        res.type('application/json')
        return res.send(JSON.stringify({'success':'Venue successfully added'}))

      } else {
        res.status(400);
        return res.send(JSON.stringify({"error":"not authorised, wrong token"}));
      }
    });
  }
});

  app.post('/events2017/events/add', (req, res) => {
    res.type('application/json');
    var ip = req.clientIp.toString();
    var auth_token = req.body.auth_token;
    var event_id = req.body.event_id;
    var title = req.body.title;
    var venue_id = req.body.venue_id;
    var date = req.body.date;
    var url = (req.body.url == "" || typeof req.body.url == 'undefined') ? "null" : req.body.url;
    var blurb = (req.body.blurb == "" || typeof req.body.blurb == 'undefined') ? "null" : req.body.blurb;

    if (!(typeof auth_token === 'string' || auth_token instanceof String) ||
      !(typeof event_id === 'string' || event_id instanceof String) || !(typeof title === 'string' || title instanceof String) || 
      !(typeof venue_id === 'string' || venue_id instanceof String) || !(typeof url === 'string' || url instanceof String) ||
      !(typeof blurb === 'string' || blurb instanceof String)){
    
      res.status(400);
      return res.send(JSON.stringify({"error":"Incorrect data type provided "}))
    }

    var longDate = /\d\d\d\d\-\d\d\-\d\d[Tt]\d\d\:\d\d\:\d\d[Zz]/
    var shortDate = /^\d\d\d\d\-\d\d\-\d\d$/

    if(!longDate.exec(date) && !shortDate.exec(date)){
      res.status(400);
      return res.send(JSON.stringify({"error":"Incorrect date format"}))
    }

    if(!auth_token){
      res.status(400);
      return res.send(JSON.stringify({"error":"not authorised, wrong token"}))
    } else if(!event_id){
      res.status(400);
      return res.send(JSON.stringify({"error":"Event_ID not given"}))
    } else if(!title){
      res.status(400);
      return res.send(JSON.stringify({"error":"Title not given"}))
    } else if(!venue_id){
      res.status(400);
      return res.send(JSON.stringify({"error":"Venue_ID not given"}))
    } else if(!date){
      res.status(400);
      return res.send(JSON.stringify({"error":"Date not given"}))
    } else {
      request('http://' + req.headers.host + '/events2017/validate?auth_token='+auth_token+'&ip='+ip, function (error, response, body) {
        var obj = JSON.parse(body)
        if(obj.success){

          filePath = path.join(__dirname, '../events/events.json');
          var data = require('fs').readFileSync(filePath, 'utf8')
          events = JSON.parse(data).events;

          newEvent = {
            event_id: event_id,
            title: title,
            blurb: blurb,
            date: date,
            url: url,
            venue_id:venue_id
          }

          events.push(newEvent);
          require('fs').writeFile(filePath, JSON.stringify({"events":events}));
          return res.send(JSON.stringify({'success':'Event successfully added to ' + venue_id}))
        } else {
          res.status(400);
          return res.send(JSON.stringify({"error":"not authorised, wrong token"}));
        }
      });
    }
  });

  app.get('/events2017/admin.html', (req, res) => {
    res.redirect('/admin.html');
  });
};
var koa = require('koa');
var Router = require('koa-router');
var mqtt = require('mqtt');
var mongodb = require('mongodb');

var app = koa();
var router = new Router();
var mqttBroker = mqtt.connect('mqtt://test.mosquitto.org');
var mongodbServer = new mongodb.Server('http://kiss5891:kiss8591@ds153845.mlab.com',53845,{
  auto_reconnect : true
});
var db = new mongodb.Db('taiwan_hackathon',mongodbServer);

var rfid ="";

mqttBroker.on('connect',function(){
  mqttBroker.subscribe('/RFID/v1/NUTC');
});

mqttBroker.on('message',function(topic,message){
  rfid = JSON.parse(message).rfid;
  console.log(rfid);
});

function * cardJson(rfid){
  var cardId = {
    "roderID" : rfid,
    "guestName" : xxx,
    "guestPhone" : xxx,
    "datalink" : [
      {
        "urlPNG" : "http://123.123.123.123/PNG/12345.png",
        "urlMusic" : "http://123.123.123.123/MP3/12345.mp3"
      },
      {
        "guestTable" : 1 ,
        "guestMode" : 2 ,
        "guestRFID" : "FF:AA:11"
      }
    ],
    "enable" : true
  }
  return cardId;
}

router.post('/insert',function * (){
  db.open(function(){
    // if(!err){
      console.log('connect mongodb');
      db.collection('RFID',function(err,collection){
        collection.insert(cardJson(rfid),function(err,data){
          if(!err){
            console.log('ok');
          }else{
            console.log('error');
          }
        });
      });
    // }else{
    //   console.log('mongodb open error');
    // }
  });
});

router.post('/delete',function * (){

});

router.post('/update',function * (){

});

router.post('/find',function * (){

});

app.use(router.middleware());
app.listen(3000);

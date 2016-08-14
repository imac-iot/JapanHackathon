var SerialPort = require('serialport');
var mqtt = require('mqtt');
var dateFormat = require('dateformat');

var port = new SerialPort.SerialPort('/dev/ttyS0',{
        baudRate : 57600,
        parser : SerialPort.parsers.readline('\n')
});
var server = mqtt.connect('mqtt://test.mosquitto.org');

server.on('connect',function(){
        server.subscribe('/RFID/v1/NUTC');
});

port.on('open',function(){
        console.log('ok');
        port.on('data',function(data){
                console.log('Data:'+data);
                var mes = data.split('\r');
                var day = dateFormat('yyyy-mm-dd h:mm:ss');
                var card = { 'rfid' : mes[0] , 'time' : day};
                server.publish('/RFID/v1/NUTC',JSON.stringify(card));
        });
});

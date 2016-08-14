var mongodb = require('mongodb');

// var mongodbServer = new mongodb.Server('mongodb://kiss5891:kiss8591@ds153845.mlab.com',53845, {
//     auto_reconnect: true
// });
var mongodbServer = new mongodb.Server('mongodb://kiss5891:kiss8591@ds153845.mlab.com',27017, {
    auto_reconnect: true
});

var db = new mongodb.Db('taiwan_hackathon', mongodbServer);

db.open(function(err, db) {
    if (!err) {
        console.log('mongodb are connected');
        db.collection('RFID', function(err, collection) {
            var data = {
                'name': 'apple'
            };
            collection.insert(data, function(err, data) {
                if (err) {
                    console.log('mqtt data insert failed');
                } else {
                    console.log('mqtt data insert successfully');
                }
            });
        });

        db.collection('RFID', function(err, collection) {
            var updateData = {
                'name': 'apple'
            }
            collection.update(updateData, {
                '$set': {
                    'apple': 'titan'
                }
            });
        });

        // db.collection('mqtt',function(err,collection){
        //     var removeData = {
        //       'name' : 'apple'
        //     }
        //     collection.remove(removeData);
        // });

        db.collection('RFID', function(err, collection) {
            var find = {
                'name': 'apple'
            }
            collection.findOne(find, function(err, item) {
                console.log(item['name']);
                console.log(item.apple);
            });
        });

    } else {
        console.log('mongodb open error');
    }
});

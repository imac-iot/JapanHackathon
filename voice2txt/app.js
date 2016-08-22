/*eslint-env node*/

//------------------------------------------------------------------------------
// node.js starter application for Bluemix
//------------------------------------------------------------------------------

// This application uses express as its web server
// for more info, see: http://expressjs.com
var koa = require('koa');
var serve = require('koa-static');
var _ = require('koa-route');
var fs = require('fs');
var speech_to_txt = require('watson-developer-cloud/speech-to-text/v1');
var LanguageTranslatorV2 = require('watson-developer-cloud/language-translator/v2');

//const PassThrough = require('stream').PassThrough;

// cfenv provides access to your Cloud Foundry environment
// for more info, see: https://www.npmjs.com/package/cfenv
var cfenv = require('cfenv');

var app = koa();

var stream_to_txt= new speech_to_txt({
    username: 'd8a9ce1f-2614-4de8-afad-f85a5a4369dd',
    password: 'mM5mUdGSNBIC',
});

var lang_translator = new LanguageTranslatorV2({
    username: '82e38d00-4dd9-42a9-be5c-0369db5c6fe8',
    password: 'zWEVFw8F5Mnu',      
})

// serve the files out of ./public as our main files
//app.use(serve(__dirname + '/public'));


function translator(words){
    lang_translator.translate({
        text: words, source: 'en', target: 'es'},
        function(err, translation){
            if(err)
                console.log(err);
            else
                words = JSON.stringify(translation.translations[0].translation);
                console.log(words);
                return(words);
    })
}

app.use(_.get('/test', function *(){
    console.log('start');
    this.type = 'text/plain'
    var params = {
        audio: fs.createReadStream('./public/0001.flac'),
        content_type: 'audio/flac; rate=44100'
    };
    /*
    fs.createReadStream('./public/0001.flac')
        .pipe(stream_to_txt.createRecognizeStream({ content_type: 'audio/l16; rate=44100'}))
        .pipe()
        .pipe(fs.createWriteStream('./transcription.txt'));
    */
    stream_to_txt.recognize(params, function(err, res) {
        if (err)
            console.log(err);
        else
            var words = JSON.stringify(res.results[0].alternatives[0].transcript);
            console.log(words);
            translator(words);            
    });
}));


// get the app environment from Cloud Foundry
var appEnv = cfenv.getAppEnv();

// start server on the specified port and binding host
app.listen(appEnv.port, '0.0.0.0', function() {
  // print a message when the server starts listening
  console.log("server starting on " + appEnv.url);
});

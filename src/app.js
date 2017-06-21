let fs = require('fs');
let uuid = require('uuid/v4');

let express = require('express');
let app = express();

let bodyParser = require('body-parser');

let marked = require('marked');

const template = fs.readFileSync(__dirname + '/story.md').toString();

function replaceAll(string, pattern, replace) {
    let done = false;

    while (!done) {
        var newStr = string.replace(pattern, replace);

        if (newStr === string) {
            done = true;
        } else {
            string = newStr;
        }
    }

    return string;
}

app.use(bodyParser.urlencoded());

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/main.html');
});

app.get('/stories/:id', (req, res) => {
    res.sendFile(__dirname + '/stories/' + req.params.id + '.html');
});


let prepend = '<html><head>     <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css"           integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" crossorigin="anonymous">      <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap-theme.min.css"           integrity="sha384-rHyoN1iRsVXV4nD0JutlnGaslCJuC7uwjduW9SVrLvRYooPp2bWYgmgJQIXwl/Sp" crossorigin="anonymous">      <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"             integrity="sha384-Tc5IQib027qvyjSMfHjOMaLkfuWVxZxUPnCJA7l2mCWNIpG9mGCD8wGNIcPD7Txa"             crossorigin="anonymous"></script>      <style>         .container {             max-width: 800px;         }                  body {             font-family: Geneva;         }     </style> </head><body><div class="container">';

let postpend = '</div></body></html>';

app.post('/', (req, res) => {
    var temp = replaceAll(template, '[[PROFESSION]]', req.body['PROFESSION']);
    temp = replaceAll(temp, '[[COMMON TASK]]', req.body['COMMON_TASK']);
    temp = replaceAll(temp, '[[SECOND COMMON TASK]]', req.body['SECOND_COMMON_TASK']);
    temp = replaceAll(temp, '[[OFF THE WALL QUESTION]]', req.body['OFF_THE_WALL_QUESTION']);
    temp = replaceAll(temp, '[[SOLUTION TO OFF THE WALL QUESTION]]', req.body['SOLUTION']);
    temp = replaceAll(temp, '[[ESSENTIAL TOOL OF THE TRADE]]', req.body['ESSENTIAL_TOOL']);
    temp = replaceAll(temp, '[[SECOND ESSENTIAL TOOL OF THE TRADE]]', req.body['SECOND_ESSENTIAL_TOOL']);
    temp = replaceAll(temp, '[[INTERVIEW PREP BOOK NAME]]', req.body['PREP_BOOK']);
    temp = replaceAll(temp, '[[PROFESSIONAL COMPETITION NAME]]', req.body['COMP_NAME']);

    marked(temp, (err, content) => {
        content = prepend + content + postpend;
        if (err) {
            console.error(err);
            res.sendStatus(500);
        } else {
            let id = uuid();
            fs.writeFile(__dirname + '/stories/' + id + '.html', content, {}, (err) => {
                if (err) {
                    console.error(err);
                    res.sendStatus(500);
                } else {
                    res.redirect('./stories/' + id);
                }
            });
        }
    });
});

app.listen('8080', () => {
    console.log('App listening on port 8080');
});


// Error 503: https://stackoverflow.com/questions/43596835/heroku-is-giving-me-a-503-when-trying-to-open-my-web-app-works-on-local-host

// Import statement
const helmet = require('helmet')
const express = require('express')
const compression = require('compression')
const cors = require('cors')
const fs = require('fs')
const path = require('path')
const ocrSpaceApi = require('ocr-space-api')
const zxing = require('./zxing-umd-browser.js')

// const PORT = 2000

const app = express()

app.use(helmet()) // Security
app.use(compression()) // compress HTTP request (compress all routes) [reduce the time required for the client to get and load the page from server]

app.use(express.text({ limit: '50mb' }))

app.use(cors({ origin: ['https://smartm-dev.es.thingworx.com','https://view.vuforia.com'] }))
app.options('*', cors()) // enable preflight across-the-board --> include bfeore other route



// Setting middleware
app.use(express.static('public')) // Serve resources from public folder

app.use('/images', express.static(path.join(__dirname, '/public')))

// Post base64 string
app.post('/post-base64', (req, res) => {

    // Captured img [base64 string]
    let strBase64 = req.body
    console.log(strBase64)

    /*
    // Convert base64 --> img.jpeg
    let buffer = Buffer.from(strBase64, 'base64')
    console.log(buffer)

    // Write base64 to file
    let writeStream = fs.createWriteStream('label.txt')
    writeStream.write(buffer, 'base64')


    writeStream.on('finish', () => {
        console.log('WROTE ALL!')
    })

    writeStream.end()

    */

    // Save img as 'label.jpeg'/'out.jpeg'
    fs.writeFile(__dirname + '/public/out.jpeg', strBase64, 'base64', (err, data) => {
        if (err) {
            console.log('err', err)
            res.send({
                sendStatus: 'error' + err
            })

        }

        console.log('success')
        res.send({
            sendStatus: 'succeed!',
            dirLoc: __dirname + '/public/out.jpeg'
        })

    })
})

app.use('/static', express.static(path.join(__dirname, '/'))) //https://qwe-1.herokuapp.com/static/browser.html

app.get('/zxing-value', (req, res) => {
    res.sendFile(process.cwd() + '/browser.html')
})

var options = {
    apikey: '2065cf6e9188957',
    language: 'eng',
    imageFormat: 'image/png',
    isOverlayRequired: true,
    OCREngine: 2
}

app.use(express.json())

app.get('/value', (req, res) => {

    const imageFilePath = `https://qwe-1.herokuapp.com/out.jpeg`
    // OCR
    ocrSpaceApi.parseImageFromLocalFile(imageFilePath, options)
        .then((ParsedResults) => {
            console.log('PARSED RESULT --: ', ParsedResults.parsedText)
            res.send({
                ResultOCR: ParsedResults.parsedText
            })
        }).catch((error) => {
            console.log('ERRRRORRRRR --: ', error)
            res.send({
                ResultOCR: error
            })

        })
})


app.get('/tea', (req, res) => {
    //res.sendFile(process.cwd() + '/index.html')
    res.send({
        haluu: 'PlsGett'
    })
})


app.get('/testCors', (req, res) => {
    //res.sendFile(process.cwd() + '/index.html')
    res.send({
        status: '🥦'
    })
})

app.get('/data-matrix', (req, res) => {
    const codeReader = new zxing.BrowserDatamatrixCodeReader()
    console.log('ZXing code reader initialized')

    codeReader.decodeFromImage()
        .then(result => {
            console.log(result)
        })
        .catch(err => {
            console.log(err)
        })
})

const server = app.listen(process.env.PORT || 2000, () => {
    const port = server.address().port;
    console.log(`Express is working on port ${port}`);
});

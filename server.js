var express = require('express')
  , app = express()

app.use(express.static(__dirname + '/client'))

//// start-up
var server = app.listen(process.env.PORT, function () {
  console.log('listening on: %s', server.address().port)
})

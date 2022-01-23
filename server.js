var app = require('./app');
const socketIo = require('socket.io');
const http = require("http");

const httpServer = http.createServer(app);

/**
 * Get port from environment and store in Express.
 */
const port = process.env.PORT || 5000;
const io = socketIo(httpServer, {
    cors: true,
    origins: [`http://locahost:${port}}`]
})

httpServer.listen(port, () => console.log(`App listening on port ${port}.`))


// Socket.io 

io.on('connection', function (socket) {
    // Connection now authenticated to receive further events
    console.log('hi')

    const uploader = new siofu(socket);
    uploader.listen(socket)
    uploader.dir = "/srv/uploads";
    uploader.listen(socket);

    // Do something when a file is saved:
    uploader.on("saved", function (event) {
        console.log(event.file);
    });

    // Error handler:
    uploader.on("error", function (event) {
        console.log("Error from uploader", event);
    });
    socket.on('sent message', function (msg) {
        console.log('message' + ' : ' + JSON.stringify(msg))
        socket.broadcast.emit('message', msg);
    })



    socket.on('notify', function (data) {
        console.log(data)
        socket.emit('message', data);
    });
    socket.on('authenticate', function (data) {
        const token = data.token;
        if (token) {
            jwt.verify(token, process.env.JWT, [algorithm = "HS256"], (err, user) => {
                if (err) {
                    console.log(err)
                }
                else {
                    socket.emit('authenticated', { done: 'Done', data: data });
                }
            });
        }
    });
});


let socket = "";

function socketsOnConnected()
{
    
}

function socketsOnDisonnected()
{
    
}

function socketsOnError(error)
{
    
}

function socketsOnCompilationUpdate(update)
{
    handleCompilationUpdates(update);
}

function socketsOnCompilationEnded(results)
{
    handleCompilationEnded(results);
}

function socketsOnRunUpdate(update)
{
    handleRunUpdates(update);
}

function socketsOnRunEnded(results)
{
    handleRunEnded(results);
}

function socketsSendMessage(event, message) {
    socket.emit(event, message);
}

function startSocketIOConnection()
{
    socket = io.connect('http://localhost:8080');

    socket.on('connect', function() {
        socketsOnConnected();
    });

    socket.on('disconnect', function() {
        socketsOnDisonnected();
    });

    socket.on('error', function(error) {
        socketsOnError(error);
    });

    socket.on('COMPILATION_UPDATE', function(update) {
        socketsOnCompilationUpdate(update);
    });

    socket.on('COMPILATION_ENDED', function(results) {
        socketsOnCompilationEnded(results);
    });

    socket.on('RUN_UPDATE', function(update) {
        socketsOnRunUpdate(update);
    });

    socket.on('RUN_ENDED', function(results) {
        socketsOnRunEnded(results);
    });
}
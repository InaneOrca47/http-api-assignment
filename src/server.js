const http = require('http');
const responseHandler = require('./responses.js');
const htmlHandler = require('./htmlResponses.js');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

const urlStruct = {
    '/': htmlHandler.getIndex,
    '/style.css': htmlHandler.getCss,
    '/client.js': htmlHandler.getJavascript,
    '/success': responseHandler.getSuccess,
    '/badRequest': responseHandler.getBadRequest,
    '/unauthorized': responseHandler.getUnauthorized,
    '/forbidden': responseHandler.getForbidden,
    '/internal': responseHandler.getInternal,
    '/notImplemented': responseHandler.getNotImplemented,
    index: responseHandler.getNotFound,
}

const onRequest = (request, response) => {
    const protocol = request.connection.encrypted ? 'https' : 'http';
    const parsedUrl = new URL(request.url, `${protocol}://${request.headers.host}`);

    request.query = Object.fromEntries(parsedUrl.searchParams);

    if (request.headers.accept) {
        request.acceptedTypes = request.headers.accept.split(',');
        const handler = urlStruct[parsedUrl.pathname];
        if (handler) {
            return handler(request, response);
        } else {
            return urlStruct.index(request, response);
        }
    }
}

http.createServer(onRequest).listen(port, () => {
    console.log(`Listening on 127.0.0.1: ${port}`);
});
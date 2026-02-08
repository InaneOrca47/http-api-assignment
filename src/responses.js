
const constructJSON = (message, id = null) => {
    if (id === null) {
        return JSON.stringify({ message });
    }
    return JSON.stringify({ message, id });
}

const constructXML = (message, id = null) => {
    if (id === null) {
        return `<response><message>${message}</message></response>`;
    }
    return `<response><message>${message}</message><id>${id}</id></response>`;
}


const respond = (request, response, status, content, type) => {
    response.writeHead(status, {
        'Content-Type': type,
        'Content-Length': Buffer.byteLength(content, 'utf8'),
    });
    console.log(content);
    response.write(content);
    response.end();
};

const checkQuery = (request, response, queryKey, expectedValue) => {
    if (request.query[queryKey]) {
        return request.query[queryKey] === expectedValue;
    } else {
        return false;
    }
}

const getSuccess = (request, response) => {
    let content;
    // if they want xml
    if (request.acceptedTypes[0] === 'text/xml') {
        content = constructXML('This is a successful response.');
        return respond(request, response, 200, content, 'text/xml');
    }

    // otherwise default to json
    content = content = constructJSON('This is a successful response.');
    return respond(request, response, 200, content, 'application/json');
}

const getBadRequest = (request, response) => {
    let content;

    // if they want xml
    if (request.acceptedTypes[0] === 'text/xml') {
        if (checkQuery(request, response, 'valid', 'true')) {
            content = constructXML('This request has the required parameters.');
            return respond(request, response, 200, content, 'text/xml');
        }
        content = constructXML('Missing valid query paramater set to true.', 'Bad Request');
        return respond(request, response, 400, content, 'text/xml');
    }

    // otherwise default to json
    if (checkQuery(request, response, 'valid', 'true')) {
        content = constructJSON('This request has the required parameters.');
        return respond(request, response, 200, content, 'application/json');
    }
    content = constructJSON('Missing valid query paramater set to true.', 'Bad Request');
    return respond(request, response, 400, content, 'application/json');
}

const getUnauthorized = (request, response) => {
    let content;

    // if they want xml
    if (request.acceptedTypes[0] === 'text/xml') {
        if (checkQuery(request, response, 'loggedIn', 'yes')) {
            content = constructXML('You have successfully viewed the content');
            return respond(request, response, 200, content, 'text/xml');
        }
        content = constructXML('Missing loggedIn query parameter set to yes', 'Unauthorized');
        return respond(request, response, 401, content, 'text/xml');
    }

    // otherwise default to json
    if (checkQuery(request, response, 'loggedIn', 'yes')) {
        content = constructJSON('You have successfully viewed the content');
        return respond(request, response, 200, content, 'application/json');
    }
    content = constructJSON('Missing loggedIn query parameter set to yes', 'Unauthorized');
    return respond(request, response, 401, content, 'application/json');
}

const getForbidden = (request, response) => {
    let content;
    // if they want xml
    if (request.acceptedTypes[0] === 'text/xml') {
        content = constructXML('You do not have access to this content', 'Forbidden');
        return respond(request, response, 403, content, 'text/xml');
    }

    // otherwise default to json
    content = constructJSON('You do not have access to this content', 'Forbidden');
    return respond(request, response, 403, content, 'application/json');
}

const getInternal = (request, response) => {
    let content;
    // if they want xml
    if (request.acceptedTypes[0] === 'text/xml') {
        content = constructXML('Internal server error. Something went wrong.', 'Internal Server Error');
        return respond(request, response, 500, content, 'text/xml');
    }

    // otherwise default to json
    content = constructJSON('Internal server error. Something went wrong.', 'Internal Server Error');
    return respond(request, response, 500, content, 'application/json');
}

const getNotImplemented = (request, response) => {
    let content;
    // if they want xml
    if (request.acceptedTypes[0] === 'text/xml') {
        content = constructXML('A request for this page has not been implemented yet. Check later for updated content', 'Not Implemented');
        return respond(request, response, 501, content, 'text/xml');
    }

    // otherwise default to json
    content = constructJSON('A request for this page has not been implemented yet. Check later for updated content', 'Not Implemented');
    return respond(request, response, 501, content, 'application/json');
}

const getNotFound = (request, response) => {
    let content;
    // if they want xml
    if (request.acceptedTypes[0] === 'text/xml') {
        content = constructXML('The page you are looking for was not found', 'Resource Not Found');
        return respond(request, response, 404, content, 'text/xml');
    }

    // otherwise default to json
    content = constructJSON('The page you are looking for was not found', 'Resource Not Found');
    return respond(request, response, 404, content, 'application/json');
}


module.exports = {
    getSuccess,
    getBadRequest,
    getUnauthorized,
    getForbidden,
    getInternal,
    getNotImplemented,
    getNotFound
}
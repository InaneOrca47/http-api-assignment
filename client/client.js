

const handleResponse = (response) => {
    // document
    const content = document.querySelector('#content');

    content.innerHTML = "";
    response.text().then(responseText => {
        content.appendChild(document.createElement('hr'));

        const h1 = document.createElement('h1');
        const p = document.createElement('p');

        const contentType = response.headers.get('Content-Type');

        if (contentType === 'application/json') {
            // JSON parse
            const parsedObj = JSON.parse(responseText);
            h1.innerText = response.status === 200 ? 'Success' : `${parsedObj.id}`;
            p.innerText = `Message: ${parsedObj.message}`;
        } else if (contentType === 'text/xml') {
            // Manual XML parse
            let parsedXML = new window.DOMParser().parseFromString(responseText, 'text/xml');
            h1.innerText = response.status === 200 ? 'Success' : `${parsedXML.querySelector('id').textContent}`;
            p.innerText = `Message: ${parsedXML.querySelector('message').textContent}`;
        }
        

        content.appendChild(h1);
        content.appendChild(p);
    });
};

const sendFetchRequest = async (url, acceptedType) => {
    const response = await fetch(url,
        {
            method: 'GET',
            headers: {
                'Accept': acceptedType,
            }
        });
    handleResponse(response);
};


const init = () => {
    const sendButton = document.querySelector('#send');
    const pageSelect = document.querySelector('#page');
    const typeSelect = document.querySelector('#type');
    sendButton.addEventListener('click', (e) => {
        const pageUrl = pageSelect.value;
        const requestType = typeSelect.value;

        sendFetchRequest(pageUrl, requestType);
    })
}

window.onload = init;

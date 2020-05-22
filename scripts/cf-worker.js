// https://github.com/boynet/cf-GoogleAnalytics-shield-worker
const UrlPrefix = "cfgasw"; // pls replace with random  string
const EndPointScramble = "gallect"; // pls replace with random string
const EndPoint = "collect";
const GAHostname = "www.google-analytics.com";

addEventListener('fetch', event => {
    event.passThroughOnException();
    event.respondWith(handleRequest(event));
})

async function proxy(event) {
    let url = new URL(event.request.url);
    //removing prefix http://example.com/PREFIX/Scramble?v => http://example.com/Scramble?v
    url.pathname = url.pathname.replace("/" + UrlPrefix, '');
    //unscramble => http://example.com/Scramble?v => http://example.com/collect?v
    url.pathname = url.pathname.replace(EndPointScramble, EndPoint);
    url.hostname = GAHostname;
    url.searchParams.set('uip', event.request.headers.get('CF-Connecting-IP'));
    let response = await fetch(url, event.request);
    return response;
}
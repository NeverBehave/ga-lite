// https://github.com/boynet/cf-GoogleAnalytics-shield-worker
// https://github.com/SukkaW/cloudflare-workers-async-google-analytics/blob/master/worker.js

const UrlPrefix = "optical"; // pls replace with random  string
const EndPointScramble = "blog"; // pls replace with random string
const EndPoint = "collect";
const GAHostname = "www.google-analytics.com";
const AllowedReferrer = 'skk.moe';  // ['skk.moe', 'suka.js.org'] multiple domains is supported in array format

addEventListener('fetch', event => {
    event.passThroughOnException();
    event.respondWith(proxy(event));
})

async function proxy(event) {
    const url = new URL(event.request.url);

    const getReqHeader = (key) => event.request.headers.get(key);

    const Referer = getReqHeader('Referer');
    const user_agent = getReqHeader('User-Agent');

    const try_host = () => {	
        try {
            return new URL(Referer).hostname;
        } catch (e) {
            return ""
        }
    };

    const ref_host = try_host()

    let needBlock = false;

    needBlock = (!ref_host || ref_host === '' || !user_agent || !url.search.includes('ga=UA-')) ? true : false;

    if (typeof AllowedReferrer !== 'undefined' && AllowedReferrer !== null && AllowedReferrer) {
      let _AllowedReferrer = AllowedReferrer;

      if (!Array.isArray(AllowedReferrer)) _AllowedReferrer = [_AllowedReferrer];
    
      const rAllowedReferrer = new RegExp(_AllowedReferrer.join('|'), 'g');

      needBlock = (!rAllowedReferrer.test(ref_host)) ? true : false;
      console.log(_AllowedReferrer, rAllowedReferrer, ref_host);
    }

    if (needBlock) {
        return new Response('403 Forbidden', {
            headers: { 'Content-Type': 'text/html' },
            status: 403,
            statusText: 'Forbidden'
        });
    }

    //removing prefix http://example.com/PREFIX/Scramble?v => http://example.com/Scramble?v
    url.pathname = url.pathname.replace("/" + UrlPrefix, '');
    //unscramble => http://example.com/Scramble?v => http://example.com/collect?v
    url.pathname = url.pathname.replace(EndPointScramble, EndPoint);
    url.hostname = GAHostname;
    url.searchParams.set('uip', event.request.headers.get('CF-Connecting-IP'));
    const response = await fetch(url, event.request);
    return response;
}
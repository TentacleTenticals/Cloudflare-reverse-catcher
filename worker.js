export default {
  async fetch(req, env, ctx) {
    const cors = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, HEAD, POST, PUT, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization, Url"
    };

    const cType = req.headers.get('Content-Type');
    const url = req.headers.get('Url');
    const auth = req.headers.get('Authorization');
    const dataType = async () => {
      if(!cType) return;
      if(req.body) switch(cType){
        case 'application/json': return await req.json();
        case 'application/text': return await req.json();
        case 'text/html': return req.text();
        default: return req.text();
      }
    };
    const data = await dataType();

    if(req.method.match(/OPTIONS/)){
      return new Response(null, {headers: {
        "Allow": "GET, HEAD, POST, PUT, OPTIONS",
        ...cors
      }})
    };

    return fetch(url||'https://www.example.com', {
      method: req.method,
      headers: {
        ...(cType) && {'Content-Type': cType},
        ...(auth) && {Authorization: auth}
      },
      ...(data) && {body: data}
    }).then(r => r.json().then(
      res => {
        return Response.json(res, {headers: {...cors}});
      },
      err => {
        return Response.json(err, {headers: {...cors}});
      }
    ))
  },
};

export default {
  async fetch(req, env, ctx) {
    const cors = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, HEAD, POST, PUT, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization, Url, Method, Type"
    };

    const url = req.headers.get('Url') && req.headers.get('Url');
    const method = req.headers.get('Method') && req.headers.get('Method');
    const auth = req.headers.get('Authorization') && req.headers.get('Authorization');
    // const info = req.get('Info') && JSON.parse(req.get('Info'));
    const json = method && method.match(/POST|PUT/) && await req.json();
    // const qq = await req.text();
    // const data = json && new URLSearchParams(json);

    if(req.method.match(/OPTIONS/)){
      return new Response(null, {headers: {
        "Allow": "GET, HEAD, POST, PUT, OPTIONS",
        ...cors
      }})
    };

    // console.log('BODY', req.body);

    // console.log('JSON', json);
    // console.log('Data', data);

    return fetch(url||'https://www.example.com', {
      method: method||'GET',
      headers: {
        // ...cors,
        ...(auth) && {Authorization: auth}
      },
      ...(json) && {body: new URLSearchParams(json)/*JSON.stringify(data)*//*.toString()*/}
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

#  Stocks REST API

A simple REST API that manages stock information.

Source code is contained at [`index.js`](https://github.com/betolabrada/stocks-api/blob/master/index.js)

### Dockerizing PostgREST API

The application connects to a PostgREST endpoint which is containerized using docker-compose with postgres, postgrest and cloudfare as pulled images. Port is exposed using cloudflared service.
Follow the steps on [this repo](https://github.com/cloudflare/postgres-postgrest-cloudflared-example) for more information.

The application communicates with this endpoint via [postgrest-js library](https://supabase.github.io/postgrest-js/)

### Authentication
We have two types of users (admin and anonymous) those with admin role can create and update stock information. Implemented a JWT middleware solution that ensures this.

### Cloudflare Workers + Wrangler

Project was generated using [wrangler](https://github.com/cloudflare/wrangler).

```
wrangler generate projectname https://github.com/cloudflare/worker-template
```

Further documentation for Wrangler can be found [here](https://developers.cloudflare.com/workers/tooling/wrangler).

### Endpoints

GET list of stocks

```
$ curl 'https://stocks-api.albertolabrada99.workers.dev/api/stocks'
```

GET specific stock

```
$ curl 'https://stocks-api.albertolabrada99.workers.dev/api/stocks/<id-of-stock>'
```

POST create new stock (protected with jwt)

```
$ curl 'https://stocks-api.albertolabrada99.workers.dev/api/stocks?accessToken=<accessTokenString>' -X POST -H "Content-Type: application/json" \
-d '{ "ticker": "Ticker", "name": "Microsoft", "price": 143.45, "category": "Technology" }'
```

PUT update stock (protected with jwt)

```
$ curl 'https://stocks-api.albertolabrada99.workers.dev/api/stocks/<id-of-stock>?accessToken=<accessTokenString>' -X POST -H "Content-Type: application/json" \
-d '{ "ticker": "Ticker", "name": "Microsoft", "price": 234.45, "category": "Technology" }'
```

POST login (verify with db). Returns token to access protected requests

```
$ curl 'https://stocks-api.albertolabrada99.workers.dev/api/auth/login' -X POST -H "Content-Type: application/json" \
-d '{ "username": "betolabrada", "password": "betolabrada"'
```

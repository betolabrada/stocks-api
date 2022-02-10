import { PostgrestClient } from '@supabase/postgrest-js'
import { Router } from 'itty-router'
import * as jwt from 'jsonwebtoken'

const client = new PostgrestClient(POSTGREST_ENDPOINT, {
  fetch: (...args) => fetch(...args),
})
const router = Router({ base: '/api' })

// Middleware for route protection
const requireUser = (request) => {
  const { query } = request
  const token = query.accessToken
  if (!token) {
    return new Response('Not Authenticated', { status: 401 })
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET)

    if (!decoded.user) {
      return new Response('Invalid token', { status: 401 })
    }
  } catch (error) {
    return new Response('Error verifying token', { status: 500 })
  }
}

// @route   GET api/stocks
// @desc    Get a list of all stocks
// @access  Public
router.get('/stocks', async () => {
  const { data, error } = await client.from('stocks').select()
  if (error) throw error

  return new Response(JSON.stringify({ stocks: data }), {
      headers: { 'content-type': 'application/json' },
  })
})

// @route   GET api/stocks/:id
// @desc    Get a the stock by id
// @access  Public
router.get('/stocks/:id', async ({ params }) => {
  const { id } = params
  const { data, error } = await client
    .from('stocks')
    .select()
    .eq('id', id)

  if (error) throw error

  const stock = data.length ? data[0] : null

  return new Response(JSON.stringify({ stock }), {
      headers: { 'content-type': 'application/json' },
      status: stock ? 200 : 404
  })
})

// @route   POST api/stocks
// @desc    Add a new stock
// @access  Private
router.post('/stocks', requireUser, async (request) => {
  const stockData = await request.json()

  const { data: stock, error } = await client
    .from('stocks')
    .insert([stockData])

  if (error) throw error

  return new Response(JSON.stringify({ stock }), {
    headers: { 'content-type': 'application/json' },
  })
})


// @route   POST api/auth/login
// @desc    Logs in user
// @access  Public
router.post('/auth/login', async (request) => {
  const { username, password } = await request.json()

  const { data, error } = await client
    .from('users')
    .select()
    .eq('username', username)
    .eq('pass', password)

  if (error) throw error

  const user = data.length ? data[0] : null

  if (!user) {
    return new Response("User Not Found", { status: 401 })
  }

  const payload = {
    user: {
      id: user.id,
    },
  }

  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: 360000 })
  return new Response(JSON.stringify({ token }), { status: 200 })
});


// @route   *
// @desc    Any other route will return Not Found with 404 Status
router.all('*', () => new Response("Not Found", { status: 404 }))

addEventListener('fetch', event => {
  console.log('headers', JSON.stringify(event.request.headers));
  event.respondWith(router.handle(event.request))
})
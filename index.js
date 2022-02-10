import { PostgrestClient } from '@supabase/postgrest-js'
import { Router } from 'itty-router'

const client = new PostgrestClient(POSTGREST_ENDPOINT, {
  fetch: (...args) => fetch(...args),
})
const router = Router({ base: '/api' })

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
router.post('/stocks', async (request) => {
  const stockData = await request.json()

  const { data: stock, error } = await client
    .from('stocks')
    .insert([stockData])

  if (error) throw error

  return new Response(JSON.stringify({ stock }), {
    headers: { 'content-type': 'application/json' },
  })
})


// @route   *
// @desc    Any other route will return Not Found with 404 Status
router.all('*', () => new Response("Not Found", { status: 404 }))

addEventListener('fetch', event => {
  event.respondWith(router.handle(event.request))
})
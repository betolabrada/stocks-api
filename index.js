import { PostgrestClient } from '@supabase/postgrest-js'

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})
/**
 * Respond with hello worker text
 * @param {Request} request
 */
async function handleRequest(request) {
  const client = new PostgrestClient(POSTGREST_ENDPOINT, {
    fetch: (...args) => fetch(...args),
  })
  const { data, error } = await client
    .from('users')
    .select()

  return new Response(JSON.stringify(data), {
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

import { getSession } from './_session.js'

export default function handler(req, res) {
  const session = getSession(req)
  res.setHeader('Content-Type', 'application/json')
  res.statusCode = session ? 200 : 401
  res.end(JSON.stringify(session || { error: 'not signed in' }))
}

const API_BASE = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8080'

async function request(path, { method = 'GET', body, headers = {}, ...opts } = {}) {
  const url = `${API_BASE}${path}`
  const init = {
    method,
    credentials: 'include', // always include cookies
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    ...opts,
  }

  if (body !== undefined) init.body = JSON.stringify(body)

  const res = await fetch(url, init)
  const text = await res.text()
  let data
  try { data = text ? JSON.parse(text) : {} } catch (e) { data = { raw: text } }

  if (!res.ok) {
    const err = new Error(data.message || 'Request failed')
    err.status = res.status
    err.data = data
    throw err
  }

  return data
}

export default request

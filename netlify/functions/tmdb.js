exports.handler = async (event) => {
  try {
    const path = (event.queryStringParameters && event.queryStringParameters.path) || '';
    if (!path) {
      return { statusCode: 400, body: JSON.stringify({ error: 'Missing path' }) };
    }

    const baseUrl = 'https://api.themoviedb.org/3/';
    const url = `${baseUrl}${path}${path.includes('?') ? '&' : '?'}api_key=${process.env.TMDB_API_KEY}`;

    const response = await fetch(url, { headers: { 'Accept': 'application/json' } });
    const body = await response.text();

    return {
      statusCode: response.status,
      headers: { 'Content-Type': 'application/json' },
      body
    };
  } catch (error) {
    return { statusCode: 500, body: JSON.stringify({ error: 'TMDB proxy failed' }) };
  }
};



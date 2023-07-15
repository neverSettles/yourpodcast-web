// This is /pages/api/proxy.js

import fetch from 'node-fetch';

export default async (req: any, res: any) => {
  const { query } = req;

  // Build your external API URL with the necessary query parameters
  const url = new URL('https://podcast-be-production.up.railway.app/generate');
  Object.keys(query).forEach(key => url.searchParams.append(key, query[key]));

  try {
    const response = await fetch(url, {
      method: req.method,
      headers: {
        'Content-Type': 'application/json',
        // 'Content-Type': 'audio/mpeg'
        // Additional headers if needed
      },
      // Send the request body, if any
      body: req.method === 'POST' ? JSON.stringify(req.body) : undefined,
    });

    console.log(response);

    if (!response.ok) {
        // If the server responded with a non-OK status, copy that status onto our response to the client
        res.status(response.status);
        res.end();
        return;
      }

    const data = await response.blob();

    // Send the data back to the client
    // res.status(200).json(data);
    if (response.body) response.body.pipe(res);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error contacting external API' });
  }
};

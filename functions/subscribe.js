const qs = require('querystring');
const fetch = require('node-fetch');

exports.handler = async (event) => {
  const { firstName, email } = qs.parse(event.body);

  const response = await fetch(
    `https://api.convertkit.com/v3/forms/${process.env.CK_FORM_ID}/subscribe`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        api_key: process.env.CK_API_KEY,
        first_name: firstName,
        email,
      }),
    }
  )
    .then((res) => res.json())
    .catch((err) => console.error(err));

  if (!response.subscription) {
    return {
      statusCode: 500,
      body: 'there was an error',
    };
  }

  return {
    statusCode: 301,
    headers: {
      Location: '/success.html',
    },
    body: 'Redirecting...',
  };
};

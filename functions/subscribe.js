const qs = require('querystring');
const fetch = require('node-fetch');

const FORM_ID = process.env.CK_FORM_ID;
const API_KEY = process.env.CK_API_KEY;

exports.handler = async event => {
  const { first_name, email } = qs.parse(event.body);

  const response = await fetch(
    `https://api.convertkit.com/v3/forms/${FORM_ID}/subscribe`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        api_key: API_KEY,
        first_name,
        email,
      }),
    },
  )
    .then(res => res.json())
    .catch(err => console.error(err));

  if (!response.subscription) {
    console.log(response);
    return {
      statusCode: 500,
      body: 'there was an error with your subscription',
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

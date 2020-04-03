const qs = require('querystring');
const fetch = require('node-fetch');

exports.handler = async event => {
  const { value } = qs.parse(event.body);
  const response = await fetch('https://graphql.fauna.com/graphql', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.FAUNA_API_KEY}`,
    },
    body: JSON.stringify({
      query: `
        mutation ($value: String!) {
          createVote(data: {
            value: $value
          }) {
            value
          }
        }
      `,
      variables: { value },
    }),
  })
    .then(res => res.json())
    .catch(err => console.error(err));

  if (!response.data) {
    return {
      statusCode: 500,
      body: 'There was an error loading votes.',
    };
  }

  return {
    statusCode: 301,
    headers: {
      Location: '/vote.html?voted=true',
    },
    body: 'success',
  };
};

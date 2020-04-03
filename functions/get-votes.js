const fetch = require('node-fetch');

exports.handler = async () => {
  const response = await fetch('https://graphql.fauna.com/graphql', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.FAUNA_API_KEY}`,
    },
    body: JSON.stringify({
      query: `
        query {
          votes {
            data {
              value
            }
          }
        }
      `,
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

  // get a count of votes for each value
  const votes = new Map();
  response.data.votes.data.forEach(({ value }) => {
    const currentCount = votes.has(value) ? votes.get(value).votes : 0;

    votes.set(value, { value, votes: currentCount + 1 });
  });

  return {
    statusCode: 200,
    body: JSON.stringify(Array.from(votes.values())),
  };
};

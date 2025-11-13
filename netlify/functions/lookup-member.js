// File: netlify/functions/lookup-member.js
import pg from 'pg';
const { Client } = pg;

export default async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const client = new Client({
    connectionString: process.env.NETLIFY_DATABASE_URL_UNPOOLED,
  });

  try {
    const { email } = JSON.parse(event.body);
    if (!email) {
      return { statusCode: 400, body: JSON.stringify({ error: "Email is required" })};
    }

    const emailKey = email.toLowerCase();
    await client.connect();

    const query = `
      SELECT membership_data 
      FROM memberships 
      WHERE email = $1;
    `;
    const values = [emailKey];

    const result = await client.query(query, values);

    if (result.rows.length === 0) {
      return { 
        statusCode: 404, 
        body: JSON.stringify({ error: "No membership found for this email" })
      };
    }

    // Return the JSON data stored in the database
    return {
      statusCode: 200,
      body: JSON.stringify(result.rows[0].membership_data) 
    };

  } catch (error) {
    return { 
      statusCode: 500, 
      body: JSON.stringify({ error: "Failed to lookup member", details: error.message }) 
    };
  } finally {
    await client.end();
  }
};

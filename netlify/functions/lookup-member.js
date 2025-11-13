// File: netlify/functions/lookup-member.js
import pg from 'pg';
const { Client } = pg;

export default async (event) => {
  if (event.httpMethod !== 'POST') {
    return new Response("Method Not Allowed", { status: 405 });
  }

  const client = new Client({
    connectionString: process.env.NETLIFY_DATABASE_URL_UNPOOLED,
  });

  try {
    const { email } = JSON.parse(event.body);
    if (!email) {
      return new Response(
        JSON.stringify({ error: "Email is required" }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
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
      return new Response(
        JSON.stringify({ error: "No membership found for this email" }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Return the membership data
    return new Response(
      JSON.stringify(result.rows[0].membership_data),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Failed to lookup member", details: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  } finally {
    await client.end();
  }
};

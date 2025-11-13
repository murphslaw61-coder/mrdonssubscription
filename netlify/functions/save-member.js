// File: netlify/functions/save-member.js
import pg from 'pg';
const { Client } = pg;

// Helper function to create table if it doesn't exist
async function createTable(client) {
  await client.query(`
    CREATE TABLE IF NOT EXISTS memberships (
      email VARCHAR(255) PRIMARY KEY,
      membership_data JSONB
    );
  `);
}

export default async (event) => {
  if (event.httpMethod !== 'POST') {
    return new Response("Method Not Allowed", { status: 405 });
  }

  const client = new Client({
    connectionString: process.env.NETLIFY_DATABASE_URL_UNPOOLED, 
  });

  try {
    const membershipData = JSON.parse(event.body);
    const emailKey = membershipData.email.toLowerCase();
    
    await client.connect();
    await createTable(client);

    const query = `
      INSERT INTO memberships (email, membership_data) 
      VALUES ($1, $2)
      ON CONFLICT (email) 
      DO UPDATE SET membership_data = $2;
    `;
    const values = [emailKey, JSON.stringify(membershipData)];
    
    await client.query(query, values);

    return new Response(
      JSON.stringify({ message: "Member saved successfully" }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Failed to save member", details: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  } finally {
    await client.end();
  }
};

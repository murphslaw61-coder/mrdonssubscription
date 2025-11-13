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
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  // Use the _UNPOOLED_ URL for a quick, serverless function
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
    // We store the whole object as a JSON string in a single column
    const values = [emailKey, JSON.stringify(membershipData)];
    
    await client.query(query, values);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Member saved successfully" })
    };

  } catch (error) {
    return { 
      statusCode: 500, 
      body: JSON.stringify({ error: "Failed to save member", details: error.message }) 
    };
  } finally {
    // Ensure the connection is always closed
    await client.end();
  }
};

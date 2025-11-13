// File: netlify/functions/save-member.js
const { Client } = require('pg');

async function createTable(client) {
  await client.query(`
    CREATE TABLE IF NOT EXISTS memberships (
      email VARCHAR(255) PRIMARY KEY,
      membership_data JSONB
    );
  `);
}

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
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
    await client.end();
  }
};

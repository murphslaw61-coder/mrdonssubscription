// File: netlify/functions/save-member.js
import { neon } from '@netlify/neon';

// Helper function to create table if it doesn't exist
// This is safe to run every time.
async function createTable(sql) {
  await sql`
    CREATE TABLE IF NOT EXISTS memberships (
      email VARCHAR(255) PRIMARY KEY,
      membership_data JSONB
    );
  `;
}

export default async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const membershipData = JSON.parse(event.body);
    const emailKey = membershipData.email.toLowerCase();
    
    // Get the SQL connection
    const sql = neon(process.env.NETLIFY_DATABASE_URL);

    // Make sure the table exists
    await createTable(sql);

    // Save the data
    // We use JSON.stringify to store the whole object in a single JSONB column
    await sql`
      INSERT INTO memberships (email, membership_data) 
      VALUES (${emailKey}, ${JSON.stringify(membershipData)})
      ON CONFLICT (email) 
      DO UPDATE SET membership_data = ${JSON.stringify(membershipData)};
    `;

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Member saved successfully" })
    };

  } catch (error) {
    return { 
      statusCode: 500, 
      body: JSON.stringify({ error: "Failed to save member", details: error.message }) 
    };
  }
};

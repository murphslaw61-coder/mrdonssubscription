// File: netlify/functions/lookup-member.js
import { neon } from '@netlify/neon';

export default async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { email } = JSON.parse(event.body);
    if (!email) {
      return { statusCode: 400, body: JSON.stringify({ error: "Email is required" })};
    }

    const emailKey = email.toLowerCase();
    const sql = neon(process.env.NETLIFY_DATABASE_URL);

    // Get the data using the email key
    // We select the 'membership_data' column which contains our JSON object
    const result = await sql`
      SELECT membership_data 
      FROM memberships 
      WHERE email = ${emailKey};
    `;

    if (result.length === 0) {
      return { 
        statusCode: 404, 
        body: JSON.stringify({ error: "No membership found for this email" })
      };
    }

    // Return the membership data
    // result[0].membership_data is the JSON object we stored
    return {
      statusCode: 200,
      body: JSON.stringify(result[0].membership_data) 
    };

  } catch (error) {
    return { 
      statusCode: 500, 
      body: JSON.stringify({ error: "Failed to lookup member", details: error.message }) 
    };
  }
};

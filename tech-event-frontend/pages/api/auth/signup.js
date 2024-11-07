import db from '../../../lib/db'; 

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { email, password, interests } = req.body;

    // Validate the request body
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    try {
      // Save the user to the database (you should hash the password in production!)
      const user = { email, password, interests };
      await db.collection('users').insertOne(user); // Assuming MongoDB is being used

      return res.status(201).json({ message: 'User created successfully.' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  } else {
    // Handle unsupported methods
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

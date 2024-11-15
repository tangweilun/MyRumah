import { NextApiRequest, NextApiResponse } from 'next';
import { clerkClient } from '@clerk/nextjs/server';
import { User } from '@/lib/data';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    const user: User = req.body;

    try {
      const client = await clerkClient();
      const createdUser = await client.users.createUser({
        username: user.username,
        password: user.password,
        phoneNumber: [user.phoneNumber],
        emailAddress: [user.email],
        publicMetadata: { role: 'teacher' },
      });

      return res.status(200).json({ success: true });
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

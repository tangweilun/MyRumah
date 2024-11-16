import { PrismaClient } from '@prisma/client';

// Note: need generate the prisma client first
// command is: npx prisma generate

const prisma = new PrismaClient();
export default prisma;

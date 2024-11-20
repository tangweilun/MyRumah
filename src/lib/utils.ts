import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
// import bcrypt from 'bcrypt';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// // Function to hash a password
// export async function hashPassword(password: string): Promise<string> {
//   const salt = await bcrypt.genSalt(10);
//   const hashedPassword = await bcrypt.hash(password, salt);
//   return hashedPassword;
// }

// // Function to verify a password
// export async function verifyPassword(
//   password: string,
//   hashedPassword: string
// ): Promise<boolean> {
//   return await bcrypt.compare(password, hashedPassword);
// }

export const propertyImage = [
  { id: 1, url: '/propertyImage1.jpeg' },
  { id: 2, url: '/propertyImage2.jpeg' },
  { id: 3, url: '/propertyImage3.jpeg' },
  { id: 4, url: '/propertyImage1.jpeg' },
];

export enum UserRole {
  Tenant = 'tenant',
  Owner = 'owner',
}

export type User = {
  email: string;
  username: string;
  password: string;
  phoneNumber: string;
};

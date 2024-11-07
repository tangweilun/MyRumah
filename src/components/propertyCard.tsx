import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { BellRing } from 'lucide-react';
import { Button } from './ui/button';

const properties = [
  {
    title: 'Modern Apartment in Downtown',
    description:
      '2 bedrooms, 1 bathroom, fully furnished, with a city view. $1,200/month',
    image:
      'https://www.google.com/url?sa=i&url=https%3A%2F%2Fmickeyclub.fandom.com%2Fwiki%2FThe_Clubhouse&psig=AOvVaw3devkwxsiCdwAAAOZkTBVy&ust=1731049166837000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCJim2ejSyYkDFQAAAAAdAAAAABAE',
  },
  {
    title: 'Cozy Family Home',
    description:
      '3 bedrooms, 2 bathrooms, pet-friendly, with a spacious backyard. $1,800/month',
    image:
      'https://www.google.com/url?sa=i&url=https%3A%2F%2Fmickeyclub.fandom.com%2Fwiki%2FThe_Clubhouse&psig=AOvVaw3devkwxsiCdwAAAOZkTBVy&ust=1731049166837000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCJim2ejSyYkDFQAAAAAdAAAAABAE',
  },
  {
    title: 'Studio Apartment Near Campus',
    description:
      '1 bedroom, 1 bathroom, close to public transport and amenities. $900/month',
    image:
      'https://www.google.com/url?sa=i&url=https%3A%2F%2Fmickeyclub.fandom.com%2Fwiki%2FThe_Clubhouse&psig=AOvVaw3devkwxsiCdwAAAOZkTBVy&ust=1731049166837000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCJim2ejSyYkDFQAAAAAdAAAAABAE',
  },
  {
    title: 'Luxury Condo with Sea View',
    description:
      '2 bedrooms, 2 bathrooms, access to pool and gym. $2,500/month',
    image:
      'https://www.google.com/url?sa=i&url=https%3A%2F%2Fmickeyclub.fandom.com%2Fwiki%2FThe_Clubhouse&psig=AOvVaw3devkwxsiCdwAAAOZkTBVy&ust=1731049166837000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCJim2ejSyYkDFQAAAAAdAAAAABAE',
  },
  {
    title: 'Affordable Room in Shared House',
    description:
      '1 bedroom, shared bathroom and kitchen. Ideal for students. $600/month',
    image:
      'https://www.google.com/url?sa=i&url=https%3A%2F%2Fmickeyclub.fandom.com%2Fwiki%2FThe_Clubhouse&psig=AOvVaw3devkwxsiCdwAAAOZkTBVy&ust=1731049166837000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCJim2ejSyYkDFQAAAAAdAAAAABAE',
  },
];

type CardProps = React.ComponentProps<typeof Card>;

export function CardDemo({ className, ...props }: CardProps) {
  return (
    <Card className={cn('w-[380px]', className)} {...props}>
      <CardHeader>
        <CardTitle>Notifications</CardTitle>
        <CardDescription>You have 3 unread messages.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className=" flex items-center space-x-4 rounded-md border p-4">
          <BellRing />
          <div className="flex-1 space-y-1">
            <p className="text-sm font-medium leading-none">
              Push Notifications
            </p>
            <p className="text-sm text-muted-foreground">
              Send notifications to device.
            </p>
          </div>
        </div>
        <div>
          {properties.map((property, index) => (
            <div
              key={index}
              className="mb-4 grid grid-cols-[25px_1fr] items-start pb-4 last:mb-0 last:pb-0"
            >
              <span className="flex h-2 w-2 translate-y-1 rounded-full bg-sky-500" />
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">
                  {property.title}
                </p>
                <p className="text-sm text-muted-foreground">
                  {property.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full"></Button>
      </CardFooter>
    </Card>
  );
}

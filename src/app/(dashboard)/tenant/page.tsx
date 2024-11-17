'use client';

import { MapPin } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useSession } from 'next-auth/react';

const TenantPage = () => {
  const { data: session, status } = useSession();

  return (
    <div>
      <h1>Tenant</h1>
      <h1>{status}</h1>
      <pre>{JSON.stringify(session, null, 2)}</pre>
    </div>
  );
};

export default TenantPage;

import { getSession } from '@/lib/getSession';
import { redirect } from 'next/navigation';

const Guest = async () => {
  const session = await getSession();
  if (session?.user?.role === 'tenant') {
    redirect('/tenant');
  } else if (session?.user?.role === 'owner') {
    redirect('/owner');
  } else {
    redirect('/');
  }
  return <div className="">Guest</div>;
};

export default Guest;

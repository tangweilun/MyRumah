import Navbar from '@/components/Navbar';
import Image from 'next/image';

const PropertyPage = () => {
  return (
    <div>
      <Navbar></Navbar>
      <div className="bg-green-100 w-screen py-16">
        <div className="flex">
          <div className="w-1/2 px-5">
            <Image
              src="/image.png"
              width={500}
              height={500}
              alt="Picture of the author"
            />
          </div>
          <div className="w-1/2 px-5">
            <h3 className="text-2xl font-bold text-green-900 mb-4">
              Modern Apartment 1
            </h3>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyPage;

import Navbar from "@/components/Navbar";
import LocationSearch from "@/components/LocationSearch";
import PropertyGrid from "@/components/propertyGrid";

export default function Home() {
  const [formData, setFormData] = useState<PropertyInfo>({
    ownerId: 0,
    address: '',
    description: '',
    occupant_num: 0,
    rental_fee: 0,
    startDate: '',
    endDate: '',
    status: 'active',
    image: null,
  });

  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [properties, setProperties] = useState<PropertyInfo[]>([]); // State to hold the list of properties
  console.log(properties);
  // Handle input changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFormData((prev) => ({
        ...prev,
        image: file,
      }));
      setPreviewImage(URL.createObjectURL(file)); // Generate image preview
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Ensure ownerId, occupantNum, and rentalFee are numbers
    const ownerId = Number(formData.ownerId);
    const occupantNum = Number(formData.occupant_num);
    const rentalFee = Number(formData.rental_fee);

    // Create the propertyData object with the expected structure
    const propertyData = {
      ownerId,
      address: formData.address,
      description: formData.description,
      occupantNum,
      rentalFee,
      startDate: formData.startDate,
      endDate: formData.endDate,
      status: formData.status,
    };

    if (formData.image) {
      // Convert the image to base64 string
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64Image = reader.result as string;

        // Add the image as a base64 string to the propertyData
        const dataToSend = {
          ...propertyData,
          image: base64Image, // Include the image as base64 string
        };

        try {
          const response = await fetch('/api/property', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(dataToSend), // Send JSON data
          });

          const result = await response.json();
          if (response.status === 200) {
            console.log('Property created successfully:', result);
            // Reset form or show success message here
            setProperties((prev) => [...prev, result.property]); // Add the new property to the list
          } else {
            console.error('Error creating property:', result.message);
          }
        } catch (error) {
          console.error('Error submitting property:', error);
        }
      };
      reader.readAsDataURL(formData.image); // Convert the image to base64
    }
  };

  // Fetch all properties when the component mounts
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await fetch('/api/property');
        const result = await response.json();
        console.log(result.properties[0].occupant_num);
        if (response.status === 200) {
          // console.log(properties);
          setProperties(result.properties); // Update state with the fetched properties
        } else {
          console.error('Error fetching properties:', result.message);
        }
      } catch (error) {
        console.error('Error fetching properties:', error);
      }
    };

    fetchProperties();
  }, []);

  return (
    <div className="bg-gradient-to-b from-stone-50 to-stone-100">
      <Navbar />
      {/* Hero section with search */}
      <div className="bg-green-100 py-8 md:py-16 lg:py-16">
        <div className="max-w-xl mx-auto px-4">
          <h1 className="text-4xl font-bold text-green-900 mb-4 text-center md:text-5xl">
            Explore Decentralized Rentals with MyRumah
          </h1>
          <p className="text-xl text-green-700 mb-8 text-center md:text-2xl">
            Discover trusted rentals powered by blockchain technology for
            transparent, secure, and hassle-free agreements.
          </p>
          <div className="flex flex-col md:flex-row shadow-lg rounded-lg overflow-hidden bg-white">
            <LocationSearch></LocationSearch>
          </div>
        </div>
      </div>
      {/* Properties listing */}
      <div>
        <PropertyGrid />
      </div>
    </div>
  );
}

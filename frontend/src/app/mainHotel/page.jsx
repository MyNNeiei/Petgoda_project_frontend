import Image from 'next/image';
import Link from 'next/link';

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-gray-900 text-white p-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold">🐾 PetStay</span>
        </div>
        <div className="flex gap-4">
          <Link href="/" className="hover:text-yellow-400">Home</Link>
          <Link href="/dashboard" className="hover:text-yellow-400">Dashboard</Link>
          <Link href="/booking-schedule" className="hover:text-yellow-400">Booking Schedule</Link>
          <Link href="/settings" className="hover:text-yellow-400">Settings</Link>
        </div>
      </nav>

      <div className="p-8">
        <h1 className="text-2xl font-bold mb-6">Your Hotels</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 justify-center">
          {hotels.map((hotel, index) => (
            <div key={index} className="bg-cream rounded-lg shadow-lg p-4">
              <Image
                src={hotel.image}
                alt={hotel.name}
                width={400}
                height={300}
                className="rounded-lg object-cover"
              />
              <h2 className="text-lg font-semibold mt-4">{hotel.name}</h2>
              <p className="text-blue-500 text-sm">{hotel.location}</p>
              <p className="mt-2">Occupancy Rate: {hotel.occupancy}%</p>
              <p>Guest Reviews: {hotel.reviews}/5</p>
              <button className="mt-4 bg-black text-white py-2 px-4 rounded hover:bg-gray-800">
                View Details
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const hotels = [
  {
    name: 'Hotel Bella Vista',
    location: 'New York, USA',
    image: '/pethotel1.jpg',
    occupancy: 85,
    reviews: 4.5,
  },
  {
    name: 'Oceanview Resort',
    location: 'Miami, USA',
    image: '/pethotel1.jpg',
    occupancy: 78,
    reviews: 4.7,
  },
  {
    name: 'Mountain Lodge',
    location: 'Aspen, USA',
    image: '/pethotel1.jpg',
    occupancy: 92,
    reviews: 4.6,
  },
  {
    name: 'Mountain Lodge',
    location: 'Aspen, USA',
    image: '/pethotel1.jpg',
    occupancy: 92,
    reviews: 4.6,
  },
];
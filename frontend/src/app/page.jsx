import Image from "next/image";
import Footer from "@/components/ui/footer";


export default function Home() {
  return (
    <div className="min-h-screen">
      <div className="bg-[#D2C8BC] px-4 py-10 w-100 mx-auto">
        <span className="flex flex-rows items-center justify-center py-5 mt-10">
          <h1 className="text-7xl font-bold text-center mb-8">Hotel</h1>
          <h1 className="text-[#886551] text-7xl font-bold text-center mb-8">, For Your Love</h1>
        </span>
        <div className="flex justify-center mt-10 space-x-4 mb-[-213px]">
          <Image src="/pngegg.png" alt="Dog" width={1200} height={600} className="h-auto" />
        </div>
      </div>
      <div className="my-20">
        <h1 className="text-5xl font-bold text-center mb-8">How It Works</h1>
        <div className="flex flex-rows justify-center">
          <Image src="/tin.svg" alt="Dog" width={50} height={50} className="h-auto" />
          <Image src="/line.svg" alt="line" width={500} height={50} className="h-auto" />
          <Image src="/tin.svg" alt="Dog" width={50} height={50} className="h-auto" />
          <Image src="/line.svg" alt="line" width={500} height={50} className="h-auto" />
          <Image src="/tin.svg" alt="Dog" width={50} height={50} className="h-auto" />
        </div>
        <div className="grid grid-cols-3 place-items-center gap-2">
          <div className="w-1/2">
            <h3 className="text-center font-semibold text-[#262721]">Booking Services</h3>
            <p>- Select accommodations, dates, and services for your pet. <br />
              - Provide necessary details (dietary needs, special care).</p>
          </div>
          <div className="w-1/2">
            <h3 className="text-center font-semibold text-[#262721]">Select a location near your home</h3>
            <p>They will find the nearest and highest-quality pet hotels for you.</p>
          </div>
          <div className="w-1/2">
            <h3 className="text-center font-semibold text-[#262721]">Tracking Pet Stay</h3>
            <p>Check live updates, photos, or camera feeds if available.</p>
          </div>
        </div>
        <div className="my-20 px-20">
          <div className="grid grid-cols-2 gap-2">
            <div className="flex flex-col">
              <span className="flex flex-rows items-start justify-start">
                <h1 className="text-5xl font-bold text-start">ABOUT</h1>
                <Image
                  src="/logo-petloga1.svg" alt="Petgoda Logo" width={200} height={200} priority
                  className="h-[90px] w-auto mx-5 mt-[-30px]"
                />
              </span>
              <p className="1/4">
                We love pets, and we believe loving pets makes us better people. That’s one of the many reasons we do Anything for Pets – because they will do anything for us. Anything for Pets is our commitment to pet parents, it’s how we do business and who we are as pet lovers. As the leader in pet care, we make our decisions based on how we can bring pet parents closer to their pets.

                From dressing in matching costumes, to finding the perfect treats and toys, we innovate solutions and unique, must-have products to create more ways for pets to be a part of our everyday lives.

                Our trusted and skilled associates share the same passion for pets as the pet parents we serve, helping pet parents choose from our offering of the largest variety of pet products and services in one convenient place – in your neighborhood or the palm of your hand. With more than 1,660 locations in North America, we pride ourselves on our unrivaled variety of pet food, treats, toys, and apparel, as well as our services including training, grooming, boarding and more.

                <br />
                When you need to be away, Petgoda makes pet boarding easy with comfortable accommodations and activities that give your dog or cat a fun getaway for overnight or longer. PetsHotel offers dogs and cats of every age and stage of life a safe, comfortable home away from home. It's the perfect pet hotel to board your pets with Standard Guest Rooms where dogs can bunk with buddies, Private Suites and Kitty Cottages for your favorite felines.

                Our PetsHotel includes on-site care plus twice-daily exercise walks for dogs and unlimited potty breaks. Cats enjoy daily individual playtime and complimentary calming pheromones. Bring your dog or cat's food and treats from home. Medication dispensing services are also available.

                If your pet needs grooming services while they're with us, we can help facilitate that, too so they'll be well cared for and looking their best when it's time to go home.

                For special offers, more information on our pet boarding services or to book your pet's stay at a Petgoda PetsHotel, find the store nearest you.

                *Select locations. Pet age, health & vaccination requirements apply. Subject to availability. Prices may vary. Overnight hotel host may not available in some locations. Breed restrictions apply. At the sole discretion of Petgoda, some pets may not be permitted.
              </p>
            </div>
            <div className="flex items-center justify-center">
              <Image src="/pngegg(3).png" alt="Petgoda Logo" width={200} height={200} priority
                className="h-[700px] w-auto mx-5 mt-[-30px]"></Image>
            </div>

          </div>
        </div>
        <div className="my-20 px-20">
          <h1 className="text-5xl font-bold text-start">Recommend</h1>
          <div className="my-10">
            <div className="max-w-sm bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-[#2A1D16] dark:border-[#2A1D16]">
              <a href="#">
                <img className="rounded-t-lg" src="/docs/images/blog/image-1.jpg" alt="" />
              </a>
              <div class="p-5">
                <a href="#">
                  <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Noteworthy technology acquisitions 2021</h5>
                </a>
                <p className="mb-3 font-normal text-[#886551]">Here are the biggest enterprise technology acquisitions of 2021 so far, in reverse chronological order.</p>
                <a href="#" class="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-[#886551] bg-[#D2C8BC] rounded-lg hover:bg-[#D2C8BC] focus:ring-4 focus:outline-none">
                  See more
                  <svg className="rtl:rotate-180 w-3.5 h-3.5 ms-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5h12m0 0L9 1m4 4L9 9" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
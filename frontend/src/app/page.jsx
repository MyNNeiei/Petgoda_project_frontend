import Image from "next/image"
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
        <div className="">

        </div>
      </div>
    </div>
  )
}
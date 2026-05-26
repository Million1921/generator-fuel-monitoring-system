import { SignUp } from '@clerk/nextjs'
import Image from 'next/image'

export default function Page() {
  return (
    <div className="flex min-h-screen w-full bg-white">
      {/* Left side - Login Form */}
      <div className="flex w-full flex-col justify-center px-4 py-12 sm:px-6 lg:w-1/2 lg:px-8 xl:w-[45%]">
        <div className="mx-auto w-full max-w-sm lg:max-w-md flex flex-col items-center">
          <div className="mb-10 w-full flex justify-center">
            <Image 
              src="/ethio_logo_full.png" 
              alt="Ethio Telecom Logo" 
              width={250} 
              height={80} 
              className="object-contain"
              priority
            />
          </div>
          
          <div className="w-full">
            <SignUp 
              routing="hash" 
              appearance={{
                elements: {
                  rootBox: "w-full mx-auto",
                  card: "shadow-none p-0 bg-transparent w-full",
                  headerTitle: "hidden", 
                  headerSubtitle: "text-gray-500 text-center mb-6 text-[15px]",
                  formButtonPrimary: "bg-[#8cc63f] hover:bg-[#7ab130] text-white py-2.5 rounded-md font-bold text-[15px] shadow-sm",
                  formFieldInput: "bg-[#f4f7fb] border-gray-200 py-2.5 focus:border-[#8cc63f] focus:ring-[#8cc63f]",
                  formFieldLabel: "text-gray-700 font-medium text-sm",
                  dividerLine: "bg-gray-200",
                  dividerText: "text-gray-400",
                  socialButtonsBlockButton: "border-gray-200 text-gray-600 hover:bg-gray-50",
                  footerActionLink: "text-[#8cc63f] hover:text-[#7ab130]"
                }
              }}
            />
          </div>
        </div>
      </div>
      
      {/* Right side - Hero Image */}
      <div className="hidden lg:block lg:w-1/2 xl:w-[55%] relative h-screen">
        <Image 
          src="/login-hero.png"
          alt="Generator Fuel Monitoring"
          fill
          priority
          className="object-cover"
        />
      </div>
    </div>
  )
}

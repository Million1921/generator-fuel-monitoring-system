import { LoginForm } from "@/features/auth/components/login-form"

export default function LoginPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-[360px] flex flex-col gap-8">
            <div className="flex justify-start">
              <img src="/ethio_logo_full.png" alt="ethio telecom" className="h-16 w-auto object-contain" />
            </div>
            <LoginForm />
          </div>
        </div>
      </div>
      <div className="relative hidden bg-zinc-950 lg:block">
        <img
          src="/Logo.png"
          alt="Login Background"
          className="absolute inset-0 h-full w-full object-cover"
        />
      </div>
    </div>
  )
}

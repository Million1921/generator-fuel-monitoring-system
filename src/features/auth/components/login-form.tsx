"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { signIn } from "@/lib/auth-client"

import { toast } from "sonner"
import * as React from "react"

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const [isLoading, setIsLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    
    const formData = new FormData(e.currentTarget)
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    try {
      const result = await signIn.email({
        email,
        password,
      })

      if (result.error) {
        setIsLoading(false)
        const errorMsg = result.error.message || "Invalid email or password"
        setError(errorMsg)
        toast.error(errorMsg)
        return
      }

      // Success - full page redirect so server components fetch fresh data
      window.location.href = "/dashboard"
    } catch (error: any) {
      setIsLoading(false)
      const errorMsg = error?.message || "Invalid email or password. Please try again."
      setError(errorMsg)
      toast.error(errorMsg)
    }
  }

  return (
    <form 
      className={cn("flex flex-col gap-6 ml-5", className)} 
      onSubmit={handleSubmit}
      {...props}
    >
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <p className="text-sm text-balance text-muted-foreground">
            Enter your email below to login to your account
          </p>
        </div>
        {error && (
          <div className="rounded-md bg-red-50 border border-red-200 p-3 text-sm text-red-600">
            {error}
          </div>
        )}
        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input id="email" name="email" type="email" placeholder="m@example.com" required />
        </Field>
        <Field>
          <div className="flex items-center">
            <FieldLabel htmlFor="password">Password</FieldLabel>
          </div>
          <Input id="password" name="password" type="password" required />
        </Field>
        <Field>
          <Button type="submit" className="w-full bg-lime-500 hover:bg-lime-600 text-white font-bold uppercase tracking-tight" disabled={isLoading}>
            {isLoading ? "SIGNING IN..." : "SIGN IN"}
          </Button>
        </Field>
      </FieldGroup>
    </form>
  )
}

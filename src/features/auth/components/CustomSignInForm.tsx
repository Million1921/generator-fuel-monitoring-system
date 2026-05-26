"use client"

import { useSignIn } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import * as React from 'react'

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"

export function CustomSignInForm({ className, ...props }: React.ComponentProps<"form">) {
  const { isLoaded, signIn, setActive } = useSignIn()
  const [emailAddress, setEmailAddress] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [error, setError] = React.useState('')
  const [isLoading, setIsLoading] = React.useState(false)
  const router = useRouter()

  if (!isLoaded) {
    return null
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      if (!signIn || !setActive) return;

      const result = await signIn.create({
        identifier: emailAddress,
        password,
      })

      if (result.status === 'complete') {
        await setActive({ session: result.createdSessionId })
        router.push('/dashboard')
      } else {
        console.error(result)
        setError('Invalid email or password')
        setIsLoading(false)
      }
    } catch (err: any) {
      console.error(err)
      setError(err.errors?.[0]?.message || 'Invalid email or password')
      setIsLoading(false)
    }
  }

  return (
    <form className={cn("flex flex-col gap-6", className)} onSubmit={submit} {...props}>
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <p className="text-sm text-balance text-gray-500 mb-2">
            Enter your email below to login to your account
          </p>
        </div>
        {error && (
          <div className="rounded-md bg-red-50/50 border border-red-100 p-3 text-sm text-red-500">
            {error}
          </div>
        )}
        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input 
            id="email" 
            name="email" 
            type="email" 
            placeholder="m@example.com" 
            required 
            value={emailAddress}
            onChange={(e) => setEmailAddress(e.target.value)}
            className="bg-blue-50/50 border-gray-200"
          />
        </Field>
        <Field>
          <div className="flex items-center">
            <FieldLabel htmlFor="password">Password</FieldLabel>
          </div>
          <Input 
            id="password" 
            name="password" 
            type="password" 
            required 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-blue-50/50 border-gray-200"
          />
        </Field>
        <Field>
          <Button type="submit" className="w-full bg-[#8cc63f] hover:bg-[#7ab130] text-white font-bold uppercase tracking-tight" disabled={isLoading}>
            {isLoading ? "SIGNING IN..." : "SIGN IN"}
          </Button>
        </Field>
      </FieldGroup>
    </form>
  )
}

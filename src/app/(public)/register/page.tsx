"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { ArrowLeft, Loader2, Lock, Mail, Phone, User } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Footer } from "@/components/footer"
import { registerNewUser } from "@/services/users"

const registerSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  mobileNumber: z
    .string()
    .min(10, {
      message: "Mobile number must be at least 10 digits.",
    })
    .regex(/^[0-9+\-\s()]+$/, {
      message: "Please enter a valid phone/mobile number.",
    }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
})

type RegisterFormValues = z.infer<typeof registerSchema>

export default function RegisterPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      mobileNumber: "",
      password: "",
    },
  })

  async function onSubmit(data: RegisterFormValues) {
    console.log(JSON.stringify(data, null, 2))
    setIsSubmitting(true)
    try {
      await registerNewUser({
        name: data.name,
        email: data.email,
        mobile: data.mobileNumber,
        password: data.password,
      })
      toast.success("User registered successfully! Please sign in.")
      router.push("/login")
    } catch (err: any) {
      toast.error(err?.message || "Failed to register user. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen w-full bg-white flex flex-col justify-between">
      <main className="flex-1 flex flex-col justify-center items-center p-4 py-12">
        {/* Top Home Link */}
        <div className="w-full max-w-md mb-4 flex items-center justify-start">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="size-4" />
            Back to Home
          </Link>
        </div>

        {/* Register Form Card */}
        <Card className="w-full max-w-md border-2 border-primary shadow-sm bg-white">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-2xl font-bold tracking-tight text-foreground">
              Create an account
            </CardTitle>
            <CardDescription>
              Enter your details below to register for a new account
            </CardDescription>
          </CardHeader>

          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                {/* Name Field */}
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                          <Input
                            placeholder="John Doe"
                            className="pl-9 h-10"
                            disabled={isSubmitting}
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Email Field */}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                          <Input
                            type="email"
                            placeholder="name@example.com"
                            className="pl-9 h-10"
                            disabled={isSubmitting}
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Mobile Number Field */}
                <FormField
                  control={form.control}
                  name="mobileNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mobile Number</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                          <Input
                            type="tel"
                            placeholder="+1 234 567 890"
                            className="pl-9 h-10"
                            disabled={isSubmitting}
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Password Field */}
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                          <Input
                            type="password"
                            placeholder="••••••••"
                            className="pl-9 h-10"
                            disabled={isSubmitting}
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full h-10 mt-2 font-medium"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="size-4 animate-spin" />
                      Creating Account...
                    </span>
                  ) : (
                    "Create Account"
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>

          <CardFooter className="flex flex-col items-center justify-center border-t border-border/40 pt-4 pb-6">
            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-medium text-foreground underline underline-offset-4 hover:text-primary transition-colors"
              >
                Sign in
              </Link>
            </p>
          </CardFooter>
        </Card>
      </main>

      <Footer />
    </div>
  )
}
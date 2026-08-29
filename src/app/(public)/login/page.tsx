"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { ArrowLeft, Loader2, Lock, Mail, ShieldCheck } from "lucide-react"
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Footer } from "@/components/footer"
import { loginUser } from "@/services/users"
import { useUserStore } from "@/store/user-store"

const loginSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(1, {
    message: "Password is required.",
  }),
  role: z.enum(["user", "admin"], {
    message: "Please select a valid role.",
  }),
})

type LoginFormValues = z.infer<typeof loginSchema>

export default function LoginPage() {
  const router = useRouter()
  const { setCurrentUser } = useUserStore()
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      role: "user",
    },
  })

  async function onSubmit(data: LoginFormValues) {
    console.log(JSON.stringify(data, null, 2))
    setIsSubmitting(true)
    try {
      const user = await loginUser({
        email: data.email,
        password: data.password,
        role: data.role,
      })

      setCurrentUser(user)
      toast.success(`Welcome back, ${user.name || user.email}!`)

      if (data.role === "admin") {
        router.push("/admin/dashboard")
      } else {
        router.push("/user/products")
      }
    } catch (err: any) {
      toast.error(err?.message || "Failed to sign in. Please check your credentials.")
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

        {/* Login Form Card */}
        <Card className="w-full max-w-md border-2 border-primary shadow-sm bg-white">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-2xl font-bold tracking-tight text-foreground">
              Sign in
            </CardTitle>
            <CardDescription>
              Enter your credentials and select your role to access your account
            </CardDescription>
          </CardHeader>

          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                {/* Role Select Field */}
                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Role</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        disabled={isSubmitting}
                      >
                        <FormControl>
                          <SelectTrigger className="h-10">
                            <div className="flex items-center gap-2">
                              <ShieldCheck className="size-4 text-muted-foreground" />
                              <SelectValue placeholder="Select role" />
                            </div>
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="user">User</SelectItem>
                          <SelectItem value="admin">Admin</SelectItem>
                        </SelectContent>
                      </Select>
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
                      Signing in...
                    </span>
                  ) : (
                    "Sign In"
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>

          <CardFooter className="flex flex-col items-center justify-center border-t border-border/40 pt-4 pb-6">
            <p className="text-sm text-muted-foreground">
              Don&apos;t have an account?{" "}
              <Link
                href="/register"
                className="font-medium text-foreground underline underline-offset-4 hover:text-primary transition-colors"
              >
                Register
              </Link>
            </p>
          </CardFooter>
        </Card>
      </main>

      <Footer />
    </div>
  )
}
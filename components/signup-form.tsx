"use client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldSeparator } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "@tanstack/react-form";
import { signUp } from "@/lib/auth-client";
import { Label } from "./ui/label";

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    onSubmit: async ({ value }) => {
      try {
        const res = await signUp.email({
          name: value.name,
          email: value.email,
          password: value.password,
        });
        if (res.error) {
          setError(res.error.message || "Something went wrong.");
        } else {
          router.push("/dashboard");
        }
      } catch (error) {
        console.error("Error signing in:", error);
      }
    },
  });
  return (
    <form
      className={cn("flex flex-col gap-6", className)}
      {...props}
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
    >
      <div className="flex flex-col items-center gap-1 text-center">
        <h1 className=" font-bold text-2xl">Signup to your account</h1>
        <p className="text-muted-foreground text-sm text-balance">
          Enter your email below to Signup to your account
        </p>
      </div>
      {error && (
        <div className="bg-destructive/20 p-4">
          <p className="text-sm text-destructive-foreground">{error}</p>
        </div>
      )}
      <form.Field
        name="name"
        validators={{
          onChange: ({ value }) =>
            !value
              ? "A name is required"
              : value.length < 3
                ? "Name must be at least 3 characters"
                : undefined,
        }}
      >
        {(field) => (
          <>
            <Label htmlFor={field.name}>Name</Label>
            <Input
              type="text"
              placeholder="Your name"
              id={field.name}
              name={field.name}
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
            />
          </>
        )}
      </form.Field>
      <form.Field
        name="email"
        validators={{
          onChange: ({ value }) =>
            !value
              ? "An email is required"
              : value.length < 3
                ? "Email must be at least 3 characters"
                : undefined,
          onChangeAsyncDebounceMs: 500,
          onChangeAsync: async ({ value }) => {
            await new Promise((resolve) => setTimeout(resolve, 1000));
            return value.includes("error") && 'No "error" allowed in email';
          },
        }}
      >
        {(field) => (
          <>
            <Label htmlFor={field.name}>Email</Label>
            <Input
              type="email"
              placeholder="m@example.com"
              id={field.name}
              name={field.name}
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
            />
          </>
        )}
      </form.Field>
      <form.Field
        name="password"
        validators={{
          onChange: ({ value }) =>
            !value
              ? "A password is required"
              : value.length < 6
                ? "Password must be at least 6 characters"
                : undefined,
        }}
      >
        {(field) => (
          <>
            <div className="flex items-center">
              <Label htmlFor={field.name}>Password</Label>
              <a
                href="#"
                className="ml-auto text-sm underline-offset-4 hover:underline"
              >
                Forgot your password?
              </a>
            </div>
            <Input
              type="password"
              placeholder="**********"
              id={field.name}
              name={field.name}
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
            />
          </>
        )}
      </form.Field>
      <form.Field
        name="confirmPassword"
        validators={{
          onChange: (props) =>
            !props.value
              ? "Please confirm your password"
              : props.value !== props.fieldApi.form.getFieldValue("password")
                ? "Passwords do not match"
                : undefined,
        }}
      >
        {(field) => (
          <>
            <Label htmlFor={field.name}>Confirm Password</Label>
            <Input
              type="password"
              placeholder="**********"
              id={field.name}
              name={field.name}
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
            />
          </>
        )}
      </form.Field>
      <form.Subscribe
        selector={(state) => [state.canSubmit, state.isSubmitting]}
      >
        {([canSubmit, isSubmitting]) => (
          <div className="w-full">
            <Button
              type="submit"
              className="w-full"
              size="xl"
              disabled={!canSubmit}
            >
              {isSubmitting ? "..." : "Signup"}
            </Button>
          </div>
        )}
      </form.Subscribe>

      <FieldSeparator>Or continue with</FieldSeparator>
      <Field>
        <Button variant="outline" type="button" size="xl">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="currentColor"
              d="M11.999 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-1 .67-2.27 1.07-3.71 1.07-2.86 0-5.29-1.93-6.16-4.53H2.13v2.84C3.93 20.53 7.2 23 11.999 23z"
            />
            <path
              fill="currentColor"
              d="M5.83 14.11c-.22-.66-.35-1.36-.35-2.11s.13-1.45.35-2.11V7.05H2.13C1.43 8.55 1 10.22 1 12s.43 3.45 1.13 4.95l2.7-2.84z"
            />
            <path
              fill="currentColor"
              d="M11.999 4.98c1.62 0 3.06.56 4.21 1.64l3.15-3.15C16.96 1.64 14.47 1 11.999 1 7c-4.8 0-8.07 2.47-9.86 6.05l2.7 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          Signup with Google
        </Button>
        <FieldDescription className="text-center text-md">
          Already have an account?{" "}
          <Link href="/login" className="underline">
            <span>Login</span>
          </Link>
        </FieldDescription>
      </Field>
    </form>
  );
}

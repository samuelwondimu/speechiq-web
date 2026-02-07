"use client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldSeparator } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "@/lib/auth-client";
import { useForm } from "@tanstack/react-form";
import { Label } from "./ui/label";
import { useState } from "react";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    onSubmit: async ({ value }) => {
      try {
        const res = await signIn.email({
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
        <h1 className="font-bold text-2xl">Login to your account</h1>
        <p className="text-muted-foreground text-sm text-balance">
          Enter your email below to login to your account
        </p>
      </div>
      {error && (
        <div className="bg-destructive/20 p-4">
          <p className="text-sm text-destructive-foreground">{error}</p>
        </div>
      )}
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
              {isSubmitting ? "..." : "Submit"}
            </Button>
          </div>
        )}
      </form.Subscribe>
      <FieldSeparator>Or continue with</FieldSeparator>
      <Field>
        <Button variant="outline" type="button" size="xl">
          Login with Google
        </Button>
        <FieldDescription className="text-center text-md">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="underline">
            <span>Sign up</span>
          </Link>
        </FieldDescription>
      </Field>
    </form>
  );
}

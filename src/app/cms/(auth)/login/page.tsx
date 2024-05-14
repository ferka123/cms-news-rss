"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { login } from "@/lib/auth/actions";
import { CircleAlert } from "lucide-react";
import { useFormState, useFormStatus } from "react-dom";

export default function LoginForm() {
  const [state, formAction] = useFormState(login, {});

  return (
    <form action={formAction}>
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            Enter your email below to login to your account.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="m@example.com"
              required
            />
            <p className="text-sm font-medium text-destructive-foreground">
              {state.validationErrors?.email}
            </p>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" name="password" type="password" required />
            <p className="text-sm font-medium text-destructive-foreground">
              {state.validationErrors?.password}
            </p>
          </div>
          {state.serverError && (
            <div className="flex gap-2 items-center border rounded-sm p-2 text-sm text-destructive-foreground">
              <CircleAlert size={20} />
              {state.serverError}
            </div>
          )}
        </CardContent>
        <CardFooter>
          <SubmitButton />
        </CardFooter>
      </Card>
    </form>
  );
}

const SubmitButton = () => {
  const { pending } = useFormStatus();
  return (
    <Button className="w-full" type="submit">
      {pending ? "Login In..." : "Login"}
    </Button>
  );
};

import { Login } from "@/api/api";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { setToken } from "@/redux/slices/tokenSlice";
import { Label } from "@radix-ui/react-label";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { LoaderCircle } from "lucide-react";
import { useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom"; // Import the useNavigate hook

const LoginPage = () => {
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const submitRef = useRef<HTMLButtonElement>(null);
  const [Error, SetError] = useState<string>("");

  const dispatch = useDispatch();
  const navigate = useNavigate(); // Initialize the navigate hook

  const mutation = useMutation({
    mutationFn: Login,
    onSuccess: (response) => {
      const { token } = response.data;
      dispatch(setToken(token));

      // Clear form fields after success
      if (emailRef.current) emailRef.current.value = "";
      if (passwordRef.current) passwordRef.current.value = "";

      // Navigate to dashboard or home
      navigate("/dashboard"); // Or navigate("/") for home
    },
    onError: (error: AxiosError) => {
      if (error.response?.status === 401) {
        SetError("Invalid Email Or Password. Please try again.");
      } else {
        SetError("Something went wrong. Please try again later.");
      }
    },
  });

  const HandleLogin = () => {
    try {
      const email = emailRef.current?.value;
      const password = passwordRef.current?.value;

      // Reset error state before validation
      SetError("");

      // Validation for empty email
      if (!email) {
        SetError("Email is required.");
        emailRef.current?.focus();
        return;
      }

      // Validation for empty password
      if (!password) {
        SetError("Password is required.");
        passwordRef.current?.focus();
        return;
      }

      // Basic email format validation
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailRegex.test(email)) {
        SetError("Please enter a valid email address.");
        return;
      }

      // Trigger the mutation with email and password
      mutation.mutate({ email, password });
    } catch (error) {
      SetError("An unexpected error occurred.");
      console.error(error);
    }
  };

  return (
    <section>
      <Card className="mx-auto max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            Enter your email below to login to your account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="nighatcloth@example.com"
                required
                ref={emailRef}
                autoComplete="off"
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
              </div>
              <Input
                id="password"
                type="password"
                required
                ref={passwordRef}
                autoComplete="off"
              />
            </div>
            {Error && <div className="text-red-500">{Error}</div>}
            <Button
              type="button"
              className="w-full"
              ref={submitRef}
              onClick={HandleLogin}
              disabled={mutation.isPending}
            >
              {mutation.isPending && <LoaderCircle className="animate-spin" />}
              Login
            </Button>
          </div>
        </CardContent>
      </Card>
    </section>
  );
};

export default LoginPage;

import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChevronDown, LoaderCircle } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AddUser } from "@/api/api";
import { AxiosError } from "axios";

interface ErrorResponse {
  message: string;
}

const AddUserPage = () => {
  const usernameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const [role, setRole] = useState("User");
  const [error, setError] = useState<string | null>(null);

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationKey: ["AddUser"],
    mutationFn: AddUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      alert("User added successfully!");
      setError(null);
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      const errorMessage =
        error.response?.data.message || "An unknown error occurred";
      setError(errorMessage);
    },
  });

  const handleAddUser = () => {
    const username = usernameRef.current?.value;
    const email = emailRef.current?.value;
    const password = passwordRef.current?.value;

    if (!username || !email || !password) {
      alert("All fields are required!");
      return;
    }

    mutation.mutate({ username, email, password, role });
  };

  return (
    <section className="lg:m-6 md:m-4 sm:m-2">
      <Card className="m-auto max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Add User</CardTitle>
          <CardDescription>
            Enter user details below to create a new user.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="grid grid-cols-3 gap-2 items-center">
              <Label htmlFor="username" className="text-right">
                Username :
              </Label>
              <Input
                id="username"
                ref={usernameRef}
                type="text"
                placeholder="nighatcloth"
                required
                autoComplete="off"
                className="col-span-2"
              />
            </div>
            <div className="grid grid-cols-3 gap-2 items-center">
              <Label htmlFor="email" className="text-right">
                Email :
              </Label>
              <Input
                id="email"
                ref={emailRef}
                type="email"
                placeholder="nighatcloth@store.com"
                required
                autoComplete="off"
                className="col-span-2"
              />
            </div>
            <div className="grid grid-cols-3 gap-2 items-center">
              <Label htmlFor="password" className="text-right">
                Password :
              </Label>
              <Input
                id="password"
                ref={passwordRef}
                type="password"
                placeholder="secret123"
                required
                autoComplete="off"
                className="col-span-2"
              />
            </div>
            <div className="grid grid-cols-3 gap-2 items-center">
              <Label className="text-right">Role :</Label>
              <div className="col-span-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline">
                      {role} <ChevronDown />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuCheckboxItem
                      checked={role === "User"}
                      onClick={() => setRole("User")}
                      className="cursor-pointer"
                    >
                      User
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                      checked={role === "Admin"}
                      onClick={() => setRole("Admin")}
                      className="cursor-pointer"
                    >
                      Admin
                    </DropdownMenuCheckboxItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
            {mutation.isError && error && (
              <div className="text-red-600">{error}</div>
            )}
            <Button type="button" className="w-full" onClick={handleAddUser}>
              {mutation.isPending && <LoaderCircle className="animate-spin" />}
              Add User
            </Button>
          </div>
        </CardContent>
      </Card>
    </section>
  );
};

export default AddUserPage;

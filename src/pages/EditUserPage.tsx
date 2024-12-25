import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";
import { ChevronDown } from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { GetSingleUser, UpdateUser } from "@/api/api"; // Assuming UpdateUser is the API call to update user

const EdituserPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userRole, setUserRole] = useState("User");

  // Convert id to number and handle undefined
  const userId = id ? parseInt(id, 10) : undefined;

  // Fetch user data by ID
  const {
    data: user,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["user", userId],
    queryFn: () => GetSingleUser({ id: userId! }),
    enabled: !!userId, // Only run the query if userId is defined
  });

  // Mutation for updating user
  const updateUserMutation = useMutation({
    mutationKey: ["UpdateUser", userId],
    mutationFn: (updatedUserData: {
      id: number;
      username: string;
      email: string;
      role: string;
    }) => {
      return UpdateUser(updatedUserData); // Pass updated data to the UpdateUser function
    },
    onSuccess: () => {
      navigate("/dashboard/users"); // Redirect after success
    },
    onError: (error: any) => {
      console.error("Error updating user:", error); // Handle error
    },
  });

  useEffect(() => {
    if (user) {
      setUserName(user.user.username || "");
      setUserEmail(user.user.email || "");
      setUserRole(user.user.role || "User");
    }
  }, [user]);

  const handleUpdateUser = () => {
    // Prepare the updated user data
    const updatedUserData = {
      id: userId!,
      username: userName,
      email: userEmail,
      role: userRole,
    };

    // Trigger the mutation to update the user
    updateUserMutation.mutate(updatedUserData);
  };

  if (isLoading) {
    return <main>Loading user data...</main>;
  }

  if (isError) {
    return <main>Error fetching user data.</main>;
  }

  return (
    <section className="lg:m-6 sm:m-2">
      <Card className="mx-auto max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Edit User</CardTitle>
          <CardDescription>Update the user details below.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                required
                placeholder="Enter username"
                autoComplete="off"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                required
                placeholder="Enter email"
                autoComplete="off"
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
              />
            </div>
            <div className="gap-2 items-center flex mt-2">
              <Label className="text-right">Role:</Label>
              <div className="col-span-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline">
                      {userRole} <ChevronDown />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuCheckboxItem
                      checked={userRole === "User"}
                      onClick={() => setUserRole("User")}
                      className="cursor-pointer"
                    >
                      User
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                      checked={userRole === "Admin"}
                      onClick={() => setUserRole("Admin")}
                      className="cursor-pointer"
                    >
                      Admin
                    </DropdownMenuCheckboxItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
            <div className="flex gap-3">
              <Button
                className="w-full mt-2"
                type="button"
                variant="secondary"
                onClick={() => navigate("/dashboard/users")}
              >
                Cancel
              </Button>
              <Button
                type="button"
                className="w-full mt-2"
                onClick={handleUpdateUser} // Trigger the update on button click
              >
                Update User
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
};

export default EdituserPage;

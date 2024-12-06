import { Users } from "@/api/api";
import { User } from "@/Types/UserType";
import { useQuery } from "@tanstack/react-query";

const UserPage = () => {
  const {
    data: response,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["users"],
    queryFn: Users,
    staleTime: 3 * 60 * 1000, // 3 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
  });

  // Loading state
  if (isLoading) {
    return <main>Loading users...</main>;
  }

  // Error state
  if (isError) {
    return <main>Error fetching users: {error.message}</main>;
  }

  // If no users found
  if (!response?.data?.users?.length) {
    return <main>No users found</main>;
  }

  // Render users
  return (
    <main>
      <h1>Hello, this is the Users page</h1>
      <section>
        {response.data.users.map((user: User) => (
          <>
            <div key={user.id}>{user.firstname}</div>
            <div key={user.id}>{user.email}</div>
            <div key={user.id}>{user.role}</div>
          </>
        ))}
      </section>
    </main>
  );
};

export default UserPage;

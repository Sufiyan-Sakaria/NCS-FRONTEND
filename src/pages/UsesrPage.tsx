import { Users } from "@/api/api";
import DataTable from "@/components/DataTable";
import { User } from "@/Types/UserType";
import { useQuery } from "@tanstack/react-query";
import { createColumnHelper, ColumnDef } from "@tanstack/react-table";

const UsersPage = () => {
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

  // Default data to avoid conditional hook calls
  const usersData = response?.data?.users || [];

  const columnHelper = createColumnHelper<User>();

  const columns: ColumnDef<User>[] = [
    columnHelper.accessor("id", {
      header: "ID",
    }),
    columnHelper.accessor("firstname", {
      header: "Firstname",
    }),
    columnHelper.accessor("lastname", {
      header: "Lastname",
    }),
    columnHelper.accessor("email", {
      header: "Email",
    }),
    columnHelper.accessor("role", {
      header: "Role",
    }),
  ];

  if (isLoading) {
    return <main>Loading users...</main>;
  }

  if (isError) {
    return <main>Error fetching users: {error?.message}</main>;
  }

  if (!usersData.length) {
    return <main>No users found</main>;
  }

  return (
    <main className="m-3">
      <section className="mb-6">
        <h1 className="text-2xl font-semibold">List of Users</h1>
        <p>Here all the users of Nighat Cloth Store.</p>
        <p className="text-md">
          Total Users: <span className="font-medium">{usersData.length}</span>
        </p>
      </section>
      <section>
        <DataTable<User> data={usersData} columns={columns} />
      </section>
    </main>
  );
};

export default UsersPage;

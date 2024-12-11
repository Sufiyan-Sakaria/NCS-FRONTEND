import { Users } from "@/api/api";
import DataTable from "@/components/DataTable";
import { User } from "@/Types/UserType";
import { useQuery } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import { DateTime } from "luxon";

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

  const columns: ColumnDef<User>[] = [
    {
      accessorKey: "id",
      header: "ID",
    },
    {
      accessorFn: (row) => `${row.firstname} ${row.lastname}`,
      id: "name", // Unique identifier for this column
      header: "Name",
    },
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      accessorKey: "role",
      header: "Role",
    },
    {
      accessorKey: "createdAt",
      header: "Created At",
      cell: ({ cell }) => {
        const value = cell.getValue() as string;
        return DateTime.fromISO(value).toLocaleString(DateTime.DATETIME_MED);
      },
    },
    {
      accessorKey: "updatedAt",
      header: "Updated At",
      cell: ({ cell }) => {
        const value = cell.getValue() as string;
        return DateTime.fromISO(value).toLocaleString(DateTime.DATETIME_MED);
      },
    },
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
      <section>
        <h1 className="text-2xl font-semibold">List of Users</h1>
        <p>Here all the users of Nighat Cloth Store.</p>
      </section>
      <section>
        <DataTable<User> data={usersData} columns={columns} />
      </section>
    </main>
  );
};

export default UsersPage;

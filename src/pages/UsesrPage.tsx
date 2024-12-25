import { GetAllUsers } from "@/api/api";
import DataTable from "@/components/DataTable";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import TableActions from "@/components/UserTableActions";
import { User } from "@/Types/UserType";
import { useQuery } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import { DateTime } from "luxon";

const UsersPage = () => {
  const {
    data: response,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["users"],
    queryFn: GetAllUsers,
    staleTime: 3 * 60 * 1000, // 3 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
  });

  // Default data to avoid conditional hook calls
  const usersData = response?.data?.users || [];

  const columns: ColumnDef<User>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableHiding: false,
      enableSorting: false,
    },
    {
      accessorKey: "id",
      header: "ID",
    },
    {
      accessorKey: "username",
      id: "username",
      header: ({ column }) => {
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting()}>
            Name
            {column.getIsSorted() === "asc" ? (
              <ArrowUp />
            ) : column.getIsSorted() === "desc" ? (
              <ArrowDown />
            ) : (
              <ArrowUpDown />
            )}
          </Button>
        );
      },
      cell: ({ cell }) => (
        <div className="capitalize">{cell.getValue() as string}</div>
      ),
    },
    {
      accessorKey: "email",
      header: ({ column }) => {
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting()}>
            Email
            {column.getIsSorted() === "asc" ? (
              <ArrowUp />
            ) : column.getIsSorted() === "desc" ? (
              <ArrowDown />
            ) : (
              <ArrowUpDown />
            )}
          </Button>
        );
      },
    },
    {
      accessorKey: "role",
      header: ({ column }) => (
        <div className="text-center">
          <Button variant="ghost" onClick={() => column.toggleSorting()}>
            Role
            {column.getIsSorted() === "asc" ? (
              <ArrowUp />
            ) : column.getIsSorted() === "desc" ? (
              <ArrowDown />
            ) : (
              <ArrowUpDown />
            )}
          </Button>
        </div>
      ),
      cell: ({ cell }) => (
        <div className="text-center">{cell.getValue() as string}</div>
      ),
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
    {
      id: "actions",
      header: () => <div className="text-center">Actions</div>,
      enableHiding: false,
      cell: ({ row }) => (
        <div className="text-center">
          <TableActions id={row.original.id} title="User" />
        </div>
      ),
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
        <DataTable<User> data={usersData} columns={columns} title="User" />
      </section>
    </main>
  );
};

export default UsersPage;

import { GetAllCategories } from "@/api/api";
import DataTable from "@/components/DataTable";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import TableActions from "@/components/UserTableActions";
import { Category } from "@/Types/CategoryType";
import { useQuery } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import { DateTime } from "luxon";

const CategoryPage = () => {
  const {
    data: response,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["categories"],
    queryFn: GetAllCategories,
    staleTime: 3 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });

  // Default data to avoid conditional hook calls
  const categories = response?.data?.categories || [];

  const columns: ColumnDef<Category>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <div className="p-2">
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && "indeterminate")
            }
            onCheckedChange={(value) =>
              table.toggleAllPageRowsSelected(!!value)
            }
            aria-label="Select all"
          />
        </div>
      ),
      cell: ({ row }) => (
        <div className="px-2">
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
          />
        </div>
      ),
      size: 40,
      enableHiding: false,
      enableSorting: false,
    },
    {
      accessorKey: "id",
      header: ({ column }) => {
        return (
          <Button
            className="w-14"
            variant="ghost"
            onClick={() => column.toggleSorting()}
          >
            ID
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
      size: 40,
      cell: ({ cell }) => (
        <div className="px-4">{cell.getValue() as string}</div>
      ),
    },
    {
      accessorKey: "name",
      id: "name",
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
      size: 150,
    },
    {
      accessorKey: "description",
      id: "description",
      header: ({ column }) => {
        return (
          <div className="text-center">
            <Button variant="ghost" onClick={() => column.toggleSorting()}>
              Description
              {column.getIsSorted() === "asc" ? (
                <ArrowUp />
              ) : column.getIsSorted() === "desc" ? (
                <ArrowDown />
              ) : (
                <ArrowUpDown />
              )}
            </Button>
          </div>
        );
      },
      cell: ({ cell }) => (
        <div className="capitalize text-center">
          {cell.getValue() ? (cell.getValue() as string) : "-"}
        </div>
      ),
      size: 280,
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
      header: () => <div className="text-center p-2">Actions</div>,
      enableHiding: false,
      cell: ({ row }) => (
        <div className="text-center px-2">
          <TableActions id={row.original.id} title="Brand" />
        </div>
      ),
      size: 150,
    },
  ];

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error fetching data</div>;

  return (
    <main className="m-3">
      <section>
        <h1 className="text-2xl font-semibold">List of Categories</h1>
        <p>Here are all the category from Nighat Cloth Store.</p>
      </section>
      <section>
        <DataTable<Category>
          data={categories}
          columns={columns}
          title="Category"
          search="name"
          columnVisibility={{ updatedAt: false }}
        />
      </section>
    </main>
  );
};

export default CategoryPage;

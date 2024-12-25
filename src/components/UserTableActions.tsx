import { Copy, Edit, MoreHorizontal, Trash2 } from "lucide-react";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useMutation } from "@tanstack/react-query";
import { DeleteUser } from "@/api/api";
import { Link } from "react-router-dom";

interface TableActionsProps {
  id: number;
  title: string;
}

const TableActions = ({ id, title }: TableActionsProps) => {
  const { mutate } = useMutation({
    mutationKey: [`delete${title}`, id],
    mutationFn: DeleteUser,
    onSuccess: (response) => {
      console.log(`Deleted User with ID ${response.data}`);
    },
    onError: (error) => {
      console.error(`Error deleting ${title} with ID ${id}:`, error);
    },
  });

  const HandleDelete = () => {
    mutate({ id });
    console.log(`Deleting ${title} with ID ${id}`);
  };

  return (
    <AlertDialog>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={() => navigator.clipboard.writeText(id.toString())}
          >
            <Copy />
            Copy {title} ID
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <Link to={`edit/${id}`}>
            <DropdownMenuItem className="text-green-600 cursor-pointer">
              <Edit />
              Edit {title}
            </DropdownMenuItem>
          </Link>
          <AlertDialogTrigger className="w-full">
            <DropdownMenuItem className="text-red-600 cursor-pointer">
              <Trash2 />
              Delete {title}
            </DropdownMenuItem>
          </AlertDialogTrigger>
        </DropdownMenuContent>
      </DropdownMenu>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete {title}{" "}
            from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={HandleDelete}>Delete</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default TableActions;

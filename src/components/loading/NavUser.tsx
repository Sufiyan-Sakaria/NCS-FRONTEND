import { Skeleton } from "../ui/skeleton";

const NavUserLoading = () => {
  return (
    <div className="flex items-center gap-3 p-3 rounded-md">
      <div className="flex flex-col flex-1">
        <Skeleton className="w-32 h-4 rounded-md" />
        <Skeleton className="w-40 h-3 mt-1 rounded-md" />
      </div>
      <Skeleton className="w-5 h-5 ml-auto rounded-md" />
    </div>
  );
};

export default NavUserLoading;

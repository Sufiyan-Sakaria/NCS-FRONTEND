import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LoaderCircle } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AddCategory } from "@/api/api";
import { AxiosError } from "axios";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "react-router-dom";

interface ErrorResponse {
  message: string;
}

const AddCategoryPage = () => {
  const nameRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLTextAreaElement>(null);

  const navigate = useNavigate();

  const [error, setError] = useState<string | null>(null);

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationKey: ["AddCategory"],
    mutationFn: AddCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      alert("Category added successfully!");
      setError(null);
      navigate("/dashboard/categories");
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      const errorMessage =
        error.response?.data.message || "An unknown error occurred";
      setError(errorMessage);
    },
  });

  const handleAddBrand = () => {
    const name = nameRef.current?.value;
    const description = descriptionRef.current?.value;

    if (!name) {
      setError("Name is required");
      return;
    }

    mutation.mutate({ name, description });
  };

  return (
    <section className="lg:m-6 md:m-4 sm:m-2">
      <Card className="m-auto max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Add Category</CardTitle>
          <CardDescription>
            Enter category details below to create a new category.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5 gap-1">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                ref={nameRef}
                type="text"
                placeholder="Wash N Wear"
                required
                autoComplete="off"
              />
            </div>
            <div className="flex flex-col space-y-1.5 gap-1">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                ref={descriptionRef}
                placeholder="optional"
                required
                autoComplete="off"
                className="resize-none"
              />
            </div>
            {mutation.isError && error && (
              <div className="text-red-600">{error}</div>
            )}
            <Button
              type="button"
              className="w-full"
              onClick={handleAddBrand}
              disabled={mutation.isPending}
            >
              {mutation.isPending && <LoaderCircle className="animate-spin" />}
              Add Category
            </Button>
          </div>
        </CardContent>
      </Card>
    </section>
  );
};

export default AddCategoryPage;

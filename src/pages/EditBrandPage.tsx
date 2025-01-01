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
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { GetSingleBrand, UpdateBrand } from "@/api/api";
import { Textarea } from "@/components/ui/textarea";
import { LoaderCircle } from "lucide-react";

const EditBrandPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  // Convert id to number and handle undefined
  const brandId = id ? parseInt(id, 10) : undefined;

  // Fetch user data by ID
  const {
    data: brand,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["Brand", brandId],
    queryFn: () => GetSingleBrand({ id: brandId! }),
    enabled: !!brandId,
  });

  const queryClient = useQueryClient();

  // Mutation for updating user
  const mutation = useMutation({
    mutationKey: ["UpdateBrand", brandId],
    mutationFn: (updatedBrandData: {
      id: number;
      name: string;
      description: string;
    }) => {
      return UpdateBrand(updatedBrandData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["brands"] });
      navigate("/dashboard/brands");
    },
    onError: (error: any) => {
      console.error("Error updating user:", error);
    },
  });

  useEffect(() => {
    if (brand) {
      setName(brand.brand.name || "");
      setDescription(brand.brand.description || "");
    }
  }, [brand]);

  const handleUpdateBrand = () => {
    // Prepare the updated user data
    const updatedBrandData = {
      id: brandId!,
      name,
      description,
    };

    // Trigger the mutation to update the user
    mutation.mutate(updatedBrandData);
  };

  if (isLoading) {
    return <main>Loading Brand data...</main>;
  }

  if (isError) {
    return <main>Error fetching user data.</main>;
  }

  return (
    <section className="lg:m-6 sm:m-2">
      <Card className="mx-auto max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Edit Brand</CardTitle>
          <CardDescription>Update the brand details below.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                type="text"
                required
                placeholder="Enter Name"
                autoComplete="off"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                required
                placeholder="Enter Description"
                autoComplete="off"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="resize-none"
                rows={3}
              />
            </div>
            <div className="flex gap-3">
              <Button
                className="w-full mt-2"
                type="button"
                variant="secondary"
                onClick={() => navigate("/dashboard/brands")}
              >
                Cancel
              </Button>
              <Button
                type="button"
                className="w-full mt-2"
                onClick={handleUpdateBrand}
                disabled={mutation.isPending}
              >
                {mutation.isPending && (
                  <LoaderCircle className="animate-spin" />
                )}
                Update Brand
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
};

export default EditBrandPage;

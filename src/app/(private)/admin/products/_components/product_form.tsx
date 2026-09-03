"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { addProduct, editProductById } from "@/services/products";
import { getAllCategories } from "@/services/categories";
import { uploadFileAndReturnUrl } from "@/services/uploads";
import { ICategory, IProduct } from "@/interfaces";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Trash2 } from "lucide-react";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  price: z.coerce.number().min(0, "Price must be greater than or equal to 0"),
  category_id: z.string().min(1, "Category is required"),
});

type FormValues = z.infer<typeof formSchema>;

interface ProductFormProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  initialData?: IProduct | null;
  onSuccess?: () => void;
}

const ProductForm = ({ open, setOpen, initialData, onSuccess }: ProductFormProps) => {
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [existingImageRemoved, setExistingImageRemoved] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleRemoveImage = () => {
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getAllCategories();
        setCategories(data || []);
      } catch (error) {
        console.error("Failed to fetch categories", error);
      }
    };
    if (open) {
      fetchCategories();
    }
  }, [open]);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      category_id: "",
    },
  });

  useEffect(() => {
    if (initialData) {
      form.reset({
        name: initialData.name,
        description: initialData.description,
        price: initialData.price,
        category_id: initialData.category_id?.toString() || "",
      });
    } else {
      form.reset({
        name: "",
        description: "",
        price: 0,
        category_id: "",
      });
    }
    setFile(null); // Clear file when opening form (edit will show existing if we implemented it, but for now we clear to let them upload new)
    setExistingImageRemoved(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, [initialData, form, open]);

  const onSubmit = async (values: FormValues) => {
    try {
      setLoading(true);
      let imagesUrl = "";
      
      // If a new file is uploaded, get the URL
      if (file) {
        imagesUrl = await uploadFileAndReturnUrl(file);
      } else if (initialData && initialData.images && initialData.images.length > 0 && !existingImageRemoved) {
        // If editing and no new file was uploaded, retain the old image
        imagesUrl = initialData.images[0];
      }

      if (initialData) {
        await editProductById(initialData.id, {
          ...values,
          category_id: values.category_id as any,
          images: imagesUrl ? [imagesUrl] : [],
        });
        toast.success("Product updated successfully");
      } else {
        await addProduct({
          ...values,
          category_id: values.category_id as any, // Cast to any since interface uses number but DB uses UUID strings
          images: imagesUrl ? [imagesUrl] : [],
        });
        toast.success("Product added successfully");
      }
      
      form.reset();
      setFile(null);
      setOpen(false);
      if (onSuccess) onSuccess();
    } catch (error: any) {
      toast.error(error.message || `Failed to ${initialData ? "update" : "add"} product`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{initialData ? "Edit Product" : "Add Product"}</DialogTitle>
          <DialogDescription>
            {initialData ? "Modify product details." : "Enter product details to add a new product."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter product name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter product description"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price (₹)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="Enter product price (₹)" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="category_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.id.toString()}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormItem>
              <FormLabel>Image</FormLabel>
              <FormControl>
                <Input 
                  type="file" 
                  ref={fileInputRef}
                  onChange={(e) => setFile(e.target.files?.[0] || null)} 
                />
              </FormControl>
              {file && (
                <div className="mt-2 w-32 h-32 relative rounded-md overflow-hidden border group">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img 
                    src={URL.createObjectURL(file)} 
                    alt="Preview" 
                    className="object-cover w-full h-full" 
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-1 right-1 h-8 w-8 shadow-sm"
                    onClick={handleRemoveImage}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              )}
              {!file && initialData && initialData.images && initialData.images.length > 0 && !existingImageRemoved && (
                <div className="mt-2">
                  <p className="text-xs text-muted-foreground mb-1">Current Image:</p>
                  <div className="w-32 h-32 relative rounded-md overflow-hidden border group">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img 
                      src={initialData.images[0]} 
                      alt="Current" 
                      className="object-cover w-full h-full" 
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-1 right-1 h-8 w-8 shadow-sm"
                      onClick={() => setExistingImageRemoved(true)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </FormItem>

            <div className="flex justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Saving..." : initialData ? "Update Product" : "Add Product"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ProductForm;

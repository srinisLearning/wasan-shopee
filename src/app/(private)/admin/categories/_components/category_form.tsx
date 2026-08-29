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
import { addCategory, editCategoryById } from "@/services/categories";
import { ICategory } from "@/interfaces";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
});

type FormValues = z.infer<typeof formSchema>;

interface CategoryFormProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  initialData?: ICategory | null;
  onSuccess?: () => void;
}

const CategoryForm = ({ open, setOpen, initialData, onSuccess }: CategoryFormProps) => {
  const [loading, setLoading] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  useEffect(() => {
    if (initialData) {
      form.reset({
        name: initialData.name,
        description: initialData.description,
      });
    } else {
      form.reset({
        name: "",
        description: "",
      });
    }
  }, [initialData, form, open]);

  const onSubmit = async (values: FormValues) => {
    try {
      setLoading(true);
      if (initialData) {
        await editCategoryById(initialData.id, values);
        toast.success("Category updated successfully");
      } else {
        await addCategory(values);
        toast.success("Category added successfully");
      }
      form.reset();
      setOpen(false);
      if (onSuccess) onSuccess();
    } catch (error: any) {
      toast.error(error.message || `Failed to ${initialData ? "update" : "add"} category`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{initialData ? "Edit Category" : "Add Category"}</DialogTitle>
          <DialogDescription>
            {initialData ? "Modify category details." : "Enter category details to add a new category."}
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
                    <Input placeholder="Enter category name" {...field} />
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
                      placeholder="Enter category description"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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
                {loading ? "Saving..." : initialData ? "Update Category" : "Add Category"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CategoryForm;

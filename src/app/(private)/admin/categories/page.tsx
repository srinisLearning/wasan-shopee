"use client";

import { Button } from "@/components/ui/button";
import PageTitle from "@/components/ui/page-title";
import React, { useEffect, useState } from "react";
import CategoryForm from "./_components/category_form";
import { ICategory } from "@/interfaces";
import { deleteCategory, getAllCategories } from "@/services/categories";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Edit, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const AdminCategoriesPage = () => {
  const [open, setOpen] = useState(false);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingCategory, setEditingCategory] = useState<ICategory | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const data = await getAllCategories();
      setCategories(data || []);
    } catch (error) {
      toast.error("Failed to fetch categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await deleteCategory(id);
      toast.success("Category deleted successfully");
      fetchCategories();
    } catch (error) {
      toast.error("Failed to delete category");
    } finally {
      setDeleteId(null);
    }
  };

  const handleEdit = (category: ICategory) => {
    setEditingCategory(category);
    setOpen(true);
  };

  const handleAdd = () => {
    setEditingCategory(null);
    setOpen(true);
  };

  return (
    <>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <PageTitle title="Categories" />
          <Button onClick={handleAdd}>Add Category</Button>
        </div>

        <div className="border rounded-md w-[800] mx-auto">
          <Table>
            <TableHeader className="bg-slate-100">
              <TableRow>
                <TableHead className="font-bold text-slate-900">Name</TableHead>
                <TableHead className="font-bold text-slate-900">Description</TableHead>
                <TableHead className="text-right font-bold text-slate-900">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-center py-4">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : categories.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-center py-4">
                    No categories found.
                  </TableCell>
                </TableRow>
              ) : (
                categories.map((category) => (
                  <TableRow key={category.id}>
                    <TableCell className="font-medium">
                      {category.name}
                    </TableCell>
                    <TableCell>{category.description}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(category)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setDeleteId(category.id)}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        <CategoryForm
          open={open}
          setOpen={setOpen}
          initialData={editingCategory}
          onSuccess={fetchCategories}
        />

        <AlertDialog
          open={!!deleteId}
          onOpenChange={(open) => !open && setDeleteId(null)}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the
                category.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => deleteId && handleDelete(deleteId)}
              >
                Continue
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </>
  );
};

export default AdminCategoriesPage;

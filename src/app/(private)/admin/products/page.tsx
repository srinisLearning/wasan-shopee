"use client";

import { Button } from "@/components/ui/button";
import PageTitle from "@/components/ui/page-title";
import React, { useEffect, useState } from "react";
import ProductForm from "./_components/product_form";
import { IProduct, ICategory } from "@/interfaces";
import { deleteProduct, getAllProducts } from "@/services/products";
import { getAllCategories } from "@/services/categories";
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

const AdminProductsPage = () => {
  const [open, setOpen] = useState(false);
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState<IProduct | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [categories, setCategories] = useState<ICategory[]>([]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await getAllProducts();
      setProducts(data || []);
    } catch (error) {
      toast.error("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const data = await getAllCategories();
      setCategories(data || []);
    } catch (error) {
      console.error("Failed to fetch categories", error);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await deleteProduct(id);
      toast.success("Product deleted successfully");
      fetchProducts();
    } catch (error) {
      toast.error("Failed to delete product");
    } finally {
      setDeleteId(null);
    }
  };

  const handleEdit = (product: IProduct) => {
    setEditingProduct(product);
    setOpen(true);
  };

  const handleAdd = () => {
    setEditingProduct(null);
    setOpen(true);
  };

  return (
    <>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <PageTitle title="Products" />
          <Button onClick={handleAdd}>Add Product</Button>
        </div>

        <div className="border rounded-md">
          <Table>
            <TableHeader className="bg-slate-100">
              <TableRow>
                <TableHead className="font-bold text-slate-900">Image</TableHead>
                <TableHead className="font-bold text-slate-900">Name</TableHead>
                <TableHead className="font-bold text-slate-900">Category</TableHead>
                <TableHead className="font-bold text-slate-900">Description</TableHead>
                <TableHead className="font-bold text-slate-900">Price</TableHead>
                <TableHead className="text-right font-bold text-slate-900">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-4">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : products.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-4">
                    No products found.
                  </TableCell>
                </TableRow>
              ) : (
                products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      {product.images && product.images.length > 0 ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="h-10 w-10 object-cover rounded"
                        />
                      ) : (
                        <div className="h-10 w-10 bg-slate-100 rounded flex items-center justify-center text-xs text-muted-foreground">
                          N/A
                        </div>
                      )}
                    </TableCell>

                    <TableCell className="font-medium">
                      {product.name}
                    </TableCell>
                    <TableCell>
                      {categories.find((c) => c.id.toString() === product.category_id?.toString())?.name || "Uncategorized"}
                    </TableCell>
                    <TableCell className="max-w-[200px] truncate">
                      {product.description}
                    </TableCell>
                    <TableCell>${product.price}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(product)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setDeleteId(product.id)}
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

        <ProductForm
          open={open}
          setOpen={setOpen}
          initialData={editingProduct}
          onSuccess={fetchProducts}
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
                product.
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

export default AdminProductsPage;

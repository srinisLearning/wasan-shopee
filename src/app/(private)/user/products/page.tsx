"use client";

import React, { useEffect, useState, useCallback } from "react";
import { getAllProductsWithFilters } from "@/services/products";
import { getAllCategories } from "@/services/categories";
import { IProduct, ICategory } from "@/interfaces/index";
import { ProductCard } from "@/components/ProductCard";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const ProductsPage = () => {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortOrder, setSortOrder] = useState("none");

  // Fetch categories only once
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoriesData = await getAllCategories();
        setCategories(categoriesData || []);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  // Fetch products whenever filters change
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const data = await getAllProductsWithFilters({
          searchQuery,
          categoryId: selectedCategory,
          sortOrder,
        });
        setProducts(data || []);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    // Optional: Add a simple debounce for search query
    const debounceTimer = setTimeout(() => {
      fetchProducts();
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchQuery, selectedCategory, sortOrder]);

  return (
    <div className="flex flex-col gap-6 w-full p-4">
      <div className="flex flex-col gap-1">
        <h3 className="text-2xl font-semibold">Our Products</h3>
        <p className="text-sm text-muted-foreground">
          Discover Your Exact Needs Here At Prices You'll Love.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between w-full">
        <Input 
          placeholder="Search products..." 
          value={searchQuery} 
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full sm:max-w-xs"
        />
        <div className="flex flex-col sm:flex-row gap-4 items-center w-full sm:w-auto sm:ml-auto">
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={cat.id.toString()}>{cat.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={sortOrder} onValueChange={setSortOrder}>
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder="Sort by Price" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Sort by Price</SelectItem>
              <SelectItem value="asc">Price: Low to High</SelectItem>
              <SelectItem value="desc">Price: High to Low</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
        </div>
      ) : products.length === 0 ? (
        <div className="text-center text-muted-foreground mt-10">
          No products found.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductsPage;

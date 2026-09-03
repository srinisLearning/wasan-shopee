"use client";

import React from "react";
import { IProduct } from "@/interfaces/index";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/cart-store";
import { Plus, Minus } from "lucide-react";

interface ProductCardProps {
  product: IProduct;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const cartItems = useCartStore((state) => state.cartItems);
  const addCartItem = useCartStore((state) => state.addCartItem);
  const removeCartItem = useCartStore((state) => state.removeCartItem);
  const editCartQuantity = useCartStore((state) => state.editCartQuantity);

  const cartItem = cartItems.find((item) => item.id === product.id);

  const handleMinus = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (cartItem) {
      if (cartItem.quantity > 1) {
        editCartQuantity(product.id, cartItem.quantity - 1);
      } else {
        removeCartItem(product.id);
      }
    }
  };

  const handlePlus = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (cartItem) {
      editCartQuantity(product.id, cartItem.quantity + 1);
    }
  };

  return (
    <Dialog>
      <Card className="h-full flex flex-col hover:shadow-md transition-shadow">
        <DialogTrigger asChild>
          <div className="cursor-pointer flex-1 flex flex-col">
            {product.images && product.images.length > 0 && (
              <div className="w-full h-48 overflow-hidden rounded-t-2xl bg-muted shrink-0">
                <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
              </div>
            )}
            <CardHeader>
              <CardTitle className="text-lg line-clamp-1">{product.name}</CardTitle>
            </CardHeader>
            <CardContent className="flex-1">
              <CardDescription className="line-clamp-2">{product.description}</CardDescription>
            </CardContent>
          </div>
        </DialogTrigger>
        <CardFooter className="flex justify-between items-center w-full min-h-[4rem]">
          <div className="font-semibold text-lg text-primary">₹{product.price}</div>
          {cartItem ? (
            <div className="flex items-center gap-2">
              <Button size="icon" variant="outline" className="h-8 w-8 rounded-full" onClick={handleMinus}>
                <Minus className="h-4 w-4" />
              </Button>
              <span className="w-4 text-center font-semibold">{cartItem.quantity}</span>
              <Button size="icon" variant="outline" className="h-8 w-8 rounded-full" onClick={handlePlus}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <Button size="sm" onClick={() => addCartItem(product)}>Add to Cart</Button>
          )}
        </CardFooter>
      </Card>
      <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">{product.name}</DialogTitle>
          <DialogDescription className="text-xl font-semibold text-primary">
            ₹{product.price}
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-6 py-4">
          {product.images && product.images.length > 0 && (
            <img src={product.images[0]} alt={product.name} className="w-full h-auto max-h-80 object-cover rounded-xl" />
          )}
          <p className="text-sm text-foreground whitespace-pre-wrap leading-relaxed">{product.description}</p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

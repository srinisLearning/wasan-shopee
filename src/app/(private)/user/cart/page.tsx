"use client";

import React from "react";
import { useCartStore } from "@/store/cart-store";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Plus, Minus, Trash2, ShoppingCart, MapPin } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useUserStore } from "@/store/user-store";
import { IAddress } from "@/interfaces";
import { getUserAddresses } from "@/services/addresses";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import CheckoutButton from "./_components/checkout-btn";

const CartPage = () => {
  const { cartItems, editCartQuantity, removeCartItem, clearCart } =
    useCartStore();
  const { currentUser } = useUserStore();

  const [addresses, setAddresses] = useState<IAddress[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string>("");

  useEffect(() => {
    const fetchAddresses = async () => {
      if (!currentUser?.id) return;
      try {
        const data = await getUserAddresses(currentUser.id);
        setAddresses(data || []);

        // Select default address if available
        const defaultAddr = data?.find((a) => a.is_default);
        if (defaultAddr) {
          setSelectedAddressId(defaultAddr.id);
        } else if (data && data.length > 0) {
          setSelectedAddressId(data[0].id);
        }
      } catch (error) {
        console.error("Failed to load addresses", error);
      }
    };
    fetchAddresses();
  }, [currentUser?.id]);

  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );
  const shipping = subtotal > 0 ? 15 : 0; // Flat shipping rate
  const total = subtotal + shipping;

  if (cartItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 p-4">
        <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mb-4">
          <ShoppingCart className="w-12 h-12 text-primary/40" />
        </div>
        <h2 className="text-2xl font-bold text-foreground">
          Your cart is empty
        </h2>
        <p className="text-muted-foreground">
          Looks like you haven't added anything to your cart yet.
        </p>
        <Link href="/user/products">
          <Button size="lg" className="mt-4 rounded-xl px-8 shadow-sm">
            Start Shopping
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto w-full animate-in fade-in zoom-in-95 duration-300">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold tracking-tight">Shopping Cart</h2>
        <Button
          variant="ghost"
          className="text-destructive hover:bg-destructive/10 rounded-xl"
          onClick={clearCart}
        >
          <Trash2 className="w-4 h-4 mr-2" />
          Clear Cart
        </Button>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Side: Product List */}
        <div className="flex-1 flex flex-col gap-4">
          {cartItems.map((item) => (
            <Card
              key={item.id}
              className="flex flex-col sm:flex-row items-center sm:items-start p-4 gap-4 sm:gap-6 relative rounded-2xl shadow-sm border-border hover:shadow-md transition-shadow"
            >
              {item.images && item.images.length > 0 && (
                <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-xl overflow-hidden bg-muted shrink-0 border border-border/50">
                  <img
                    src={item.images[0]}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <div className="flex-1 flex flex-col h-full py-2 w-full">
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <h3 className="text-xl font-semibold line-clamp-1">
                      {item.name}
                    </h3>
                    <p className="text-muted-foreground text-sm line-clamp-2 mt-1 pr-4">
                      {item.description}
                    </p>
                  </div>
                  <span className="font-bold text-xl text-primary whitespace-nowrap">
                    ₹{item.price}
                  </span>
                </div>

                <div className="mt-auto pt-6 flex items-center justify-between w-full">
                  <div className="flex items-center gap-3">
                    <Button
                      size="icon"
                      variant="outline"
                      className="h-8 w-8 rounded-full border-muted-foreground/30 hover:border-primary hover:text-primary transition-colors"
                      onClick={() =>
                        item.quantity > 1
                          ? editCartQuantity(item.id, item.quantity - 1)
                          : removeCartItem(item.id)
                      }
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-6 text-center font-semibold text-lg">
                      {item.quantity}
                    </span>
                    <Button
                      size="icon"
                      variant="outline"
                      className="h-8 w-8 rounded-full border-muted-foreground/30 hover:border-primary hover:text-primary transition-colors"
                      onClick={() =>
                        editCartQuantity(item.id, item.quantity + 1)
                      }
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg"
                    onClick={() => removeCartItem(item.id)}
                  >
                    Remove
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Right Side: Order Summary */}
        <div className="w-full lg:w-[380px] shrink-0">
          <Card className="sticky top-28 bg-card shadow-lg border-border/50 rounded-2xl overflow-hidden">
            <CardHeader className="bg-muted/30 pb-6 border-b border-border/50">
              <CardTitle className="text-xl">Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-5 pt-6">
              <div className="flex justify-between items-center text-[15px]">
                <span className="text-muted-foreground">
                  Subtotal ({cartItems.reduce((acc, i) => acc + i.quantity, 0)}{" "}
                  items)
                </span>
                <span className="font-semibold">₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center text-[15px]">
                <span className="text-muted-foreground">
                  Estimated Shipping
                </span>
                <span className="font-semibold">
                  {shipping === 0 ? "Free" : `₹${shipping.toFixed(2)}`}
                </span>
              </div>

              <div className="h-px bg-border/80 my-2" />

              <div className="flex justify-between items-center text-xl font-bold">
                <span>Total</span>
                <span className="text-primary">₹{total.toFixed(2)}</span>
              </div>
            </CardContent>
            <CardFooter className="pb-6 flex flex-col gap-4">
              <div className="w-full space-y-2 pb-2">
                <label className="text-sm font-medium text-muted-foreground flex items-center gap-1.5">
                  <MapPin className="w-4 h-4" /> Shipping Address
                </label>
                <Select
                  value={selectedAddressId}
                  onValueChange={setSelectedAddressId}
                >
                  <SelectTrigger className="w-full h-11 bg-muted/30">
                    <SelectValue placeholder="Select an address" />
                  </SelectTrigger>
                  <SelectContent>
                    {addresses.length === 0 ? (
                      <SelectItem value="none" disabled>
                        No addresses found
                      </SelectItem>
                    ) : (
                      addresses.map((address) => (
                        <SelectItem key={address.id} value={address.id}>
                          {address.name} - {address.city}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
                {addresses.length === 0 && (
                  <Link
                    href="/user/addresses"
                    className="text-xs text-primary hover:underline block mt-1"
                  >
                    + Add a new address
                  </Link>
                )}
              </div>

              <CheckoutButton
                amount={total}
                selectedAddressId={selectedAddressId}
                subtotal={subtotal}
                shipping={shipping}
              />

              {/* <Button 
                className="w-full text-lg h-14 rounded-xl shadow-md hover:shadow-lg transition-all" 
                size="lg"
                disabled={!selectedAddressId || selectedAddressId === "none"}
              >
                Proceed to Checkout
              </Button> */}
              <Link
                href="/user/products"
                className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors underline-offset-4 hover:underline"
              >
                Continue Shopping
              </Link>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CartPage;

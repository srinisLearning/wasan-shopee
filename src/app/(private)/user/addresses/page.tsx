"use client";

import React, { useEffect, useState } from "react";
import { Plus, Edit2, Trash2, MapPin, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { useUserStore } from "@/store/user-store";
import { IAddress } from "@/interfaces";
import { getUserAddresses, deleteAddress, setDefaultAddress } from "@/services/addresses";
import AddressForm from "./AddressForm";
import PageTitle from "@/components/ui/page-title";
import Spinner from "@/components/ui/spinner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const AddressesPage = () => {
  const { currentUser } = useUserStore();
  const [addresses, setAddresses] = useState<IAddress[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<IAddress | null>(null);

  const fetchAddresses = async () => {
    if (!currentUser?.id) return;
    try {
      setLoading(true);
      const data = await getUserAddresses(currentUser.id);
      setAddresses(data || []);
    } catch (error: any) {
      toast.error(error.message || "Failed to load addresses.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser?.id]);

  const handleDelete = async (id: string) => {
    try {
      await deleteAddress(id);
      toast.success("Address deleted successfully.");
      fetchAddresses();
    } catch (error: any) {
      toast.error(error.message || "Failed to delete address.");
    }
  };

  const handleSetDefault = async (id: string) => {
    if (!currentUser?.id) return;
    try {
      await setDefaultAddress(id, currentUser.id);
      toast.success("Default address updated.");
      fetchAddresses();
    } catch (error: any) {
      toast.error(error.message || "Failed to set default address.");
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-10">
      <div className="flex items-center justify-between">
        <PageTitle title="My Addresses" />
        <Button onClick={() => { setEditingAddress(null); setIsFormOpen(true); }} className="gap-2">
          <Plus className="w-4 h-4" /> Add Address
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-10">
          <Spinner />
        </div>
      ) : addresses.length === 0 ? (
        <Card className="flex flex-col items-center justify-center py-16 text-center space-y-4">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary">
            <MapPin className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">No addresses found</h3>
            <p className="text-sm text-muted-foreground mt-1">You haven&apos;t added any addresses yet.</p>
          </div>
          <Button variant="outline" onClick={() => setIsFormOpen(true)} className="mt-2">
            Add your first address
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {addresses.map((address) => (
            <Card key={address.id} className="p-5 flex flex-col relative overflow-hidden group border-border/50 hover:border-primary/30 transition-colors">
              {address.is_default && (
                <div className="absolute top-0 right-0 bg-primary/10 text-primary text-[10px] font-bold px-3 py-1 rounded-bl-lg uppercase flex items-center gap-1">
                  <Star className="w-3 h-3 fill-primary" /> Default
                </div>
              )}
              
              <div className="flex items-start justify-between mb-4 mt-2">
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-muted-foreground" />
                  <h3 className="font-semibold text-lg">{address.name}</h3>
                </div>
              </div>

              <div className="flex-1 space-y-1 text-sm text-muted-foreground mb-6">
                <p>{address.address_line_1}</p>
                {address.address_line_2 && <p>{address.address_line_2}</p>}
                <p>{address.city}, {address.state} {address.zip_code}</p>
              </div>

              <div className="flex items-center gap-2 pt-4 border-t border-border/50 mt-auto">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1 gap-2"
                  onClick={() => { setEditingAddress(address); setIsFormOpen(true); }}
                >
                  <Edit2 className="w-4 h-4" /> Edit
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button 
                      variant="destructive" 
                      size="sm" 
                      className="flex-1 gap-2"
                    >
                      <Trash2 className="w-4 h-4" /> Delete
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete your address.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleDelete(address.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                        Continue
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
                {!address.is_default && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="w-full"
                    onClick={() => handleSetDefault(address.id)}
                  >
                    Set as Default
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}

      <AddressForm 
        isOpen={isFormOpen} 
        onClose={() => setIsFormOpen(false)} 
        addressToEdit={editingAddress} 
        onSuccess={fetchAddresses} 
      />
    </div>
  );
};

export default AddressesPage;

"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { IAddress } from "@/interfaces";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { useUserStore } from "@/store/user-store";
import { addAddress, editAddress } from "@/services/addresses";

interface AddressFormProps {
  isOpen: boolean;
  onClose: () => void;
  addressToEdit: IAddress | null;
  onSuccess: () => void;
}

const AddressForm: React.FC<AddressFormProps> = ({
  isOpen,
  onClose,
  addressToEdit,
  onSuccess,
}) => {
  const { currentUser } = useUserStore();
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, reset, setValue } = useForm<Partial<IAddress>>({
    defaultValues: {
      name: "",
      address_line_1: "",
      address_line_2: "",
      city: "",
      state: "",
      zip_code: "",
      is_default: false,
    },
  });

  useEffect(() => {
    if (isOpen) {
      if (addressToEdit) {
        setValue("name", addressToEdit.name);
        setValue("address_line_1", addressToEdit.address_line_1);
        setValue("address_line_2", addressToEdit.address_line_2 || "");
        setValue("city", addressToEdit.city);
        setValue("state", addressToEdit.state);
        setValue("zip_code", addressToEdit.zip_code);
        setValue("is_default", addressToEdit.is_default);
      } else {
        reset();
      }
    }
  }, [isOpen, addressToEdit, setValue, reset]);

  const onSubmit = async (data: Partial<IAddress>) => {
    if (!currentUser?.id) {
      toast.error("User not found.");
      return;
    }

    // Force is_default to a strict boolean value
    const isDefault = data.is_default === true || (data.is_default as any) === "true" || (data.is_default as any) === "on";
    const payload = { ...data, is_default: isDefault };

    try {
      setLoading(true);
      if (addressToEdit) {
        await editAddress(addressToEdit.id, payload);
        toast.success("Address updated successfully.");
      } else {
        await addAddress({ ...payload, user_id: currentUser.id });
        toast.success("Address added successfully.");
      }
      onSuccess();
      onClose();
    } catch (error: any) {
      toast.error(error.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{addressToEdit ? "Edit Address" : "Add New Address"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name (e.g. Home, Work)</Label>
            <Input id="name" {...register("name", { required: true })} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="address_line_1">Address Line 1</Label>
            <Input id="address_line_1" {...register("address_line_1", { required: true })} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="address_line_2">Address Line 2 (Optional)</Label>
            <Input id="address_line_2" {...register("address_line_2")} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input id="city" {...register("city", { required: true })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="state">State</Label>
              <Input id="state" {...register("state", { required: true })} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="zip_code">Zip Code</Label>
            <Input id="zip_code" {...register("zip_code", { required: true })} />
          </div>
          <div className="flex items-center gap-2 pt-2">
            <input type="checkbox" id="is_default" {...register("is_default")} className="w-4 h-4" />
            <Label htmlFor="is_default" className="cursor-pointer">Set as default address</Label>
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : "Save Address"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddressForm;

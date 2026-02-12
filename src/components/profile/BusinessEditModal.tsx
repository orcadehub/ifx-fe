import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';

interface BusinessEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  initialData: {
    business_name?: string;
    category?: string;
    service_type?: string;
    website?: string;
    location?: string;
    business_status?: string;
    price_range?: string;
    account_status?: string;
  };
}

const BusinessEditModal: React.FC<BusinessEditModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
}) => {
  const [formData, setFormData] = useState({
    business_name: initialData.business_name || '',
    category: initialData.category || '',
    business_status: initialData.business_status || 'Registered',
    service_type: initialData.service_type || '',
    website: initialData.website || '',
    location: initialData.location || '',
    price_range: initialData.price_range || '',
    account_status: initialData.account_status || 'Public'
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setFormData({
      business_name: initialData.business_name || '',
      category: initialData.category || '',
      business_status: initialData.business_status || 'Registered',
      service_type: initialData.service_type || '',
      website: initialData.website || '',
      location: initialData.location || '',
      price_range: initialData.price_range || '',
      account_status: initialData.account_status || 'Public'
    });
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const handleSwitchChange = (checked: boolean) => {
    setFormData((prevData) => ({
      ...prevData,
      isRegistered: checked,
    }));
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const handleSubmit = async () => {
    setIsSaving(true);
    await onSave(formData);
    setIsSaving(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Business Information</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="business_name" className="text-right">
              Business Name
            </Label>
            <Input
              id="business_name"
              value={formData.business_name}
              onChange={handleChange}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="category" className="text-right">
              Category
            </Label>
            <Input
              id="category"
              value={formData.category}
              onChange={handleChange}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="business_status" className="text-right">
              Business Status
            </Label>
            <Input
              id="business_status"
              value={formData.business_status}
              onChange={handleChange}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="service_type" className="text-right">
              Service Type
            </Label>
            <Input
              id="service_type"
              value={formData.service_type}
              onChange={handleChange}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="website" className="text-right">
              Website
            </Label>
            <Input
              id="website"
              value={formData.website}
              onChange={handleChange}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="location" className="text-right">
              Location
            </Label>
            <Input
              id="location"
              value={formData.location}
              onChange={handleChange}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="price_range" className="text-right">
              Price Range
            </Label>
            <Input
              id="price_range"
              value={formData.price_range}
              placeholder="e.g., ₹5,000 - ₹50,000"
              onChange={handleChange}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="account_status" className="text-right">
              Account Management
            </Label>
            <select
              id="account_status"
              value={formData.account_status}
              onChange={handleSelectChange}
              className="col-span-3 border rounded px-3 py-2 bg-background text-foreground text-sm"
            >
              <option value="Public">Public</option>
              <option value="Private">Private</option>
            </select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isSaving}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSaving}>
            {isSaving ? 'Saving...' : 'Save changes'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BusinessEditModal; 
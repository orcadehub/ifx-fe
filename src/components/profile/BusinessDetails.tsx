import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Star, Pencil } from 'lucide-react';

interface BusinessDetailsProps {
  businessName: string;
  category: string;
  serviceType: string;
  website: string;
  location: string;
  isRegistered: boolean;
  accountStatus?: string;
  onEdit?: () => void;
}

const BusinessDetails: React.FC<BusinessDetailsProps> = ({
  businessName,
  category,
  serviceType,
  website,
  location,
  isRegistered,
  accountStatus,
  onEdit
}) => {
  // Format example price in INR
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };
  return <div className="space-y-4">
      {/* Business Info Card */}
      <Card className="overflow-hidden">
        <CardContent className="p-4">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-lg font-bold">Business Info</h2>
            {onEdit && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => {
                  console.log('Edit button clicked');
                  onEdit();
                }}
                className="h-8 px-2"
              >
                <Pencil className="h-4 w-4 mr-1" />
                Edit
              </Button>
            )}
          </div>
          <div className="space-y-3">
            <div>
              <p className="text-gray-600 text-sm mb-1">Business Name</p>
              <p className="font-medium">{businessName}</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm mb-1">Category</p>
              <p className="font-medium">{category}</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm mb-1">Business Status</p>
              <p className="font-medium">{isRegistered ? "Registered" : "Not Registered"}</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm mb-1">Service Type</p>
              <p className="font-medium">{serviceType}</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm mb-1">Visit our site</p>
              <p className="font-medium">{website}</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm mb-1">Location</p>
              <p className="font-medium">{location}</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm mb-1">Price Range</p>
              <p className="font-medium">{formatCurrency(5000)} - {formatCurrency(50000)}</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm mb-1">Account Management</p>
              <p className="font-medium">{accountStatus || 'Public'}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Activity Chart */}
      <Card className="overflow-hidden">
        
      </Card>
    </div>;
};
export default BusinessDetails;
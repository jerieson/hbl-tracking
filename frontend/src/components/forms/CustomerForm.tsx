import { useState } from 'react';
import { Customer, CustomerFormData } from '@/types/customer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Loader2 } from 'lucide-react';

interface CustomerFormProps {
  customer?: Customer;
  onSubmit: (data: Partial<Customer>) => Promise<void>;
  onCancel: () => void;
}

export const CustomerForm = ({ customer, onSubmit, onCancel }: CustomerFormProps) => {
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState<CustomerFormData>({
    first_name: customer?.first_name || '',
    last_name: customer?.last_name || '',
    email: customer?.email || '',
    country_code: customer?.country_code || '+63',
    contact_number: customer?.contact_number || '',
    designation: customer?.designation || '',
    company_name: customer?.company_name || '',
    business_address: customer?.business_address || '',
    nature_of_business: customer?.nature_of_business || '',
    area: customer?.area || '',
    remarks: customer?.remarks || '',
    status: customer?.status || 'active',
    tapped: customer?.tapped || false,
  });

  const handleChange = (field: keyof CustomerFormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const submitData: Partial<Customer> = {
        ...formData,
        first_name: formData.first_name || undefined,
        last_name: formData.last_name || undefined,
        email: formData.email || undefined,
        country_code: formData.country_code || undefined,
        contact_number: formData.contact_number || undefined,
        designation: formData.designation || undefined,
        nature_of_business: formData.nature_of_business || undefined,
        area: formData.area || undefined,
        remarks: formData.remarks || undefined,
      };
      
      await onSubmit(submitData);
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Required Information Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide">
            Required Information
          </h3>
          <Badge variant="destructive" className="text-[10px] px-1.5 py-0">Required</Badge>
        </div>
        
        {/* Company Name - Required */}
        <div className="space-y-2">
          <Label htmlFor="company_name" className="text-sm font-medium flex items-center gap-1">
            Company/Organization Name
            <span className="text-destructive">*</span>
          </Label>
          <Input
            id="company_name"
            value={formData.company_name}
            onChange={(e) => handleChange('company_name', e.target.value)}
            placeholder="e.g., Acme Corporation"
            required
            className="h-11"
          />
        </div>

        {/* Business Address - Required */}
        <div className="space-y-2">
          <Label htmlFor="business_address" className="text-sm font-medium flex items-center gap-1">
            Business Address
            <span className="text-destructive">*</span>
          </Label>
          <textarea
            id="business_address"
            value={formData.business_address}
            onChange={(e) => handleChange('business_address', e.target.value)}
            placeholder="Complete business address"
            required
            rows={3}
            className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
          />
        </div>
      </div>

      {/* Contact Information Section */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide border-b pb-2">
          Contact Information
        </h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* First Name */}
          <div className="space-y-2">
            <Label htmlFor="first_name" className="text-sm">First Name</Label>
            <Input
              id="first_name"
              value={formData.first_name}
              onChange={(e) => handleChange('first_name', e.target.value)}
              placeholder="John"
              className="h-11"
            />
          </div>

          {/* Last Name */}
          <div className="space-y-2">
            <Label htmlFor="last_name" className="text-sm">Last Name</Label>
            <Input
              id="last_name"
              value={formData.last_name}
              onChange={(e) => handleChange('last_name', e.target.value)}
              placeholder="Doe"
              className="h-11"
            />
          </div>
        </div>

        {/* Email */}
        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm">Email</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
            placeholder="john@example.com"
            className="h-11"
          />
        </div>

        <div className="grid grid-cols-3 gap-3">
          {/* Country Code */}
          <div className="space-y-2">
            <Label htmlFor="country_code" className="text-xs">Code</Label>
            <Input
              id="country_code"
              value={formData.country_code}
              onChange={(e) => handleChange('country_code', e.target.value)}
              placeholder="+63"
              className="h-11"
            />
          </div>

          {/* Contact Number */}
          <div className="space-y-2 col-span-2">
            <Label htmlFor="contact_number" className="text-xs">Contact Number</Label>
            <Input
              id="contact_number"
              type="tel"
              value={formData.contact_number}
              onChange={(e) => handleChange('contact_number', e.target.value)}
              placeholder="9123456789"
              className="h-11"
            />
          </div>
        </div>

        {/* Designation */}
        <div className="space-y-2">
          <Label htmlFor="designation" className="text-sm">Designation</Label>
          <Input
            id="designation"
            value={formData.designation}
            onChange={(e) => handleChange('designation', e.target.value)}
            placeholder="e.g., Sales Manager"
            className="h-11"
          />
        </div>
      </div>

      {/* Business Details Section */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide border-b pb-2">
          Business Details
        </h3>

        {/* Nature of Business */}
        <div className="space-y-2">
          <Label htmlFor="nature_of_business" className="text-sm">Nature of Business</Label>
          <Input
            id="nature_of_business"
            value={formData.nature_of_business}
            onChange={(e) => handleChange('nature_of_business', e.target.value)}
            placeholder="e.g., Retail, Manufacturing, Services"
            className="h-11"
          />
        </div>

        {/* Area */}
        <div className="space-y-2">
          <Label htmlFor="area" className="text-sm">Area</Label>
          <Input
            id="area"
            value={formData.area}
            onChange={(e) => handleChange('area', e.target.value)}
            placeholder="e.g., North District, Downtown"
            className="h-11"
          />
        </div>
      </div>

      {/* Additional Information Section */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide border-b pb-2">
          Additional Information
        </h3>

        {/* Remarks */}
        <div className="space-y-2">
          <Label htmlFor="remarks" className="text-sm">Remarks</Label>
          <textarea
            id="remarks"
            value={formData.remarks}
            onChange={(e) => handleChange('remarks', e.target.value)}
            placeholder="Any additional notes or comments..."
            rows={4}
            className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Status */}
          <div className="space-y-2">
            <Label htmlFor="status" className="text-sm font-medium">Status</Label>
            <Select
              value={formData.status}
              onValueChange={(value: 'active' | 'inactive') => handleChange('status', value)}
            >
              <SelectTrigger className="h-11">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Tapped */}
          <div className="space-y-2">
            <Label htmlFor="tapped" className="text-sm font-medium">Tapped</Label>
            <Select
              value={formData.tapped ? 'true' : 'false'}
              onValueChange={(value) => handleChange('tapped', value === 'true')}
            >
              <SelectTrigger className="h-11">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="true">Yes</SelectItem>
                <SelectItem value="false">No</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col-reverse sm:flex-row gap-3 pt-6 border-t">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onCancel}
          className="w-full sm:w-auto h-11"
        >
          Cancel
        </Button>
        <Button 
          type="submit" 
          disabled={loading}
          className="w-full sm:flex-1 h-11"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            customer ? 'Update Customer' : 'Add Customer'
          )}
        </Button>
      </div>
    </form>
  );
};
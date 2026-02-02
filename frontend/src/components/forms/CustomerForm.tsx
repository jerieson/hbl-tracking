import { useState, useEffect } from 'react';
import { Customer, CustomerFormData } from '@/types/customer';
import { useGeolocation } from '@/hooks/useGeolocation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MapPin, Loader2, CheckCircle2 } from 'lucide-react';

interface CustomerFormProps {
  customer?: Customer;
  onSubmit: (data: Partial<Customer>) => Promise<void>;
  onCancel: () => void;
}

export const CustomerForm = ({ customer, onSubmit, onCancel }: CustomerFormProps) => {
  const { coordinates, error: geoError, loading: geoLoading, getCurrentLocation } = useGeolocation();
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
    latitude: customer?.latitude,
    longitude: customer?.longitude,
    area: customer?.area || '',
    remarks: customer?.remarks || '',
    status: customer?.status || 'active',
    tapped: customer?.tapped || false,
  });

  useEffect(() => {
    if (coordinates) {
      setFormData(prev => ({
        ...prev,
        latitude: coordinates.latitude,
        longitude: coordinates.longitude,
      }));
    }
  }, [coordinates]);

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
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Section: Required Information */}
      <div className="space-y-4">
        <h3 className="text-base sm:text-lg font-semibold text-primary border-b-2 border-primary/20 pb-2">
          Required Information
        </h3>
        
        {/* Company Name - Required */}
        <div className="space-y-2">
          <Label htmlFor="company_name" className="text-sm sm:text-base font-medium flex items-center">
            Company/Organization Name
            <span className="text-destructive ml-1 text-lg">*</span>
          </Label>
          <Input
            id="company_name"
            value={formData.company_name}
            onChange={(e) => handleChange('company_name', e.target.value)}
            placeholder="e.g., Acme Corporation"
            required
            className="h-11 sm:h-12 text-base border-2 focus:border-primary"
          />
        </div>

        {/* Business Address - Required */}
        <div className="space-y-2">
          <Label htmlFor="business_address" className="text-sm sm:text-base font-medium flex items-center">
            Business Address
            <span className="text-destructive ml-1 text-lg">*</span>
          </Label>
          <textarea
            id="business_address"
            value={formData.business_address}
            onChange={(e) => handleChange('business_address', e.target.value)}
            placeholder="Complete business address"
            required
            rows={3}
            className="flex w-full rounded-md border-2 border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 focus:border-primary resize-none"
          />
        </div>
      </div>

      {/* Section: Contact Information */}
      <div className="space-y-4">
        <h3 className="text-base sm:text-lg font-semibold text-sage-dark border-b-2 border-sage-dark/20 pb-2">
          Contact Information
        </h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* First Name */}
          <div className="space-y-2">
            <Label htmlFor="first_name" className="text-sm sm:text-base">First Name</Label>
            <Input
              id="first_name"
              value={formData.first_name}
              onChange={(e) => handleChange('first_name', e.target.value)}
              placeholder="John"
              className="h-11 text-base border-2"
            />
          </div>

          {/* Last Name */}
          <div className="space-y-2">
            <Label htmlFor="last_name" className="text-sm sm:text-base">Last Name</Label>
            <Input
              id="last_name"
              value={formData.last_name}
              onChange={(e) => handleChange('last_name', e.target.value)}
              placeholder="Doe"
              className="h-11 text-base border-2"
            />
          </div>
        </div>

        {/* Email */}
        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm sm:text-base">Email</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
            placeholder="john@example.com"
            className="h-11 text-base border-2"
          />
        </div>

        <div className="grid grid-cols-3 gap-3">
          {/* Country Code */}
          <div className="space-y-2">
            <Label htmlFor="country_code" className="text-xs sm:text-sm">Code</Label>
            <Input
              id="country_code"
              value={formData.country_code}
              onChange={(e) => handleChange('country_code', e.target.value)}
              placeholder="+63"
              className="h-11 text-base border-2"
            />
          </div>

          {/* Contact Number */}
          <div className="space-y-2 col-span-2">
            <Label htmlFor="contact_number" className="text-xs sm:text-sm">Contact Number</Label>
            <Input
              id="contact_number"
              type="tel"
              value={formData.contact_number}
              onChange={(e) => handleChange('contact_number', e.target.value)}
              placeholder="9123456789"
              className="h-11 text-base border-2"
            />
          </div>
        </div>

        {/* Designation */}
        <div className="space-y-2">
          <Label htmlFor="designation" className="text-sm sm:text-base">Designation</Label>
          <Input
            id="designation"
            value={formData.designation}
            onChange={(e) => handleChange('designation', e.target.value)}
            placeholder="e.g., Sales Manager"
            className="h-11 text-base border-2"
          />
        </div>
      </div>

      {/* Section: Business Details */}
      <div className="space-y-4">
        <h3 className="text-base sm:text-lg font-semibold text-sage-dark border-b-2 border-sage-dark/20 pb-2">
          Business Details
        </h3>

        {/* Nature of Business */}
        <div className="space-y-2">
          <Label htmlFor="nature_of_business" className="text-sm sm:text-base">Nature of Business</Label>
          <Input
            id="nature_of_business"
            value={formData.nature_of_business}
            onChange={(e) => handleChange('nature_of_business', e.target.value)}
            placeholder="e.g., Retail, Manufacturing, Services"
            className="h-11 text-base border-2"
          />
        </div>

        {/* Area */}
        <div className="space-y-2">
          <Label htmlFor="area" className="text-sm sm:text-base">Area</Label>
          <Input
            id="area"
            value={formData.area}
            onChange={(e) => handleChange('area', e.target.value)}
            placeholder="e.g., North District, Downtown"
            className="h-11 text-base border-2"
          />
        </div>
      </div>

      {/* Section: Location */}
      <div className="space-y-4">
        <h3 className="text-base sm:text-lg font-semibold text-sage-dark border-b-2 border-sage-dark/20 pb-2">
          Location
        </h3>

        {/* Location Capture */}
        <div className="space-y-3">
          <Label className="text-sm sm:text-base">GPS Coordinates</Label>
          <Button
            type="button"
            variant="outline"
            onClick={getCurrentLocation}
            disabled={geoLoading}
            className="w-full h-12 border-2 hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all"
          >
            {geoLoading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Getting Location...
              </>
            ) : formData.latitude && formData.longitude ? (
              <>
                <CheckCircle2 className="mr-2 h-5 w-5 text-success" />
                Location Captured - Tap to Update
              </>
            ) : (
              <>
                <MapPin className="mr-2 h-5 w-5" />
                Capture Current Location
              </>
            )}
          </Button>
          
          {formData.latitude && formData.longitude && (
            <div className="bg-success/10 border-2 border-success/30 rounded-md p-3">
              <p className="text-xs sm:text-sm text-success font-mono text-center">
                📍 {formData.latitude}, {formData.longitude}
              </p>
            </div>
          )}
          
          {geoError && (
            <div className="bg-destructive/10 border-2 border-destructive/30 rounded-md p-3">
              <p className="text-xs sm:text-sm text-destructive text-center">{geoError}</p>
            </div>
          )}
          
          <p className="text-xs text-muted-foreground">
            Tap the button to automatically capture your current GPS coordinates
          </p>
        </div>
      </div>

      {/* Section: Additional Notes */}
      <div className="space-y-4">
        <h3 className="text-base sm:text-lg font-semibold text-sage-dark border-b-2 border-sage-dark/20 pb-2">
          Additional Information
        </h3>

        {/* Remarks */}
        <div className="space-y-2">
          <Label htmlFor="remarks" className="text-sm sm:text-base">Remarks</Label>
          <textarea
            id="remarks"
            value={formData.remarks}
            onChange={(e) => handleChange('remarks', e.target.value)}
            placeholder="Any additional notes or comments..."
            rows={4}
            className="flex w-full rounded-md border-2 border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 focus:border-primary resize-none"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Status */}
          <div className="space-y-2">
            <Label htmlFor="status" className="text-sm sm:text-base font-medium">Status</Label>
            <Select
              value={formData.status}
              onValueChange={(value: 'active' | 'inactive') => handleChange('status', value)}
            >
              <SelectTrigger className="h-11 border-2 text-base">
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
            <Label htmlFor="tapped" className="text-sm sm:text-base font-medium">Tapped</Label>
            <Select
              value={formData.tapped ? 'true' : 'false'}
              onValueChange={(value) => handleChange('tapped', value === 'true')}
            >
              <SelectTrigger className="h-11 border-2 text-base">
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
      <div className="flex flex-col-reverse sm:flex-row gap-3 pt-4 border-t-2 border-border">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onCancel}
          className="w-full sm:w-auto h-12 border-2 text-base"
        >
          Cancel
        </Button>
        <Button 
          type="submit" 
          disabled={loading}
          className="w-full sm:flex-1 h-12 bg-primary hover:bg-primary/90 text-base font-semibold shadow-md hover:shadow-lg transition-all"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
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
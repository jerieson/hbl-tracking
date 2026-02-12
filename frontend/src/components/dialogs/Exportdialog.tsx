import { useState } from 'react';
import { Customer } from '@/types/customer';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Calendar, Download, FileDown } from 'lucide-react';
import { toast } from 'sonner';

interface ExportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  customers: Customer[];
}

export const ExportDialog = ({ open, onOpenChange, customers }: ExportDialogProps) => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const handleExport = () => {
    try {
      // Filter customers by date range if dates are provided
      let filteredCustomers = customers;
      
      if (startDate || endDate) {
        filteredCustomers = customers.filter(customer => {
          const createdAt = new Date(customer.created_at || '');
          const start = startDate ? new Date(startDate) : null;
          const end = endDate ? new Date(endDate) : null;
          
          if (start && end) {
            return createdAt >= start && createdAt <= end;
          } else if (start) {
            return createdAt >= start;
          } else if (end) {
            return createdAt <= end;
          }
          return true;
        });
      }

      if (filteredCustomers.length === 0) {
        toast.error('No customers found in the selected date range');
        return;
      }

      // Create CSV content
      const headers = [
        'ID',
        'Company Name',
        'First Name',
        'Last Name',
        'Email',
        'Country Code',
        'Contact Number',
        'Designation',
        'Business Address',
        'Nature of Business',
        'Area',
        'Status',
        'Tapped',
        'Remarks',
        'Created At',
        'Updated At'
      ];

      const csvRows = [
        headers.join(','),
        ...filteredCustomers.map(customer => [
          customer.id || '',
          `"${(customer.company_name || '').replace(/"/g, '""')}"`,
          `"${(customer.first_name || '').replace(/"/g, '""')}"`,
          `"${(customer.last_name || '').replace(/"/g, '""')}"`,
          customer.email || '',
          customer.country_code || '',
          customer.contact_number || '',
          `"${(customer.designation || '').replace(/"/g, '""')}"`,
          `"${(customer.business_address || '').replace(/"/g, '""')}"`,
          `"${(customer.nature_of_business || '').replace(/"/g, '""')}"`,
          `"${(customer.area || '').replace(/"/g, '""')}"`,
          customer.status || '',
          customer.tapped ? 'Yes' : 'No',
          `"${(customer.remarks || '').replace(/"/g, '""')}"`,
          customer.created_at || '',
          customer.updated_at || ''
        ].join(','))
      ];

      const csvContent = csvRows.join('\n');

      // Create download link
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      
      const dateRange = startDate && endDate 
        ? `_${startDate}_to_${endDate}`
        : startDate 
        ? `_from_${startDate}`
        : endDate
        ? `_until_${endDate}`
        : '';
      
      link.setAttribute('href', url);
      link.setAttribute('download', `customers_export${dateRange}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success(`Exported ${filteredCustomers.length} customer${filteredCustomers.length !== 1 ? 's' : ''}`);
      onOpenChange(false);
      
      // Reset dates
      setStartDate('');
      setEndDate('');
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Failed to export customers');
    }
  };

  const handleExportAll = () => {
    setStartDate('');
    setEndDate('');
    // Trigger export immediately
    setTimeout(() => {
      handleExport();
    }, 100);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileDown className="h-5 w-5" />
            Export Customers
          </DialogTitle>
          <DialogDescription>
            Download customer data as CSV. Optionally filter by date range.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="start-date" className="text-sm font-medium flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Start Date (Optional)
            </Label>
            <Input
              id="start-date"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="h-10"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="end-date" className="text-sm font-medium flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              End Date (Optional)
            </Label>
            <Input
              id="end-date"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              min={startDate}
              className="h-10"
            />
          </div>

          {startDate && endDate && (
            <div className="bg-muted p-3 rounded-md text-sm">
              <p className="text-muted-foreground">
                Exporting customers created between{' '}
                <span className="font-medium text-foreground">{new Date(startDate).toLocaleDateString()}</span>
                {' '}and{' '}
                <span className="font-medium text-foreground">{new Date(endDate).toLocaleDateString()}</span>
              </p>
            </div>
          )}
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            onClick={handleExportAll}
            className="w-full sm:w-auto"
          >
            <Download className="mr-2 h-4 w-4" />
            Export All
          </Button>
          <Button
            onClick={handleExport}
            disabled={!customers.length}
            className="w-full sm:flex-1"
          >
            <FileDown className="mr-2 h-4 w-4" />
            {startDate || endDate ? 'Export Filtered' : 'Export'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
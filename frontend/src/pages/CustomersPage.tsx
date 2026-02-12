import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Customer } from '@/types/customer';
import { customerService } from '@/services/customerService';
import { authService } from '@/services/authService';
import { CustomerForm } from '@/components/forms/CustomerForm';
import { CustomerDataTable } from '@/components/tables/CustomerDataTable';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from 'sonner';
import { Plus, X, LogOut, User, Download } from 'lucide-react';
import { ExportDialog } from '@/components/dialogs/Exportdialog';

export const CustomersPage = () => {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | undefined>();
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [showExportDialog, setShowExportDialog] = useState(false);
  
  const user = authService.getUser();

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const response = await customerService.getAll({});
      setCustomers(response.data);
    } catch (error) {
      console.error('Error fetching customers:', error);
      toast.error('Failed to load customers');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (data: Partial<Customer>) => {
    try {
      await customerService.create(data);
      await fetchCustomers();
      setShowForm(false);
      toast.success('Customer added successfully');
    } catch (error) {
      console.error('Error creating customer:', error);
      toast.error('Failed to add customer');
    }
  };

  const handleUpdate = async (data: Partial<Customer>) => {
    if (!editingCustomer?.id) return;
    
    try {
      await customerService.update(editingCustomer.id, data);
      await fetchCustomers();
      setEditingCustomer(undefined);
      setShowForm(false);
      toast.success('Customer updated successfully');
    } catch (error) {
      console.error('Error updating customer:', error);
      toast.error('Failed to update customer');
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    
    try {
      await customerService.delete(deleteId);
      await fetchCustomers();
      toast.success('Customer deleted successfully');
    } catch (error) {
      console.error('Error deleting customer:', error);
      toast.error('Failed to delete customer');
    } finally {
      setDeleteId(null);
    }
  };

  const handleEdit = (customer: Customer) => {
    setEditingCustomer(customer);
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingCustomer(undefined);
  };

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-4 sm:py-6 max-w-7xl">
        {/* Header */}
        <div className="mb-6 animate-fade-in">
          <div className="flex flex-col gap-4 mb-6">
            {/* Title */}
            <div>
              <h1 className="text-4xl sm:text-4xl font-bold text-foreground mb-1">
                HBL
              </h1>
              <p className="text-sm text-muted-foreground">
                Manage your customer database
              </p>
            </div>
            
            {/* User Info & Actions */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              {/* User Badge */}
              <div className="flex items-center gap-2 px-3 py-2 bg-muted rounded-lg flex-1 sm:flex-none">
                <User className="h-5 w-5 text-muted-foreground" />
                <div className="flex flex-col min-w-0">
                  <span className="text-md font-medium text-foreground truncate">
                    {user?.full_name || user?.username}
                  </span>
                  <Badge variant="secondary" className="text-[12px] font-thin px-1.5 py-0 w-fit">
                    {user?.role}
                  </Badge>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                {!showForm && (
                  <>
                    <Button 
                      onClick={() => setShowExportDialog(true)}
                      variant="outline"
                      className="flex-1 sm:flex-none h-10 px-4"
                    >
                      <Download className="mr-2 h-4 w-4" />
                      <span className="hidden sm:inline">Export</span>
                      <span className="sm:hidden">Export CSV</span>
                    </Button>
                    
                    <Button 
                      onClick={() => setShowForm(true)}
                      className="flex-1 sm:flex-none h-10 px-4 bg-gradient-to-r from-teal-200 to-indigo-600"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Add Customer
                    </Button>
                  </>
                )}
                
                <Button
                  variant="outline"
                  onClick={handleLogout}
                  className="h-10 px-3 sm:px-4"
                >
                  <LogOut className="h-4 w-4 sm:mr-2" />
                  <span className="hidden sm:inline">Logout</span>
                </Button>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-border" />
        </div>

        {/* Form */}
        {showForm && (
          <Card className="mb-6 shadow-sm animate-slide-down">
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <CardTitle className="text-xl text-foreground">
                    {editingCustomer ? 'Edit Customer' : 'Add New Customer'}
                  </CardTitle>
                  <CardDescription className="text-sm mt-1">
                    {editingCustomer ? 'Update customer information' : 'Fill in the details to add a new customer'}
                  </CardDescription>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleCancel}
                  className="h-9 w-9 flex-shrink-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <CustomerForm
                customer={editingCustomer}
                onSubmit={editingCustomer ? handleUpdate : handleCreate}
                onCancel={handleCancel}
              />
            </CardContent>
          </Card>
        )}

        {/* Customer List */}
        {!showForm && (
          <div className="animate-fade-in">
            {loading ? (
              <Card className="shadow-sm">
                <CardContent className="p-12 sm:p-16">
                  <div className="flex flex-col items-center justify-center gap-3">
                    <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                    <div className="text-muted-foreground text-sm">Loading customers...</div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <CustomerDataTable
                data={customers}
                onEdit={handleEdit}
                onDelete={(id) => setDeleteId(id)}
              />
            )}
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteId !== null} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the customer record.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Export Dialog */}
      <ExportDialog
        open={showExportDialog}
        onOpenChange={setShowExportDialog}
        customers={customers}
      />
    </div>
  );
};
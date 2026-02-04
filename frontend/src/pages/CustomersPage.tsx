import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Customer } from '@/types/customer';
import { customerService } from '@/services/customerService';
import { authService } from '@/services/authService';
import { CustomerForm } from '@/components/forms/CustomerForm';
import { CustomerDataTable } from '@/components/tables/CustomerDataTable';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, X, LogOut, User } from 'lucide-react';

export const CustomersPage = () => {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | undefined>();
  
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
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (data: Partial<Customer>) => {
    try {
      await customerService.create(data);
      await fetchCustomers();
      setShowForm(false);
    } catch (error) {
      console.error('Error creating customer:', error);
    }
  };

  const handleUpdate = async (data: Partial<Customer>) => {
    if (!editingCustomer?.id) return;
    
    try {
      await customerService.update(editingCustomer.id, data);
      await fetchCustomers();
      setEditingCustomer(undefined);
      setShowForm(false);
    } catch (error) {
      console.error('Error updating customer:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this customer?')) return;
    
    try {
      await customerService.delete(id);
      await fetchCustomers();
    } catch (error) {
      console.error('Error deleting customer:', error);
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
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-6 sm:mb-8 animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div className="flex-1">
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-display text-primary mb-2">
                HBL
              </h1>
              <p className="text-sm sm:text-base text-muted-foreground">
                Customer Database Management
              </p>
            </div>
            
            {/* User Info & Actions */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              {/* User Badge */}
              <div className="flex items-center gap-2 px-4 py-2.5 bg-muted/50 rounded-lg border-2 border-border">
                <User className="h-4 w-4 text-primary" />
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-foreground">
                    {user?.full_name || user?.username}
                  </span>
                  <span className="text-xs text-muted-foreground capitalize">
                    {user?.role}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                {!showForm && (
                  <Button 
                    onClick={() => setShowForm(true)}
                    className="flex-1 sm:flex-none h-11 sm:h-12 px-6 bg-primary hover:bg-primary/90 shadow-md hover:shadow-lg transition-all"
                  >
                    <Plus className="mr-2 h-5 w-5" />
                    Add Customer
                  </Button>
                )}
                
                <Button
                  variant="outline"
                  onClick={handleLogout}
                  className="h-11 sm:h-12 px-4 border-2 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30"
                >
                  <LogOut className="h-5 w-5 sm:mr-2" />
                  <span className="hidden sm:inline">Logout</span>
                </Button>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="h-0.5 bg-border rounded-full" />
        </div>

        {/* Form */}
        {showForm && (
          <Card className="mb-6 sm:mb-8 shadow-lg border-2 border-border animate-slide-up">
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <CardTitle className="text-xl sm:text-2xl text-primary">
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
                  className="h-9 w-9 flex-shrink-0 hover:bg-muted"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="px-4 sm:px-6">
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
              <Card className="shadow-lg border-2 border-border">
                <CardContent className="p-12 sm:p-16">
                  <div className="flex flex-col items-center justify-center gap-3">
                    <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                    <div className="text-muted-foreground">Loading customers...</div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <CustomerDataTable
                data={customers}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};
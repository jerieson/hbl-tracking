import { useState, useEffect } from 'react';
import { Customer, CustomerFilters } from '@/types/customer';
import { customerService } from '@/services/customerService';
import { CustomerForm } from '@/components/forms/CustomerForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Search, Edit, Trash2, MapPin, Building2, Mail, Phone, Briefcase, X, Filter } from 'lucide-react';

export const CustomersPage = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | undefined>();
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<CustomerFilters>({
    status: 'all',
    tapped: 'all',
    search: '',
  });

  useEffect(() => {
    fetchCustomers();
  }, [filters]);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const response = await customerService.getAll({
        status: filters.status === 'all' ? undefined : filters.status,
        tapped: filters.tapped === 'all' ? undefined : filters.tapped,
        search: filters.search || undefined,
      });
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

  const activeFiltersCount = [
    filters.status !== 'all',
    filters.tapped !== 'all',
  ].filter(Boolean).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-sage-light/30">
      <div className="container mx-auto p-3 sm:p-4 md:p-6 max-w-7xl">
        {/* Header */}
        <div className="mb-4 sm:mb-6 animate-fade-in">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-display text-primary mb-1">
                HBL
              </h1>
              <p className="text-sm sm:text-base text-muted-foreground">
                {customers.length} {customers.length === 1 ? 'customer' : 'customers'} in database
              </p>
            </div>
            {!showForm && (
              <Button 
                onClick={() => setShowForm(true)}
                className="h-10 sm:h-11 px-3 sm:px-6 bg-primary hover:bg-primary/90 shadow-md hover:shadow-lg transition-all"
              >
                <Plus className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                <span className="hidden sm:inline">Add Customer</span>
                <span className="sm:hidden">Add</span>
              </Button>
            )}
          </div>

          {/* Search and Filter Bar */}
          {!showForm && (
            <div className="space-y-3 animate-slide-up">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
                <Input
                  placeholder="Search by company, name, or email..."
                  value={filters.search}
                  onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                  className="pl-9 sm:pl-10 h-11 sm:h-12 text-base bg-white/80 backdrop-blur-sm border-2 focus:border-primary"
                />
              </div>

              {/* Filter Toggle Button (Mobile) */}
              <div className="md:hidden">
                <Button
                  variant="outline"
                  onClick={() => setShowFilters(!showFilters)}
                  className="w-full h-11 border-2 bg-white/80 backdrop-blur-sm"
                >
                  <Filter className="mr-2 h-4 w-4" />
                  Filters
                  {activeFiltersCount > 0 && (
                    <span className="ml-2 bg-primary text-primary-foreground rounded-full px-2 py-0.5 text-xs">
                      {activeFiltersCount}
                    </span>
                  )}
                </Button>
              </div>

              {/* Filters */}
              <div className={`grid md:grid-cols-2 gap-3 ${showFilters ? 'grid' : 'hidden md:grid'}`}>
                <Select
                  value={filters.status || 'all'}
                  onValueChange={(value) => setFilters(prev => ({ ...prev, status: value as any }))}
                >
                  <SelectTrigger className="h-11 border-2 bg-white/80 backdrop-blur-sm text-base">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>

                <Select
                  value={String(filters.tapped) || 'all'}
                  onValueChange={(value) => setFilters(prev => ({ ...prev, tapped: value === 'all' ? 'all' : value === 'true' }))}
                >
                  <SelectTrigger className="h-11 border-2 bg-white/80 backdrop-blur-sm text-base">
                    <SelectValue placeholder="Filter by tapped" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Tapped Status</SelectItem>
                    <SelectItem value="true">Tapped: Yes</SelectItem>
                    <SelectItem value="false">Tapped: No</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </div>

        {/* Form */}
        {showForm && (
          <Card className="mb-6 shadow-lg border-2 animate-scale-in glass-card">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl sm:text-2xl text-primary">
                    {editingCustomer ? 'Edit Customer' : 'Add New Customer'}
                  </CardTitle>
                  <CardDescription className="text-sm sm:text-base mt-1">
                    {editingCustomer ? 'Update customer information' : 'Fill in the details to add a new customer'}
                  </CardDescription>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleCancel}
                  className="h-8 w-8 md:hidden"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="px-3 sm:px-6">
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
          <div className="space-y-3 sm:space-y-4">
            {loading ? (
              <Card className="shadow-md">
                <CardContent className="p-6 sm:p-8">
                  <div className="flex items-center justify-center">
                    <div className="animate-pulse-subtle text-muted-foreground">
                      Loading customers...
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : customers.length === 0 ? (
              <Card className="shadow-md">
                <CardContent className="empty-state py-12">
                  <Building2 className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
                  <p className="text-lg font-medium text-foreground mb-2">No customers found</p>
                  <p className="text-sm text-muted-foreground">
                    {filters.search || filters.status !== 'all' || filters.tapped !== 'all'
                      ? 'Try adjusting your filters'
                      : 'Get started by adding your first customer'}
                  </p>
                </CardContent>
              </Card>
            ) : (
              customers.map((customer, index) => (
                <Card 
                  key={customer.id} 
                  className="shadow-md hover:shadow-xl border-2 transition-all duration-300 card-hover glass-card animate-slide-up"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex flex-col gap-4">
                      {/* Header Section */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap mb-2">
                            <Building2 className="h-5 w-5 sm:h-6 sm:w-6 text-primary flex-shrink-0" />
                            <h3 className="text-lg sm:text-xl font-semibold text-foreground truncate">
                              {customer.company_name}
                            </h3>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            <span
                              className={`status-badge ${
                                customer.status === 'active'
                                  ? 'bg-success/15 text-success border border-success/30'
                                  : 'bg-muted text-muted-foreground border border-border'
                              }`}
                            >
                              {customer.status}
                            </span>
                            {customer.tapped && (
                              <span className="status-badge bg-info/15 text-info border border-info/30">
                                Tapped
                              </span>
                            )}
                          </div>
                        </div>
                        
                        {/* Action Buttons */}
                        <div className="flex gap-2 flex-shrink-0">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleEdit(customer)}
                            className="h-9 w-9 sm:h-10 sm:w-10 border-2 hover:bg-primary hover:text-primary-foreground hover:border-primary"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => customer.id && handleDelete(customer.id)}
                            className="h-9 w-9 sm:h-10 sm:w-10 border-2 hover:bg-destructive hover:text-destructive-foreground hover:border-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      {/* Details Section */}
                      <div className="space-y-2 text-sm sm:text-base">
                        {/* Contact Person */}
                        {(customer.first_name || customer.last_name) && (
                          <div className="flex items-center gap-2 text-foreground/90">
                            <Briefcase className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                            <span className="font-medium">
                              {customer.first_name} {customer.last_name}
                              {customer.designation && (
                                <span className="text-muted-foreground ml-1">
                                  • {customer.designation}
                                </span>
                              )}
                            </span>
                          </div>
                        )}

                        {/* Email */}
                        {customer.email && (
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Mail className="h-4 w-4 flex-shrink-0" />
                            <a 
                              href={`mailto:${customer.email}`}
                              className="hover:text-primary transition-colors truncate"
                            >
                              {customer.email}
                            </a>
                          </div>
                        )}

                        {/* Phone */}
                        {customer.contact_number && (
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Phone className="h-4 w-4 flex-shrink-0" />
                            <a 
                              href={`tel:${customer.country_code}${customer.contact_number}`}
                              className="hover:text-primary transition-colors"
                            >
                              {customer.country_code} {customer.contact_number}
                            </a>
                          </div>
                        )}

                        {/* Address */}
                        <div className="flex items-start gap-2 text-muted-foreground">
                          <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="leading-relaxed">{customer.business_address}</p>
                            {customer.area && (
                              <p className="text-xs mt-1 text-muted-foreground/75">
                                Area: {customer.area}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Coordinates */}
                        {customer.latitude && customer.longitude && (
                          <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/50 px-3 py-2 rounded-md">
                            <MapPin className="h-3 w-3" />
                            <span className="font-mono">
                              {customer.latitude}, {customer.longitude}
                            </span>
                          </div>
                        )}

                        {/* Nature of Business */}
                        {customer.nature_of_business && (
                          <div className="text-sm text-muted-foreground bg-muted/30 px-3 py-2 rounded-md">
                            <span className="font-medium">Business:</span> {customer.nature_of_business}
                          </div>
                        )}

                        {/* Remarks */}
                        {customer.remarks && (
                          <div className="text-sm text-muted-foreground bg-accent/20 px-3 py-2 rounded-md border-l-2 border-accent">
                            <span className="font-medium">Note:</span> {customer.remarks}
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};
'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Download, Eye } from 'lucide-react';
import { apiGet } from '@/lib/api-client';
import { useAuth } from '@/hooks/useAuth';

interface Patient {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  dateOfBirth?: string;
  gender?: string;
  address?: string;
  isActive: boolean;
  createdAt: string;
  profile?: {
    emergencyContact?: string;
    medicalHistory?: string;
  };
}

export default function AdminPatientsPage() {
  const { user } = useAuth();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const loadPatients = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      params.append('userType', 'patient');
      if (searchTerm) params.append('search', searchTerm);

      const response = await apiGet<{ users: Patient[] }>(`/api/admin/users?${params.toString()}`);
      if (!response.success || !response.data) {
        setError(response.error || 'Failed to load patients');
        setPatients([]);
        return;
      }

      setPatients(response.data.users || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load patients');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      loadPatients();
    }
  }, [user, searchTerm]);

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-600">Redirecting to login...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 space-y-6">
      {error && (
        <div className="flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Patient Database</CardTitle>
                <CardDescription>Search and view patient records - read-only by default</CardDescription>
              </div>
              <div className="flex gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <Input
                    placeholder="Search patients..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-64"
                  />
                </div>
                <Button variant="outline" className="gap-2">
                  <Download className="h-4 w-4" /> Export
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">Loading patients...</div>
            ) : (
              <div className="space-y-4">
                {patients.map((patient) => (
                  <div key={patient.id} className="flex items-center justify-between rounded-lg border border-slate-200 bg-white p-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <p className="font-medium text-slate-900">{patient.firstName} {patient.lastName}</p>
                        <Badge variant={patient.isActive ? 'default' : 'outline'}>
                          {patient.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                      <p className="text-sm text-slate-600">{patient.email}</p>
                      {patient.phoneNumber && <p className="text-sm text-slate-500">{patient.phoneNumber}</p>}
                      {patient.dateOfBirth && (
                        <p className="text-sm text-slate-500">
                          DOB: {new Date(patient.dateOfBirth).toLocaleDateString()}
                          {patient.gender && ` • ${patient.gender}`}
                        </p>
                      )}
                      {patient.address && <p className="text-sm text-slate-500">{patient.address}</p>}
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-2" /> View Details
                      </Button>
                    </div>
                  </div>
                ))}
                {patients.length === 0 && (
                  <div className="text-center py-8 text-slate-500">
                    No patients found matching your search.
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
}
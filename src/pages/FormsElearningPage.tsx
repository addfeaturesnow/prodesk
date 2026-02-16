import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  Download, FileText, CheckCircle, Clock, AlertCircle, Plus, Search, 
  Filter, Eye, Edit, Trash2, BookOpen, Award, Users
} from 'lucide-react';
import { apiClient } from '@/integrations/api/client';

interface FormSubmission {
  id: string;
  date: string;
  status: 'completed' | 'pending' | 'expired';
  diverName: string;
  formName: string;
  fileName: string;
  fileSize: string;
}

interface PADIForm {
  id: string;
  name: string;
  description: string;
  category: 'liability' | 'medical' | 'certification' | 'training';
  downloadUrl: string;
  fileSize: string;
  required: boolean;
}

export default function FormsElearningPage() {
  const [submissions, setSubmissions] = useState<FormSubmission[]>([]);
  const [divers, setDivers] = useState<any[]>([]);
  const [selectedDiver, setSelectedDiver] = useState('');
  const [selectedForm, setSelectedForm] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  // PADI Forms data
  const padiForms: PADIForm[] = [
    {
      id: 'liability-release',
      name: 'PADI Liability Release',
      description: 'Liability release and assumption of risk agreement',
      category: 'liability',
      downloadUrl: '/forms/padi-liability-release.pdf',
      fileSize: '245 KB',
      required: true
    },
    {
      id: 'medical-statement',
      name: 'PADI Medical Statement',
      description: 'Medical questionnaire and physician\'s approval form',
      category: 'medical',
      downloadUrl: '/forms/padi-medical-statement.pdf',
      fileSize: '380 KB',
      required: true
    },
    {
      id: 'safe-practices',
      name: 'PADI Safe Diving Practices',
      description: 'Safe diving practices statement of understanding',
      category: 'training',
      downloadUrl: '/forms/padi-safe-practices.pdf',
      fileSize: '156 KB',
      required: true
    },
    {
      id: 'certification-card',
      name: 'PADI Certification Card Application',
      description: 'Application for PADI certification card',
      category: 'certification',
      downloadUrl: '/forms/padi-certification-application.pdf',
      fileSize: '198 KB',
      required: false
    },
    {
      id: 'experience-program',
      name: 'PADI Experience Program',
      description: 'Discover Scuba Diving experience program form',
      category: 'training',
      downloadUrl: '/forms/padi-experience-program.pdf',
      fileSize: '267 KB',
      required: false
    },
    {
      id: 'medical-evaluation',
      name: 'PADI Medical Evaluation',
      description: 'Medical evaluation form for diving physicians',
      category: 'medical',
      downloadUrl: '/forms/padi-medical-evaluation.pdf',
      fileSize: '412 KB',
      required: false
    }
  ];

  // Sample submission data
  const sampleSubmissions: FormSubmission[] = [
    {
      id: '1',
      date: '2026-02-15',
      status: 'completed',
      diverName: 'Peter Greaney',
      formName: 'PADI Liability Release',
      fileName: 'peter-greaney-liability-2026.pdf',
      fileSize: '245 KB'
    },
    {
      id: '2',
      date: '2026-02-14',
      status: 'completed',
      diverName: 'Sarah Johnson',
      formName: 'PADI Medical Statement',
      fileName: 'sarah-johnson-medical-2026.pdf',
      fileSize: '380 KB'
    },
    {
      id: '3',
      date: '2026-02-13',
      status: 'pending',
      diverName: 'Mike Chen',
      formName: 'PADI Liability Release',
      fileName: 'mike-chen-liability-draft.pdf',
      fileSize: '245 KB'
    },
    {
      id: '4',
      date: '2026-02-10',
      status: 'expired',
      diverName: 'Emily Davis',
      formName: 'PADI Medical Statement',
      fileName: 'emily-davis-medical-2025.pdf',
      fileSize: '380 KB'
    }
  ];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // Load divers
      const diversData = await apiClient.divers.list();
      setDivers(Array.isArray(diversData) ? diversData : []);
      
      // Load form submissions (using sample data for now)
      setSubmissions(sampleSubmissions);
    } catch (err) {
      console.error('Failed to load data:', err);
      // Use sample data if API fails
      setSubmissions(sampleSubmissions);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge variant="default" className="flex items-center gap-1 w-fit"><CheckCircle className="w-3 h-3" />Completed</Badge>;
      case 'pending':
        return <Badge variant="secondary" className="flex items-center gap-1 w-fit"><Clock className="w-3 h-3" />Pending</Badge>;
      case 'expired':
        return <Badge variant="destructive" className="flex items-center gap-1 w-fit"><AlertCircle className="w-3 h-3" />Expired</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const filteredSubmissions = submissions.filter(submission => {
    const matchesSearch = submission.diverName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         submission.formName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         submission.fileName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || submission.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleCreateNewForm = () => {
    if (!selectedDiver || !selectedForm) {
      alert('Please select both a diver and a form');
      return;
    }
    // Implementation for creating new form submission
    console.log('Creating form submission:', { diver: selectedDiver, form: selectedForm });
    alert('Form submission created successfully!');
    setSelectedDiver('');
    setSelectedForm('');
  };

  const handleDownloadForm = (form: PADIForm) => {
    // In a real app, this would trigger actual file download
    console.log('Downloading form:', form.name);
    alert(`Downloading ${form.name} (${form.fileSize})`);
  };

  const handleViewSubmission = (submission: FormSubmission) => {
    console.log('Viewing submission:', submission);
    alert(`Viewing ${submission.fileName}`);
  };

  const handleDeleteSubmission = (id: string) => {
    if (confirm('Are you sure you want to delete this form submission?')) {
      setSubmissions(prev => prev.filter(s => s.id !== id));
      alert('Form submission deleted successfully');
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-muted-foreground">Loading forms and e-learning...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="page-header">
        <h1 className="page-title">Forms & E-learning</h1>
        <p className="page-description">Manage diver forms, downloads, and training materials</p>
      </div>

      {/* Downloadable Forms Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="w-5 h-5" />
            Downloadable PADI Forms
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {padiForms.map((form) => (
              <Card key={form.id} className="hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <h3 className="font-semibold">{form.name}</h3>
                        <p className="text-sm text-muted-foreground">{form.description}</p>
                      </div>
                      {form.required && (
                        <Badge variant="destructive" className="text-xs">Required</Badge>
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">{form.fileSize}</span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDownloadForm(form)}
                        className="flex items-center gap-1"
                      >
                        <Download className="w-3 h-3" />
                        Download
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* New Digital Form Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="w-5 h-5" />
            New Digital Form
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="diver-select">Select Diver</Label>
              <Select value={selectedDiver} onValueChange={setSelectedDiver}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a diver..." />
                </SelectTrigger>
                <SelectContent>
                  {divers.map((diver) => (
                    <SelectItem key={diver.id} value={diver.id}>
                      {diver.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="form-select">Select Form</Label>
              <Select value={selectedForm} onValueChange={setSelectedForm}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a form..." />
                </SelectTrigger>
                <SelectContent>
                  {padiForms.map((form) => (
                    <SelectItem key={form.id} value={form.id}>
                      {form.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button 
                onClick={handleCreateNewForm}
                disabled={!selectedDiver || !selectedForm}
                className="w-full"
              >
                Create Form Submission
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Completed Diver Forms Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Completed Diver Forms
            </CardTitle>
            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search forms..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="expired">Expired</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredSubmissions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No form submissions found
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Diver</TableHead>
                  <TableHead>Form</TableHead>
                  <TableHead>File</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSubmissions.map((submission) => (
                  <TableRow key={submission.id}>
                    <TableCell>{submission.date}</TableCell>
                    <TableCell>{getStatusBadge(submission.status)}</TableCell>
                    <TableCell className="font-medium">{submission.diverName}</TableCell>
                    <TableCell>{submission.formName}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">{submission.fileName}</span>
                        <span className="text-xs text-muted-foreground">({submission.fileSize})</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewSubmission(submission)}
                        >
                          <Eye className="w-3 h-3" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteSubmission(submission.id)}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* E-learning Resources */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            E-learning Resources
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
              <BookOpen className="w-8 h-8" />
              <span className="text-sm">Open Water Diver</span>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
              <Award className="w-8 h-8" />
              <span className="text-sm">Advanced Diver</span>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
              <Users className="w-8 h-8" />
              <span className="text-sm">Rescue Diver</span>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
              <FileText className="w-8 h-8" />
              <span className="text-sm">All Courses</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

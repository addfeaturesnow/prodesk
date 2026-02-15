import { useState, useEffect } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { apiClient } from "@/integrations/api/client";
import { useToast } from "@/hooks/use-toast";

export default function CoursesPage() {
  const [courses, setCourses] = useState<any[]>([]);
  const [instructors, setInstructors] = useState<any[]>([]);
  const [boats, setBoats] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", description: "", instructor_id: "", boat_id: "", start_date: "", end_date: "", max_students: "6", price: "0" });
  const { toast } = useToast();

  const load = async () => {
    try {
      const [c, i, b] = await Promise.all([
        apiClient.courses.list(),
        apiClient.instructors.list(),
        apiClient.boats.list(),
      ]);
      setCourses(c);
      setInstructors(i);
      setBoats(b);
    } catch (err) {
      toast({ title: "Error", description: String(err), variant: "destructive" });
    }
  };

  useEffect(() => { load(); }, []);

  const handleSubmit = async () => {
    if (!form.name) return;
    try {
      await apiClient.courses.create({
        name: form.name, 
        description: form.description || null,
        instructor_id: form.instructor_id || null, 
        boat_id: form.boat_id || null,
        start_date: form.start_date || null, 
        end_date: form.end_date || null,
        max_students: Number(form.max_students) || 6, 
        price: Number(form.price) || 0,
      });
      setForm({ name: "", description: "", instructor_id: "", boat_id: "", start_date: "", end_date: "", max_students: "6", price: "0" });
      setOpen(false);
      load();
      toast({ title: "Success", description: "Course created successfully" });
    } catch (err) {
      toast({ title: "Error", description: String(err), variant: "destructive" });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await apiClient.courses.delete(id);
      load();
      toast({ title: "Success", description: "Course deleted successfully" });
    } catch (err) {
      toast({ title: "Error", description: String(err), variant: "destructive" });
    }
  };

  return (
    <div>
      <div className="page-header flex items-center justify-between">
        <div>
          <h1 className="page-title">Courses</h1>
          <p className="page-description">Manage dive courses with instructors and boats</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild><Button><Plus className="h-4 w-4 mr-2" />Add Course</Button></DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader><DialogTitle>New Course</DialogTitle></DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2"><Label>Course Name</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
              <div className="grid gap-2"><Label>Description</Label><Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Instructor</Label>
                  <Select value={form.instructor_id} onValueChange={(v) => setForm({ ...form, instructor_id: v })}>
                    <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent>{instructors.map((i) => <SelectItem key={i.id} value={i.id}>{i.name}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label>Boat</Label>
                  <Select value={form.boat_id} onValueChange={(v) => setForm({ ...form, boat_id: v })}>
                    <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent>{boats.map((b) => <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2"><Label>Start Date</Label><Input type="date" value={form.start_date} onChange={(e) => setForm({ ...form, start_date: e.target.value })} /></div>
                <div className="grid gap-2"><Label>End Date</Label><Input type="date" value={form.end_date} onChange={(e) => setForm({ ...form, end_date: e.target.value })} /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2"><Label>Max Students</Label><Input type="number" value={form.max_students} onChange={(e) => setForm({ ...form, max_students: e.target.value })} /></div>
                <div className="grid gap-2"><Label>Price ($)</Label><Input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} /></div>
              </div>
              <Button onClick={handleSubmit}>Save Course</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {courses.map((c) => (
          <div key={c.id} className="bg-card rounded-lg border p-5 relative group">
            <Button variant="ghost" size="icon" className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => handleDelete(c.id)}>
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
            <p className="font-semibold text-lg">{c.name}</p>
            {c.description && <p className="text-sm text-muted-foreground mt-1">{c.description}</p>}
            <div className="grid grid-cols-2 gap-2 mt-3 text-sm">
              <div><span className="text-muted-foreground">Instructor:</span> {c.instructors?.name || "—"}</div>
              <div><span className="text-muted-foreground">Boat:</span> {c.boats?.name || "—"}</div>
              <div><span className="text-muted-foreground">Dates:</span> {c.start_date || "—"} → {c.end_date || "—"}</div>
              <div><span className="text-muted-foreground">Price:</span> <span className="font-mono font-medium">${c.price}</span></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

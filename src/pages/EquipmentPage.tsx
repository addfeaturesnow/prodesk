import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { apiClient } from '@/integrations/api/client';
import { Trash2, Plus, Save } from 'lucide-react';

export default function EquipmentPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [edits, setEdits] = useState<Record<string, any>>({});

  const load = async () => {
    setLoading(true);
    try {
      const data = await apiClient.equipment.list();
      setItems(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to load equipment', err);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const getStatus = (it: any) => {
    if (typeof it.quantity_available_for_rent === 'number') {
      return it.quantity_available_for_rent > 0 ? 'Available' : 'Rented out';
    }
    return 'Unknown';
  };

  const handleEdit = (id: string, field: string, value: any) => {
    setEdits((e) => ({ ...e, [id]: { ...e[id], [field]: value } }));
  };

  const handleSave = async (id: string) => {
    const payload = edits[id];
    if (!payload) return;
    try {
      await apiClient.equipment.update(id, payload);
      await load();
      setEdits((e) => { const c = { ...e }; delete c[id]; return c; });
    } catch (err) {
      console.error('Save failed', err);
      alert('Failed to save changes');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this equipment item?')) return;
    try {
      await apiClient.equipment.delete(id);
      await load();
    } catch (err) {
      console.error('Delete failed', err);
      alert('Failed to delete');
    }
  };

  const addExamples = async () => {
    const examples = [
      { name: 'BCD (Buoyancy Compensator)', category: 'Dive Gear', price: 199.99, can_rent: true, rent_price_per_day: 10, quantity_in_stock: 5, quantity_available_for_rent: 5 },
      { name: 'Regulator Set', category: 'Dive Gear', price: 349.99, can_rent: true, rent_price_per_day: 15, quantity_in_stock: 3, quantity_available_for_rent: 3 },
      { name: 'Wetsuit (3mm)', category: 'Apparel', price: 79.99, can_rent: true, rent_price_per_day: 5, quantity_in_stock: 6, quantity_available_for_rent: 6 },
      { name: 'Dive Computer', category: 'Electronics', price: 499.99, can_rent: false, rent_price_per_day: 0, quantity_in_stock: 2, quantity_available_for_rent: 0 },
    ];
    try {
      for (const ex of examples) {
        await apiClient.equipment.create(ex);
      }
      await load();
    } catch (err) {
      console.error('Failed to create examples', err);
      alert('Failed to add example items');
    }
  };

  return (
    <div>
      <div className="page-header flex items-center justify-between mb-4">
        <div>
          <h1 className="page-title">Equipment</h1>
          <p className="page-description">Inventory and rental status. Edit prices inline.</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={addExamples} variant="outline"><Plus className="mr-2 h-4 w-4" />Add Example Items</Button>
          <Button onClick={load}><Save className="mr-2 h-4 w-4" />Refresh</Button>
        </div>
      </div>

      <div className="bg-card rounded-lg border overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-muted-foreground">Loading equipment…</div>
        ) : (
          <table className="data-table w-full">
            <thead>
              <tr className="bg-muted/50">
                <th>Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Rent /day</th>
                <th>Available</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 ? (
                <tr><td colSpan={7} className="text-center py-8 text-muted-foreground">No equipment yet</td></tr>
              ) : items.map((it) => (
                <tr key={it.id} className="hover:bg-muted/30 transition-colors">
                  <td className="max-w-xs">
                    <div className="font-medium">{it.name}</div>
                    <div className="text-xs text-muted-foreground">{it.sku || ''} {it.barcode ? `· ${it.barcode}` : ''}</div>
                  </td>
                  <td>{it.category}</td>
                  <td>
                    <Input type="number" value={(edits[it.id]?.price ?? it.price ?? 0)} onChange={(e) => handleEdit(it.id, 'price', Number(e.target.value))} className="w-28" />
                  </td>
                  <td>
                    <Input type="number" value={(edits[it.id]?.rent_price_per_day ?? it.rent_price_per_day ?? 0)} onChange={(e) => handleEdit(it.id, 'rent_price_per_day', Number(e.target.value))} className="w-28" />
                  </td>
                  <td>{it.quantity_available_for_rent ?? it.quantity_in_stock ?? 0}</td>
                  <td>
                    <Badge variant={getStatus(it) === 'Available' ? 'secondary' : 'destructive'}>{getStatus(it)}</Badge>
                  </td>
                  <td>
                    <div className="flex gap-2 justify-end">
                      <Button size="sm" onClick={() => handleSave(it.id)}>Save</Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(it.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

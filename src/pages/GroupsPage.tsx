import React, { useState, useEffect } from 'react';
import useGroups from '@/hooks/useGroups';
import { apiClient } from '@/integrations/api/client';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Diver {
  id: string;
  name: string;
}

interface Course {
  id: string;
  name: string;
  price: number;
}

interface DiveSite {
  id: string;
  name: string;
  location: string;
  max_depth: number;
  difficulty: string;
}

interface GroupMember {
  id: string;
  diver: Diver | null;
  role: string | null;
}

interface Group {
  id: string;
  name: string;
  type: 'fundive' | 'course';
  days: number | null;
  course: Course | null;
  leader: Diver | null;
  members: GroupMember[];
}

interface ItineraryItem {
  id: string;
  group_id: string;
  day_number: number;
  dive_site_id: string | null;
  notes: string | null;
  site_name: string | null;
  location: string | null;
  max_depth: number | null;
  difficulty: string | null;
}

export default function GroupsPage() {
  const { groups, loading, error, refresh, createGroup, addMember, removeMember } = useGroups();
  const [divers, setDivers] = useState<Diver[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [diveSites, setDiveSites] = useState<DiveSite[]>([]);
  const [name, setName] = useState('');
  const [groupType, setGroupType] = useState<'fundive' | 'course'>('fundive');
  const [leader, setLeader] = useState<string | undefined>(undefined);
  const [selectedCourse, setSelectedCourse] = useState<string>('');
  const [days, setDays] = useState<string>('');
  const [selectedForGroup, setSelectedForGroup] = useState<Record<string, string>>({});
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  const [itinerary, setItinerary] = useState<ItineraryItem[]>([]);
  const [itineraryOpen, setItineraryOpen] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const [d, c, s] = await Promise.all([
          apiClient.divers.list(),
          apiClient.courses.list(),
          apiClient.diveSites.list(),
        ]);
        setDivers(d);
        setCourses(c);
        setDiveSites(s);
      } catch (err) {
        console.error('Failed to load data', err);
      }
    })();
  }, []);

  const loadItinerary = async (groupId: string) => {
    try {
      const data = await apiClient.groupItinerary.get(groupId);
      setItinerary(data);
    } catch (err) {
      console.error('Failed to load itinerary', err);
    }
  };

  const handleOpenItinerary = (groupId: string) => {
    setSelectedGroup(groupId);
    loadItinerary(groupId);
    setItineraryOpen(true);
  };

  const handleUpdateItinerary = async (dayNumber: number, diveSiteId: string) => {
    if (!selectedGroup) return;
    try {
      await apiClient.groupItinerary.updateDay(selectedGroup, {
        day_number: dayNumber,
        dive_site_id: diveSiteId || null,
      });
      loadItinerary(selectedGroup);
    } catch (err) {
      console.error('Failed to update itinerary', err);
    }
  };

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!name) return;
    await createGroup({
      name,
      type: groupType,
      leader_id: leader ?? null,
      course_id: groupType === 'course' ? selectedCourse : null,
      days: days ? parseInt(days) : null,
    });
    setName('');
    setGroupType('fundive');
    setLeader(undefined);
    setSelectedCourse('');
    setDays('');
  }

  const selectedGroupData = groups.find(g => g.id === selectedGroup);
  const numDays = selectedGroupData?.days || 1;

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Groups</h1>
        <p className="page-description">Create and manage diver groups with dive site planning</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="col-span-1 p-4 border rounded">
          <form onSubmit={handleCreate} className="space-y-3">
            <div>
              <label className="text-sm font-medium">Group name</label>
              <input
                className="w-full mt-1 px-3 py-2 border rounded"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Monday Beginners"
              />
            </div>

            <div>
              <label htmlFor="group-type" className="text-sm font-medium">Group type</label>
              <select
                id="group-type"
                className="w-full mt-1 px-3 py-2 border rounded"
                value={groupType}
                onChange={(e) => setGroupType(e.target.value as 'fundive' | 'course')}
              >
                <option value="fundive">Fun Dive Group</option>
                <option value="course">Course Group</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-medium">Duration (days)</label>
              <input
                className="w-full mt-1 px-3 py-2 border rounded"
                type="number"
                min="1"
                value={days}
                onChange={(e) => setDays(e.target.value)}
                placeholder="e.g., 3"
              />
            </div>

            {groupType === 'course' && (
              <div>
                <label htmlFor="course-select" className="text-sm font-medium">Course</label>
                <select
                  id="course-select"
                  className="w-full mt-1 px-3 py-2 border rounded"
                  value={selectedCourse}
                  onChange={(e) => setSelectedCourse(e.target.value)}
                >
                  <option value="">Select course…</option>
                  {courses.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} (${c.price})
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <label htmlFor="leader-select" className="text-sm font-medium">Leader (optional)</label>
              <select
                id="leader-select"
                className="w-full mt-1 px-3 py-2 border rounded"
                value={leader ?? ''}
                onChange={(e) => setLeader(e.target.value || undefined)}
              >
                <option value="">— none —</option>
                {divers.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>

            <button type="submit" className="btn w-full">
              Create Group
            </button>
          </form>
        </div>

        <div className="col-span-2 p-4 border rounded">
          <h3 className="font-semibold mb-3">Existing Groups</h3>
          {loading && <div>Loading…</div>}
          {error && (
            <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded text-sm text-red-700">
              <div>Failed to load groups: {error.message || JSON.stringify(error)}</div>
              <div className="mt-2">
                <button className="btn btn-sm" onClick={() => refresh()}>
                  Reload
                </button>
              </div>
            </div>
          )}
          <div className="space-y-3">
            {groups.map((g: Group) => (
              <div key={String(g.id)} className="p-3 border rounded">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex-1">
                    <div className="font-medium">{g.name}</div>
                    <div className="text-sm text-muted-foreground">
                      Type: {g.type === 'course' ? 'Course Group' : 'Fun Dive Group'}
                      {g.type === 'course' && g.course && ` • ${g.course.name}`}
                      {g.days && ` • ${g.days} days`}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Leader: {g.leader?.name || '—'}
                    </div>
                  </div>
                  {g.days && (
                    <Dialog open={itineraryOpen && selectedGroup === g.id} onOpenChange={setItineraryOpen}>
                      <DialogTrigger asChild>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleOpenItinerary(String(g.id))}
                        >
                          Plan Dives
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Dive Plan: {g.name}</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          {Array.from({ length: numDays }).map((_, dayIdx) => {
                            const dayNum = dayIdx + 1;
                            const dayPlan = itinerary.find(i => Number(i.day_number) === dayNum);
                            return (
                              <div key={dayNum} className="p-4 border rounded">
                                <Label className="font-semibold">Day {dayNum}</Label>
                                <Select 
                                  value={dayPlan?.dive_site_id || ''} 
                                  onValueChange={(val) => handleUpdateItinerary(dayNum, val)}
                                >
                                  <SelectTrigger className="mt-2">
                                    <SelectValue placeholder="Select dive site for this day" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {diveSites.map((site) => (
                                      <SelectItem key={site.id} value={site.id}>
                                        {site.name} ({site.location}) - {site.difficulty}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                {dayPlan?.site_name && (
                                  <div className="mt-2 text-sm text-muted-foreground">
                                    <div>📍 {dayPlan.site_name}</div>
                                    <div>📊 Max Depth: {dayPlan.max_depth}m</div>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </DialogContent>
                    </Dialog>
                  )}
                </div>

                <div className="mt-2">
                  <label className="text-sm font-medium">Members</label>
                  <div className="mt-2 space-y-2">
                    {(!g.members || g.members.length === 0) && (
                      <div className="text-sm text-muted-foreground">No members</div>
                    )}
                    {(g.members || []).map((m: GroupMember) => (
                      <div key={String(m.id)} className="flex items-center justify-between bg-muted p-2 rounded">
                        <div>{m.diver?.name || 'Unknown'}</div>
                        <div className="flex items-center gap-2">
                          <div className="text-sm text-muted-foreground">{m.role || ''}</div>
                          <button
                            className="btn btn-sm"
                            onClick={async () => {
                              if (
                                !confirm(`Remove ${m.diver?.name || 'this member'} from ${g.name}?`)
                              )
                                return;
                              await removeMember(String(m.id), String(g.id));
                            }}
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-3">
                  <label htmlFor={`add-member-${String(g.id)}`} className="text-sm font-medium">Add member</label>
                  <div className="flex gap-2 mt-2">
                    <select
                      id={`add-member-${String(g.id)}`}
                      className="flex-1 px-3 py-2 border rounded"
                      value={selectedForGroup[String(g.id)] ?? ''}
                      onChange={(e) =>
                        setSelectedForGroup((s) => ({ ...s, [String(g.id)]: e.target.value }))
                      }
                    >
                      <option value="">Select diver…</option>
                      {divers.map((d) => (
                        <option key={d.id} value={d.id}>
                          {d.name}
                        </option>
                      ))}
                    </select>
                    <button
                      onClick={async (e) => {
                        e.preventDefault();
                        const diverId = selectedForGroup[String(g.id)];
                        if (!diverId) return;
                        await addMember(String(g.id), diverId);
                        setSelectedForGroup((s) => ({ ...s, [String(g.id)]: '' }));
                      }}
                      className="btn"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

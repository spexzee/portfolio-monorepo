'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Pencil, Trash2, Plus, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
    useGetTechnologies, useCreateTechnology, useUpdateTechnology, useDeleteTechnology,
    useGetProjects, useCreateProject, useUpdateProject, useDeleteProject,
    useGetExperiences, useCreateExperience, useUpdateExperience, useDeleteExperience,
    Technology, Project, Experience, ProjectTech
} from '@/queries/portfolio';
import { ImageUpload } from '@/components/image-upload';

export default function ManagementPage() {
    return (
        <div className="container mx-auto py-8 px-4">
            <h1 className="text-3xl font-bold mb-8">Portfolio Management</h1>

            <Tabs defaultValue="technologies" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="technologies">Technologies</TabsTrigger>
                    <TabsTrigger value="projects">Projects</TabsTrigger>
                    <TabsTrigger value="experiences">Experiences</TabsTrigger>
                </TabsList>

                <TabsContent value="technologies">
                    <TechnologiesTab />
                </TabsContent>

                <TabsContent value="projects">
                    <ProjectsTab />
                </TabsContent>

                <TabsContent value="experiences">
                    <ExperiencesTab />
                </TabsContent>
            </Tabs>
        </div>
    );
}

// Technologies Tab
function TechnologiesTab() {
    const { toast } = useToast();
    const { data: technologies, isLoading } = useGetTechnologies();
    const createMutation = useCreateTechnology();
    const updateMutation = useUpdateTechnology();
    const deleteMutation = useDeleteTechnology();

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<Technology | null>(null);
    const [formData, setFormData] = useState({ name: '', icon: '' });

    const handleSubmit = async () => {
        try {
            if (editingItem?._id) {
                await updateMutation.mutateAsync({ id: editingItem._id, data: formData });
                toast({ title: 'Technology updated successfully' });
            } else {
                await createMutation.mutateAsync(formData);
                toast({ title: 'Technology created successfully' });
            }
            setIsDialogOpen(false);
            setEditingItem(null);
            setFormData({ name: '', icon: '' });
        } catch (error) {
            toast({ title: 'Error', description: String(error), variant: 'destructive' });
        }
    };

    const handleEdit = (item: Technology) => {
        setEditingItem(item);
        setFormData({ name: item.name, icon: item.icon });
        setIsDialogOpen(true);
    };

    const handleDelete = async (id: string) => {
        try {
            await deleteMutation.mutateAsync(id);
            toast({ title: 'Technology deleted successfully' });
        } catch (error) {
            toast({ title: 'Error', description: String(error), variant: 'destructive' });
        }
    };

    const openCreateDialog = () => {
        setEditingItem(null);
        setFormData({ name: '', icon: '' });
        setIsDialogOpen(true);
    };

    if (isLoading) return <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>;

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>Technologies</CardTitle>
                    <CardDescription>Manage your skills and technologies</CardDescription>
                </div>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button onClick={openCreateDialog}><Plus className="mr-2 h-4 w-4" /> Add Technology</Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>{editingItem ? 'Edit Technology' : 'Add Technology'}</DialogTitle>
                            <DialogDescription>Fill in the technology details</DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <Label htmlFor="name">Name</Label>
                                <Input id="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                            </div>
                            <div className="grid gap-2">
                                <ImageUpload
                                    label="Icon"
                                    value={formData.icon}
                                    onChange={(url) => setFormData({ ...formData, icon: url })}
                                    folder="/technologies"
                                    accept="image/*"
                                    placeholder="Enter icon URL or upload"
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button onClick={handleSubmit} disabled={createMutation.isPending || updateMutation.isPending}>
                                {(createMutation.isPending || updateMutation.isPending) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                {editingItem ? 'Update' : 'Create'}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Icon</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {technologies?.map((tech) => (
                            <TableRow key={tech._id}>
                                <TableCell><img src={tech.icon} alt={tech.name} className="w-8 h-8 object-contain" /></TableCell>
                                <TableCell className="font-medium">{tech.name}</TableCell>
                                <TableCell className="text-right">
                                    <Button variant="ghost" size="icon" onClick={() => handleEdit(tech)}><Pencil className="h-4 w-4" /></Button>
                                    <AlertDialog>
                                        <AlertDialogTrigger asChild><Button variant="ghost" size="icon"><Trash2 className="h-4 w-4 text-destructive" /></Button></AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>Delete Technology?</AlertDialogTitle>
                                                <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                <AlertDialogAction onClick={() => handleDelete(tech._id!)}>Delete</AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}

// Projects Tab
function ProjectsTab() {
    const { toast } = useToast();
    const { data: projects, isLoading } = useGetProjects();
    const createMutation = useCreateProject();
    const updateMutation = useUpdateProject();
    const deleteMutation = useDeleteProject();

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<Project | null>(null);
    const [formData, setFormData] = useState<Omit<Project, '_id'>>({
        name: '', description: '', technologies: [], image: '', source_code_link: '', demo_link: '', category: 'frontend'
    });
    const [techInput, setTechInput] = useState({ name: '', color: '#3b82f6' });

    const handleSubmit = async () => {
        try {
            if (editingItem?._id) {
                await updateMutation.mutateAsync({ id: editingItem._id, data: formData });
                toast({ title: 'Project updated successfully' });
            } else {
                await createMutation.mutateAsync(formData);
                toast({ title: 'Project created successfully' });
            }
            setIsDialogOpen(false);
            resetForm();
        } catch (error) {
            toast({ title: 'Error', description: String(error), variant: 'destructive' });
        }
    };

    const resetForm = () => {
        setEditingItem(null);
        setFormData({ name: '', description: '', technologies: [], image: '', source_code_link: '', demo_link: '', category: 'frontend' });
        setTechInput({ name: '', color: '#3b82f6' });
    };

    const handleEdit = (item: Project) => {
        setEditingItem(item);
        setFormData({ ...item });
        setIsDialogOpen(true);
    };

    const handleDelete = async (id: string) => {
        try {
            await deleteMutation.mutateAsync(id);
            toast({ title: 'Project deleted successfully' });
        } catch (error) {
            toast({ title: 'Error', description: String(error), variant: 'destructive' });
        }
    };

    const addTech = () => {
        if (techInput.name) {
            setFormData({ ...formData, technologies: [...formData.technologies, techInput] });
            setTechInput({ name: '', color: 'blue-text-gradient' });
        }
    };

    const removeTech = (index: number) => {
        setFormData({ ...formData, technologies: formData.technologies.filter((_, i) => i !== index) });
    };

    if (isLoading) return <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>;

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>Projects</CardTitle>
                    <CardDescription>Manage your portfolio projects</CardDescription>
                </div>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button onClick={resetForm}><Plus className="mr-2 h-4 w-4" /> Add Project</Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>{editingItem ? 'Edit Project' : 'Add Project'}</DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label>Name</Label>
                                    <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                                </div>
                                <div className="grid gap-2">
                                    <Label>Category</Label>
                                    <Select value={formData.category} onValueChange={(v: 'frontend' | 'fullstack' | 'tools') => setFormData({ ...formData, category: v })}>
                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="frontend">Frontend</SelectItem>
                                            <SelectItem value="fullstack">Full Stack</SelectItem>
                                            <SelectItem value="tools">Tools</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <div className="grid gap-2">
                                <Label>Description</Label>
                                <Textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
                            </div>
                            <div className="grid gap-2">
                                <ImageUpload
                                    label="Project Image"
                                    value={formData.image}
                                    onChange={(url) => setFormData({ ...formData, image: url })}
                                    folder="/projects"
                                    accept="image/*"
                                    placeholder="Enter image URL or upload"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label>Source Code Link</Label>
                                    <Input value={formData.source_code_link} onChange={(e) => setFormData({ ...formData, source_code_link: e.target.value })} />
                                </div>
                                <div className="grid gap-2">
                                    <Label>Demo Link</Label>
                                    <Input value={formData.demo_link} onChange={(e) => setFormData({ ...formData, demo_link: e.target.value })} />
                                </div>
                            </div>
                            <div className="grid gap-2">
                                <Label>Technologies</Label>
                                <div className="flex gap-2 items-end">
                                    <div className="flex-1">
                                        <Input placeholder="Tech name" value={techInput.name} onChange={(e) => setTechInput({ ...techInput, name: e.target.value })} />
                                    </div>
                                    <div className="w-14">
                                        <Input type="color" value={techInput.color} onChange={(e) => setTechInput({ ...techInput, color: e.target.value })} className="h-10 p-1 cursor-pointer" />
                                    </div>
                                    <Button type="button" onClick={addTech}>Add</Button>
                                </div>
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {formData.technologies.map((tech, i) => (
                                        <Badge key={i} variant="secondary" className="cursor-pointer" style={{ backgroundColor: tech.color, color: '#fff' }} onClick={() => removeTech(i)}>
                                            {tech.name} ✕
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button onClick={handleSubmit} disabled={createMutation.isPending || updateMutation.isPending}>
                                {(createMutation.isPending || updateMutation.isPending) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                {editingItem ? 'Update' : 'Create'}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Technologies</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {projects?.map((project) => (
                            <TableRow key={project._id}>
                                <TableCell className="font-medium">{project.name}</TableCell>
                                <TableCell><Badge>{project.category}</Badge></TableCell>
                                <TableCell>
                                    <div className="flex flex-wrap gap-1">
                                        {project.technologies?.slice(0, 3).map((t, i) => <Badge key={i} variant="outline">{t.name}</Badge>)}
                                        {project.technologies?.length > 3 && <Badge variant="outline">+{project.technologies.length - 3}</Badge>}
                                    </div>
                                </TableCell>
                                <TableCell className="text-right">
                                    <Button variant="ghost" size="icon" onClick={() => handleEdit(project)}><Pencil className="h-4 w-4" /></Button>
                                    <AlertDialog>
                                        <AlertDialogTrigger asChild><Button variant="ghost" size="icon"><Trash2 className="h-4 w-4 text-destructive" /></Button></AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>Delete Project?</AlertDialogTitle>
                                                <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                <AlertDialogAction onClick={() => handleDelete(project._id!)}>Delete</AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}

// Experiences Tab
function ExperiencesTab() {
    const { toast } = useToast();
    const { data: experiences, isLoading } = useGetExperiences();
    const createMutation = useCreateExperience();
    const updateMutation = useUpdateExperience();
    const deleteMutation = useDeleteExperience();

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<Experience | null>(null);
    const [formData, setFormData] = useState<Omit<Experience, '_id'>>({
        title: '', company_name: '', icon: '', iconBg: '#383E56', date: '', points: []
    });
    const [pointInput, setPointInput] = useState('');

    const handleSubmit = async () => {
        try {
            if (editingItem?._id) {
                await updateMutation.mutateAsync({ id: editingItem._id, data: formData });
                toast({ title: 'Experience updated successfully' });
            } else {
                await createMutation.mutateAsync(formData);
                toast({ title: 'Experience created successfully' });
            }
            setIsDialogOpen(false);
            resetForm();
        } catch (error) {
            toast({ title: 'Error', description: String(error), variant: 'destructive' });
        }
    };

    const resetForm = () => {
        setEditingItem(null);
        setFormData({ title: '', company_name: '', icon: '', iconBg: '#383E56', date: '', points: [] });
        setPointInput('');
    };

    const handleEdit = (item: Experience) => {
        setEditingItem(item);
        setFormData({ ...item });
        setIsDialogOpen(true);
    };

    const handleDelete = async (id: string) => {
        try {
            await deleteMutation.mutateAsync(id);
            toast({ title: 'Experience deleted successfully' });
        } catch (error) {
            toast({ title: 'Error', description: String(error), variant: 'destructive' });
        }
    };

    const addPoint = () => {
        if (pointInput) {
            setFormData({ ...formData, points: [...formData.points, pointInput] });
            setPointInput('');
        }
    };

    const removePoint = (index: number) => {
        setFormData({ ...formData, points: formData.points.filter((_, i) => i !== index) });
    };

    if (isLoading) return <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>;

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>Experiences</CardTitle>
                    <CardDescription>Manage your work experience</CardDescription>
                </div>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button onClick={resetForm}><Plus className="mr-2 h-4 w-4" /> Add Experience</Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>{editingItem ? 'Edit Experience' : 'Add Experience'}</DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label>Job Title</Label>
                                    <Input value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
                                </div>
                                <div className="grid gap-2">
                                    <Label>Company Name</Label>
                                    <Input value={formData.company_name} onChange={(e) => setFormData({ ...formData, company_name: e.target.value })} />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <ImageUpload
                                        label="Company Icon"
                                        value={formData.icon}
                                        onChange={(url) => setFormData({ ...formData, icon: url })}
                                        folder="/experiences"
                                        accept="image/*"
                                        placeholder="Enter icon URL or upload"
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label>Icon Background Color</Label>
                                    <Input type="color" value={formData.iconBg} onChange={(e) => setFormData({ ...formData, iconBg: e.target.value })} />
                                </div>
                            </div>
                            <div className="grid gap-2">
                                <Label>Date Range</Label>
                                <Input placeholder="e.g., January 2023 - Present" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} />
                            </div>
                            <div className="grid gap-2">
                                <Label>Key Points</Label>
                                <div className="flex gap-2">
                                    <Textarea placeholder="Add a key responsibility or achievement" value={pointInput} onChange={(e) => setPointInput(e.target.value)} />
                                    <Button type="button" onClick={addPoint}>Add</Button>
                                </div>
                                <ul className="list-disc list-inside space-y-1 mt-2">
                                    {formData.points.map((point, i) => (
                                        <li key={i} className="flex items-start gap-2">
                                            <span className="flex-1 text-sm">{point}</span>
                                            <Button variant="ghost" size="sm" onClick={() => removePoint(i)}><Trash2 className="h-3 w-3" /></Button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button onClick={handleSubmit} disabled={createMutation.isPending || updateMutation.isPending}>
                                {(createMutation.isPending || updateMutation.isPending) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                {editingItem ? 'Update' : 'Create'}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Title</TableHead>
                            <TableHead>Company</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {experiences?.map((exp) => (
                            <TableRow key={exp._id}>
                                <TableCell className="font-medium">{exp.title}</TableCell>
                                <TableCell>{exp.company_name}</TableCell>
                                <TableCell>{exp.date}</TableCell>
                                <TableCell className="text-right">
                                    <Button variant="ghost" size="icon" onClick={() => handleEdit(exp)}><Pencil className="h-4 w-4" /></Button>
                                    <AlertDialog>
                                        <AlertDialogTrigger asChild><Button variant="ghost" size="icon"><Trash2 className="h-4 w-4 text-destructive" /></Button></AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>Delete Experience?</AlertDialogTitle>
                                                <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                <AlertDialogAction onClick={() => handleDelete(exp._id!)}>Delete</AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}

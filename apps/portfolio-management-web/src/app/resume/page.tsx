'use client';

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Upload, ExternalLink, FileText, Trash2, File } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export default function ResumePage() {
    const { toast } = useToast();
    const [resumeUrl, setResumeUrl] = useState('');
    const [inputUrl, setInputUrl] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Fetch current resume URL
    useEffect(() => {
        const fetchResume = async () => {
            try {
                const res = await fetch(`${API_URL}/api/config/resume_url`);
                if (res.ok) {
                    const data = await res.json();
                    setResumeUrl(data.config?.value || '');
                    setInputUrl(data.config?.value || '');
                }
            } catch (error) {
                console.error('Failed to fetch resume:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchResume();
    }, []);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Validate file type
            const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/gif', 'image/webp'];
            if (!allowedTypes.includes(file.type)) {
                toast({ title: 'Invalid file type', description: 'Please select a PDF or image file', variant: 'destructive' });
                return;
            }
            // Validate file size (max 10MB)
            if (file.size > 10 * 1024 * 1024) {
                toast({ title: 'File too large', description: 'Maximum file size is 10MB', variant: 'destructive' });
                return;
            }
            setSelectedFile(file);
        }
    };

    const handleUpload = async () => {
        if (!selectedFile) {
            toast({ title: 'No file selected', variant: 'destructive' });
            return;
        }

        setIsUploading(true);
        try {
            // Convert file to base64
            const base64 = await new Promise<string>((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => resolve(reader.result as string);
                reader.onerror = reject;
                reader.readAsDataURL(selectedFile);
            });

            // Upload to ImageKit via backend
            const uploadRes = await fetch(`${API_URL}/api/imagekit/upload`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    file: base64,
                    fileName: selectedFile.name,
                    folder: '/resume'
                }),
            });

            const uploadData = await uploadRes.json();

            if (uploadData.success) {
                // Save URL to config
                const saveRes = await fetch(`${API_URL}/api/config/resume_url`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ value: uploadData.data.url }),
                });

                if (saveRes.ok) {
                    setResumeUrl(uploadData.data.url);
                    setInputUrl(uploadData.data.url);
                    setSelectedFile(null);
                    if (fileInputRef.current) fileInputRef.current.value = '';
                    toast({ title: 'Resume uploaded successfully!' });
                }
            } else {
                throw new Error(uploadData.message || 'Upload failed');
            }
        } catch (error) {
            toast({ title: 'Upload failed', description: String(error), variant: 'destructive' });
        } finally {
            setIsUploading(false);
        }
    };

    const handleSaveUrl = async () => {
        if (!inputUrl.trim()) {
            toast({ title: 'Error', description: 'Please enter a resume URL', variant: 'destructive' });
            return;
        }

        setIsSaving(true);
        try {
            const res = await fetch(`${API_URL}/api/config/resume_url`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ value: inputUrl.trim() }),
            });

            if (res.ok) {
                setResumeUrl(inputUrl.trim());
                toast({ title: 'Resume URL saved successfully' });
            } else {
                throw new Error('Failed to save');
            }
        } catch (error) {
            toast({ title: 'Error', description: 'Failed to save resume URL', variant: 'destructive' });
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async () => {
        setIsSaving(true);
        try {
            const res = await fetch(`${API_URL}/api/config/resume_url`, {
                method: 'DELETE',
            });

            if (res.ok) {
                setResumeUrl('');
                setInputUrl('');
                toast({ title: 'Resume URL deleted' });
            }
        } catch (error) {
            toast({ title: 'Error', description: 'Failed to delete resume URL', variant: 'destructive' });
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }

    return (
        <div className="container mx-auto py-8 px-4">
            <h1 className="text-3xl font-bold mb-8">Resume Management</h1>

            <div className="grid gap-6 md:grid-cols-2">
                {/* File Upload Card */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Upload className="h-5 w-5" />
                            Upload Resume
                        </CardTitle>
                        <CardDescription>
                            Upload your resume PDF directly. Files will be stored in ImageKit.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="fileUpload">Select File (PDF or Image, max 10MB)</Label>
                            <Input
                                ref={fileInputRef}
                                id="fileUpload"
                                type="file"
                                accept=".pdf,.jpg,.jpeg,.png,.gif,.webp"
                                onChange={handleFileSelect}
                            />
                        </div>
                        {selectedFile && (
                            <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                                <File className="h-5 w-5" />
                                <span className="text-sm flex-1 truncate">{selectedFile.name}</span>
                                <span className="text-xs text-muted-foreground">
                                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                                </span>
                            </div>
                        )}
                        <Button onClick={handleUpload} disabled={!selectedFile || isUploading} className="w-full">
                            {isUploading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Uploading...
                                </>
                            ) : (
                                <>
                                    <Upload className="mr-2 h-4 w-4" />
                                    Upload to ImageKit
                                </>
                            )}
                        </Button>
                    </CardContent>
                </Card>

                {/* Manual URL Card */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <ExternalLink className="h-5 w-5" />
                            Manual URL Entry
                        </CardTitle>
                        <CardDescription>
                            Or paste a URL from any file hosting service.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="resumeUrl">Resume URL</Label>
                            <Input
                                id="resumeUrl"
                                placeholder="https://example.com/resume.pdf"
                                value={inputUrl}
                                onChange={(e) => setInputUrl(e.target.value)}
                            />
                        </div>
                        <div className="flex gap-2">
                            <Button onClick={handleSaveUrl} disabled={isSaving} className="flex-1">
                                {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                                Save URL
                            </Button>
                            {resumeUrl && (
                                <Button variant="destructive" onClick={handleDelete} disabled={isSaving}>
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Current Resume Preview */}
            <Card className="mt-6">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <FileText className="h-5 w-5" />
                        Current Resume
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {resumeUrl ? (
                        <div className="space-y-4">
                            <div className="p-4 bg-muted rounded-lg">
                                <p className="text-sm font-mono break-all">{resumeUrl}</p>
                            </div>
                            <div className="flex gap-2">
                                <Button asChild>
                                    <a href={resumeUrl} target="_blank" rel="noopener noreferrer">
                                        <ExternalLink className="mr-2 h-4 w-4" />
                                        Open Resume
                                    </a>
                                </Button>
                                {resumeUrl.endsWith('.pdf') && (
                                    <Button variant="outline" asChild>
                                        <a href={resumeUrl} download>
                                            Download PDF
                                        </a>
                                    </Button>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-8 text-muted-foreground">
                            <FileText className="mx-auto h-12 w-12 mb-4 opacity-50" />
                            <p>No resume configured yet</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

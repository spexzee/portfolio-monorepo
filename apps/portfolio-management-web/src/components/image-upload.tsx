'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Upload, X, Image as ImageIcon } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

interface ImageUploadProps {
    value: string;
    onChange: (url: string) => void;
    folder?: string;
    label?: string;
    accept?: string;
    placeholder?: string;
}

export function ImageUpload({
    value,
    onChange,
    folder = '/uploads',
    label = 'Image',
    accept = 'image/*,.pdf',
    placeholder = 'Enter URL or upload file'
}: ImageUploadProps) {
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            setError('File too large. Max 5MB.');
            return;
        }

        setError('');
        setIsUploading(true);

        try {
            // Convert to base64
            const base64 = await new Promise<string>((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => resolve(reader.result as string);
                reader.onerror = reject;
                reader.readAsDataURL(file);
            });

            // Upload to ImageKit
            const res = await fetch(`${API_URL}/api/imagekit/upload`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    file: base64,
                    fileName: file.name,
                    folder
                }),
            });

            const data = await res.json();

            if (data.success) {
                onChange(data.data.url);
            } else {
                setError(data.message || 'Upload failed');
            }
        } catch (err) {
            setError('Upload failed. Please try again.');
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    return (
        <div className="space-y-2">
            <Label>{label}</Label>
            <div className="flex gap-2">
                <Input
                    placeholder={placeholder}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="flex-1"
                />
                <input
                    ref={fileInputRef}
                    type="file"
                    accept={accept}
                    onChange={handleFileSelect}
                    className="hidden"
                />
                <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                >
                    {isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                </Button>
                {value && (
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => onChange('')}
                    >
                        <X className="h-4 w-4" />
                    </Button>
                )}
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            {value && (
                <div className="mt-2 p-2 bg-muted rounded-md flex items-center gap-2">
                    {value.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i) ? (
                        <img src={value} alt="Preview" className="h-10 w-10 object-contain rounded" />
                    ) : (
                        <ImageIcon className="h-10 w-10 text-muted-foreground" />
                    )}
                    <span className="text-xs text-muted-foreground truncate flex-1">{value}</span>
                </div>
            )}
        </div>
    );
}

'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trash2, Mail, MailOpen, Loader2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface Message {
    _id: string;
    name: string;
    email: string;
    message: string;
    isRead: boolean;
    createdAt: string;
}

export default function MessagesPage() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

    const fetchMessages = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${apiUrl}/api/messages`);
            const data = await response.json();
            if (data.success) {
                setMessages(data.messages);
            } else {
                setError(data.error);
            }
        } catch (err) {
            setError('Failed to fetch messages');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMessages();
    }, []);

    const markAsRead = async (id: string) => {
        try {
            const response = await fetch(`${apiUrl}/api/messages/${id}/read`, {
                method: 'PATCH',
            });
            const data = await response.json();
            if (data.success) {
                setMessages(messages.map(m => m._id === id ? { ...m, isRead: true } : m));
            }
        } catch (err) {
            console.error('Failed to mark as read:', err);
        }
    };

    const deleteMessage = async (id: string) => {
        if (!confirm('Are you sure you want to delete this message?')) return;

        try {
            const response = await fetch(`${apiUrl}/api/messages/${id}`, {
                method: 'DELETE',
            });
            const data = await response.json();
            if (data.success) {
                setMessages(messages.filter(m => m._id !== id));
            }
        } catch (err) {
            console.error('Failed to delete message:', err);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }

    if (error) {
        return (
            <Card className="border-destructive">
                <CardHeader>
                    <CardTitle className="text-destructive">Error</CardTitle>
                    <CardDescription>{error}</CardDescription>
                </CardHeader>
            </Card>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Messages</h1>
                <p className="text-muted-foreground">
                    Contact form submissions from your portfolio
                </p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>All Messages ({messages.length})</CardTitle>
                    <CardDescription>
                        {messages.filter(m => !m.isRead).length} unread
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {messages.length === 0 ? (
                        <p className="text-center text-muted-foreground py-8">No messages yet</p>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead className="max-w-[300px]">Message</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {messages.map((message) => (
                                    <TableRow key={message._id} className={!message.isRead ? 'bg-muted/50' : ''}>
                                        <TableCell>
                                            {message.isRead ? (
                                                <Badge variant="secondary"><MailOpen className="h-3 w-3 mr-1" /> Read</Badge>
                                            ) : (
                                                <Badge variant="default"><Mail className="h-3 w-3 mr-1" /> New</Badge>
                                            )}
                                        </TableCell>
                                        <TableCell className="font-medium">{message.name}</TableCell>
                                        <TableCell>
                                            <a href={`mailto:${message.email}`} className="text-primary hover:underline">
                                                {message.email}
                                            </a>
                                        </TableCell>
                                        <TableCell className="max-w-[300px] truncate">{message.message}</TableCell>
                                        <TableCell className="text-muted-foreground text-sm">
                                            {formatDistanceToNow(new Date(message.createdAt), { addSuffix: true })}
                                        </TableCell>
                                        <TableCell className="text-right space-x-2">
                                            {!message.isRead && (
                                                <Button variant="ghost" size="sm" onClick={() => markAsRead(message._id)}>
                                                    <MailOpen className="h-4 w-4" />
                                                </Button>
                                            )}
                                            <Button variant="ghost" size="sm" onClick={() => deleteMessage(message._id)} className="text-destructive hover:text-destructive">
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

import React, { useState, useEffect, useRef } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import { Avatar } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Search, Send, Paperclip, Mic, File, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { fetchChats, fetchChatMessages, sendMessage, uploadChatFile, markMessagesAsRead } from '@/lib/chat-api';
import { io, Socket } from 'socket.io-client';
import { useLocation } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';

interface Chat {
  other_user_id: string;
  other_user_name: string;
  other_user_pic: string;
  user_role: string;
  user_category: string;
  last_message: string;
  timestamp: string;
  unread_count: number;
}

interface Message {
  id: number;
  sender_id: string;
  receiver_id: string;
  message: string;
  message_type: string;
  file_url?: string;
  file_name?: string;
  file_size?: number;
  created_at: string;
  is_read: boolean;
}

const formatDateLabel = (dateStr: string) => {
  const today = new Date();
  const date = new Date(dateStr);
  const diffTime = today.getTime() - date.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return date.toLocaleDateString('en-US', { weekday: 'long' });

  return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
};

const formatMessageTime = (timestamp: string | Date) => {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

const ChatHeader: React.FC<{ chat: Chat | null; onBack?: () => void }> = ({ chat, onBack }) => {
  if (!chat) return null;
  
  return (
    <div className="flex items-center justify-between border-b border-border p-4 bg-card">
      <div className="flex items-center gap-3">
        {onBack && (
          <Button variant="ghost" size="icon" onClick={onBack}>
            ←
          </Button>
        )}
        <Avatar>
          <img src={chat.other_user_pic || 'https://picsum.photos/200'} alt={chat.other_user_name} className="h-full w-full object-cover" />
        </Avatar>
        <div>
          <h3 className="font-medium text-foreground">{chat.other_user_name}</h3>
          <p className="text-sm text-muted-foreground">{chat.user_category}</p>
        </div>
      </div>
    </div>
  );
};

const ChatMessage: React.FC<{ message: Message; currentUserId: string }> = ({ message, currentUserId }) => {
  const isSender = message.sender_id === currentUserId;
  const time = new Date(message.created_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
  
  return (
    <div className={`flex ${isSender ? 'justify-end' : 'justify-start'} mb-2`}>
      <div className={`max-w-[70%] rounded-xl ${isSender ? 'bg-primary text-primary-foreground' : 'bg-card border border-border text-foreground'} px-4 py-1`}>
        {message.message_type === 'file' && message.file_url && (
          <div className="mb-2">
            {message.file_url.match(/\.(jpg|jpeg|png|gif)$/i) ? (
              <img src={message.file_url} alt={message.file_name} className="max-w-[200px] max-h-[150px] rounded" />
            ) : message.file_url.match(/\.(webm|mp3|wav|ogg)$/i) ? (
              <audio controls className="max-w-[250px]">
                <source src={message.file_url} type="audio/webm" />
              </audio>
            ) : (
              <a href={message.file_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 underline">
                <File className="h-4 w-4" />
                {message.file_name}
              </a>
            )}
          </div>
        )}
        <p className="text-sm">{message.message}</p>
        <p className={`text-[10px] mt-0.5 text-right ${isSender ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>{time}</p>
      </div>
    </div>
  );
};

const ChatInput: React.FC<{ onSendMessage: (message: string, file?: File) => void; disabled: boolean }> = ({ onSendMessage, disabled }) => {
  const [message, setMessage] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [showFileDialog, setShowFileDialog] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);

  const handleSend = () => {
    if (message.trim()) {
      onSendMessage(message);
      setMessage('');
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      
      // Create preview for images
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setFilePreview(reader.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        setFilePreview(null);
      }
      
      setShowFileDialog(true);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleConfirmSend = () => {
    if (selectedFile) {
      onSendMessage(audioBlob ? 'Voice message' : '', selectedFile);
      setShowFileDialog(false);
      setSelectedFile(null);
      setFilePreview(null);
      setAudioBlob(null);
    }
  };

  const handleCancelSend = () => {
    setShowFileDialog(false);
    setSelectedFile(null);
    setFilePreview(null);
    setAudioBlob(null);
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const recorder = new MediaRecorder(stream);
      audioChunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };

      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);
      setIsPaused(false);
    } catch (error) {
      console.error('Error accessing microphone:', error);
      alert('Could not access microphone');
    }
  };

  const pauseRecording = () => {
    if (mediaRecorder) {
      if (mediaRecorder.state === 'recording') {
        mediaRecorder.pause();
        setIsPaused(true);
      } else if (mediaRecorder.state === 'paused') {
        mediaRecorder.resume();
        setIsPaused(false);
      }
    }
  };

  const cancelRecording = () => {
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
      mediaRecorder.stop();
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    setMediaRecorder(null);
    setIsRecording(false);
    setIsPaused(false);
    audioChunksRef.current = [];
  };

  const sendRecording = () => {
    if (mediaRecorder && isRecording) {
      mediaRecorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        setAudioBlob(blob);
        const audioFile = new File([blob], `voice-${Date.now()}.webm`, { type: 'audio/webm' });
        setSelectedFile(audioFile);
        setFilePreview(URL.createObjectURL(blob));
        setShowFileDialog(true);
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop());
        }
        setIsRecording(false);
        setIsPaused(false);
      };
      if (mediaRecorder.state !== 'inactive') {
        mediaRecorder.stop();
      }
      setMediaRecorder(null);
    }
  };

  return (
    <>
      <div className="border-t border-border p-3">
        {!isRecording ? (
          <div className="flex items-center gap-2 rounded-xl border border-border overflow-hidden shadow-sm">
            <input type="file" ref={fileInputRef} onChange={handleFileSelect} className="hidden" />
            <Button variant="ghost" size="icon" onClick={() => fileInputRef.current?.click()} disabled={disabled} className="pl-2">
              <Paperclip className="h-5 w-5 text-foreground" />
            </Button>
            <Input 
              placeholder="Type your message..." 
              className="flex-1 border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              disabled={disabled}
            />
            <Button 
              variant="ghost" 
              size="icon" 
              disabled={disabled}
              onClick={startRecording}
            >
              <Mic className="h-5 w-5 text-foreground" />
            </Button>
            <Button size="icon" className="bg-primary text-primary-foreground" onClick={handleSend} disabled={disabled || !message.trim()}>
              <Send className="h-5 w-5" />
            </Button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <div className="flex-1 flex items-center gap-2 px-4 py-2 rounded-xl border border-border bg-red-50 dark:bg-red-950">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-foreground">{isPaused ? 'Paused' : 'Recording...'}</span>
              </div>
            </div>
            <Button variant="outline" size="icon" onClick={cancelRecording} title="Cancel">
              <X className="h-5 w-5" />
            </Button>
            <Button variant="outline" size="icon" onClick={pauseRecording} title="Pause/Resume">
              {isPaused ? '▶' : '⏸'}
            </Button>
            <Button size="icon" className="bg-primary text-primary-foreground" onClick={sendRecording} title="Send">
              <Send className="h-5 w-5" />
            </Button>
          </div>
        )}
      </div>

      <Dialog open={showFileDialog} onOpenChange={setShowFileDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Send File</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            {audioBlob ? (
              <div className="flex flex-col items-center gap-3">
                <audio controls className="w-full">
                  <source src={filePreview || ''} type="audio/webm" />
                </audio>
                <p className="text-sm text-muted-foreground">Voice message</p>
              </div>
            ) : filePreview ? (
              <img src={filePreview} alt="Preview" className="max-w-full max-h-64 mx-auto rounded" />
            ) : (
              <div className="flex items-center gap-3 p-4 border border-border rounded">
                <File className="h-8 w-8 text-muted-foreground" />
                <div>
                  <p className="font-medium text-foreground">{selectedFile?.name}</p>
                  <p className="text-sm text-muted-foreground">{(selectedFile?.size || 0 / 1024).toFixed(2)} KB</p>
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleCancelSend}>Cancel</Button>
            <Button onClick={handleConfirmSend}>Send</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

const ChatListItem: React.FC<{ 
  chat: Chat; 
  isActive: boolean; 
  onClick: () => void;
}> = ({ chat, isActive, onClick }) => {
  return (
    <div 
      className={`p-3 flex items-center gap-3 cursor-pointer border-b border-border ${isActive ? 'bg-secondary' : 'hover:bg-secondary/50'}`}
      onClick={onClick}
    >
      <Avatar>
        <img src={chat.other_user_pic || 'https://picsum.photos/200'} alt={chat.other_user_name} className="h-full w-full object-cover" />
      </Avatar>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <h4 className="font-semibold text-foreground">{chat.other_user_name}</h4>
            {chat.user_category && (
              <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">{chat.user_category}</span>
            )}
          </div>
          <span className="text-xs text-muted-foreground">{formatMessageTime(chat.timestamp)}</span>
        </div>
        <div className="flex justify-between items-center">
          <p className="text-sm text-muted-foreground truncate">{chat.last_message}</p>
          {chat.unread_count > 0 && (
            <span className="bg-green-500 text-white text-xs rounded-full px-2 py-0.5 ml-2">{chat.unread_count}</span>
          )}
        </div>
      </div>
    </div>
  );
};

const ChatsPage = () => {
  const location = useLocation();
  const [chats, setChats] = useState<Chat[]>([]);
  const [activeChat, setActiveChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [showChat, setShowChat] = useState(false);
  const [hasLoadedFromState, setHasLoadedFromState] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const currentUserId = localStorage.getItem('userData') ? JSON.parse(localStorage.getItem('userData')!).id : null;
  const isMobile = window.innerWidth <= 768;

  useEffect(() => {
    loadChats();
    initSocket();
    return () => {
      socket?.disconnect();
    };
  }, []);

  useEffect(() => {
    const selectedUserId = location.state?.selectedUserId;
    if (selectedUserId && chats.length > 0 && !hasLoadedFromState) {
      const existingChat = chats.find(chat => chat.other_user_id === selectedUserId);
      if (existingChat) {
        setActiveChat(existingChat);
        setHasLoadedFromState(true);
      } else {
        fetchNewContact(selectedUserId);
        setHasLoadedFromState(true);
      }
    }
  }, [chats, hasLoadedFromState]);

  useEffect(() => {
    if (activeChat) {
      loadMessages(activeChat.other_user_id);
      if (isMobile) setShowChat(true);
    }
  }, [activeChat]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const initSocket = () => {
    const token = localStorage.getItem('authToken');
    const socketInstance = io('http://localhost:3001', {
      transports: ['polling', 'websocket']
    });

    socketInstance.on('connect', () => {
      socketInstance.emit('join', token);
    });

    socketInstance.on('new_message', (data) => {
      if (activeChat && (data.senderId === activeChat.other_user_id || data.receiverId === activeChat.other_user_id)) {
        setMessages(prev => [...prev, data]);
      }
      loadChats();
    });

    socketInstance.on('message_sent', (data) => {
      setMessages(prev => [...prev, data]);
    });

    setSocket(socketInstance);
  };

  const loadChats = async () => {
    try {
      const data = await fetchChats();
      setChats(data);
      const selectedUserId = location.state?.selectedUserId;
      if (!selectedUserId && data.length > 0 && !activeChat) {
        setActiveChat(data[0]);
      }
    } catch (error) {
      console.error('Error loading chats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchNewContact = async (userId: string) => {
    try {
      const response = await fetch(`http://localhost:3001/api/users/${userId}`, {
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('authToken')
        }
      });
      const data = await response.json();
      if (response.ok && data.user) {
        const newChat: Chat = {
          other_user_id: data.user.id,
          other_user_name: data.user.fullname,
          other_user_pic: data.user.profile_pic,
          user_role: data.user.user_role,
          user_category: data.user.user_category || 'General',
          last_message: '',
          timestamp: new Date().toISOString(),
          unread_count: 0
        };
        setChats(prev => {
          const exists = prev.some(chat => chat.other_user_id === newChat.other_user_id);
          return exists ? prev : [newChat, ...prev];
        });
        setActiveChat(newChat);
      }
    } catch (error) {
      console.error('Error fetching new contact:', error);
    }
  };

  const loadMessages = async (otherUserId: string) => {
    try {
      const data = await fetchChatMessages(otherUserId);
      setMessages(data);
      await markMessagesAsRead(otherUserId);
      loadChats();
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  const handleSendMessage = async (message: string, file?: File) => {
    if (!activeChat) return;

    setIsSending(true);
    try {
      let fileUrl, fileName, fileSize;
      if (file) {
        const uploadResult = await uploadChatFile(file);
        fileUrl = uploadResult.fileUrl;
        fileName = uploadResult.fileName;
        fileSize = uploadResult.fileSize;
      }

      if (socket?.connected) {
        socket.emit('send_message', {
          receiverId: activeChat.other_user_id,
          message: message || fileName || 'File',
          messageType: file ? 'file' : 'text',
          fileUrl,
          fileName,
          fileSize
        });
      } else {
        await sendMessage(activeChat.other_user_id, message || fileName || 'File', file ? 'file' : 'text', fileUrl, fileName, fileSize);
        loadMessages(activeChat.other_user_id);
      }
      loadChats();
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsSending(false);
    }
  };

  const handleChatSelect = (chat: Chat) => {
    setActiveChat(chat);
  };

  const filteredChats = chats.filter(chat => 
    chat.other_user_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const groupedMessages = () => {
    const grouped: { [key: string]: Message[] } = {};
    messages.forEach((msg) => {
      const dateKey = new Date(msg.created_at).toDateString();
      if (!grouped[dateKey]) grouped[dateKey] = [];
      grouped[dateKey].push(msg);
    });
    return grouped;
  };

  if (isLoading) {
    return (
      <div className="flex h-screen overflow-hidden bg-background">
        <Sidebar />
        <main className="flex-1 flex flex-col overflow-hidden">
          <Header />
          <div className="flex-1 overflow-auto flex">
            <div className="w-full md:w-80 border-r border-border bg-card overflow-y-auto flex flex-col">
              <div className="p-4 border-b border-border">
                <h1 className="text-2xl font-bold mb-4 text-foreground">Chats</h1>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Search..."
                    className="pl-10 pr-4 py-2 w-full rounded-xl border-border"
                    disabled
                  />
                </div>
              </div>
              <div className="flex-1 overflow-y-auto">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="p-3 flex items-center gap-3 border-b border-border">
                    <div className="w-10 h-10 rounded-full bg-secondary animate-pulse"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-secondary rounded w-3/4 mb-2 animate-pulse"></div>
                      <div className="h-3 bg-secondary rounded w-1/2 animate-pulse"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex-1 flex flex-col bg-card">
              <div className="flex items-center justify-between border-b border-border p-4 bg-card">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-secondary animate-pulse"></div>
                  <div>
                    <div className="h-4 bg-secondary rounded w-32 mb-2 animate-pulse"></div>
                    <div className="h-3 bg-secondary rounded w-20 animate-pulse"></div>
                  </div>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto p-4 bg-background">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className={`flex ${i % 2 === 0 ? 'justify-end' : 'justify-start'} mb-4`}>
                    <div className={`max-w-[70%] rounded-xl ${i % 2 === 0 ? 'bg-primary/20' : 'bg-secondary'} px-4 py-3`}>
                      <div className="h-4 bg-secondary rounded w-48 mb-2 animate-pulse"></div>
                      <div className="h-3 bg-secondary rounded w-16 animate-pulse"></div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="border-t border-border p-3">
                <div className="h-10 bg-secondary rounded-xl animate-pulse"></div>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar />
      <main className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <div className="flex-1 overflow-auto flex">
          {(!isMobile || !showChat) && (
            <div className="w-full md:w-80 border-r border-border bg-card overflow-y-auto flex flex-col">
              <div className="p-4 border-b border-border">
                <h1 className="text-2xl font-bold mb-4 text-foreground">Chats</h1>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Search..."
                    className="pl-10 pr-4 py-2 w-full rounded-xl border-border"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex-1 overflow-y-auto">
                {filteredChats.length === 0 ? (
                  <div className="p-4 text-center text-muted-foreground">No chats found</div>
                ) : (
                  filteredChats.map(chat => (
                    <ChatListItem 
                      key={chat.other_user_id} 
                      chat={chat} 
                      isActive={activeChat?.other_user_id === chat.other_user_id}
                      onClick={() => handleChatSelect(chat)}
                    />
                  ))
                )}
              </div>
            </div>
          )}
          
          {(isMobile ? showChat : true) && (
            <div className="flex-1 flex flex-col bg-card">
              {isSending && (
                <div className="absolute inset-0 bg-background/80 flex items-center justify-center z-50">
                  <div className="flex flex-col items-center gap-2">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                    <p className="text-foreground">Sending...</p>
                  </div>
                </div>
              )}
              {activeChat ? (
                <>
                  <ChatHeader chat={activeChat} onBack={isMobile ? () => setShowChat(false) : undefined} />
                  <div className="flex-1 overflow-y-auto p-4 bg-background" style={{ height: 'calc(100vh - 250px)' }}>
                    {Object.entries(groupedMessages()).map(([dateKey, msgs]) => (
                      <div key={dateKey}>
                        <div className="text-center my-3">
                          <span className="bg-secondary px-4 py-1.5 rounded-full text-sm font-medium text-foreground">
                            {formatDateLabel(dateKey)}
                          </span>
                        </div>
                        {msgs.map((message) => (
                          <ChatMessage key={message.id} message={message} currentUserId={currentUserId} />
                        ))}
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                  <ChatInput onSendMessage={handleSendMessage} disabled={false} />
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center text-muted-foreground">
                  Select a chat to start messaging
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default ChatsPage;

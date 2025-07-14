'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../../contexts/authContext';
import {
    Send,
    Plus,
    Mic,
    Camera,
    Trash2,
    Bold,
    Italic,
    Underline,
    Strikethrough,
    ChevronDown
} from 'lucide-react';

interface PostEditorProps {
    onPublish: (content: string, emoji: string) => void;
    onAuthRequired?: () => void;
    selectedEmoji: string;
    setSelectedEmoji: (emoji: string) => void;
}

const emojis = [
    '😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '😊', '😇',
    '🙂', '🙃', '😉', '😌', '😍', '🥰', '😘', '😗', '😙', '😚',
    '😋', '😛', '😝', '😜', '🤪', '🤨', '🧐', '🤓', '😎', '🥸',
    '🤩', '🥳', '😏', '😒', '😞', '😔', '😟', '😕', '🙁', '☹️',
    '😣', '😖', '😫', '😩', '🥺', '😢', '😭', '😤', '😠', '😡',
    '🤬', '🤯', '😳', '🥵', '🥶', '😱', '😨', '😰', '😥', '😓',
    '🤗', '🤔', '🤭', '🤫', '🤥', '😶', '😐', '😑', '😬', '🙄',
    '😯', '😦', '😧', '😮', '😲', '🥱', '😴', '🤤', '😪', '😵',
    '🤐', '🥴', '🤢', '🤮', '🤧', '😷', '🤒', '🤕', '🤑', '🤠'
];
interface QuillFormat {
    [key: string]: boolean | string | number;
}

interface QuillInstance {
    root: HTMLElement;
    getText(): string;
    getFormat(): QuillFormat;
    format(format: string, value: boolean): void;
    setContents(contents: unknown[]): void;
    focus(): void;
    on(event: string, handler: () => void): void;
    off(event: string, handler: () => void): void;
}
interface QuillOptions {
    modules: {
        toolbar: boolean | string | HTMLElement;
    };
    formats: string[];
    placeholder: string;
}

interface QuillConstructor {
    new(element: HTMLElement, options: QuillOptions): QuillInstance;
}

declare global {
    interface Window {
        Quill?: QuillConstructor;
    }
}

export default function PostEditor({ onPublish, onAuthRequired, selectedEmoji, setSelectedEmoji }: PostEditorProps) {
    const [isPublishing, setIsPublishing] = useState(false);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [quillLoaded, setQuillLoaded] = useState(false);
    const [hasContent, setHasContent] = useState(false);
    const editorRef = useRef<HTMLDivElement>(null);
    const quillRef = useRef<QuillInstance>(null);
    const { isAuthenticated } = useAuth();

    useEffect(() => {
        if (typeof window !== 'undefined' && !window.Quill) {
            const script = document.createElement('script');
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/quill/1.3.7/quill.min.js';
            script.onload = () => {
                const link = document.createElement('link');
                link.rel = 'stylesheet';
                link.href = 'https://cdnjs.cloudflare.com/ajax/libs/quill/1.3.7/quill.snow.min.css';
                document.head.appendChild(link);
                setQuillLoaded(true);
            };
            document.head.appendChild(script);
        } else if (window.Quill) {
            setQuillLoaded(true);
        }
    }, []);

    useEffect(() => {
        if (quillLoaded && editorRef.current && !quillRef.current && window.Quill) {
            quillRef.current = new window.Quill(editorRef.current, {
                modules: {
                    toolbar: false,
                },
                formats: ['bold', 'italic', 'underline', 'strike', 'header', 'list', 'link'],
                placeholder: 'How are you feeling today?',
            });

            const quillInstance = quillRef.current;
            if (quillInstance) {
                quillInstance.on('text-change', () => {
                    const text = quillInstance.getText().trim();
                    setHasContent(text.length > 0);
                });
            }
        }
    }, [quillLoaded]);

    const formatButtons = [
        { icon: Bold, label: 'Bold', format: 'bold' },
        { icon: Italic, label: 'Italic', format: 'italic' },
        { icon: Underline, label: 'Underline', format: 'underline' },
        { icon: Strikethrough, label: 'Strikethrough', format: 'strike' },
    ];

    const attachmentButtons = [
        { icon: Plus, label: 'Add attachment', action: handleUnimplementedClick },
        { icon: Mic, label: 'Voice message', action: handleUnimplementedClick },
        { icon: Camera, label: 'Add photo', action: handleUnimplementedClick },
    ];

    const handleFormat = (format: string) => {
        if (!quillRef.current) return;

        const currentFormat = quillRef.current.getFormat();
        const isActive = currentFormat[format];

        quillRef.current.format(format, !isActive);
        quillRef.current.focus();
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isAuthenticated) {
            onAuthRequired?.();
            return;
        }

        if (!quillRef.current) return;

        const content = quillRef.current.root.innerHTML;
        const text = quillRef.current.getText().trim();

        if (!text) return;

        setIsPublishing(true);
        await new Promise(resolve => setTimeout(resolve, 1000));

        onPublish(content, selectedEmoji);

        quillRef.current.setContents([]);
        setHasContent(false);
        setIsPublishing(false);
    };

    function handleUnimplementedClick() {
        if (!isAuthenticated) {
            onAuthRequired?.();
            return;
        }
        alert('Function not implemented');
    }

    const handleDiscard = () => {
        if (quillRef.current) {
            quillRef.current.setContents([]);
            setHasContent(false);
        }
    };

    const handleEmojiSelect = (emoji: string) => {
        setSelectedEmoji(emoji);
        setShowEmojiPicker(false);
    };

    const getActiveFormats = (): Set<string> => {
        if (!quillRef.current) return new Set<string>();
        const formats = quillRef.current.getFormat();
        return new Set<string>(Object.keys(formats).filter(key => formats[key]));
    };

    const [activeFormats, setActiveFormats] = useState<Set<string>>(new Set());

    useEffect(() => {
        if (!quillRef.current) return;

        const updateFormats = () => {
            setActiveFormats(getActiveFormats());
        };

        quillRef.current.on('selection-change', updateFormats);

        return () => {
            if (quillRef.current) {
                quillRef.current.off('selection-change', updateFormats);
            }
        };
    }, [quillLoaded]);

    if (!quillLoaded) {
        return (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6 mx-auto max-w-2xl">
                <div className="p-4 text-center text-gray-500">
                    Loading editor...
                </div>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6 mx-auto max-w-2xl"
        >
            <div className="bg-gray-50 border-b border-gray-200 px-4 py-3 rounded-t-lg">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <button className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md transition-colors">
                                <span>Paragraph</span>
                                <ChevronDown className="w-4 h-4" />
                            </button>
                        </div>
                        <div className="w-px h-6 bg-gray-200" />
                        <div className="flex items-center gap-1">
                            {formatButtons.map(({ icon: Icon, label, format }) => (
                                <button
                                    key={label}
                                    onClick={() => handleFormat(format)}
                                    className={`p-2 rounded-md transition-colors ${activeFormats.has(format)
                                        ? 'bg-blue-100 text-blue-600'
                                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                                        }`}
                                    title={label}
                                >
                                    <Icon className="w-4 h-4" />
                                </button>
                            ))}
                        </div>
                    </div>
                    <button
                        onClick={handleDiscard}
                        className="p-2 bg-red-50 text-red-500 hover:bg-red-100 rounded-md transition-colors"
                        title="Discard"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            </div>
            <div className="p-4">
                <div className="flex items-start gap-3">
                    <div className="relative">
                        <button
                            type="button"
                            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                            className="text-xl mt-1 hover:scale-110 transition-transform"
                        >
                            {selectedEmoji}
                        </button>

                        {showEmojiPicker && (
                            <div className="absolute top-10 left-0 bg-white border border-gray-200 rounded-lg shadow-lg p-3 z-10 w-64">
                                <div className="grid grid-cols-8 gap-1 max-h-32 overflow-y-auto">
                                    {emojis.map((emoji, index) => (
                                        <button
                                            key={index}
                                            type="button"
                                            onClick={() => handleEmojiSelect(emoji)}
                                            className="text-lg hover:bg-gray-100 p-1 rounded transition-colors"
                                        >
                                            {emoji}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="flex-1">
                        <div
                            ref={editorRef}
                            className="text-gray-700 text-sm leading-relaxed font-normal"
                            style={{ fontFamily: 'inherit' }}
                        />
                    </div>
                </div>
            </div>
            <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200">
                <div className="flex items-center gap-2">
                    {attachmentButtons.map(({ icon: Icon, label, action }) => (
                        <button
                            key={label}
                            onClick={action}
                            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                            title={label}
                        >
                            <Icon className="w-4 h-4" />
                        </button>
                    ))}
                </div>
                <div className="flex items-center gap-3">
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleSubmit}
                        disabled={!hasContent || isPublishing}
                        className="bg-blue-500 text-white px-2 py-2 rounded-md font-medium hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
                    >
                        {isPublishing ? (
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                            <Send className="w-4 h-4" />
                        )}
                    </motion.button>
                </div>
            </div>
        </motion.div>
    );
}
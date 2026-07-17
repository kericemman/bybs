import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import TextAlign from '@tiptap/extension-text-align';
import Placeholder from '@tiptap/extension-placeholder';
import CharacterCount from '@tiptap/extension-character-count';

import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Heading3,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Link as LinkIcon,
  Image as ImageIcon,
  Undo,
  Redo,
  Code,
  Quote
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

const normalizeUrl = (value = '') => {
  const trimmed = value.trim();
  if (!trimmed) return '';
  return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
};

const MenuBar = ({ editor, onImageUpload }) => {
  const [linkUrl, setLinkUrl] = useState('');
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [showImageInput, setShowImageInput] = useState(false);
  const [imageUploadError, setImageUploadError] = useState('');
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const imageFileInputRef = useRef(null);

  const addLink = () => {
    const href = normalizeUrl(linkUrl);

    if (href) {
      editor.chain().focus().setLink({ href }).run();
      setLinkUrl('');
      setShowLinkInput(false);
    }
  };

  const addImageByUrl = () => {
    const src = normalizeUrl(imageUrl);

    if (src) {
      editor.chain().focus().setImage({ src }).run();
      setImageUrl('');
      setShowImageInput(false);
      setImageUploadError('');
    }
  };

  const handleImageFileChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!onImageUpload) {
      setImageUploadError('Image uploads are not available in this editor.');
      event.target.value = '';
      return;
    }

    try {
      setImageUploadError('');
      setIsUploadingImage(true);
      const uploadedUrl = await onImageUpload(file);

      if (!uploadedUrl) {
        throw new Error('The upload did not return an image URL.');
      }

      editor.chain().focus().setImage({ src: uploadedUrl, alt: file.name }).run();
      setShowImageInput(false);
      setImageUrl('');
    } catch (error) {
      setImageUploadError(
        error?.response?.data?.message ||
          error?.message ||
          'Could not upload this image. Please try again.'
      );
    } finally {
      setIsUploadingImage(false);
      event.target.value = '';
    }
  };

  if (!editor) {
    return null;
  }

  return (
    <div className="border-b border-gray-200 bg-gray-50 p-3">
      {/* Basic Formatting */}
      <div className="flex flex-wrap items-center gap-1 mb-3">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-2 rounded ${editor.isActive('bold') ? 'bg-gray-200 text-gray-900' : 'text-gray-600 hover:bg-gray-100'}`}
          title="Bold"
        >
          <Bold className="w-4 h-4" />
        </button>
        
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-2 rounded ${editor.isActive('italic') ? 'bg-gray-200 text-gray-900' : 'text-gray-600 hover:bg-gray-100'}`}
          title="Italic"
        >
          <Italic className="w-4 h-4" />
        </button>
        
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={`p-2 rounded ${editor.isActive('underline') ? 'bg-gray-200 text-gray-900' : 'text-gray-600 hover:bg-gray-100'}`}
          title="Underline"
        >
          <UnderlineIcon className="w-4 h-4" />
        </button>

        <div className="w-px h-6 bg-gray-300 mx-1"></div>

        {/* Headings */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={`p-2 rounded ${editor.isActive('heading', { level: 1 }) ? 'bg-gray-200 text-gray-900' : 'text-gray-600 hover:bg-gray-100'}`}
          title="Heading 1"
        >
          <Heading1 className="w-4 h-4" />
        </button>
        
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`p-2 rounded ${editor.isActive('heading', { level: 2 }) ? 'bg-gray-200 text-gray-900' : 'text-gray-600 hover:bg-gray-100'}`}
          title="Heading 2"
        >
          <Heading2 className="w-4 h-4" />
        </button>
        
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={`p-2 rounded ${editor.isActive('heading', { level: 3 }) ? 'bg-gray-200 text-gray-900' : 'text-gray-600 hover:bg-gray-100'}`}
          title="Heading 3"
        >
          <Heading3 className="w-4 h-4" />
        </button>

        <div className="w-px h-6 bg-gray-300 mx-1"></div>

        {/* Lists */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-2 rounded ${editor.isActive('bulletList') ? 'bg-gray-200 text-gray-900' : 'text-gray-600 hover:bg-gray-100'}`}
          title="Bullet List"
        >
          <List className="w-4 h-4" />
        </button>
        
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-2 rounded ${editor.isActive('orderedList') ? 'bg-gray-200 text-gray-900' : 'text-gray-600 hover:bg-gray-100'}`}
          title="Numbered List"
        >
          <ListOrdered className="w-4 h-4" />
        </button>

        <div className="w-px h-6 bg-gray-300 mx-1"></div>

        {/* Block Elements */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`p-2 rounded ${editor.isActive('blockquote') ? 'bg-gray-200 text-gray-900' : 'text-gray-600 hover:bg-gray-100'}`}
          title="Quote"
        >
          <Quote className="w-4 h-4" />
        </button>
        
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className={`p-2 rounded ${editor.isActive('codeBlock') ? 'bg-gray-200 text-gray-900' : 'text-gray-600 hover:bg-gray-100'}`}
          title="Code Block"
        >
          <Code className="w-4 h-4" />
        </button>

        <div className="w-px h-6 bg-gray-300 mx-1"></div>

        {/* Alignment */}
        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
          className={`p-2 rounded ${editor.isActive({ textAlign: 'left' }) ? 'bg-gray-200 text-gray-900' : 'text-gray-600 hover:bg-gray-100'}`}
          title="Align Left"
        >
          <AlignLeft className="w-4 h-4" />
        </button>
        
        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
          className={`p-2 rounded ${editor.isActive({ textAlign: 'center' }) ? 'bg-gray-200 text-gray-900' : 'text-gray-600 hover:bg-gray-100'}`}
          title="Align Center"
        >
          <AlignCenter className="w-4 h-4" />
        </button>
        
        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
          className={`p-2 rounded ${editor.isActive({ textAlign: 'right' }) ? 'bg-gray-200 text-gray-900' : 'text-gray-600 hover:bg-gray-100'}`}
          title="Align Right"
        >
          <AlignRight className="w-4 h-4" />
        </button>

        <div className="w-px h-6 bg-gray-300 mx-1"></div>

        {/* Link */}
        <button
          type="button"
          onClick={() => setShowLinkInput(!showLinkInput)}
          className={`p-2 rounded ${editor.isActive('link') ? 'bg-gray-200 text-gray-900' : 'text-gray-600 hover:bg-gray-100'}`}
          title="Add Link"
        >
          <LinkIcon className="w-4 h-4" />
        </button>

        {/* Image */}
        <button
          type="button"
          onClick={() => setShowImageInput(!showImageInput)}
          className="p-2 rounded text-gray-600 hover:bg-gray-100"
          title="Add Image"
        >
          <ImageIcon className="w-4 h-4" />
        </button>

        <div className="w-px h-6 bg-gray-300 mx-1"></div>

        {/* History */}
        <button
          type="button"
          onClick={() => editor.chain().focus().undo().run()}
          className="p-2 rounded text-gray-600 hover:bg-gray-100"
          title="Undo"
        >
          <Undo className="w-4 h-4" />
        </button>
        
        <button
          type="button"
          onClick={() => editor.chain().focus().redo().run()}
          className="p-2 rounded text-gray-600 hover:bg-gray-100"
          title="Redo"
        >
          <Redo className="w-4 h-4" />
        </button>
      </div>

      {/* Link Input */}
      {showLinkInput && (
        <div className="mb-3 p-2 bg-white border border-gray-200 rounded-lg">
          <div className="flex gap-2">
            <input
              type="url"
              placeholder="Enter URL"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              className="flex-1 px-3 py-1 border border-gray-300 rounded text-sm"
            />
            <button
              type="button"
              onClick={addLink}
              className="px-3 py-1 bg-[#00337C] text-white rounded text-sm hover:bg-[#1E4B9E]"
            >
              Add
            </button>
            <button
              type="button"
              onClick={() => {
                editor.chain().focus().unsetLink().run();
                setShowLinkInput(false);
              }}
              className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-100"
            >
              Remove
            </button>
          </div>
        </div>
      )}

      {/* Image Input */}
      {showImageInput && (
        <div className="mb-3 p-2 bg-white border border-gray-200 rounded-lg">
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2 sm:flex-row">
              <input
                type="url"
                placeholder="Paste image URL"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="flex-1 px-3 py-1 border border-gray-300 rounded text-sm"
              />
              <button
                type="button"
                onClick={addImageByUrl}
                className="px-3 py-1 bg-[#00337C] text-white rounded text-sm hover:bg-[#1E4B9E]"
              >
                Add URL
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowImageInput(false);
                  setImageUploadError('');
                }}
                className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-100"
              >
                Cancel
              </button>
            </div>

            <input
              ref={imageFileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageFileChange}
              className="hidden"
            />
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <button
                type="button"
                onClick={() => imageFileInputRef.current?.click()}
                disabled={isUploadingImage}
                className="inline-flex items-center justify-center rounded bg-slate-100 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <ImageIcon className="mr-2 h-4 w-4" />
                {isUploadingImage ? 'Uploading...' : 'Upload image file'}
              </button>
              <p className="text-xs text-gray-500">
                Uploaded images are inserted directly into the article body.
              </p>
            </div>
          </div>
          {imageUploadError && (
            <p className="mt-2 text-xs text-red-600">{imageUploadError}</p>
          )}
        </div>
      )}
    </div>
  );
};

const RichTextEditor = ({ content, onChange, onImageUpload }) => {
    const editor = useEditor({
        extensions: [
          StarterKit.configure({
            link: false,
            underline: false,
          }),
          Underline,
          Link.configure({
            openOnClick: false,
            HTMLAttributes: {
              class: 'text-[#00337C] hover:text-[#1E4B9E] underline',
            },
          }),
          Image.configure({
            inline: false,
            allowBase64: true,
            HTMLAttributes: {
              class: 'rounded-lg max-w-full h-auto',
            },
          }),
          TextAlign.configure({
            types: ['heading', 'paragraph'],
          }),
          Placeholder.configure({
            placeholder: 'Start writing your article here...',
          }),
          CharacterCount, // ✅ ADD THIS
        ],
        content,
        onUpdate: ({ editor }) => {
          onChange(editor.getHTML());
        },
        editorProps: {
          attributes: {
            class:
              'rich-editor-content prose prose-lg max-w-none focus:outline-none p-4 min-h-[400px]',
          },
        },
      });

    useEffect(() => {
      if (!editor) return;

      const currentHtml = editor.getHTML();
      const nextHtml = content || "<p></p>";

      if (nextHtml !== currentHtml) {
        editor.commands.setContent(nextHtml, false);
      }
    }, [content, editor]);
      

  return (
    <div className="flex flex-col">
      <MenuBar editor={editor} onImageUpload={onImageUpload} />
      <EditorContent editor={editor} />
      <style>{`
        .rich-editor-content p {
          margin: 0.85rem 0;
        }

        .rich-editor-content ul {
          list-style-type: disc;
          padding-left: 1.5rem;
          margin: 1rem 0;
        }

        .rich-editor-content ol {
          list-style-type: decimal;
          padding-left: 1.5rem;
          margin: 1rem 0;
        }

        .rich-editor-content li {
          display: list-item;
          margin: 0.35rem 0;
          padding-left: 0.25rem;
        }

        .rich-editor-content li p {
          margin: 0;
        }

        .rich-editor-content img {
          display: block;
          max-width: 100%;
          height: auto;
          margin: 1.25rem 0;
          border-radius: 0.75rem;
        }
      `}</style>
      
      {/* Character Count */}
      {editor && (
        <div className="border-t border-gray-200 bg-gray-50 px-4 py-2 text-sm text-gray-500">
          {editor?.storage?.characterCount?.characters?.() ?? 0} characters •{' '}
            {editor?.storage?.characterCount?.words?.() ?? 0} words
        </div>
      )}
    </div>
  );
};

export default RichTextEditor;

import React, { useState } from 'react';
import {
    FaBold,
    FaItalic,
    FaUnderline,
    FaListUl,
    FaListOl,
    FaAlignLeft,
    FaAlignCenter,
    FaAlignRight,
    FaAlignJustify,
    FaHeading,
    FaLink,
    FaUnlink,
    FaImage as FaImageIcon,
    FaQuoteLeft,
    FaCode,
    FaUndo,
    FaRedo,
    FaPlus,
    FaExpandArrowsAlt,
    FaStrikethrough,
    FaSubscript,
    FaSuperscript,
    FaIndent,
    FaOutdent,
    FaEraser,
    FaCopy,
    FaPaste,
    FaCut
} from 'react-icons/fa';
import './ToolbarTiptap.css';
import ImageUploadToolbar from './ImageUploadToolbar';
import ImageSizeSelector from './ImageSizeSelector';

const Toolbar = ({ editor, onImageUpload }) => {
    const [showImageUpload, setShowImageUpload] = useState(false);
    const [showImageSizeSelector, setShowImageSizeSelector] = useState(false);
    const [showLinkModal, setShowLinkModal] = useState(false);
    const [linkUrl, setLinkUrl] = useState('');
    const [linkText, setLinkText] = useState('');
    const [selectedImageSize, setSelectedImageSize] = useState('medium');
    
    if (!editor) {
        return null;
    }

    const addImage = () => {
        setShowImageUpload(true);
    };

    const handleImageSelect = (imageBase64, imageData) => {
        editor.chain().focus().setImage({ 
            src: imageBase64,
            alt: imageData?.name || 'Uploaded image',
            title: imageData?.name || 'Uploaded image'
        }).run();
        setShowImageUpload(false);
    };

    const handleLinkSubmit = (e) => {
        e.preventDefault();
        if (linkUrl.trim()) {
            if (linkText.trim()) {
                // Insert link with custom text
                editor.chain().focus().insertContent(`<a href="${linkUrl}" target="_blank" rel="noopener noreferrer">${linkText}</a>`).run();
            } else {
                // Insert link with URL as text
                editor.chain().focus().insertContent(`<a href="${linkUrl}" target="_blank" rel="noopener noreferrer">${linkUrl}</a>`).run();
            }
            setLinkUrl('');
            setLinkText('');
            setShowLinkModal(false);
        }
    };

    const setLink = () => {
        const { from, to } = editor.state.selection;
        const selectedText = editor.state.doc.textBetween(from, to);
        
        if (selectedText) {
            setLinkText(selectedText);
        }
        setShowLinkModal(true);
    };

    const removeLink = () => {
        editor.chain().focus().unsetLink().run();
    };

    // Function để lấy kích thước hiện tại của ảnh được chọn
    const getCurrentImageSize = () => {
        const { from, to } = editor.state.selection;
        let currentSize = 'medium';
        
        editor.state.doc.nodesBetween(from, to, (node, pos) => {
            if (node.type.name === 'image') {
                const className = node.attrs.class || '';
                if (className.includes('size-small')) currentSize = 'small';
                else if (className.includes('size-large')) currentSize = 'large';
                else if (className.includes('size-full')) currentSize = 'full';
                else currentSize = 'medium';
            }
        });
        
        return currentSize;
    };

    const handleImageSizeSelect = (size) => {
        // Kiểm tra xem có ảnh nào được chọn không
        const { from, to } = editor.state.selection;
        let hasImage = false;
        
        // Tìm ảnh trong vùng được chọn
        editor.state.doc.nodesBetween(from, to, (node, pos) => {
            if (node.type.name === 'image') {
                hasImage = true;
                // Cập nhật class cho ảnh cụ thể này
                editor.chain().focus().updateAttributes('image', {
                    class: `size-${size.key}`
                }).run();
            }
        });
        
        if (!hasImage) {
            alert('Vui lòng click vào một ảnh để chọn trước khi chỉnh kích thước!');
            return;
        }
        
        // Hiển thị thông báo thành công
        const sizeLabels = {
            'small': 'Nhỏ',
            'medium': 'Vừa', 
            'large': 'Lớn',
            'full': 'Đầy đủ'
        };
        
        console.log(`Đã thay đổi kích thước ảnh thành: ${sizeLabels[size.key]}`);
        
        setShowImageSizeSelector(false);
    };

    const clearFormatting = () => {
        editor.chain().focus().clearNodes().unsetAllMarks().run();
    };

    const copyContent = () => {
        const html = editor.getHTML();
        navigator.clipboard.writeText(html).then(() => {
            console.log('Nội dung đã được sao chép vào clipboard');
        }).catch(err => {
            console.error('Lỗi khi sao chép:', err);
        });
    };

    const pasteContent = async () => {
        try {
            const text = await navigator.clipboard.readText();
            editor.chain().focus().insertContent(text).run();
        } catch (err) {
            console.error('Lỗi khi dán nội dung:', err);
        }
    };

    const cutContent = () => {
        const { from, to } = editor.state.selection;
        const selectedText = editor.state.doc.textBetween(from, to);
        if (selectedText) {
            navigator.clipboard.writeText(selectedText).then(() => {
                editor.chain().focus().deleteSelection().run();
            }).catch(err => {
                console.error('Lỗi khi cắt nội dung:', err);
            });
        }
    };

    return (
        <>
            <div className="border border-gray-300 rounded-t-lg bg-gray-50 p-2">
                <div className="flex flex-wrap gap-1">
                    {/* Text Formatting */}
                    <button
                        onClick={() => editor.chain().focus().toggleBold().run()}
                        className={`p-2 rounded hover:bg-gray-200 toolbar-button ${editor.isActive('bold') ? 'bg-gray-300' : ''}`}
                        title="In đậm (Ctrl+B)"
                    >
                        <FaBold className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => editor.chain().focus().toggleItalic().run()}
                        className={`p-2 rounded hover:bg-gray-200 toolbar-button ${editor.isActive('italic') ? 'bg-gray-300' : ''}`}
                        title="In nghiêng (Ctrl+I)"
                    >
                        <FaItalic className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => editor.chain().focus().toggleUnderline().run()}
                        className={`p-2 rounded hover:bg-gray-200 toolbar-button ${editor.isActive('underline') ? 'bg-gray-300' : ''}`}
                        title="Gạch chân (Ctrl+U)"
                    >
                        <FaUnderline className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => editor.chain().focus().toggleStrike().run()}
                        className={`p-2 rounded hover:bg-gray-200 toolbar-button ${editor.isActive('strike') ? 'bg-gray-300' : ''}`}
                        title="Gạch ngang"
                    >
                        <FaStrikethrough className="w-4 h-4" />
                    </button>

                    <div className="w-px h-6 bg-gray-300 mx-1"></div>

                    {/* Headings */}
                    <button
                        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                        className={`p-2 rounded hover:bg-gray-200 toolbar-button ${editor.isActive('heading', { level: 1 }) ? 'bg-gray-300' : ''}`}
                        title="Tiêu đề 1"
                    >
                        <FaHeading className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                        className={`p-2 rounded hover:bg-gray-200 toolbar-button ${editor.isActive('heading', { level: 2 }) ? 'bg-gray-300' : ''}`}
                        title="Tiêu đề 2"
                    >
                        <span className="text-xs font-bold">H2</span>
                    </button>
                    <button
                        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                        className={`p-2 rounded hover:bg-gray-200 toolbar-button ${editor.isActive('heading', { level: 3 }) ? 'bg-gray-300' : ''}`}
                        title="Tiêu đề 3"
                    >
                        <span className="text-xs font-bold">H3</span>
                    </button>

                    <div className="w-px h-6 bg-gray-300 mx-1"></div>

                    {/* Lists */}
                    <button
                        onClick={() => editor.chain().focus().toggleBulletList().run()}
                        className={`p-2 rounded hover:bg-gray-200 toolbar-button ${editor.isActive('bulletList') ? 'bg-gray-300' : ''}`}
                        title="Danh sách không đánh số"
                    >
                        <FaListUl className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => editor.chain().focus().toggleOrderedList().run()}
                        className={`p-2 rounded hover:bg-gray-200 toolbar-button ${editor.isActive('orderedList') ? 'bg-gray-300' : ''}`}
                        title="Danh sách đánh số"
                    >
                        <FaListOl className="w-4 h-4" />
                    </button>

                    <div className="w-px h-6 bg-gray-300 mx-1"></div>

                    {/* Alignment */}
                    <button
                        onClick={() => editor.chain().focus().setTextAlign('left').run()}
                        className={`p-2 rounded hover:bg-gray-200 toolbar-button ${editor.isActive({ textAlign: 'left' }) ? 'bg-gray-300' : ''}`}
                        title="Căn trái"
                    >
                        <FaAlignLeft className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => editor.chain().focus().setTextAlign('center').run()}
                        className={`p-2 rounded hover:bg-gray-200 toolbar-button ${editor.isActive({ textAlign: 'center' }) ? 'bg-gray-300' : ''}`}
                        title="Căn giữa"
                    >
                        <FaAlignCenter className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => editor.chain().focus().setTextAlign('right').run()}
                        className={`p-2 rounded hover:bg-gray-200 toolbar-button ${editor.isActive({ textAlign: 'right' }) ? 'bg-gray-300' : ''}`}
                        title="Căn phải"
                    >
                        <FaAlignRight className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => editor.chain().focus().setTextAlign('justify').run()}
                        className={`p-2 rounded hover:bg-gray-200 toolbar-button ${editor.isActive({ textAlign: 'justify' }) ? 'bg-gray-300' : ''}`}
                        title="Căn đều"
                    >
                        <FaAlignJustify className="w-4 h-4" />
                    </button>

                    <div className="w-px h-6 bg-gray-300 mx-1"></div>

                    {/* Links and Images */}
                    <button
                        onClick={setLink}
                        className={`p-2 rounded hover:bg-gray-200 toolbar-button ${editor.isActive('link') ? 'bg-gray-300' : ''}`}
                        title="Thêm liên kết"
                    >
                        <FaLink className="w-4 h-4" />
                    </button>
                    <button
                        onClick={removeLink}
                        className="p-2 rounded hover:bg-gray-200 toolbar-button"
                        title="Xóa liên kết"
                    >
                        <FaUnlink className="w-4 h-4" />
                    </button>
                    <button
                        onClick={addImage}
                        className="p-2 rounded hover:bg-gray-200 toolbar-button"
                        title="Thêm hình ảnh"
                    >
                        <FaImageIcon className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => setShowImageSizeSelector(true)}
                        className="p-2 rounded hover:bg-gray-200 toolbar-button"
                        title="Chỉnh kích thước ảnh"
                    >
                        <FaExpandArrowsAlt className="w-4 h-4" />
                    </button>

                    <div className="w-px h-6 bg-gray-300 mx-1"></div>

                    {/* Other formatting */}
                    <button
                        onClick={() => editor.chain().focus().toggleBlockquote().run()}
                        className={`p-2 rounded hover:bg-gray-200 toolbar-button ${editor.isActive('blockquote') ? 'bg-gray-300' : ''}`}
                        title="Trích dẫn"
                    >
                        <FaQuoteLeft className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                        className={`p-2 rounded hover:bg-gray-200 toolbar-button ${editor.isActive('codeBlock') ? 'bg-gray-300' : ''}`}
                        title="Khối code"
                    >
                        <FaCode className="w-4 h-4" />
                    </button>

                    <div className="w-px h-6 bg-gray-300 mx-1"></div>

                    {/* Copy/Paste/Cut */}
                    <button
                        onClick={copyContent}
                        className="p-2 rounded hover:bg-gray-200 toolbar-button"
                        title="Sao chép (Ctrl+C)"
                    >
                        <FaCopy className="w-4 h-4" />
                    </button>
                    <button
                        onClick={pasteContent}
                        className="p-2 rounded hover:bg-gray-200 toolbar-button"
                        title="Dán (Ctrl+V)"
                    >
                        <FaPaste className="w-4 h-4" />
                    </button>
                    <button
                        onClick={cutContent}
                        className="p-2 rounded hover:bg-gray-200 toolbar-button"
                        title="Cắt (Ctrl+X)"
                    >
                        <FaCut className="w-4 h-4" />
                    </button>

                    <div className="w-px h-6 bg-gray-300 mx-1"></div>

                    {/* Undo/Redo */}
                    <button
                        onClick={() => editor.chain().focus().undo().run()}
                        disabled={!editor.can().undo()}
                        className="p-2 rounded hover:bg-gray-200 disabled:opacity-50 toolbar-button"
                        title="Hoàn tác (Ctrl+Z)"
                    >
                        <FaUndo className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => editor.chain().focus().redo().run()}
                        disabled={!editor.can().redo()}
                        className="p-2 rounded hover:bg-gray-200 disabled:opacity-50 toolbar-button"
                        title="Làm lại (Ctrl+Y)"
                    >
                        <FaRedo className="w-4 h-4" />
                    </button>
                    <button
                        onClick={clearFormatting}
                        className="p-2 rounded hover:bg-gray-200 toolbar-button"
                        title="Xóa định dạng"
                    >
                        <FaEraser className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Image Upload Modal */}
            <ImageUploadToolbar
                isOpen={showImageUpload}
                onClose={() => setShowImageUpload(false)}
                onImageSelect={handleImageSelect}
                maxImages={10}
                maxSize={2 * 1024 * 1024}
            />

            {/* Link Modal */}
            {showLinkModal && (
                <div className="fixed inset-0 backdrop-sepia-0 bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold text-gray-900">Thêm liên kết</h3>
                            <button
                                onClick={() => {
                                    setShowLinkModal(false);
                                    setLinkUrl('');
                                    setLinkText('');
                                }}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        
                        <form onSubmit={handleLinkSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    URL <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="url"
                                    value={linkUrl}
                                    onChange={(e) => setLinkUrl(e.target.value)}
                                    placeholder="https://example.com"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#06AEF4] focus:border-transparent"
                                    required
                                    autoFocus
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Văn bản hiển thị (tùy chọn)
                                </label>
                                <input
                                    type="text"
                                    value={linkText}
                                    onChange={(e) => setLinkText(e.target.value)}
                                    placeholder="Văn bản sẽ hiển thị cho liên kết"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#06AEF4] focus:border-transparent"
                                />
                            </div>
                            
                            <div className="flex gap-3 pt-4">
                                <button
                                    type="submit"
                                    className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                                >
                                    Thêm liên kết
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowLinkModal(false);
                                        setLinkUrl('');
                                        setLinkText('');
                                    }}
                                    className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                                >
                                    Hủy bỏ
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Image Size Selector Modal */}
            {showImageSizeSelector && (
                <div className="fixed inset-0 backdrop-sepia-0 bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold text-gray-900">Chỉnh kích thước ảnh</h3>
                            <button
                                onClick={() => setShowImageSizeSelector(false)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        
                        {/* Hiển thị thông tin ảnh được chọn */}
                        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                            <p className="text-sm text-blue-800">
                                <strong>📸 Ảnh được chọn:</strong> 
                                {(() => {
                                    const { from, to } = editor.state.selection;
                                    let imageInfo = 'Không có ảnh nào được chọn';
                                    
                                    editor.state.doc.nodesBetween(from, to, (node, pos) => {
                                        if (node.type.name === 'image') {
                                            const alt = node.attrs.alt || 'Ảnh';
                                            const currentSize = getCurrentImageSize();
                                            const sizeLabels = {
                                                'small': 'Nhỏ',
                                                'medium': 'Vừa',
                                                'large': 'Lớn',
                                                'full': 'Đầy đủ'
                                            };
                                            imageInfo = `${alt} (Kích thước hiện tại: ${sizeLabels[currentSize]})`;
                                        }
                                    });
                                    
                                    return imageInfo;
                                })()}
                            </p>
                        </div>
                        
                        <ImageSizeSelector
                            onSizeSelect={handleImageSizeSelect}
                            currentSize={getCurrentImageSize()}
                        />
                        
                        <div className="mt-4 text-sm text-gray-600">
                            <p>💡 <strong>Hướng dẫn:</strong></p>
                            <ul className="mt-2 space-y-1">
                                <li>• <strong>Nhỏ:</strong> 300x200px - Phù hợp cho ảnh nhỏ</li>
                                <li>• <strong>Vừa:</strong> 600x400px - Kích thước mặc định</li>
                                <li>• <strong>Lớn:</strong> 900x600px - Ảnh lớn, chi tiết</li>
                                <li>• <strong>Đầy đủ:</strong> 100% width - Toàn bộ chiều rộng</li>
                            </ul>
                            <p className="mt-2 text-xs text-gray-500">
                                💡 <strong>Tip:</strong> Click vào ảnh để chọn, sau đó chọn kích thước mong muốn
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Toolbar;
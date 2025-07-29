import mongoose from 'mongoose';

const blogSchema = new mongoose.Schema({
    blog_category_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'BlogCategory',
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    image: {
        type: String
    },
    content: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['draft', 'publish'],
        default: 'draft'
    }
}, {
    timestamps: {
        createdAt: 'create_at'
    }
});

const Blog = mongoose.model('Blog', blogSchema);
export default Blog; 
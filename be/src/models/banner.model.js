import mongoose from 'mongoose';

const bannerSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    image_url: {
        type: String,
        required: true
    },
    link_url: {
        type: String,
        trim: true
    },
    display_order: {
        type: Number,
        default: 0
    },
    is_active: {
        type: Boolean,
        default: true
    },
    type: {
        type: String,
        enum: ['main', 'sidebar', 'popup', 'slider'],
        default: 'main'
    },
    start_date: {
        type: Date
    },
    end_date: {
        type: Date
    }
}, {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
});

// Index for better query performance
bannerSchema.index({ is_active: 1, display_order: 1 });
bannerSchema.index({ type: 1, is_active: 1 });

const Banner = mongoose.model('Banner', bannerSchema);
export default Banner;

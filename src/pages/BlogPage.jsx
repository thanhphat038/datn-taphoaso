import React from 'react';
import { Link } from 'react-router-dom';

const BlogCard = ({ id, image, title, description, date }) => (
    <Link to={`/blog/${id}`} className="block">
        <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
        <div className="h-80 flex items-center justify-center">
            <img src={image} alt={title} className="w-full h-full object-contain" />
        </div>
        <div className="p-4">
            <h3 className="text-lg font-semibold mb-2">{title}</h3>
            <p className="text-gray-600 text-sm mb-2">{description}</p>
            <p className="text-gray-500 text-xs">{date}</p>
        </div>
        </div>
    </Link>
);

const BlogPage = () => {
    const blogPosts = [
        {
            id: 1,
            image: "/images/healthy-food.jpg",
            title: "Top 10 Thực Phẩm Tốt Cho Sức Khỏe Bạn Nên Bổ Sung Hàng Ngày",
            description: "Khám phá 10 loại thực phẩm giàu dinh dưỡng nên có trong thực đơn hàng ngày của bạn. Từ cá hồi giàu omega-3 đến các loại rau xanh bổ dưỡng.",
            date: "20/01/2024"
        },
        {
            id: 2,
            image: "/images/promo1.png",
            title: "Chế độ ăn Địa Trung Hải - Bí quyết sống khỏe từ thiên nhiên",
            description: "Tìm hiểu về chế độ ăn Địa Trung Hải và những lợi ích sức khỏe tuyệt vời từ phương pháp ăn uống này.",
            date: "19/01/2024"
        },
        {
            id: 3,
            image: "/images/promo2.png",
            title: "5 Loại Hạt Dinh Dưỡng Cần Có Trong Bữa Ăn Hàng Ngày",
            description: "Khám phá các loại hạt giàu dinh dưỡng và cách kết hợp chúng vào chế độ ăn hàng ngày của bạn.",
            date: "18/01/2024"
        },
        {
            id: 4,
            image: "/images/promo3.png",
            title: "Nguồn Protein Thực Vật Tốt Cho Sức Khỏe",
            description: "Tìm hiểu về các nguồn protein thực vật phong phú và cách đưa chúng vào thực đơn hàng ngày.",
            date: "17/01/2024"
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Banner Section */}
            <div className="bg-blue-50 pt-4">
                <div className="container mx-auto">
                    <div className="flex justify-center h-96">
                        <img 
                            src="/images/banner1.jpg" 
                            alt="Shopping Banner" 
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <h1 className="text-2xl font-bold text-center mt-6 mb-8 text-cyan-600">
                        Thực phẩm tốt cho sức khỏe
                    </h1>
                </div>
            </div>

            {/* Blog Grid */}
            <div className="max-w-5xl mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {blogPosts.map((post, index) => (
                        <BlogCard key={post.id} {...post} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default BlogPage;

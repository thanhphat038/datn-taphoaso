import React from 'react';
import { Link } from 'react-router-dom';
import { CalendarDays, BookOpen } from 'lucide-react';

const BlogCard = ({ id, image, title, description, date }) => (
    <Link to={`/blog/${id}`} className="block h-full group">
        <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all h-full flex flex-col border border-gray-100 group-hover:border-blue-300">
            <div className="h-60 flex items-center justify-center overflow-hidden bg-gray-50">
                <img src={image} alt={title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
            </div>
            <div className="p-5 flex flex-col flex-grow">
                <h3 className="text-lg font-bold mb-2 text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2 min-h-[3rem]">{title}</h3>
                <p className="text-gray-600 text-sm mb-3 flex-grow line-clamp-3">{description}</p>
                <div className="flex items-center gap-2 text-xs text-gray-400 mt-auto">
                    <CalendarDays className="w-4 h-4" />
                    <span>{date}</span>
                </div>
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
        },
        {
            id: 5,
            image: "/images/blog5.jpg",
            title: "Lợi Ích Của Việc Uống Nước Đúng Cách Mỗi Ngày",
            description: "Khám phá những lợi ích sức khỏe khi bạn duy trì thói quen uống nước đúng cách hàng ngày.",
            date: "16/01/2024"
        },
        {
            id: 6,
            image: "/images/blog6.jpg",
            title: "Các Bài Tập Thể Dục Giúp Tăng Cường Sức Khỏe Tim Mạch",
            description: "Tổng hợp các bài tập thể dục hiệu quả giúp cải thiện sức khỏe tim mạch và tăng cường thể lực.",
            date: "15/01/2024"
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Banner Section */}
            <div className="relative bg-blue-50">
                <div className="max-w-7xl mx-auto px-4 pt-8 pb-12 flex flex-col items-center justify-center">
                    <div className="relative w-full h-72 md:h-96 flex items-center justify-center rounded-2xl overflow-hidden shadow-md">
                        <img 
                            src="/images/banner1.jpg" 
                            alt="Shopping Banner" 
                            className="absolute inset-0 w-full h-full object-cover" 
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/70 to-blue-400/30"></div>
                        <div className="relative z-10 text-center w-full">
                            <h1 className="text-3xl md:text-4xl font-extrabold text-white drop-shadow-lg flex items-center justify-center gap-3">
                                <BookOpen className="w-8 h-8 text-orange-300" />
                                Blog & Tin tức
                            </h1>
                            <p className="text-lg text-blue-100 mt-4 max-w-2xl mx-auto">
                                Cập nhật kiến thức, mẹo sống khỏe và ưu đãi mới nhất từ Tạp Hóa Số!
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Blog Grid */}
            <div className="max-w-7xl mx-auto px-4 py-12">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {blogPosts.map((post) => (
                        <BlogCard key={post.id} {...post} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default BlogPage;

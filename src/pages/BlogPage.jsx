import React from 'react';
import { Link } from 'react-router-dom';

const BlogCard = ({ id, image, title, description, date }) => (
    <Link to={`/blog/${id}`} className="block h-full">
        <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow h-full flex flex-col">
        <div className="h-72 flex items-center justify-center overflow-hidden">
            <img src={image} alt={title} className="w-full h-full object-cover" />
        </div>
        <div className="p-4 flex flex-col flex-grow">
            <h3 className="text-lg font-semibold mb-2">{title}</h3>
            <p className="text-gray-600 text-sm mb-2 flex-grow">{description}</p>
            <p className="text-gray-500 text-xs mt-auto">{date}</p>
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
        <div className="min-h-screen  bg-gray-50">
            {/* Banner Section */}
            <div className="bg-blue-50  pt-4">
            <div className="container mx-auto w-[1240px]">
                    <div className="flex justify-center h-96">
                        <img 
                            src="/images/banner1.jpg" 
                            alt="Shopping Banner" 
                            className="max-w-full max-h-96 object-contain rounded-lg "
                        />
                    </div>
                    <h1 className="text-2xl font-bold text-center mt-6 mb-8 text-cyan-600">
                        Thực phẩm tốt cho sức khỏe
                    </h1>
                </div>
            </div>

            {/* Blog Grid */}
            <div className="w-[1240px] mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {blogPosts.map((post, index) => (
                        <BlogCard key={post.id} {...post} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default BlogPage;

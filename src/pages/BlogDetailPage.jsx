import React from 'react';
import { Link, useParams } from 'react-router-dom';

const BlogDetailPage = () => {
    const { id } = useParams();

    // Mock data - in real app, fetch based on id
    const blogDetail = {    
        image: "/images/healthy-food.jpg",
        title: "Top 10 Thực Phẩm Tốt Cho Sức Khỏe Bạn Nên Bổ Sung Hàng Ngày",
        date: "20/01/2024",
        author: "Chuyên Gia Dinh Dưỡng",
        content: `
            <p class="mb-4">Trong thời đại ngày nay, việc lựa chọn thực phẩm lành mạnh là yếu tố quan trọng để duy trì sức khỏe tốt. Hãy cùng khám phá 10 loại thực phẩm giàu dinh dưỡng nên có trong thực đơn hàng ngày của bạn.</p>
            
            <h3 class="text-xl font-semibold mb-3">1. Cá hồi - Nguồn omega-3 dồi dào</h3>
            <p class="mb-4">Cá hồi là một trong những loại cá béo tốt nhất, giàu omega-3, protein chất lượng cao và các vitamin thiết yếu. Omega-3 có vai trò quan trọng trong:</p>
            <ul class="list-disc pl-6 mb-4">
                <li>Phát triển não bộ và hệ thần kinh</li>
                <li>Giảm nguy cơ bệnh tim mạch</li>
                <li>Chống viêm hiệu quả</li>
                <li>Cải thiện sức khỏe da và mắt</li>
            </ul>

            <h3 class="text-xl font-semibold mb-3">2. Rau xanh lá đậm</h3>
            <p class="mb-4">Rau xanh như cải xoăn, rau bina, cải thìa là nguồn cung cấp:</p>
            <ul class="list-disc pl-6 mb-4">
                <li>Vitamin K - tốt cho xương</li>
                <li>Chất xơ - hỗ trợ tiêu hóa</li>
                <li>Sắt và canxi</li>
                <li>Chất chống oxy hóa</li>
            </ul>

            <h3 class="text-xl font-semibold mb-3">3. Quả việt quất</h3>
            <p class="mb-4">Được mệnh danh là "siêu thực phẩm" với nhiều lợi ích:</p>
            <ul class="list-disc pl-6 mb-4">
                <li>Chống lão hóa mạnh mẽ</li>
                <li>Cải thiện trí nhớ</li>
                <li>Tốt cho tim mạch</li>
                <li>Giàu vitamin C và chất xơ</li>
            </ul>

            <h3 class="text-xl font-semibold mb-3">4. Hạt óc chó</h3>
            <p class="mb-4">Loại hạt bổ dưỡng với:</p>
            <ul class="list-disc pl-6 mb-4">
                <li>Omega-3 thực vật</li>
                <li>Protein thực vật</li>
                <li>Vitamin E</li>
                <li>Khoáng chất thiết yếu</li>
            </ul>

            <h3 class="text-xl font-semibold mb-3">5. Bơ</h3>
            <p class="mb-4">Giàu chất béo lành mạnh và các dưỡng chất:</p>
            <ul class="list-disc pl-6 mb-4">
                <li>Chất béo không bão hòa đơn</li>
                <li>Kali cao hơn chuối</li>
                <li>Chất xơ</li>
                <li>Vitamin K, C, B5, B6, E</li>
            </ul>

            <h3 class="text-xl font-semibold mb-3">6. Trứng</h3>
            <p class="mb-4">Một trong những thực phẩm dinh dưỡng nhất trên hành tinh:</p>
            <ul class="list-disc pl-6 mb-4">
                <li>Protein chất lượng cao</li>
                <li>Choline - tốt cho não bộ</li>
                <li>Lutein và zeaxanthin - bảo vệ mắt</li>
                <li>Vitamin D, B12, selenium</li>
            </ul>

            <h3 class="text-xl font-semibold mb-3">7. Quả óc chó</h3>
            <p class="mb-4">Loại hạt giàu dinh dưỡng với nhiều lợi ích:</p>
            <ul class="list-disc pl-6 mb-4">
                <li>Omega-3 cao nhất trong các loại hạt</li>
                <li>Chống viêm tự nhiên</li>
                <li>Cải thiện chức năng não</li>
                <li>Giàu chất chống oxy hóa</li>
            </ul>

            <h3 class="text-xl font-semibold mb-3">8. Khoai lang</h3>
            <p class="mb-4">Nguồn carbohydrate lành mạnh với nhiều lợi ích:</p>
            <ul class="list-disc pl-6 mb-4">
                <li>Beta-carotene dồi dào</li>
                <li>Chỉ số đường huyết thấp</li>
                <li>Giàu chất xơ</li>
                <li>Vitamin C và kali</li>
            </ul>

            <h3 class="text-xl font-semibold mb-3">9. Sữa chua Hy Lạp</h3>
            <p class="mb-4">Thực phẩm lên men tốt cho sức khỏe:</p>
            <ul class="list-disc pl-6 mb-4">
                <li>Protein cao gấp đôi sữa chua thường</li>
                <li>Probiotics có lợi cho đường ruột</li>
                <li>Canxi và vitamin B12</li>
                <li>Ít đường, nhiều protein</li>
            </ul>

            <h3 class="text-xl font-semibold mb-3">10. Quả bí ngô</h3>
            <p class="mb-4">Nguồn vitamin và khoáng chất tuyệt vời:</p>
            <ul class="list-disc pl-6 mb-4">
                <li>Beta-carotene dồi dào</li>
                <li>Vitamin C và E</li>
                <li>Kali và chất xơ</li>
                <li>Ít calo, nhiều dinh dưỡng</li>
            </ul>

            <h3 class="text-xl font-semibold mb-3">Lời khuyên cho việc bổ sung thực phẩm lành mạnh:</h3>
            <ul class="list-disc pl-6 mb-4">
                <li>Ưu tiên thực phẩm tươi, ít qua chế biến</li>
                <li>Đa dạng hóa nguồn thực phẩm</li>
                <li>Chú ý đến cách chế biến để bảo toàn dinh dưỡng</li>
                <li>Duy trì chế độ ăn cân bằng và đều đặn</li>
            </ul>

            <p class="mb-4">Việc bổ sung các thực phẩm lành mạnh vào chế độ ăn hàng ngày không chỉ giúp cải thiện sức khỏe mà còn nâng cao chất lượng cuộc sống của bạn. Hãy bắt đầu thay đổi từ hôm nay!</p>
        `
    };

    const relatedPosts = [
        {
            id: 2,
            image: "/images/promo1.png",
            title: "Chế độ ăn Địa Trung Hải - Bí quyết sống khỏe từ thiên nhiên",
            date: "19/01/2024"
        },
        {
            id: 3,
            image: "/images/promo2.png",
            title: "5 Loại Hạt Dinh Dưỡng Cần Có Trong Bữa Ăn Hàng Ngày",
            date: "18/01/2024"
        },
        {
            id: 4,
            image: "/images/promo3.png",
            title: "Nguồn Protein Thực Vật Tốt Cho Sức Khỏe",
            date: "17/01/2024"
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header Image */}
            <div className="w-full h-80 bg-white relative overflow-hidden">
                <img 
                    src={blogDetail.image} 
                    alt={blogDetail.title}
                    className="w-full h-full object-contain"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-100 flex items-end justify-center text-center">
                    <div className="w-full pb-8">
                        <h1 className="text-4xl font-bold text-gray-800">{blogDetail.title}</h1>
                    </div>
                </div>
            </div>

            {/* Content Container */}
            <div className="max-w-4xl mx-auto px-4 py-8">
                {/* Navigation */}
                <div className="mb-8">
                    <Link 
                        to="/blog" 
                        className="text-cyan-600 hover:text-cyan-700 flex items-center"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                        </svg>
                        Quay lại danh sách
                    </Link>
                </div>

                {/* Meta */}
                <div className="flex items-center text-gray-600 mb-8 mt-4">
                    <span className="mr-4">{blogDetail.date}</span>
                    <span>Đăng bởi: {blogDetail.author}</span>
                </div>

                {/* Content */}
                <div 
                    className="prose max-w-none mb-12"
                    dangerouslySetInnerHTML={{ __html: blogDetail.content }}
                />

                {/* Related Posts */}
                <div>
                    <h2 className="text-2xl font-bold mb-6">Bài viết liên quan</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {relatedPosts.map(post => (
                            <Link 
                                key={post.id}
                                to={`/blog/${post.id}`}
                                className="group"
                            >
                                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                                    <div className="h-48">
                                        <img 
                                            src={post.image} 
                                            alt={post.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                        />
                                    </div>
                                    <div className="p-4">
                                        <h3 className="font-semibold mb-2 group-hover:text-cyan-600">
                                            {post.title}
                                        </h3>
                                        <p className="text-gray-600 text-sm">
                                            {post.date}
                                        </p>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BlogDetailPage;

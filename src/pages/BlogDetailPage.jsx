import React from 'react';
import { Link, useParams } from 'react-router-dom';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";

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
            <img src="/images/salmon.jpg" alt="Cá hồi" class="w-full max-w-md mb-4 rounded-lg shadow-md" />
            <p class="mb-4">Cá hồi là một trong những loại cá béo tốt nhất, giàu omega-3, protein chất lượng cao và các vitamin thiết yếu. Omega-3 có vai trò quan trọng trong:</p>
            <ul class="list-disc pl-6 mb-4">
                <li>Phát triển não bộ và hệ thần kinh</li>
                <li>Giảm nguy cơ bệnh tim mạch</li>
                <li>Chống viêm hiệu quả</li>
                <li>Cải thiện sức khỏe da và mắt</li>
            </ul>

            <h3 class="text-xl font-semibold mb-3">2. Rau xanh lá đậm</h3>
            <img src="/images/green-leafy-vegetables.jpg" alt="Rau xanh lá đậm" class="w-full max-w-md mb-4 rounded-lg shadow-md" />
            <p class="mb-4">Rau xanh như cải xoăn, rau bina, cải thìa là nguồn cung cấp:</p>
            <ul class="list-disc pl-6 mb-4">
                <li>Vitamin K - tốt cho xương</li>
                <li>Chất xơ - hỗ trợ tiêu hóa</li>
                <li>Sắt và canxi</li>
                <li>Chất chống oxy hóa</li>
            </ul>

            <h3 class="text-xl font-semibold mb-3">3. Quả việt quất</h3>
            <img src="/images/blueberries.jpg" alt="Quả việt quất" class="w-full max-w-md mb-4 rounded-lg shadow-md" />
            <p class="mb-4">Được mệnh danh là "siêu thực phẩm" với nhiều lợi ích:</p>
            <ul class="list-disc pl-6 mb-4">
                <li>Chống lão hóa mạnh mẽ</li>
                <li>Cải thiện trí nhớ</li>
                <li>Tốt cho tim mạch</li>
                <li>Giàu vitamin C và chất xơ</li>
            </ul>

            <h3 class="text-xl font-semibold mb-3">4. Hạt óc chó</h3>
            <img src="/images/walnuts.jpg" alt="Hạt óc chó" class="w-full max-w-md mb-4 rounded-lg shadow-md" />
            <p class="mb-4">Loại hạt bổ dưỡng với:</p>
            <ul class="list-disc pl-6 mb-4">
                <li>Omega-3 thực vật</li>
                <li>Protein thực vật</li>
                <li>Vitamin E</li>
                <li>Khoáng chất thiết yếu</li>
            </ul>

            <h3 class="text-xl font-semibold mb-3">5. Bơ</h3>
            <img src="/images/avocado.jpg" alt="Bơ" class="w-full max-w-md mb-4 rounded-lg shadow-md" />
            <p class="mb-4">Giàu chất béo lành mạnh và các dưỡng chất:</p>
            <ul class="list-disc pl-6 mb-4">
                <li>Chất béo không bão hòa đơn</li>
                <li>Kali cao hơn chuối</li>
                <li>Chất xơ</li>
                <li>Vitamin K, C, B5, B6, E</li>
            </ul>

            <h3 class="text-xl font-semibold mb-3">6. Trứng</h3>
            <img src="/images/eggs.jpg" alt="Trứng" class="w-full max-w-md mb-4 rounded-lg shadow-md" />
            <p class="mb-4">Một trong những thực phẩm dinh dưỡng nhất trên hành tinh:</p>
            <ul class="list-disc pl-6 mb-4">
                <li>Protein chất lượng cao</li>
                <li>Choline - tốt cho não bộ</li>
                <li>Lutein và zeaxanthin - bảo vệ mắt</li>
                <li>Vitamin D, B12, selenium</li>
            </ul>

            <h3 class="text-xl font-semibold mb-3">7. Quả óc chó</h3>
            <img src="/images/walnuts2.jpg" alt="Quả óc chó" class="w-full max-w-md mb-4 rounded-lg shadow-md" />
            <p class="mb-4">Loại hạt giàu dinh dưỡng với nhiều lợi ích:</p>
            <ul class="list-disc pl-6 mb-4">
                <li>Omega-3 cao nhất trong các loại hạt</li>
                <li>Chống viêm tự nhiên</li>
                <li>Cải thiện chức năng não</li>
                <li>Giàu chất chống oxy hóa</li>
            </ul>

            <h3 class="text-xl font-semibold mb-3">8. Khoai lang</h3>
            <img src="/images/sweet-potato.jpg" alt="Khoai lang" class="w-full max-w-md mb-4 rounded-lg shadow-md" />
            <p class="mb-4">Nguồn carbohydrate lành mạnh với nhiều lợi ích:</p>
            <ul class="list-disc pl-6 mb-4">
                <li>Beta-carotene dồi dào</li>
                <li>Chỉ số đường huyết thấp</li>
                <li>Giàu chất xơ</li>
                <li>Vitamin C và kali</li>
            </ul>

            <h3 class="text-xl font-semibold mb-3">9. Sữa chua Hy Lạp</h3>
            <img src="/images/greek-yogurt.jpg" alt="Sữa chua Hy Lạp" class="w-full max-w-md mb-4 rounded-lg shadow-md" />
            <p class="mb-4">Thực phẩm lên men tốt cho sức khỏe:</p>
            <ul class="list-disc pl-6 mb-4">
                <li>Protein cao gấp đôi sữa chua thường</li>
                <li>Probiotics có lợi cho đường ruột</li>
                <li>Canxi và vitamin B12</li>
                <li>Ít đường, nhiều protein</li>
            </ul>

            <h3 class="text-xl font-semibold mb-3">10. Quả bí ngô</h3>
            <img src="/images/pumpkin.jpg" alt="Quả bí ngô" class="w-full max-w-md mb-4 rounded-lg shadow-md" />
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
            title: "Lợi ích của việc tập thể dục đều đặn mỗi ngày",
            date: "18/01/2024"
        },
        {
            id: 4,
            image: "/images/promo3.png",
            title: "Cách giảm stress hiệu quả trong cuộc sống hiện đại",
            date: "17/01/2024"
        }
    ];

    const sliderSettings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 1,
        centerMode: false,
        centerPadding: "0px",
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 2
                }
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 1
                }
            }
        ]
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-4">
                <button
                    onClick={() => window.history.back()}
                    className="flex items-center space-x-1 font-medium"
                    style={{ color: '#06AEF4' }}
                    onMouseEnter={e => e.currentTarget.style.color = '#0284c7'}
                    onMouseLeave={e => e.currentTarget.style.color = '#06AEF4'}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                    <span>Quay lại trang blog</span>
                </button>
            </div>
            <div className="mb-8">
                <img src={blogDetail.image} alt={blogDetail.title} className="w-full max-w-3xl mx-auto rounded-lg shadow-md" style={{ maxHeight: '300px', objectFit: 'cover' }} />
                <h1 className="text-3xl font-bold mt-6 mb-2">{blogDetail.title}</h1>
                <div className="text-gray-600 mb-4">
                    <span>{blogDetail.date}</span> | <span>{blogDetail.author}</span>
                </div>
                <div
                    className="blog-content prose max-w-none"
                    dangerouslySetInnerHTML={{ __html: blogDetail.content }}
                />
            </div>

            <div>
                <h2 className="text-2xl font-semibold mb-4">Bài viết liên quan</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {relatedPosts.map(post => (
                        <Link key={post.id} to={`/blog/${post.id}`} className="block rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 bg-white">
                            <div className="w-full h-48 overflow-hidden relative">
                                <img src={post.image} alt={post.title} className="absolute inset-0 w-full h-full object-cover" />
                            </div>
                            <div className="p-4">
                                <h3 className="text-lg font-semibold mb-2 truncate">{post.title}</h3>
                                <p className="text-gray-500 text-sm">{post.date}</p>
                                <p className="text-gray-700 text-sm line-clamp-3 mt-2">
                                    Đây là mô tả ngắn gọn về bài viết liên quan, giúp người đọc hiểu nhanh nội dung.
                                </p>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default BlogDetailPage;

import bcrypt from 'bcrypt';
import { connectDB } from '../src/config/database.js';
import User from '../src/models/user.model.js';
import Category from '../src/models/category.model.js';
import Product from '../src/models/product.model.js';
import Voucher from '../src/models/voucher.model.js';
import Variant from '../src/models/variant.model.js';

const seedData = async () => {
  try {
    // Connect to MongoDB
    await connectDB();

    // Clear existing data
    await User.deleteMany({});
    await Category.deleteMany({});
    await Product.deleteMany({});
    await Voucher.deleteMany({});
    await Variant.deleteMany({});

    // Create admin user
    const adminPassword = await bcrypt.hash('admin123', 10);
    const admin = await User.create({
      username: 'admin',
      password: adminPassword,
      email: 'admin@taphoaso.com',
      full_name: 'Admin',
      phone: '0123456789',
      role: 'admin',
      status: 'active'
    });

    // Create normal user
    const userPassword = await bcrypt.hash('user123', 10);
    const user = await User.create({
      username: 'user',
      password: userPassword,
      email: 'user@taphoaso.com',
      full_name: 'Normal User',
      phone: '0987654321',
      role: 'user',
      status: 'active'
    });

    // Create categories
    const categories = await Category.create([
      {
        name: 'Rau củ',
        description: 'Các loại rau củ tươi ngon',
        status: 'active'
      },
      {
        name: 'Trái cây',
        description: 'Các loại trái cây tươi ngon',
        status: 'active'
      },
      {
        name: 'Thịt cá',
        description: 'Các loại thịt cá tươi ngon',
        status: 'active'
      },
      {
        name: 'Gia vị',
        description: 'Các loại gia vị',
        status: 'active'
      },
      {
        name: 'Dầu ăn',
        description: 'Các loại dầu ăn chất lượng',
        status: 'active'
      },
      {
        name: 'Nước mắm',
        description: 'Các loại nước mắm truyền thống',
        status: 'active'
      },
      {
        name: 'Đường',
        description: 'Các loại đường tự nhiên',
        status: 'active'
      },
      {
        name: 'Nước ngọt',
        description: 'Các loại nước ngọt giải khát',
        status: 'active'
      },
      {
        name: 'Thịt heo',
        description: 'Các loại thịt heo tươi ngon',
        status: 'active'
      }
    ]);

    // Create products
    const products = await Product.create([
      {
        category_id: categories[0]._id,
        name: 'Rau muống tươi',
        price: 15000,
        original_price: 12000,
        in_stock: 100,
        status: 'active',
        description: 'Rau muống tươi ngon, sạch, không thuốc trừ sâu. Rau muống giàu chất xơ, vitamin và khoáng chất tốt cho sức khỏe.',
        images: [
          'https://cdn.tgdd.vn/Products/Images/2286/123456/bhx/rau-muong-tuoi-202401251130536710.jpg',
          'https://cdn.tgdd.vn/Products/Images/2286/123456/bhx/rau-muong-tuoi-202401251130539737.jpg'
        ]
      },
      {
        category_id: categories[0]._id,
        name: 'Rau cải xanh',
        price: 20000,
        original_price: 18000,
        in_stock: 80,
        status: 'active',
        description: 'Rau cải xanh tươi ngon, giàu vitamin C và chất chống oxy hóa. Rau cải giúp tăng cường miễn dịch và tốt cho tim mạch.',
        images: [
          'https://cdn.tgdd.vn/Products/Images/2286/123457/bhx/rau-cai-xanh-202401251130536710.jpg',
          'https://cdn.tgdd.vn/Products/Images/2286/123457/bhx/rau-cai-xanh-202401251130539737.jpg'
        ]
      },
      {
        category_id: categories[1]._id,
        name: 'Táo đỏ Mỹ',
        price: 45000,
        original_price: 40000,
        in_stock: 50,
        status: 'active',
        description: 'Táo đỏ Mỹ giòn ngọt, giàu chất xơ và vitamin. Táo giúp giảm cholesterol, tốt cho tim mạch và hệ tiêu hóa.',
        images: [
          'https://cdn.tgdd.vn/Products/Images/2286/123458/bhx/tao-do-my-202401251130536710.jpg',
          'https://cdn.tgdd.vn/Products/Images/2286/123458/bhx/tao-do-my-202401251130539737.jpg'
        ]
      },
      {
        category_id: categories[1]._id,
        name: 'Cam sành',
        price: 35000,
        original_price: 30000,
        in_stock: 60,
        status: 'active',
        description: 'Cam sành ngọt mát, giàu vitamin C. Cam giúp tăng cường miễn dịch, làm đẹp da và tốt cho mắt.',
        images: [
          'https://cdn.tgdd.vn/Products/Images/2286/123459/bhx/cam-sanh-202401251130536710.jpg',
          'https://cdn.tgdd.vn/Products/Images/2286/123459/bhx/cam-sanh-202401251130539737.jpg'
        ]
      },
      {
        category_id: categories[2]._id,
        name: 'Thịt heo ba chỉ',
        price: 150000,
        original_price: 130000,
        in_stock: 30,
        status: 'active',
        description: 'Thịt heo ba chỉ tươi ngon, mềm mại. Thịt heo giàu protein và các vitamin nhóm B cần thiết cho cơ thể.',
        images: [
          'https://cdn.tgdd.vn/Products/Images/2286/123460/bhx/thit-heo-ba-chi-202401251130536710.jpg',
          'https://cdn.tgdd.vn/Products/Images/2286/123460/bhx/thit-heo-ba-chi-202401251130539737.jpg'
        ]
      },
      {
        category_id: categories[2]._id,
        name: 'Cá basa tươi',
        price: 120000,
        original_price: 100000,
        in_stock: 25,
        status: 'active',
        description: 'Cá basa tươi ngon, thịt trắng mềm. Cá basa giàu omega-3, protein và các khoáng chất tốt cho sức khỏe.',
        images: [
          'https://cdn.tgdd.vn/Products/Images/2286/123461/bhx/ca-basa-tuoi-202401251130536710.jpg',
          'https://cdn.tgdd.vn/Products/Images/2286/123461/bhx/ca-basa-tuoi-202401251130539737.jpg'
        ]
      },
      {
        category_id: categories[3]._id,
        name: 'Muối tinh khiết',
        price: 5000,
        original_price: 4000,
        in_stock: 200,
        status: 'active',
        description: 'Muối tinh khiết 100%, không chứa tạp chất. Muối cung cấp natri cần thiết cho cơ thể và tăng hương vị món ăn.',
        images: [
          'https://cdn.tgdd.vn/Products/Images/2286/123462/bhx/muoi-tinh-khiet-202401251130536710.jpg',
          'https://cdn.tgdd.vn/Products/Images/2286/123462/bhx/muoi-tinh-khiet-202401251130539737.jpg'
        ]
      },
      {
        category_id: categories[3]._id,
        name: 'Tiêu đen',
        price: 25000,
        original_price: 20000,
        in_stock: 150,
        status: 'active',
        description: 'Tiêu đen nguyên hạt, thơm nồng. Tiêu giúp tăng hương vị món ăn và có tác dụng kháng khuẩn tự nhiên.',
        images: [
          'https://cdn.tgdd.vn/Products/Images/2286/123463/bhx/tieu-den-202401251130536710.jpg',
          'https://cdn.tgdd.vn/Products/Images/2286/123463/bhx/tieu-den-202401251130539737.jpg'
        ]
      },
      {
        category_id: categories[7]._id,
        name: 'Pepsi Cola',
        price: 12000,
        original_price: 10000,
        in_stock: 100,
        status: 'active',
        description: 'Pepsi Cola tươi mát, hương vị đậm đà. Nước ngọt giải khát hoàn hảo cho mọi dịp.',
        images: [
          'https://cdn.tgdd.vn/Products/Images/2286/123464/bhx/pepsi-cola-202401251130536710.jpg',
          'https://cdn.tgdd.vn/Products/Images/2286/123464/bhx/pepsi-cola-202401251130539737.jpg'
        ]
      },
      {
        category_id: categories[7]._id,
        name: 'Pepsi Max',
        price: 15000,
        original_price: 12000,
        in_stock: 80,
        status: 'active',
        description: 'Pepsi Max không đường, không calo. Lựa chọn hoàn hảo cho người quan tâm đến sức khỏe.',
        images: [
          'https://cdn.tgdd.vn/Products/Images/2286/123465/bhx/pepsi-max-202401251130536710.jpg',
          'https://cdn.tgdd.vn/Products/Images/2286/123465/bhx/pepsi-max-202401251130539737.jpg'
        ]
      },
      {
        category_id: categories[7]._id,
        name: 'Pepsi Twist',
        price: 13000,
        original_price: 11000,
        in_stock: 90,
        status: 'active',
        description: 'Pepsi Twist vị chanh tươi mát. Hương vị độc đáo kết hợp giữa cola và chanh tự nhiên.',
        images: [
          'https://cdn.tgdd.vn/Products/Images/2286/123466/bhx/pepsi-twist-202401251130536710.jpg',
          'https://cdn.tgdd.vn/Products/Images/2286/123466/bhx/pepsi-twist-202401251130539737.jpg'
        ]
      },
      // Dầu ăn
      {
        category_id: categories[4]._id,
        name: 'Dầu thực vật Tường An Cooking Oil chai 1 lít',
        price: 59000,
        original_price: 57000,
        in_stock: 100,
        status: 'active',
        description: 'Dầu thực vật Tường An có công thức đặc biệt, kết hợp từ dầu đậu nành, dầu hạt cải và dầu olein. Dầu thực vật Tường An Cooking oil chai 1 lít ngoài công dụng nấu nướng, dầu ăn còn giúp bổ sung Omega 3, 6, 9 và vitamin A, E có lợi cho cơ thể.',
        images: [
          'https://cdn.tgdd.vn/Products/Images/2286/88739/bhx/dau-thuc-vat-tuong-an-cooking-oil-chai-1-lit-202105201322134036.jpg',
          'https://cdn.tgdd.vn/Products/Images/2286/88739/bhx/dau-thuc-vat-tuong-an-cooking-oil-chai-1-lit-202308081904021096.jpg',
          'https://cdn.tgdd.vn/Products/Images/2286/88739/bhx/dau-thuc-vat-tuong-an-cooking-oil-chai-1-lit-202105201322146485.jpg',
          'https://cdn.tgdd.vn/Products/Images/2286/88739/bhx/dau-thuc-vat-tuong-an-cooking-oil-chai-1-lit-202212031648567252.png',
          'https://cdn.tgdd.vn/Products/Images/2286/88739/bhx/dau-thuc-vat-tuong-an-cooking-oil-chai-1-lit-202105201322144043.jpg'
        ]
      },
      {
        category_id: categories[4]._id,
        name: 'Dầu thực vật tinh luyện Cái Lân chai 1 lít',
        price: 46500,
        original_price: 44000,
        in_stock: 80,
        status: 'active',
        description: 'Dầu ăn Cái Lân là thương hiệu dầu ăn được ưa chuộng hàng đầu của người nội trợ Việt. Dầu thực vật tinh luyện Cái Lân chai 1 lít được làm từ dầu Olein cọ, dầu đậu nành tinh luyện,...giúp tăng hương vị cho các món ăn, đặc biệt là những món chiên giòn trở nên hấp dẫn, thơm ngon.',
        images: [
          'https://cdn.tgdd.vn/Products/Images/2286/76153/bhx/dau-thuc-vat-tinh-luyen-cai-lan-chai-1-lit-202209082036584963.png',
          'https://cdn.tgdd.vn/Products/Images/2286/76153/bhx/dau-thuc-vat-tinh-luyen-cai-lan-chai-1-lit-202209082037577263.jpg',
          'https://cdn.tgdd.vn/Products/Images/2286/76153/bhx/dau-thuc-vat-tinh-luyen-cai-lan-chai-1-lit-202209082037175335.jpg',
          'https://cdnv2.tgdd.vn/bhx-static/bhx/Products/Images/2286/76153/bhx/76153-slide_202409121314413879.jpg'
        ]
      },
      {
        category_id: categories[4]._id,
        name: 'Dầu thực vật tinh luyện Bếp Hồng chai 1 lít',
        price: 45500,
        original_price: 40000,
        in_stock: 75,
        status: 'active',
        description: 'Dầu thực vật tinh luyện Bếp Hồng chai 1 lít không sử dụng chất bảo quản, bổ sung năng lượng và vitamin A, E tốt cho cơ thể. Dầu ăn Bếp Hồng là thương hiệu dầu ăn thông dụng, được rất nhiều người tiêu dùng ưa chuộng bởi chất lượng cùng giá thành tốt trên thị trường.',
        images: [
          'https://cdn.tgdd.vn/Products/Images/2286/323026/bhx/dau-thuc-vat-tinh-luyen-bep-hong-chai-1-lit-202404041526093241.jpg',
          'https://cdn.tgdd.vn/Products/Images/2286/323026/bhx/dau-thuc-vat-tinh-luyen-bep-hong-chai-1-lit-202404041526096419.jpg',
          'https://cdn.tgdd.vn/Products/Images/2286/323026/bhx/dau-thuc-vat-tinh-luyen-bep-hong-chai-1-lit-202404041526099653.jpg',
          'https://cdn.tgdd.vn/Products/Images/2286/323026/bhx/dau-thuc-vat-tinh-luyen-bep-hong-chai-1-lit-202404041526105256.jpg'
        ]
      },
      {
        category_id: categories[4]._id,
        name: 'Dầu đậu nành tinh luyện Janbee chai 1 lít',
        price: 69500,
        original_price: 50000,
        in_stock: 60,
        status: 'active',
        description: 'Dầu đậu nành tinh luyện Janbee chai 1 lít có màu sáng trong và mùi thơm nhẹ, dầu ăn Janbee là dầu thực vật thích hợp để chế biến nhiều món ăn như chiên, xào, trộn salad và làm nước sốt, tăng thêm hương vị thơm ngon đậm đà cho món ăn.',
        images: [
          'https://cdn.tgdd.vn/Products/Images/2286/207833/bhx/dau-dau-nanh-tinh-luyen-janbee-chai-1-lit-202202181454147254.jpg',
          'https://cdn.tgdd.vn/Products/Images/2286/207833/bhx/dau-dau-nanh-tinh-luyen-janbee-chai-1-lit-202405271438244348.jpg',
          'https://cdn.tgdd.vn/Products/Images/2286/207833/bhx/dau-dau-nanh-tinh-luyen-janbee-chai-1-lit-202308070916295121.jpg',
          'https://cdn.tgdd.vn/Products/Images/2286/207833/bhx/dau-dau-nanh-tinh-luyen-janbee-chai-1-lit-202405271438246251.jpg'
        ]
      },
      {
        category_id: categories[4]._id,
        name: 'Dầu gạo lứt nguyên chất Simply chai 1 lít',
        price: 69500,
        original_price: 50000,
        in_stock: 50,
        status: 'active',
        description: 'Sản phẩm sản xuất trên dây chuyền công nghệ hiện đại, chứa nhiều dưỡng chất quý giá, không chứa Cholesterol và chứa hàm lượng Omega3, Omega6, Omega9 cao giúp mang lại một trái tim khỏe. Dầu gạo chịu được nhiệt độ cao (240 độ C), giúp giảm nguy cơ cháy khét và mang đến hương vị thơm ngon cho món ăn.',
        images: [
          'https://cdn.tgdd.vn/Products/Images/2286/138691/bhx/dau-gao-lut-nguyen-chat-simply-chai-1-lit-202308081054380735.jpg',
          'https://cdnv2.tgdd.vn/bhx-static/bhx/Products/Images/2286/138691/bhx/138691-sdlie_202409121351169807.jpg',
          'https://cdn.tgdd.vn/Products/Images/2286/138691/bhx/dau-gao-lut-nguyen-chat-simply-chai-1-lit-202212031614405883.png',
          'https://cdn.tgdd.vn/Products/Images/2286/138691/bhx/dau-gao-nguyen-chat-simply-chai-1-lit-202106120415504774.jpg',
          'https://cdn.tgdd.vn/Products/Images/2286/138691/bhx/dau-gao-lut-nguyen-chat-simply-chai-1-lit-202212031615244352.png'
        ]
      },
      // Nước mắm
      {
        category_id: categories[5]._id,
        name: 'Nước mắm cá cơm than Knorr 15 độ đạm chai 242ml',
        price: 15500,
        original_price: 7000,
        in_stock: 120,
        status: 'active',
        description: 'Nước mắm cá cơm than Knorr 15 độ đạm chai 242ml được làm từ 95% cá cơm than tươi, nước mắm Knorr có vị ngọt nguyên bản của cá cơm, đậm ngọt hài hòa, nước mắm Knorr với hương thơm dịu từ đạm cá tự nhiên, mang đến vị ngon đậm đà, hấp dẫn cho các món ăn hằng ngày.',
        images: [
          'https://cdn.tgdd.vn/Products/Images/2289/324685/bhx/nuoc-mam-ca-com-than-knorr-15-do-dam-chai-242ml-202405131017167788.jpg',
          'https://cdnv2.tgdd.vn/bhx-static/bhx/Products/Images/2289/324685/bhx/nuoc-mam-ca-com-than-knorr-15-do-dam-chai-242ml_202505271010544834.jpg',
          'https://cdnv2.tgdd.vn/bhx-static/bhx/Products/Images/2289/324685/bhx/nuoc-mam-ca-com-than-knorr-15-do-dam-chai-242ml_202505271010547514.jpg'
        ]
      },
      {
        category_id: categories[5]._id,
        name: 'Nước chấm Nam Ngư Đệ Nhị chai 900ml',
        price: 25500,
        original_price: 15000,
        in_stock: 90,
        status: 'active',
        description: 'Nước mắm Nam Ngư là thương hiệu nước mắm rất nổi tiếng tại Việt Nam. Nước chấm Nam Ngư đệ nhị chai 900ml với thành phần cá cơm tươi ngon cùng với công thức pha chế đặc biệt, mang đến những bữa ăn trọn vẹn, đảm bảo an toàn cho gia đình.',
        images: [
          'https://cdn.tgdd.vn/Products/Images/2289/76428/bhx/nuoc-cham-nam-ngu-de-nhi-chai-900ml-202202161406558410.jpg',
          'https://cdn.tgdd.vn/Products/Images/2289/76428/bhx/nuoc-cham-nam-ngu-de-nhi-chai-900ml-201903151030027270.jpg',
          'https://cdn.tgdd.vn/Products/Images/2289/76428/bhx/nuoc-mam-nam-ngu-de-nhi-900ml-15-3-700x467.jpg',
          'https://cdn.tgdd.vn/Products/Images/2289/76428/bhx/nuoc-cham-nam-ngu-de-nhi-chai-900ml-201902141417257416.jpg',
          'https://cdn.tgdd.vn/Products/Images/2289/76428/bhx/nuoc-mam-nam-ngu-de-nhi-900ml-15-4-700x467.jpg'
        ]
      },
      {
        category_id: categories[5]._id,
        name: 'Nước mắm Nam Ngư nhãn vàng 14 độ đạm chai 650ml',
        price: 50500,
        original_price: 43000,
        in_stock: 70,
        status: 'active',
        description: 'Nước mắm Nam Ngư đem đến cho người tiêu dùng những giọt nước mắm thơm ngon, là sự lựa chọn hàng đầu của người Việt. Nước mắm Nam Ngư nhãn vàng chai 650ml có hơn 15 loại axit amin cần thiết cho cơ thể, đậm đặc hơn, sánh quyện hơn, có hậu vị ngọt đặc trưng của cá, và màu vàng nâu mật ong.',
        images: [
          'https://cdn.tgdd.vn/Products/Images/2289/158062/bhx/nuoc-mam-nam-ngu-nhan-vang-14-do-dam-chai-650ml-202212051137096288.png',
          'https://cdn.tgdd.vn/Products/Images/2289/158062/bhx/nuoc-mam-nam-ngu-nhan-vang-14-do-dam-chai-650ml-202212051137093617.png',
          'https://cdn.tgdd.vn/Products/Images/2289/158062/bhx/nuoc-mam-nam-ngu-nhan-vang-chai-650ml-202110192034191035.jpeg',
          'https://cdn.tgdd.vn/Products/Images/2289/158062/bhx/nuoc-mam-nam-ngu-nhan-vang-14-do-dam-chai-650ml-202212051137087596.png'
        ]
      },
      {
        category_id: categories[5]._id,
        name: 'Nước mắm hương cá hồi hảo hạng Chinsu 16 độ đạm chai 500ml',
        price: 50500,
        original_price: 40000,
        in_stock: 65,
        status: 'active',
        description: 'Là loại nước mắm hảo hạng với hương thơm cá hồi đặc trưng đậm đà, tròn vị, dậy mùi thơm, thích hợp chấm, ướp, nấu đều ngon đến từ thương hiệu nước mắm Chinsu. Nước mắm hương cá hồi hảo hạng Chinsu chai 500ml luôn được tin dùng bởi hàng triệu gia đình Việt.',
        images: [
          'https://cdn.tgdd.vn/Products/Images/2289/209456/bhx/nuoc-mam-huong-ca-hoi-hao-hang-chinsu-12-do-dam-chai-500ml-202309211050421242.jpg',
          'https://cdnv2.tgdd.vn/bhx-static/bhx/Products/Images/2289/209456/bhx/nuoc-mam-huong-ca-hoi-hao-hang-chinsu-chai-500ml_202507251054208135.jpg',
          'https://cdn.tgdd.vn/Products/Images/2289/209456/bhx/nuoc-mam-huong-ca-hoi-hao-hang-chinsu-12-do-dam-chai-500ml-202309211050423407.jpg',
          'https://cdn.tgdd.vn/Products/Images/2289/209456/bhx/nuoc-mam-huong-ca-hoi-hao-hang-chinsu-12-do-dam-chai-500ml-202309211050425195.jpg'
        ]
      },
      {
        category_id: categories[5]._id,
        name: 'Nước mắm cao cấp Vị Xưa Barona 40 độ đạm chai 50ml',
        price: 30500,
        original_price: 10000,
        in_stock: 40,
        status: 'active',
        description: 'Nước mắm Barona tự hào với nguồn nước mắm được ủ bằng phương pháp thủ công, tạo nên từng giọt nước chấm sóng sánh, vị đậm đà của nước mắm xưa. Nước mắm Vị Xưa Barona 40 độ đạm chai 50ml sử dụng nguồn nguyên liệu nước mắm Phú Quốc, cam kết không chất bảo quản, không đường tổng hợp.',
        images: [
          'https://cdn.tgdd.vn/Products/Images/2289/91349/bhx/sellingpoint.jpg',
          'https://cdn.tgdd.vn/Products/Images/2289/91349/bhx/nuoc-mam-cao-cap-barona-vi-xua-40-do-dam-chai-50ml-201910241410185260.jpg',
          'https://cdn.tgdd.vn/Products/Images/2289/91349/bhx/nuoc-mam-cao-cap-barona-vi-xua-40-do-dam-chai-50ml-201910241410193105.jpg',
          'https://cdn.tgdd.vn/Products/Images/2289/91349/bhx/nuoc-mam-cao-cap-barona-vi-xua-40-do-dam-chai-50ml-201910241410195071.jpg'
        ]
      },
      // Đường
      {
        category_id: categories[6]._id,
        name: 'Đường phèn hạt Hoàng Hải gói 500g',
        price: 30500,
        original_price: 10000,
        in_stock: 150,
        status: 'active',
        description: 'Đường phèn được sản xuất từ mía đường tự nhiên tinh khiết bằng công nghệ an toàn đến từ thương hiệu đường Hoàng Hải. Đường phèn hạt Hoàng Hải gói 500g có màu trắng tự nhiên, dạng bột dễ hoà tan, nên có thể dùng để pha chế, làm bánh,... giúp tiết kiệm thời gian.',
        images: [
          'https://cdn.tgdd.vn/Products/Images/2804/204364/bhx/duong-phen-hat-hoang-hai-goi-500g-201906251320195872.jpg',
          'https://cdn.tgdd.vn/Products/Images/2804/204364/bhx/duong-phen-hat-hoang-hai-goi-500g-201906251320194461.jpg',
          'https://cdn.tgdd.vn/Products/Images/2804/204364/bhx/duong-phen-hat-hoang-hai-goi-500g-202202160901187116.jpg'
        ]
      },
      {
        category_id: categories[6]._id,
        name: 'Đường vàng Quảng Ngãi gói 1kg',
        price: 40500,
        original_price: 15000,
        in_stock: 100,
        status: 'active',
        description: 'Đường vàng Quảng Ngãi gói 1kg chiết xuất từ mật mía tự nhiên, an toàn cho sức khỏe, hoàn toàn không sử dụng chất tạo màu. Đường Quảng Ngãi làm từ nguồn nguyên liệu mía chất lượng, đường được đóng gói trên dây chuyền tự động, đảm bảo vệ sinh.',
        images: [
          'https://cdn.tgdd.vn/Products/Images/2804/321751/bhx/duong-vang-quang-ngai-goi-1kg-202401251130536710.jpg',
          'https://cdn.tgdd.vn/Products/Images/2804/321751/bhx/duong-vang-quang-ngai-goi-1kg-202401251130539737.jpg',
          'https://cdn.tgdd.vn/Products/Images/2804/321751/bhx/duong-vang-quang-ngai-goi-1kg-202403121131038324.jpg',
          'https://cdn.tgdd.vn/Products/Images/2804/321751/bhx/duong-vang-quang-ngai-goi-1kg-202403121131050993.jpg'
        ]
      },
      {
        category_id: categories[6]._id,
        name: 'Đường thốt nốt dạng viên Moun7ains gói 500g',
        price: 35500,
        original_price: 10000,
        in_stock: 80,
        status: 'active',
        description: 'Đường thốt nốt không chỉ thay thế cho các chất tạo ngọt khác trong các bữa ăn mà còn mang đến nhiều lợi ích về sức khỏe đến từ đường Moun7ains. Đường thốt nốt dạng viên Moun7ains gói 500g mang đến hương vị đặc trưng, thơm ngon, khó cưỡng cho mọi món ăn của bạn.',
        images: [
          'https://cdn.tgdd.vn/Products/Images/2804/207731/bhx/sellingpoint.jpg',
          'https://cdn.tgdd.vn/Products/Images/2804/207731/bhx/duong-thot-not-dang-vien-7-moutains-goi-500g-201907241728193833.jpg',
          'https://cdn.tgdd.vn/Products/Images/2804/207731/bhx/duong-thot-not-dang-vien-7-moutains-goi-500g-201907241728195103.jpg',
          'https://cdn.tgdd.vn/Products/Images/2804/207731/bhx/duong-thot-not-dang-vien-7-moutains-goi-500g-201907241728196933.jpg'
        ]
      },
      {
        category_id: categories[6]._id,
        name: 'Đường mía thiên nhiên Biên Hòa gói 1kg',
        price: 35500,
        original_price: 10000,
        in_stock: 90,
        status: 'active',
        description: 'Đường mía thiên nhiên Biên Hoà 1kg được làm từ 100% mật mía đường tinh khiết, tự nhiên, mang lại vị ngọt dễ chịu, giúp món ăn có màu sắc và hương vị hấp dẫn hơn. Đường Biên Hòa sản xuất bằng phương pháp kết tinh hiện đại, không chất tạo màu, an toàn sử dụng.',
        images: [
          'https://cdn.tgdd.vn/Products/Images/2804/193562/bhx/duong-mia-thien-nhien-bien-hoa-goi-1kg-202202141526330176.jpg',
          'https://cdnv2.tgdd.vn/bhx-static/bhx/Products/Images/2804/193562/bhx/duong-vang-thien-nhien-bien-hoa-goi-1kg_202506041047178929.jpg',
          'https://cdn.tgdd.vn/Products/Images/2804/193562/bhx/duong-vang-thien-nhien-bien-hoa-gold-goi-1kg-202104230135254630.jpeg'
        ]
      },
      {
        category_id: categories[6]._id,
        name: 'Đường phèn Hoàng Long gói 500g',
        price: 27500,
        original_price: 17000,
        in_stock: 120,
        status: 'active',
        description: 'Đường phèn được sản xuất từ mía đường tự nhiên tinh khiết bằng công nghệ hiện đại đến từ thương hiệu đường Hoàng Long. Đường phèn hạt to Hoàng Long gói 500g có màu trắng tự nhiên nên có thể dùng để nấu chè, pha chế các loại thức uống giải nhiệt,...',
        images: [
          'https://cdn.tgdd.vn/Products/Images/2804/77187/bhx/duong-phen-hoang-long-goi-500g-202202160900434649.jpg',
          'https://cdn.tgdd.vn/Products/Images/2804/77187/bhx/duong-phen-hat-to-hoang-long-goi-500g-201912121527430211.jpg',
          'https://cdn.tgdd.vn/Products/Images/2804/77187/bhx/duong-phen-hat-to-hoang-long-goi-500g-201912121527433674.jpg',
          'https://cdn.tgdd.vn/Products/Images/2804/77187/bhx/duong-phen-hat-to-hoang-long-goi-500g-201912121527439507.jpg'
        ]
      },
      // Thêm 50 sản phẩm mới
      // Rau củ thêm
      {
        category_id: categories[0]._id,
        name: 'Rau cải thảo',
        price: 25000,
        original_price: 22000,
        in_stock: 70,
        status: 'active',
        description: 'Rau cải thảo tươi ngon, giòn ngọt. Rau cải thảo giàu vitamin và khoáng chất, tốt cho hệ tiêu hóa.',
        images: [
          'https://cdn.tgdd.vn/Products/Images/2286/123467/bhx/rau-cai-thao-202401251130536710.jpg',
          'https://cdn.tgdd.vn/Products/Images/2286/123467/bhx/rau-cai-thao-202401251130539737.jpg'
        ]
      },
      {
        category_id: categories[0]._id,
        name: 'Rau ngót',
        price: 18000,
        original_price: 15000,
        in_stock: 85,
        status: 'active',
        description: 'Rau ngót tươi ngon, mát lành. Rau ngót giàu canxi, sắt và vitamin C, tốt cho xương và máu.',
        images: [
          'https://cdn.tgdd.vn/Products/Images/2286/123468/bhx/rau-ngot-202401251130536710.jpg',
          'https://cdn.tgdd.vn/Products/Images/2286/123468/bhx/rau-ngot-202401251130539737.jpg'
        ]
      },
      {
        category_id: categories[0]._id,
        name: 'Rau dền',
        price: 16000,
        original_price: 14000,
        in_stock: 60,
        status: 'active',
        description: 'Rau dền tươi ngon, giàu sắt và canxi. Rau dền giúp bổ máu và tốt cho xương.',
        images: [
          'https://cdn.tgdd.vn/Products/Images/2286/123469/bhx/rau-den-202401251130536710.jpg',
          'https://cdn.tgdd.vn/Products/Images/2286/123469/bhx/rau-den-202401251130539737.jpg'
        ]
      },
      {
        category_id: categories[0]._id,
        name: 'Rau mồng tơi',
        price: 17000,
        original_price: 15000,
        in_stock: 75,
        status: 'active',
        description: 'Rau mồng tơi tươi ngon, mát lành. Rau mồng tơi giàu vitamin và khoáng chất, tốt cho sức khỏe.',
        images: [
          'https://cdn.tgdd.vn/Products/Images/2286/123470/bhx/rau-mong-toi-202401251130536710.jpg',
          'https://cdn.tgdd.vn/Products/Images/2286/123470/bhx/rau-mong-toi-202401251130539737.jpg'
        ]
      },
      {
        category_id: categories[0]._id,
        name: 'Rau lang',
        price: 14000,
        original_price: 12000,
        in_stock: 90,
        status: 'active',
        description: 'Rau lang tươi ngon, giàu chất xơ. Rau lang giúp nhuận tràng và tốt cho hệ tiêu hóa.',
        images: [
          'https://cdn.tgdd.vn/Products/Images/2286/123471/bhx/rau-lang-202401251130536710.jpg',
          'https://cdn.tgdd.vn/Products/Images/2286/123471/bhx/rau-lang-202401251130539737.jpg'
        ]
      },
      // Trái cây thêm
      {
        category_id: categories[1]._id,
        name: 'Chuối sứ',
        price: 25000,
        original_price: 22000,
        in_stock: 120,
        status: 'active',
        description: 'Chuối sứ ngọt thơm, giàu kali. Chuối giúp ổn định huyết áp và tốt cho tim mạch.',
        images: [
          'https://cdn.tgdd.vn/Products/Images/2286/123472/bhx/chuoi-su-202401251130536710.jpg',
          'https://cdn.tgdd.vn/Products/Images/2286/123472/bhx/chuoi-su-202401251130539737.jpg'
        ]
      },
      {
        category_id: categories[1]._id,
        name: 'Xoài cát Hòa Lộc',
        price: 55000,
        original_price: 48000,
        in_stock: 40,
        status: 'active',
        description: 'Xoài cát Hòa Lộc ngọt thơm, thịt vàng mịn. Xoài giàu vitamin A và C, tốt cho mắt và da.',
        images: [
          'https://cdn.tgdd.vn/Products/Images/2286/123473/bhx/xoai-cat-hoa-loc-202401251130536710.jpg',
          'https://cdn.tgdd.vn/Products/Images/2286/123473/bhx/xoai-cat-hoa-loc-202401251130539737.jpg'
        ]
      },
      {
        category_id: categories[1]._id,
        name: 'Dứa mật',
        price: 35000,
        original_price: 30000,
        in_stock: 55,
        status: 'active',
        description: 'Dứa mật ngọt thơm, giàu enzyme bromelain. Dứa giúp tiêu hóa tốt và tăng cường miễn dịch.',
        images: [
          'https://cdn.tgdd.vn/Products/Images/2286/123474/bhx/dua-mat-202401251130536710.jpg',
          'https://cdn.tgdd.vn/Products/Images/2286/123474/bhx/dua-mat-202401251130539737.jpg'
        ]
      },
      {
        category_id: categories[1]._id,
        name: 'Dưa hấu',
        price: 30000,
        original_price: 25000,
        in_stock: 80,
        status: 'active',
        description: 'Dưa hấu ngọt mát, giàu nước. Dưa hấu giúp giải nhiệt và tốt cho thận.',
        images: [
          'https://cdn.tgdd.vn/Products/Images/2286/123475/bhx/dua-hau-202401251130536710.jpg',
          'https://cdn.tgdd.vn/Products/Images/2286/123475/bhx/dua-hau-202401251130539737.jpg'
        ]
      },
      {
        category_id: categories[1]._id,
        name: 'Thanh long ruột đỏ',
        price: 40000,
        original_price: 35000,
        in_stock: 45,
        status: 'active',
        description: 'Thanh long ruột đỏ ngọt mát, giàu chất chống oxy hóa. Thanh long tốt cho tim mạch và làm đẹp da.',
        images: [
          'https://cdn.tgdd.vn/Products/Images/2286/123476/bhx/thanh-long-ruot-do-202401251130536710.jpg',
          'https://cdn.tgdd.vn/Products/Images/2286/123476/bhx/thanh-long-ruot-do-202401251130539737.jpg'
        ]
      },
      // Thịt cá thêm
      {
        category_id: categories[2]._id,
        name: 'Thịt bò phi lê',
        price: 280000,
        original_price: 250000,
        in_stock: 20,
        status: 'active',
        description: 'Thịt bò phi lê tươi ngon, mềm mại. Thịt bò giàu protein và sắt, tốt cho cơ bắp và máu.',
        images: [
          'https://cdn.tgdd.vn/Products/Images/2286/123477/bhx/thit-bo-phi-le-202401251130536710.jpg',
          'https://cdn.tgdd.vn/Products/Images/2286/123477/bhx/thit-bo-phi-le-202401251130539737.jpg'
        ]
      },
      {
        category_id: categories[2]._id,
        name: 'Thịt gà ta',
        price: 180000,
        original_price: 160000,
        in_stock: 35,
        status: 'active',
        description: 'Thịt gà ta tươi ngon, thịt chắc. Thịt gà giàu protein và ít mỡ, tốt cho sức khỏe.',
        images: [
          'https://cdn.tgdd.vn/Products/Images/2286/123478/bhx/thit-ga-ta-202401251130536710.jpg',
          'https://cdn.tgdd.vn/Products/Images/2286/123478/bhx/thit-ga-ta-202401251130539737.jpg'
        ]
      },
      {
        category_id: categories[2]._id,
        name: 'Cá lóc tươi',
        price: 140000,
        original_price: 120000,
        in_stock: 30,
        status: 'active',
        description: 'Cá lóc tươi ngon, thịt trắng mềm. Cá lóc giàu protein và omega-3, tốt cho não bộ.',
        images: [
          'https://cdn.tgdd.vn/Products/Images/2286/123479/bhx/ca-loc-tuoi-202401251130536710.jpg',
          'https://cdn.tgdd.vn/Products/Images/2286/123479/bhx/ca-loc-tuoi-202401251130539737.jpg'
        ]
      },
      {
        category_id: categories[2]._id,
        name: 'Tôm sú tươi',
        price: 220000,
        original_price: 200000,
        in_stock: 25,
        status: 'active',
        description: 'Tôm sú tươi ngon, thịt chắc ngọt. Tôm sú giàu protein và canxi, tốt cho xương.',
        images: [
          'https://cdn.tgdd.vn/Products/Images/2286/123480/bhx/tom-su-tuoi-202401251130536710.jpg',
          'https://cdn.tgdd.vn/Products/Images/2286/123480/bhx/tom-su-tuoi-202401251130539737.jpg'
        ]
      },
      {
        category_id: categories[2]._id,
        name: 'Cua biển tươi',
        price: 350000,
        original_price: 320000,
        in_stock: 15,
        status: 'active',
        description: 'Cua biển tươi ngon, thịt ngọt béo. Cua biển giàu protein và omega-3, tốt cho sức khỏe.',
        images: [
          'https://cdn.tgdd.vn/Products/Images/2286/123481/bhx/cua-bien-tuoi-202401251130536710.jpg',
          'https://cdn.tgdd.vn/Products/Images/2286/123481/bhx/cua-bien-tuoi-202401251130539737.jpg'
        ]
      },
      // Gia vị thêm
      {
        category_id: categories[3]._id,
        name: 'Hành tím',
        price: 8000,
        original_price: 6000,
        in_stock: 150,
        status: 'active',
        description: 'Hành tím tươi ngon, thơm nồng. Hành tím giúp tăng hương vị món ăn và có tác dụng kháng khuẩn.',
        images: [
          'https://cdn.tgdd.vn/Products/Images/2286/123482/bhx/hanh-tim-202401251130536710.jpg',
          'https://cdn.tgdd.vn/Products/Images/2286/123482/bhx/hanh-tim-202401251130539737.jpg'
        ]
      },
      {
        category_id: categories[3]._id,
        name: 'Tỏi tươi',
        price: 12000,
        original_price: 10000,
        in_stock: 120,
        status: 'active',
        description: 'Tỏi tươi thơm nồng, có tác dụng kháng khuẩn. Tỏi giúp tăng hương vị món ăn và tốt cho tim mạch.',
        images: [
          'https://cdn.tgdd.vn/Products/Images/2286/123483/bhx/toi-tuoi-202401251130536710.jpg',
          'https://cdn.tgdd.vn/Products/Images/2286/123483/bhx/toi-tuoi-202401251130539737.jpg'
        ]
      },
      {
        category_id: categories[3]._id,
        name: 'Gừng tươi',
        price: 15000,
        original_price: 12000,
        in_stock: 100,
        status: 'active',
        description: 'Gừng tươi thơm nồng, có tác dụng làm ấm cơ thể. Gừng giúp tiêu hóa tốt và chống buồn nôn.',
        images: [
          'https://cdn.tgdd.vn/Products/Images/2286/123484/bhx/gung-tuoi-202401251130536710.jpg',
          'https://cdn.tgdd.vn/Products/Images/2286/123484/bhx/gung-tuoi-202401251130539737.jpg'
        ]
      },
      {
        category_id: categories[3]._id,
        name: 'Nghệ tươi',
        price: 18000,
        original_price: 15000,
        in_stock: 80,
        status: 'active',
        description: 'Nghệ tươi có màu vàng đẹp, có tác dụng kháng viêm. Nghệ giúp làm đẹp da và tốt cho dạ dày.',
        images: [
          'https://cdn.tgdd.vn/Products/Images/2286/123485/bhx/nghe-tuoi-202401251130536710.jpg',
          'https://cdn.tgdd.vn/Products/Images/2286/123485/bhx/nghe-tuoi-202401251130539737.jpg'
        ]
      },
      {
        category_id: categories[3]._id,
        name: 'Sả tươi',
        price: 10000,
        original_price: 8000,
        in_stock: 90,
        status: 'active',
        description: 'Sả tươi thơm nồng, có tác dụng kháng khuẩn. Sả giúp tăng hương vị món ăn và tốt cho tiêu hóa.',
        images: [
          'https://cdn.tgdd.vn/Products/Images/2286/123486/bhx/sa-tuoi-202401251130536710.jpg',
          'https://cdn.tgdd.vn/Products/Images/2286/123486/bhx/sa-tuoi-202401251130539737.jpg'
        ]
      },
      // Dầu ăn thêm
      {
        category_id: categories[4]._id,
        name: 'Dầu oliu nguyên chất',
        price: 120000,
        original_price: 100000,
        in_stock: 40,
        status: 'active',
        description: 'Dầu oliu nguyên chất cao cấp, giàu chất chống oxy hóa. Dầu oliu tốt cho tim mạch và làm đẹp da.',
        images: [
          'https://cdn.tgdd.vn/Products/Images/2286/123487/bhx/dau-oliu-nguyen-chat-202401251130536710.jpg',
          'https://cdn.tgdd.vn/Products/Images/2286/123487/bhx/dau-oliu-nguyen-chat-202401251130539737.jpg'
        ]
      },
      {
        category_id: categories[4]._id,
        name: 'Dầu mè đen',
        price: 85000,
        original_price: 70000,
        in_stock: 35,
        status: 'active',
        description: 'Dầu mè đen thơm nồng, giàu vitamin E. Dầu mè đen tốt cho tim mạch và làm đẹp da.',
        images: [
          'https://cdn.tgdd.vn/Products/Images/2286/123488/bhx/dau-me-den-202401251130536710.jpg',
          'https://cdn.tgdd.vn/Products/Images/2286/123488/bhx/dau-me-den-202401251130539737.jpg'
        ]
      },
      {
        category_id: categories[4]._id,
        name: 'Dầu hạt cải',
        price: 75000,
        original_price: 65000,
        in_stock: 45,
        status: 'active',
        description: 'Dầu hạt cải tinh khiết, giàu omega-3. Dầu hạt cải tốt cho tim mạch và não bộ.',
        images: [
          'https://cdn.tgdd.vn/Products/Images/2286/123489/bhx/dau-hat-cai-202401251130536710.jpg',
          'https://cdn.tgdd.vn/Products/Images/2286/123489/bhx/dau-hat-cai-202401251130539737.jpg'
        ]
      },
      {
        category_id: categories[4]._id,
        name: 'Dầu đậu nành',
        price: 65000,
        original_price: 55000,
        in_stock: 50,
        status: 'active',
        description: 'Dầu đậu nành tinh khiết, giàu protein thực vật. Dầu đậu nành tốt cho tim mạch và xương.',
        images: [
          'https://cdn.tgdd.vn/Products/Images/2286/123490/bhx/dau-dau-nanh-202401251130536710.jpg',
          'https://cdn.tgdd.vn/Products/Images/2286/123490/bhx/dau-dau-nanh-202401251130539737.jpg'
        ]
      },
      {
        category_id: categories[4]._id,
        name: 'Dầu hướng dương',
        price: 70000,
        original_price: 60000,
        in_stock: 55,
        status: 'active',
        description: 'Dầu hướng dương tinh khiết, giàu vitamin E. Dầu hướng dương tốt cho tim mạch và làm đẹp da.',
        images: [
          'https://cdn.tgdd.vn/Products/Images/2286/123491/bhx/dau-huong-duong-202401251130536710.jpg',
          'https://cdn.tgdd.vn/Products/Images/2286/123491/bhx/dau-huong-duong-202401251130539737.jpg'
        ]
      },
      // Nước mắm thêm
      {
        category_id: categories[5]._id,
        name: 'Nước mắm Phú Quốc 40 độ đạm',
        price: 85000,
        original_price: 70000,
        in_stock: 30,
        status: 'active',
        description: 'Nước mắm Phú Quốc truyền thống, 40 độ đạm cao cấp. Nước mắm Phú Quốc có hương vị đậm đà đặc trưng.',
        images: [
          'https://cdn.tgdd.vn/Products/Images/2289/123492/bhx/nuoc-mam-phu-quoc-40-do-dam-202401251130536710.jpg',
          'https://cdn.tgdd.vn/Products/Images/2289/123492/bhx/nuoc-mam-phu-quoc-40-do-dam-202401251130539737.jpg'
        ]
      },
      {
        category_id: categories[5]._id,
        name: 'Nước mắm Nha Trang 25 độ đạm',
        price: 65000,
        original_price: 55000,
        in_stock: 40,
        status: 'active',
        description: 'Nước mắm Nha Trang truyền thống, 25 độ đạm. Nước mắm Nha Trang có hương vị thơm ngon đặc trưng.',
        images: [
          'https://cdn.tgdd.vn/Products/Images/2289/123493/bhx/nuoc-mam-nha-trang-25-do-dam-202401251130536710.jpg',
          'https://cdn.tgdd.vn/Products/Images/2289/123493/bhx/nuoc-mam-nha-trang-25-do-dam-202401251130539737.jpg'
        ]
      },
      {
        category_id: categories[5]._id,
        name: 'Nước mắm Cát Hải 30 độ đạm',
        price: 75000,
        original_price: 65000,
        in_stock: 35,
        status: 'active',
        description: 'Nước mắm Cát Hải truyền thống, 30 độ đạm. Nước mắm Cát Hải có hương vị đậm đà và thơm ngon.',
        images: [
          'https://cdn.tgdd.vn/Products/Images/2289/123494/bhx/nuoc-mam-cat-hai-30-do-dam-202401251130536710.jpg',
          'https://cdn.tgdd.vn/Products/Images/2289/123494/bhx/nuoc-mam-cat-hai-30-do-dam-202401251130539737.jpg'
        ]
      },
      {
        category_id: categories[5]._id,
        name: 'Nước mắm Cửa Kạn 35 độ đạm',
        price: 80000,
        original_price: 70000,
        in_stock: 25,
        status: 'active',
        description: 'Nước mắm Cửa Kạn truyền thống, 35 độ đạm. Nước mắm Cửa Kạn có hương vị đặc trưng của vùng biển.',
        images: [
          'https://cdn.tgdd.vn/Products/Images/2289/123495/bhx/nuoc-mam-cua-kan-35-do-dam-202401251130536710.jpg',
          'https://cdn.tgdd.vn/Products/Images/2289/123495/bhx/nuoc-mam-cua-kan-35-do-dam-202401251130539737.jpg'
        ]
      },
      {
        category_id: categories[5]._id,
        name: 'Nước mắm Hòn Đất 20 độ đạm',
        price: 55000,
        original_price: 45000,
        in_stock: 45,
        status: 'active',
        description: 'Nước mắm Hòn Đất truyền thống, 20 độ đạm. Nước mắm Hòn Đất có hương vị thơm ngon tự nhiên.',
        images: [
          'https://cdn.tgdd.vn/Products/Images/2289/123496/bhx/nuoc-mam-hon-dat-20-do-dam-202401251130536710.jpg',
          'https://cdn.tgdd.vn/Products/Images/2289/123496/bhx/nuoc-mam-hon-dat-20-do-dam-202401251130539737.jpg'
        ]
      },
      // Đường thêm
      {
        category_id: categories[6]._id,
        name: 'Đường phèn tinh khiết',
        price: 35000,
        original_price: 30000,
        in_stock: 100,
        status: 'active',
        description: 'Đường phèn tinh khiết 100%, không chứa tạp chất. Đường phèn có vị ngọt thanh, tốt cho sức khỏe.',
        images: [
          'https://cdn.tgdd.vn/Products/Images/2804/123497/bhx/duong-phen-tinh-khiet-202401251130536710.jpg',
          'https://cdn.tgdd.vn/Products/Images/2804/123497/bhx/duong-phen-tinh-khiet-202401251130539737.jpg'
        ]
      },
      {
        category_id: categories[6]._id,
        name: 'Đường nâu tự nhiên',
        price: 45000,
        original_price: 38000,
        in_stock: 80,
        status: 'active',
        description: 'Đường nâu tự nhiên, giàu khoáng chất. Đường nâu có vị ngọt đậm đà và tốt cho sức khỏe.',
        images: [
          'https://cdn.tgdd.vn/Products/Images/2804/123498/bhx/duong-nau-tu-nhien-202401251130536710.jpg',
          'https://cdn.tgdd.vn/Products/Images/2804/123498/bhx/duong-nau-tu-nhien-202401251130539737.jpg'
        ]
      },
      {
        category_id: categories[6]._id,
        name: 'Đường mía thô',
        price: 30000,
        original_price: 25000,
        in_stock: 90,
        status: 'active',
        description: 'Đường mía thô tự nhiên, chưa qua tinh chế. Đường mía thô giữ nguyên các khoáng chất tự nhiên.',
        images: [
          'https://cdn.tgdd.vn/Products/Images/2804/123499/bhx/duong-mia-tho-202401251130536710.jpg',
          'https://cdn.tgdd.vn/Products/Images/2804/123499/bhx/duong-mia-tho-202401251130539737.jpg'
        ]
      },
      {
        category_id: categories[6]._id,
        name: 'Đường dừa tự nhiên',
        price: 55000,
        original_price: 48000,
        in_stock: 60,
        status: 'active',
        description: 'Đường dừa tự nhiên, giàu khoáng chất. Đường dừa có vị ngọt thanh và chỉ số đường huyết thấp.',
        images: [
          'https://cdn.tgdd.vn/Products/Images/2804/123500/bhx/duong-dua-tu-nhien-202401251130536710.jpg',
          'https://cdn.tgdd.vn/Products/Images/2804/123500/bhx/duong-dua-tu-nhien-202401251130539737.jpg'
        ]
      },
      {
        category_id: categories[6]._id,
        name: 'Đường mật ong tự nhiên',
        price: 120000,
        original_price: 100000,
        in_stock: 40,
        status: 'active',
        description: 'Đường mật ong tự nhiên, giàu enzyme và khoáng chất. Mật ong có tác dụng kháng khuẩn và tốt cho sức khỏe.',
        images: [
          'https://cdn.tgdd.vn/Products/Images/2804/123501/bhx/duong-mat-ong-tu-nhien-202401251130536710.jpg',
          'https://cdn.tgdd.vn/Products/Images/2286/123501/bhx/duong-mat-ong-tu-nhien-202401251130539737.jpg'
        ]
      },
      // Sản phẩm đa dạng thêm
      {
        category_id: categories[7]._id,
        name: 'Coca Cola',
        price: 12000,
        original_price: 10000,
        in_stock: 150,
        status: 'active',
        description: 'Coca Cola tươi mát, hương vị đậm đà. Nước ngọt giải khát hoàn hảo cho mọi dịp.',
        images: [
          'https://cdn.tgdd.vn/Products/Images/2286/123502/bhx/coca-cola-202401251130536710.jpg',
          'https://cdn.tgdd.vn/Products/Images/2286/123502/bhx/coca-cola-202401251130539737.jpg'
        ]
      },
      {
        category_id: categories[7]._id,
        name: 'Sprite',
        price: 11000,
        original_price: 9000,
        in_stock: 120,
        status: 'active',
        description: 'Sprite tươi mát, vị chanh tự nhiên. Nước ngọt giải khát hoàn hảo.',
        images: [
          'https://cdn.tgdd.vn/Products/Images/2286/123503/bhx/sprite-202401251130536710.jpg',
          'https://cdn.tgdd.vn/Products/Images/2286/123503/bhx/sprite-202401251130539737.jpg'
        ]
      },
      {
        category_id: categories[7]._id,
        name: 'Fanta',
        price: 11000,
        original_price: 9000,
        in_stock: 100,
        status: 'active',
        description: 'Fanta hương vị cam tươi mát. Nước ngọt giải khát với hương vị trái cây tự nhiên.',
        images: [
          'https://cdn.tgdd.vn/Products/Images/2286/123504/bhx/fanta-202401251130536710.jpg',
          'https://cdn.tgdd.vn/Products/Images/2286/123504/bhx/fanta-202401251130539737.jpg'
        ]
      },
      {
        category_id: categories[7]._id,
        name: '7Up',
        price: 11000,
        original_price: 9000,
        in_stock: 110,
        status: 'active',
        description: '7Up tươi mát, vị chanh tự nhiên. Nước ngọt giải khát với hương vị thanh mát.',
        images: [
          'https://cdn.tgdd.vn/Products/Images/2286/123505/bhx/7up-202401251130536710.jpg',
          'https://cdn.tgdd.vn/Products/Images/2286/123505/bhx/7up-202401251130539737.jpg'
        ]
      },
      {
        category_id: categories[7]._id,
        name: 'Mirinda',
        price: 11000,
        original_price: 9000,
        in_stock: 95,
        status: 'active',
        description: 'Mirinda hương vị cam tươi mát. Nước ngọt giải khát với hương vị trái cây tự nhiên.',
        images: [
          'https://cdn.tgdd.vn/Products/Images/2286/123506/bhx/mirinda-202401251130536710.jpg',
          'https://cdn.tgdd.vn/Products/Images/2286/123506/bhx/mirinda-202401251130539737.jpg'
        ]
      },
      // Thịt heo
      {
        category_id: categories[8]._id,
        name: 'Ba rọi heo nhập khẩu',
        price: 180000,
        original_price: 160000,
        in_stock: 25,
        status: 'active',
        description: 'Ba rọi heo nhập khẩu tươi ngon, thịt mềm mại với lớp mỡ vừa phải. Ba rọi heo là phần thịt được ưa chuộng để làm các món ăn truyền thống Việt Nam.',
        images: [
          'https://cdn.tgdd.vn/Products/Images/8781/275804/bhx/ba-roi-heo-nhap-khau-202402011709510589.jpg',
          'https://cdnv2.tgdd.vn/bhx-static//ba-roi-heo-nhap-khau_202502131312187869.jpg',
          'https://cdn.tgdd.vn/Products/Images/8781/275804/bhx/ba-roi-heo-nhap-khau-202408141142519258.jpg'
        ]
      }
    ]);

    // Create vouchers
    const vouchers = await Voucher.create([
      {
        code: 'WELCOME10',
        discount_type: 'percentage',
        discount_value: 10,
        max_discount: 50000,
        min_order_value: 200000,
        start_date: new Date(),
        end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        status: 'active'
      },
      {
        code: 'SAVE20K',
        discount_type: 'fixed',
        discount_value: 20000,
        max_discount: 20000,
        min_order_value: 100000,
        start_date: new Date(),
        end_date: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15 days from now
        status: 'active'
      }
    ]);

    // Create variants for products
    const variants = await Variant.create([
      // Biến thể cho dầu ăn Tường An
      {
        product_id: products[11]._id, // Dầu thực vật Tường An Cooking Oil chai 1 lít
        name: 'Dầu thực vật Tường An Cooking Oil can 2 lít',
        sku: 'TUONGAN-2L',
        unit: 'can',
        quantity_per_unit: 1,
        price: 91500,
        original_price: 81000,
        in_stock: 50,
        status: 'active',
        is_default: false,
        description: 'Dầu thực vật Tường An Cooking Oil can 2 lít, tiết kiệm hơn cho gia đình',
        images: [
          'https://cdn.tgdd.vn/Products/Images/2286/79387/bhx/dau-thuc-vat-tuong-an-cooking-oil-can-2-lit-202212031341070283.png',
          'https://cdn.tgdd.vn/Products/Images/2286/79387/bhx/dau-thuc-vat-tuong-an-cooking-oil-can-2-lit-202212031344184629.png'
        ]
      },
      // Biến thể cho dầu ăn Cái Lân
      {
        product_id: products[12]._id, // Dầu thực vật tinh luyện Cái Lân chai 1 lít
        name: 'Dầu thực vật tinh luyện Cái Lân can 2 lít',
        sku: 'CAILAN-2L',
        unit: 'can',
        quantity_per_unit: 1,
        price: 91500,
        original_price: 81000,
        in_stock: 45,
        status: 'active',
        is_default: false,
        description: 'Dầu thực vật tinh luyện Cái Lân can 2 lít, tiết kiệm cho gia đình',
        images: [
          'https://cdn.tgdd.vn/Products/Images/2286/76154/bhx/dau-thuc-vat-tinh-luyen-cai-lan-can-2-lit-202209281748108000.png',
          'https://cdnv2.tgdd.vn/bhx-static/bhx/Products/Images/2286/76154/bhx/76154-slidee_202409121128194183.jpg'
        ]
      },
      // Biến thể cho dầu ăn Janbee
      {
        product_id: products[14]._id, // Dầu đậu nành tinh luyện Janbee chai 1 lít
        name: 'Dầu đậu nành tinh luyện Janbee can 2 lít',
        sku: 'JANBEE-2L',
        unit: 'can',
        quantity_per_unit: 1,
        price: 139500,
        original_price: 99000,
        in_stock: 30,
        status: 'active',
        is_default: false,
        description: 'Dầu đậu nành tinh luyện Janbee can 2 lít, tiết kiệm cho gia đình',
        images: [
          'https://cdn.tgdd.vn/Products/Images/2286/211349/bhx/dau-dau-nanh-tinh-luyen-janbee-can-2-lit-202407091034245023.jpg',
          'https://cdn.tgdd.vn/Products/Images/2286/211349/bhx/dau-dau-nanh-tinh-luyen-janbee-can-2-lit-202407091034247787.jpg'
        ]
      },
      // Biến thể cho nước mắm Knorr
      {
        product_id: products[17]._id, // Nước mắm cá cơm than Knorr 15 độ đạm chai 242ml
        name: 'Nước mắm cá cơm than Knorr 15 độ đạm chai 750ml',
        sku: 'KNORR-750ML',
        unit: 'chai',
        quantity_per_unit: 1,
        price: 53500,
        original_price: 29000,
        in_stock: 60,
        status: 'active',
        is_default: false,
        description: 'Nước mắm cá cơm than Knorr 15 độ đạm chai 750ml, tiết kiệm hơn',
        images: [
          'https://cdnv2.tgdd.vn/bhx-static/bhx/Products/Images/2289/289775/bhx/nuoc-mam-knorr-ngon-tron-vi-chai-750ml_202505271012011408.jpg',
          'https://cdnv2.tgdd.vn/bhx-static/bhx/Products/Images/2289/289775/bhx/nuoc-mam-knorr-ngon-tron-vi-chai-750ml_202505271012014126.jpg'
        ]
      },
      // Biến thể cho nước mắm Nam Ngư
      {
        product_id: products[18]._id, // Nước chấm Nam Ngư Đệ Nhị chai 900ml
        name: 'Thùng 15 chai nước chấm Nam Ngư Đệ Nhị chai 900ml',
        sku: 'NAMNGU-15CHAI',
        unit: 'thùng',
        quantity_per_unit: 15,
        price: 382500,
        original_price: 200000,
        in_stock: 10,
        status: 'active',
        is_default: false,
        description: 'Thùng 15 chai nước chấm Nam Ngư Đệ Nhị chai 900ml, tiết kiệm cho nhà hàng',
        images: [
          'https://cdnv2.tgdd.vn/bhx-static/bhx/Products/Images/2289/331153/bhx/331153-slide_202410161622435274.jpg',
          'https://cdn.tgdd.vn/Products/Images/2289/76428/bhx/nuoc-cham-nam-ngu-de-nhi-chai-900ml-201903151030027270.jpg'
        ]
      },
      // Biến thể cho nước mắm Chinsu
      {
        product_id: products[21]._id, // Nước mắm hương cá hồi hảo hạng Chinsu 16 độ đạm chai 500ml
        name: 'Nước mắm Chinsu cá cơm biển đông 25 độ đạm chai 720ml',
        sku: 'CHINSU-720ML',
        unit: 'chai',
        quantity_per_unit: 1,
        price: 62500,
        original_price: 53000,
        in_stock: 35,
        status: 'active',
        is_default: false,
        description: 'Nước mắm Chinsu cá cơm biển đông 25 độ đạm chai 720ml, đậm đà hơn',
        images: [
          'https://cdnv2.tgdd.vn/bhx-static/bhx/Products/Images/2289/260183/bhx/260183-slide-mau-moi_202501211043294970.jpg',
          'https://cdn.tgdd.vn/Products/Images/2289/260183/bhx/nuoc-mam-chinsu-ca-com-bien-dong-20-do-dam-chai-720ml-202407181130191704.jpg'
        ]
      },
      // Biến thể cho nước mắm Barona
      {
        product_id: products[22]._id, // Nước mắm cao cấp Vị Xưa Barona 40 độ đạm chai 50ml
        name: 'Nước mắm cao cấp Vị Xưa Barona 40 độ đạm chai 500ml',
        sku: 'BARONA-500ML',
        unit: 'chai',
        quantity_per_unit: 1,
        price: 92500,
        original_price: 80000,
        in_stock: 20,
        status: 'active',
        is_default: false,
        description: 'Nước mắm cao cấp Vị Xưa Barona 40 độ đạm chai 500ml, tiết kiệm hơn',
        images: [
          'https://cdn.tgdd.vn/Products/Images/2289/82719/bhx/sellingpoint.jpg',
          'https://cdn.tgdd.vn/Products/Images/2289/82719/bhx/nuoc-mam-cao-cap-vi-xua-barona-40-do-dam-chai-500ml-201910241415220050.jpg'
        ]
      }
    ]);

    console.log('Seed data created successfully!');
    console.log('Admin user:', admin.username);
    console.log('Normal user:', user.username);
    console.log('Categories:', categories.length);
    console.log('Products:', products.length);
    console.log('Variants:', variants.length);
    console.log('Vouchers:', vouchers.length);

    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData(); 
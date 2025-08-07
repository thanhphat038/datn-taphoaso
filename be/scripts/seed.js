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
        },
        {
          name: 'Bia',
          description: 'Các loại bia giải khát',
          status: 'active'
        },
        {
          name: 'Sữa',
          description: 'Các loại sữa tươi và sữa đóng hộp',
          status: 'active'
        },
        {
          name: 'Gạo',
          description: 'Các loại gạo chất lượng cao',
          status: 'active'
        },
        {
          name: 'Nước tương',
          description: 'Các loại nước tương đậu nành',
          status: 'active'
        },
        {
          name: 'Hạt nêm, bột ngọt, bột canh',
          description: 'Các loại hạt nêm, bột ngọt, bột canh',
          status: 'active'
        }
    ]);

    // Create products
    const products = await Product.create([
      {
        category_id: categories[0]._id,
        name: 'Rau muống tươi',
        price: 5000,
        original_price: 4000,
        in_stock: 100,
        status: 'active',
        description: 'Rau muống tươi ngon, sạch, không thuốc trừ sâu. Rau muống giàu chất xơ, vitamin và khoáng chất tốt cho sức khỏe.',
        images: [
          'https://cdnv2.tgdd.vn/bhx-static/bhx/Products/Images/8820/335480/bhx/rau-muong-nuoc-400gr_202505081440524383.jpg',
          'https://cdnv2.tgdd.vn/bhx-static/bhx/Products/Images/8820/335480/bhx/rau-muong-nuoc-400gr_202505071517577794.jpg',
          'https://cdnv2.tgdd.vn/bhx-static/bhx/Products/Images/8820/335480/bhx/rau-muong-nuoc-400gr_202505091532251089.jpg',
          'https://cdnv2.tgdd.vn/bhx-static/bhx/Products/Images/8820/335480/bhx/rau-muong-nuoc-400gr_202503271012135926.jpg'
        ]
      },
      {
        category_id: categories[0]._id,
        name: 'Rau cải xanh',
        price: 5000,
        original_price: 4000,
        in_stock: 80,
        status: 'active',
        description: 'Rau cải xanh tươi ngon, giàu vitamin C và chất chống oxy hóa. Rau cải giúp tăng cường miễn dịch và tốt cho tim mạch.',
        images: [
          'https://cdnv2.tgdd.vn/bhx-static/bhx/Products/Images/8820/309156/bhx/cai-be-xanh_202505081455284799.jpg',
          'https://cdn.tgdd.vn/Products/Images/8820/309156/bhx/cai-be-xanh-500g-202401121613149216.jpg',
          'https://cdn.tgdd.vn/Products/Images/8820/309156/bhx/cai-be-xanh-500g-202401121613156170.jpg',
          'https://cdn.tgdd.vn/Products/Images/8820/309156/bhx/cai-be-xanh-400gr-202408141351036981.jpg'
        ]
      },
      {
        category_id: categories[0]._id,
        name: 'Rau mồng tơi 400gr',
        price: 5000,
        original_price: 4000,
        in_stock: 90,
        status: 'active',
        description: 'Rau mồng tơi tươi ngon, giàu chất xơ và vitamin. Rau mồng tơi giúp thanh nhiệt, giải độc và tốt cho hệ tiêu hóa.',
        images: [
          'https://cdnv2.tgdd.vn/bhx-static/bhx/Products/Images/8820/310775/bhx/rau-mong-toi-500-g_202505081431588846.jpg',
          'https://cdn.tgdd.vn/Products/Images/8820/310775/bhx/rau-mong-toi-500-g-202310201702541388.jpg',
          'https://cdn.tgdd.vn/Products/Images/8820/310775/bhx/rau-mong-toi-500g-202307170925491678.jpg',
          'https://cdn.tgdd.vn/Products/Images/8820/310775/bhx/rau-mong-toi-400gr-202408141544286699.jpg'
        ]
      },
      {
        category_id: categories[0]._id,
        name: 'Hành lá 300g',
        price: 15000,
        original_price: 12000,
        in_stock: 70,
        status: 'active',
        description: 'Hành lá tươi ngon, thơm nồng. Hành lá giúp tăng hương vị món ăn và có tác dụng kháng khuẩn tự nhiên.',
        images: [
          'https://cdnv2.tgdd.vn/bhx-static/bhx/Products/Images/8820/232791/bhx/hanh-la-goi-50g_202505100847399340.jpg',
          'https://cdn.tgdd.vn/Products/Images/8820/232791/bhx/hanh-la-goi-50g-202012282236343442.jpg',
          'https://cdn.tgdd.vn/Products/Images/8820/232791/bhx/hanh-la-goi-50g-202012282236355259.jpg'
        ]
      },
      {
        category_id: categories[0]._id,
        name: 'Xà lách ta 300g',
        price: 12000,
        original_price: 10000,
        in_stock: 60,
        status: 'active',
        description: 'Xà lách ta tươi giòn, giàu vitamin và khoáng chất. Xà lách giúp làm mát cơ thể và tốt cho hệ tiêu hóa.',
        images: [
          'https://cdnv2.tgdd.vn/bhx-static/bhx/Products/Images/8820/325723/bhx/xa-lach-ta-300g_202505240908090022.jpg',
          'https://cdnv2.tgdd.vn/bhx-static/bhx/Products/Images/8820/325723/bhx/xa-lach-ta-300g_202505240921170604.jpg',
          'https://cdnv2.tgdd.vn/bhx-static/bhx/Products/Images/8820/325723/bhx/xa-lach-ta-300g_202505240921167970.jpg'
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
          'https://cdn.tgdd.vn/Products/Images/2804/321751/bhx/duong-vang-quang-ngai-goi-1kg-202401251130539737.jpg',
          'https://cdn.tgdd.vn/Products/Images/2804/321751/bhx/duong-vang-quang-ngai-goi-1kg-202403121131038324.jpg',
          'https://cdn.tgdd.vn/Products/Images/2804/321751/bhx/duong-vang-quang-ngai-goi-1kg-202403121131041775.jpg',
          'https://cdn.tgdd.vn/Products/Images/2804/321751/bhx/duong-vang-quang-ngai-goi-1kg-202403121131046591.jpg',
          'https://cdn.tgdd.vn/Products/Images/2804/321751/bhx/duong-vang-quang-ngai-goi-1kg-202403121131046591.jpg'
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
          'https://cdn.tgdd.vn/Products/Images/2804/207731/bhx/duong-thot-not-dang-vien-7-moutains-goi-500g-201907241728193833.jpg',
          'https://cdn.tgdd.vn/Products/Images/2804/207731/bhx/duong-thot-not-dang-vien-7-moutains-goi-500g-201907241728195103.jpg',
          'https://cdn.tgdd.vn/Products/Images/2804/207731/bhx/duong-thot-not-dang-vien-7-moutains-goi-500g-201907241728196933.jpg',
          'https://cdn.tgdd.vn/Products/Images/2804/207731/bhx/duong-thot-not-dang-vien-7-moutains-goi-500g-201907241728262073.jpg'
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
          'https://cdnv2.tgdd.vn/bhx-static/bhx/Products/Images/2804/193562/bhx/duong-vang-thien-nhien-bien-hoa-goi-1kg_202506041047178929.jpg',
          'https://cdn.tgdd.vn/Products/Images/2804/193562/bhx/duong-vang-thien-nhien-bien-hoa-gold-goi-1kg-202104230135249977.jpeg',
          'https://cdn.tgdd.vn/Products/Images/2804/193562/bhx/duong-vang-thien-nhien-bien-hoa-gold-goi-1kg-202104230135254630.jpeg',
          'https://cdn.tgdd.vn/Products/Images/2804/193562/bhx/duong-vang-thien-nhien-bien-hoa-gold-goi-1kg-202104230135260971.jpeg'
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
          'https://cdn.tgdd.vn/Products/Images/2804/77187/bhx/duong-phen-hat-to-hoang-long-goi-500g-201912121527430211.jpg',
          'https://cdn.tgdd.vn/Products/Images/2804/77187/bhx/duong-phen-hat-to-hoang-long-goi-500g-201912121527433674.jpg',
          'https://cdn.tgdd.vn/Products/Images/2804/77187/bhx/duong-phen-hat-to-hoang-long-goi-500g-201912121527436425.jpg',
          'https://cdn.tgdd.vn/Products/Images/2804/77187/bhx/duong-phen-hat-to-hoang-long-goi-500g-201912121527439507.jpg',
          'https://cdn.tgdd.vn/Products/Images/2804/77187/bhx/duong-phen-tui-05kg-hl-4-700x467.jpg'
        ]
      },
      // Thêm 50 sản phẩm mới
      // Rau củ thêm
      
      
      {
        category_id: categories[3]._id,
        name: 'Sả tươi 200gr',
        price: 10000,
        original_price: 8000,
        in_stock: 90,
        status: 'active',
        description: 'Sả tươi thơm nồng, có tác dụng kháng khuẩn. Sả giúp tăng hương vị món ăn và tốt cho tiêu hóa.',
        images: [
          'https://cdnv2.tgdd.vn/bhx-static/bhx/Products/Images/8785/292740/bhx/cdntgddvnproductsimages8785292740bhxsa-cay-goi-200g-202210031601138393_202409041611032864.jpg'
        ]
      },
      // Dầu ăn thêm
      {
        category_id: categories[4]._id,
        name: 'Dầu olive Extra Virgin Olivoilà chai 250ml',
        price: 120000,
        original_price: 100000,
        in_stock: 40,
        status: 'active',
        description: 'Dầu oliu nguyên chất cao cấp, giàu chất chống oxy hóa. Dầu oliu tốt cho tim mạch và làm đẹp da.',
        images: [
          'https://cdnv2.tgdd.vn/bhx-static/bhx/Products/Images/2286/79397/bhx/79397-sldie_202409121337056916.jpg',
          'https://cdn.tgdd.vn/Products/Images/2286/79397/bhx/dau-olive-extra-virgin-olivoila-chai-250ml-202407130903572803.jpg',
          'https://cdn.tgdd.vn/Products/Images/2286/79397/bhx/dau-olive-extra-virgin-olivoila-chai-250ml-202407130903574162.jpg',
          'https://cdn.tgdd.vn/Products/Images/2286/79397/bhx/dau-olive-extra-virgin-olivoila-chai-250ml-202407130903575666.jpg',
          'https://cdn.tgdd.vn/Products/Images/2286/79397/bhx/dau-olive-extra-virgin-olivoila-chai-250ml-202407130903577053.jpg'
        ]
      },
      {
        category_id: categories[4]._id,
        name: 'Dầu mè thơm Tường An chai 100ml',
        price: 38000,
        original_price: 35000,
        in_stock: 35,
        status: 'active',
        description: 'Dầu mè thơm Tường An chai 100ml',
        images: [
          'https://cdn.tgdd.vn/Products/Images/2286/228302/bhx/dau-me-thom-tuong-an-chai-100ml-202407121521338294.png',
          'https://cdn.tgdd.vn/Products/Images/2286/228302/bhx/dau-me-thom-tuong-an-chai-100ml-202407121521340192.png',
          'https://cdnv2.tgdd.vn/bhx-static/bhx/Products/Images/2286/228302/bhx/228302-tem_202409121542387249.jpg',
          'https://cdn.tgdd.vn/Products/Images/2286/228302/bhx/dau-me-thom-tuong-an-chai-100ml-202407121521344497.jpg',
          'https://cdn.tgdd.vn/Products/Images/2286/228302/bhx/dau-me-thom-tuong-an-chai-100ml-202407121521347116.jpg'
        ]
      },
      
      // Nước mắm thêm
      
      
      // Sản phẩm đa dạng thêm
      
      // Bia sản phẩm
      {
        category_id: categories[9]._id, // Bia
        name: 'Thùng 24 lon bia Sài Gòn Lager 330ml',
        price: 180000,
        original_price: 160000,
        in_stock: 50,
        status: 'active',
        description: 'Bia Sài Gòn Lager thùng 24 lon 330ml, hương vị đậm đà, tươi mát. Bia truyền thống Việt Nam với hương vị độc đáo.',
        images: [
          'https://cdn.tgdd.vn/Products/Images/2282/158349/bhx/thung-24-lon-bia-sai-gon-lager-330ml-202110111038141085.jpg',
          'https://cdn.tgdd.vn/Products/Images/2282/158349/bhx/thung-24-lon-bia-sai-gon-lager-330ml-202110111038144356.jpg',
          'https://cdn.tgdd.vn/Products/Images/2282/158349/bhx/thung-24-lon-bia-sai-gon-lager-330ml-202110111038148147.jpg',
          'https://cdn.tgdd.vn/Products/Images/2282/158349/bhx/thung-24-lon-bia-sai-gon-lager-330ml-202110111038154351.jpg'
        ]
      },
      {
        category_id: categories[9]._id, // Bia
        name: 'Thùng 24 lon bia Sài Gòn Chill 330ml',
        price: 190000,
        original_price: 170000,
        in_stock: 45,
        status: 'active',
        description: 'Bia Sài Gòn Chill thùng 24 lon 330ml, hương vị mới lạ, tươi mát. Bia với hương vị độc đáo, phù hợp cho mọi dịp.',
        images: [
          'https://cdn.tgdd.vn/Products/Images/2282/245542/bhx/thung-24-lon-bia-sai-gon-chill-330ml-202110211035111771.jpg',
          'https://cdn.tgdd.vn/Products/Images/2282/245542/bhx/thung-24-lon-bia-sai-gon-chill-330ml-202202191519360768.jpg',
          'https://cdn.tgdd.vn/Products/Images/2282/245542/bhx/thung-24-lon-bia-sai-gon-chill-330ml-202201211123355563.jpg',
          'https://cdn.tgdd.vn/Products/Images/2282/245542/bhx/thung-24-lon-bia-sai-gon-chill-330ml-202201211123359568.jpg'
        ]
      },
      {
        category_id: categories[9]._id, // Bia
        name: 'Bia 333 lon cao 250ml',
        price: 8500,
        original_price: 7500,
        in_stock: 200,
        status: 'active',
        description: 'Bia 333 lon cao 250ml, hương vị truyền thống, tươi mát. Bia Việt Nam với hương vị đặc trưng.',
        images: [
          'https://cdnv2.tgdd.vn/bhx-static/bhx/Products/Images/2282/328902/bhx/412208-4-1_202501040903412829.jpg',
          'https://cdnv2.tgdd.vn/bhx-static/bhx/Products/Images/2282/328902/bhx/httpscdnv2tgddvnbhx-staticbhxproductsimages2282328902bhxlon-250ml202412031319189029_202412041001229346.jpg'
        ]
      },
      {
        category_id: categories[9]._id, // Bia
        name: 'Thùng 24 lon bia Tiger lon cao 330ml',
        price: 220000,
        original_price: 200000,
        in_stock: 40,
        status: 'active',
        description: 'Bia Tiger thùng 24 lon cao 330ml, hương vị quốc tế, tươi mát. Bia cao cấp với hương vị đặc trưng.',
        images: [
          'https://cdnv2.tgdd.vn/bhx-static/bhx/Products/Images/2282/316846/bhx/412208-2_202501031430339626.jpg',
          'https://cdnv2.tgdd.vn/bhx-static/bhx/Products/Images/2282/316846/bhx/httpscdnv2tgddvnbhx-staticbhxproductsimages2282316846bhxlon-330ml-1202412031318226970_202412040935166288.jpg',
          'https://cdnv2.tgdd.vn/bhx-static/bhx/Products/Images/2282/316846/bhx/412208-1_202501031430336921.jpg'
        ]
      },
      {
        category_id: categories[9]._id, // Bia
        name: 'Thùng 24 lon bia Heineken Silver 330ml',
        price: 280000,
        original_price: 250000,
        in_stock: 35,
        status: 'active',
        description: 'Bia Heineken Silver thùng 24 lon 330ml, hương vị quốc tế, tươi mát. Bia cao cấp với hương vị đặc trưng.',
        images: [
          'https://cdn.tgdd.vn/Products/Images/2282/200639/bhx/thung-24-lon-bia-heineken-silver-330ml-202205111635132939.jpg',
          'https://cdn.tgdd.vn/Products/Images/2282/200639/bhx/thung-24-lon-bia-heineken-silver-330ml-201903281046300671.jpg',
          'https://cdn.tgdd.vn/Products/Images/2282/200639/bhx/thung-24-lon-bia-heineken-silver-330ml-201903281046301735.jpg',
          'https://cdn.tgdd.vn/Products/Images/2282/200639/bhx/thung-24-lon-bia-heineken-silver-330ml-201910091038476393.jpg',
          'https://cdn.tgdd.vn/Products/Images/2282/200639/bhx/thung-24-lon-bia-heineken-silver-330ml-201903281046302976.JPG'
        ]
      },
      // Sữa sản phẩm
      {
        category_id: categories[10]._id, // Sữa
        name: 'Thùng 48 hộp sữa tươi tiệt trùng ít đường TH True Milk 180ml',
        price: 180000,
        original_price: 160000,
        in_stock: 60,
        status: 'active',
        description: 'Sữa tươi tiệt trùng TH True Milk thùng 48 hộp 180ml, ít đường, giàu dinh dưỡng. Sữa tươi tự nhiên, an toàn cho sức khỏe.',
        images: [
          'https://cdn.tgdd.vn/Products/Images/2386/85853/bhx/thung-48-hop-sua-tuoi-tiet-trung-it-duong-th-true-milk-180ml-202104081706329168.jpg',
          'https://cdn.tgdd.vn/Products/Images/2386/85853/bhx/thung-48-hop-sua-tuoi-tiet-trung-it-duong-th-true-milk-180ml-202207151050154094.jpg',
          'https://cdn.tgdd.vn/Products/Images/2386/85853/bhx/thung-48-hop-sua-tuoi-tiet-trung-it-duong-th-true-milk-180ml-202207151050159958.jpg',
          'https://cdn.tgdd.vn/Products/Images/2386/85853/bhx/thung-sua-tuoi-tiet-trung-th-true-milk-it-duong-180ml-48-hop-201811262347284349.jpg',
          'https://cdn.tgdd.vn/Products/Images/2386/85853/bhx/thung-sua-tuoi-tiet-trung-th-true-milk-it-duong-180ml-48-hop-201811262347301480.jpg',
          'https://cdn.tgdd.vn/Products/Images/2386/85853/bhx/thung-sua-tuoi-tiet-trung-th-true-milk-it-duong-180ml-48-hop-201811262347319031.jpg'
        ]
      },
      {
        category_id: categories[10]._id, // Sữa
        name: 'Thùng 48 hộp sữa tươi tiệt trùng ít đường Vinamilk 100% sữa tươi 180ml',
        price: 170000,
        original_price: 150000,
        in_stock: 65,
        status: 'active',
        description: 'Sữa tươi tiệt trùng Vinamilk 100% thùng 48 hộp 180ml, ít đường, giàu dinh dưỡng. Sữa tươi tự nhiên, an toàn cho sức khỏe.',
        images: [
          'https://cdn.tgdd.vn/Products/Images/2386/85530/bhx/thung-48-hop-sua-tuoi-tiet-trung-it-duong-vinamilk-100-sua-tuoi-180ml-202310071419459272.jpg',
          'https://cdn.tgdd.vn/Products/Images/2386/85530/bhx/thung-48-hop-sua-tuoi-tiet-trung-it-duong-vinamilk-100-sua-tuoi-180ml-202310071419462141.jpg',
          'https://cdn.tgdd.vn/Products/Images/2386/85530/bhx/thung-48-hop-sua-tuoi-tiet-trung-it-duong-vinamilk-100-sua-tuoi-180ml-202310071419465238.jpg',
          'https://cdn.tgdd.vn/Products/Images/2386/85530/bhx/thung-48-hop-sua-tuoi-tiet-trung-it-duong-vinamilk-100-sua-tuoi-180ml-202310071419467951.jpg',
          'https://cdn.tgdd.vn/Products/Images/2386/85530/bhx/thung-48-hop-sua-tuoi-tiet-trung-it-duong-vinamilk-100-sua-tuoi-180ml-202310071419472266.jpg'
        ]
      },
      {
        category_id: categories[10]._id, // Sữa
        name: 'Thùng 12 hộp sữa tươi tiệt trùng không đường Vinamilk 100% sữa tươi 1 lít',
        price: 120000,
        original_price: 100000,
        in_stock: 40,
        status: 'active',
        description: 'Sữa tươi tiệt trùng Vinamilk 100% thùng 12 hộp 1 lít, không đường, giàu dinh dưỡng. Sữa tươi tự nhiên, an toàn cho sức khỏe.',
        images: [
          'https://cdn.tgdd.vn/Products/Images/2386/88762/bhx/thung-12-hop-sua-tuoi-tiet-trung-khong-duong-vinamilk-sua-tuoi-100-1-lit-202404021058296104.jpg',
          'https://cdn.tgdd.vn/Products/Images/2386/88762/bhx/thung-12-hop-sua-tuoi-tiet-trung-khong-duong-vinamilk-sua-tuoi-100-1-lit-202404021058276647.jpg',
          'https://cdn.tgdd.vn/Products/Images/2386/88762/bhx/thung-12-hop-sua-tuoi-tiet-trung-khong-duong-vinamilk-sua-tuoi-100-1-lit-202404021058279023.jpg',
          'https://cdn.tgdd.vn/Products/Images/2386/88762/bhx/thung-12-hop-sua-tuoi-tiet-trung-khong-duong-vinamilk-sua-tuoi-100-1-lit-202404021058281593.jpg',
          'https://cdn.tgdd.vn/Products/Images/2386/88762/bhx/thung-12-hop-sua-tuoi-tiet-trung-khong-duong-vinamilk-sua-tuoi-100-1-lit-202404021058283574.jpg'
        ]
      },
      {
        category_id: categories[10]._id, // Sữa
        name: 'Thùng 48 hộp sữa lúa mạch ít đường Milo A2 180ml',
        price: 200000,
        original_price: 180000,
        in_stock: 50,
        status: 'active',
        description: 'Sữa lúa mạch Milo A2 thùng 48 hộp 180ml, ít đường, giàu dinh dưỡng. Sữa với hương vị lúa mạch độc đáo.',
        images: [
          'https://cdnv2.tgdd.vn/bhx-static/bhx/Products/Images/2945/336178/bhx/thung-48-hop-sua-lua-mach-it-duong-milo-a2-180ml_202504101039251295.jpg',
          'https://cdnv2.tgdd.vn/bhx-static/bhx/Products/Images/2945/336178/bhx/thung-48-hop-sua-lua-mach-it-duong-milo-a2-180ml_202504101108334742.jpg',
          'https://cdnv2.tgdd.vn/bhx-static/bhx/Products/Images/2945/336178/bhx/thung-48-hop-sua-lua-mach-it-duong-milo-a2-180ml_202504110913175937.jpg',
          'https://cdnv2.tgdd.vn/bhx-static/bhx/Products/Images/2945/336178/bhx/thung-48-hop-sua-lua-mach-it-duong-milo-a2-180ml_202504101108372522.jpg',
          'https://cdnv2.tgdd.vn/bhx-static/bhx/Products/Images/2945/336178/bhx/thung-48-hop-sua-lua-mach-it-duong-milo-a2-180ml_202504110913179972.jpg'
        ]
      },
      {
        category_id: categories[10]._id, // Sữa
        name: 'Thùng 48 hộp sữa socola lúa mạch Lof Kun có thạch 170ml',
        price: 220000,
        original_price: 200000,
        in_stock: 45,
        status: 'active',
        description: 'Sữa socola lúa mạch Lof Kun có thạch thùng 48 hộp 170ml, hương vị độc đáo. Sữa với hương vị socola và thạch ngon.',
        images: [
          'https://cdnv2.tgdd.vn/bhx-static/bhx/Products/Images/2945/327987/bhx/327987-slide-1_202501211456144244.jpg',
          'https://cdn.tgdd.vn/Products/Images/2945/327987/bhx/thung-48-hop-sua-socola-lua-mach-lif-kun-co-thach-170ml-202407161605449380.jpg',
          'https://cdn.tgdd.vn/Products/Images/2945/327987/bhx/thung-48-hop-sua-socola-lua-mach-lif-kun-co-thach-170ml-202407161605455121.jpg',
          'https://cdnv2.tgdd.vn/bhx-static/bhx/Products/Images/2945/327987/bhx/327987-slide-2_202501211456292887.jpg',
          'https://cdnv2.tgdd.vn/bhx-static/bhx/Products/Images/2945/327987/bhx/bs9a8874_202412231017247836.jpg',
          'https://cdnv2.tgdd.vn/bhx-static/bhx/Products/Images/2945/327987/bhx/bs9a8872_202412231017252705.jpg'
        ]
      },
      // Gạo sản phẩm
      {
        category_id: categories[11]._id, // Gạo
        name: 'Gạo thơm A An ST25+ túi 5kg',
        price: 95000,
        original_price: 85000,
        in_stock: 100,
        status: 'active',
        description: 'Gạo thơm A An ST25+ túi 5kg, gạo thơm ngon nhất thế giới. Gạo ST25 có hương thơm đặc trưng, hạt gạo dài, trắng bóng và vị ngọt tự nhiên. Được đóng gói trong túi 5kg tiện lợi.',
        images: [
          'https://cdnv2.tgdd.vn/bhx-static/bhx/Products/Images/2513/332920/bhx/thiet-ke-chua-co-ten-2024-12-17t142205261_202412171422573674.jpg',
          'https://cdnv2.tgdd.vn/bhx-static/bhx/Products/Images/2513/332920/bhx/thiet-ke-chua-co-ten-2024-12-17t142238369_202412171422575934.jpg',
          'https://cdnv2.tgdd.vn/bhx-static/bhx/Products/Images/2513/332920/bhx/bs9a9650_202412241548531678.jpg',
          'https://cdnv2.tgdd.vn/bhx-static/bhx/Products/Images/2513/332920/bhx/bs9a9653_202412241548528679.jpg',
          'https://cdnv2.tgdd.vn/bhx-static/bhx/Products/Images/2513/332920/bhx/preview_202412241548525787.jpg'
        ]
      },
      {
        category_id: categories[11]._id, // Gạo
        name: 'Gạo thơm Neptune ST25+ Extra túi 5kg',
        price: 98000,
        original_price: 88000,
        in_stock: 80,
        status: 'active',
        description: 'Gạo thơm Neptune ST25+ Extra túi 5kg, gạo thơm ngon nhất thế giới. Gạo ST25 có hương thơm đặc trưng, hạt gạo dài, trắng bóng và vị ngọt tự nhiên. Được đóng gói trong túi 5kg tiện lợi.',
        images: [
          'https://cdn.tgdd.vn/Products/Images/2513/324448/bhx/gao-thom-neptune-st25-extra-tui-5kg-202403300918336881.jpg',
          'https://cdn.tgdd.vn/Products/Images/2513/324448/bhx/gao-thom-neptune-st25-extra-tui-5kg-202403300918339138.jpg',
          'https://cdn.tgdd.vn/Products/Images/2513/324448/bhx/gao-thom-neptune-st25-extra-tui-5kg-202403300918341944.jpg',
          'https://cdn.tgdd.vn/Products/Images/2513/324448/bhx/gao-thom-neptune-st25-extra-tui-5kg-202403300918344226.jpg',
          'https://cdn.tgdd.vn/Products/Images/2513/324448/bhx/gao-thom-neptune-st25-extra-tui-5kg-202403300918346554.jpg'
        ]
      },
      {
        category_id: categories[11]._id, // Gạo
        name: 'Gạo lứt tím Vĩnh Hiển túi 1kg',
        price: 28000,
        original_price: 25000,
        in_stock: 120,
        status: 'active',
        description: 'Gạo lứt tím Vĩnh Hiển túi 1kg, gạo nguyên cám giàu dinh dưỡng. Gạo lứt tím chứa nhiều chất xơ, vitamin và khoáng chất tốt cho sức khỏe.',
        images: [
          'https://cdn.tgdd.vn/Products/Images/2513/262354/bhx/gao-lut-tim-vinh-hien-tui-1kg-202112151155237174.jpg',
          'https://cdn.tgdd.vn/Products/Images/2513/262354/bhx/gao-lut-tim-vinh-hien-tui-1kg-202112151155242817.jpg',
          'https://cdn.tgdd.vn/Products/Images/2513/262354/bhx/gao-lut-tim-vinh-hien-tui-1kg-202112151155248108.jpg',
          'https://cdn.tgdd.vn/Products/Images/2513/262354/bhx/gao-lut-tim-vinh-hien-tui-1kg-202112151155252908.jpg'
        ]
      },
      {
        category_id: categories[11]._id, // Gạo
        name: 'Gạo lứt huyết rồng Bảo Minh thương hiệu túi 1kg',
        price: 32000,
        original_price: 28000,
        in_stock: 90,
        status: 'active',
        description: 'Gạo lứt huyết rồng Bảo Minh thương hiệu túi 1kg, gạo nguyên cám giàu dinh dưỡng. Gạo lứt huyết rồng chứa nhiều chất xơ, vitamin và khoáng chất tốt cho sức khỏe.',
        images: [
          'https://cdnv2.tgdd.vn/bhx-static/bhx/Products/Images/2513/338447/bhx/gao-lut-huyet-rong-bao-minh-thuong-hang-tui-1kg-clone_202505231104568186.jpg'
        ]
      },
      {
        category_id: categories[11]._id, // Gạo
        name: 'Gạo thơm Vua Gạo ST25 + túi 5kg',
        price: 95000,
        original_price: 85000,
        in_stock: 100,
        status: 'active',
        description: 'Gạo thơm Vua Gạo ST25 + túi 5kg, gạo thơm ngon nhất thế giới. Gạo ST25 có hương thơm đặc trưng, hạt gạo dài, trắng bóng và vị ngọt tự nhiên. Được đóng gói trong túi 5kg tiện lợi.',
        images: [
          'https://cdnv2.tgdd.vn/bhx-static/bhx/Products/Images/2513/332640/bhx/thiet-ke-chua-co-ten-2024-12-02t101141121_202412021017531362.jpg',
          'https://cdnv2.tgdd.vn/bhx-static/bhx/Products/Images/2513/332640/bhx/thiet-ke-chua-co-ten-2024-12-12t093138530_202412120932036499.jpg',
          'https://cdnv2.tgdd.vn/bhx-static/bhx/Products/Images/2513/332640/bhx/thiet-ke-chua-co-ten-2024-12-12t092511764_202412120925334751.jpg',
          'https://cdnv2.tgdd.vn/bhx-static/bhx/Products/Images/2513/332640/bhx/thiet-ke-chua-co-ten-2024-12-12t093042713_202412120930516264.jpg',
          'https://cdnv2.tgdd.vn/bhx-static/bhx/Products/Images/2513/332640/bhx/thiet-ke-chua-co-ten-2024-12-12t093024810_202412120930598920.jpg'
        ]
      },
      // Nước tương sản phẩm
      {
        category_id: categories[12]._id, // Nước tương
        name: 'Nước tương Nhất Ca Tam Thái Tử chai 500ml',
        price: 20500,
        original_price: 18000,
        in_stock: 80,
        status: 'active',
        description: 'Nước tương Nhất Ca Tam Thái Tử chai 500ml, nước tương đậu nành truyền thống, hương vị đậm đà tự nhiên.',
        images: [
          'https://cdnv2.tgdd.vn/bhx-static/bhx/Products/Images/2683/82802/bhx/82802-slide-mau-moi_202501211043008763.jpg',
          'https://cdn.tgdd.vn/Products/Images/2683/82802/bhx/nuoc-tuong-nhat-ca-tam-thai-tu-chai-500ml-202308111729325157.jpg',
          'https://cdn.tgdd.vn/Products/Images/2683/82802/bhx/nuoc-tuong-nhat-ca-tam-thai-tu-chai-500ml-202308111729327061.jpg'
        ]
      },
      {
        category_id: categories[12]._id, // Nước tương
        name: 'Nước tương đậu nành đậm đặc Cholimex chai 300ml',
        price: 15000,
        original_price: 13000,
        in_stock: 90,
        status: 'active',
        description: 'Nước tương đậu nành đậm đặc Cholimex chai 300ml, nước tương truyền thống, hương vị đậm đà.',
        images: [
          'https://cdn.tgdd.vn/Products/Images/2683/194598/bhx/nuoc-tuong-dau-nanh-dam-dac-cholimex-chai-300ml-202203152312042979.jpg',
          'https://cdn.tgdd.vn/Products/Images/2683/194598/bhx/nuoc-tuong-cholimex-dam-dac-chai-300ml-201902171540189232.JPG',
          'https://cdn.tgdd.vn/Products/Images/2683/194598/bhx/nuoc-tuong-dau-nanh-dam-dac-cholimex-chai-300ml-4-700x467.jpg',
          'https://cdn.tgdd.vn/Products/Images/2683/194598/bhx/nuoc-tuong-dau-nanh-dam-dac-cholimex-chai-300ml-3-700x467.jpg'
        ]
      },
      {
        category_id: categories[12]._id, // Nước tương
        name: 'Nước tương đậu nành Maggi thanh dịu chai 450ml',
        price: 19000,
        original_price: 17000,
        in_stock: 75,
        status: 'active',
        description: 'Nước tương đậu nành Maggi thanh dịu chai 450ml, nước tương thanh dịu, hương vị tự nhiên.',
        images: [
          'https://cdn.tgdd.vn/Products/Images/2683/278943/bhx/nuoc-tuong-dau-nanh-thanh-diu-maggi-chai-450ml-202308121813519516.jpg',
          'https://cdn.tgdd.vn/Products/Images/2683/278943/bhx/nuoc-tuong-dau-nanh-thanh-diu-maggi-chai-450ml-202308121813517143.jpg',
          'https://cdn.tgdd.vn/Products/Images/2683/278943/bhx/nuoc-tuong-dau-nanh-thanh-diu-maggi-chai-450ml-202308121813522060.jpg',
          'https://cdn.tgdd.vn/Products/Images/2683/278943/bhx/nuoc-tuong-dau-nanh-thanh-diu-maggi-chai-450ml-202308121813529551.jpg'
        ]
      },
      {
        category_id: categories[12]._id, // Nước tương
        name: 'Nước tương Chinsu tỏi ớt chai 330ml',
        price: 21000,
        original_price: 19000,
        in_stock: 70,
        status: 'active',
        description: 'Nước tương Chinsu tỏi ớt chai 330ml, nước tương với hương vị tỏi ớt độc đáo.',
        images: [
          'https://cdn.tgdd.vn/Products/Images/2683/278939/bhx/sellingpoint.jpg',
          'https://cdn.tgdd.vn/Products/Images/2683/278939/bhx/nuoc-tuong-chinsu-toi-ot-chai-330ml-202205060918487846.jpg',
          'https://cdn.tgdd.vn/Products/Images/2683/278939/bhx/nuoc-tuong-chinsu-toi-ot-chai-330ml-202205060918503635.jpg',
          'https://cdn.tgdd.vn/Products/Images/2683/278939/bhx/nuoc-tuong-chinsu-toi-ot-chai-330ml-202205060918506095.jpg'
        ]
      },
      {
        category_id: categories[12]._id, // Nước tương
        name: 'Nước tương Phú Sĩ Ajinomoto chai 500ml',
        price: 17600,
        original_price: 16000,
        in_stock: 85,
        status: 'active',
        description: 'Nước tương Phú Sĩ Ajinomoto chai 500ml, nước tương đậu nành truyền thống, hương vị đậm đà.',
        images: [
          'https://cdn.tgdd.vn/Products/Images/2683/76555/bhx/nuoc-tuong-phu-si-ajinomoto-chai-500ml-202308092053176050.jpg',
          'https://cdn.tgdd.vn/Products/Images/2683/76555/bhx/nuoc-tuong-phu-si-ajinomoto-chai-500ml-202308092053301017.jpg',
          'https://cdn.tgdd.vn/Products/Images/2683/76555/bhx/nuoc-tuong-phu-si-ajinomoto-chai-500ml-202308092053311632.jpg',
          'https://cdn.tgdd.vn/Products/Images/2683/76555/bhx/nuoc-tuong-phu-si-ajinomoto-chai-500ml-202308092053313609.jpg'
        ]
      },
      // Hạt nêm, bột ngọt, bột canh sản phẩm
      {
        category_id: categories[13]._id, // Hạt nêm, bột ngọt, bột canh
        name: 'Hạt nêm Chinsu ngọt tôm thơm thịt gói 900g',
        price: 69000,
        original_price: 60000,
        in_stock: 60,
        status: 'active',
        description: 'Hạt nêm Chinsu ngọt tôm thơm thịt gói 900g, hạt nêm cao cấp với hương vị tôm thơm thịt đậm đà.',
        images: [
          'https://cdn.tgdd.vn/Products/Images/2806/312764/bhx/hat-nem-chinsu-ngot-tom-thom-thit-goi-900g-202308181104413992.jpg',
          'https://cdn.tgdd.vn/Products/Images/2806/312764/bhx/hat-nem-chinsu-ngot-tom-thom-thit-goi-900g-202308051850002856.jpg',
          'https://cdn.tgdd.vn/Products/Images/2806/312764/bhx/hat-nem-chinsu-ngot-tom-thom-thit-goi-900g-202308181104417074.jpg',
          'https://cdn.tgdd.vn/Products/Images/2806/312764/bhx/hat-nem-chinsu-ngot-tom-thom-thit-goi-900g-202308181104424097.jpg'
        ]
      },
      {
        category_id: categories[13]._id, // Hạt nêm, bột ngọt, bột canh
        name: 'Hạt nêm cao cấp Maggi nấm hương gói 450g',
        price: 53500,
        original_price: 48000,
        in_stock: 50,
        status: 'active',
        description: 'Hạt nêm cao cấp Maggi nấm hương gói 450g, hạt nêm với hương vị nấm hương tự nhiên.',
        images: [
          'https://cdn.tgdd.vn/Products/Images/2806/198877/bhx/sellingpoint.jpg',
          'https://cdn.tgdd.vn/Products/Images/2806/198877/bhx/hat-nem-cao-cap-vi-nam-huong-maggi-goi-450g-202207291105505226.jpg',
          'https://cdn.tgdd.vn/Products/Images/2806/198877/bhx/hat-nem-cao-cap-vi-nam-huong-maggi-goi-202207291104146361.jpg',
          'https://cdn.tgdd.vn/Products/Images/2806/198877/bhx/hat-nem-cao-cap-vi-nam-huong-maggi-goi-202207291104156962.jpg'
        ]
      },
      {
        category_id: categories[13]._id, // Hạt nêm, bột ngọt, bột canh
        name: 'Hạt nêm Natafoods thịt heo gói 1kg',
        price: 49000,
        original_price: 45000,
        in_stock: 70,
        status: 'active',
        description: 'Hạt nêm Natafoods thịt heo gói 1kg, hạt nêm với hương vị thịt heo tự nhiên.',
        images: [
          'https://cdn.tgdd.vn/Products/Images/2806/247343/bhx/hat-nem-thit-heo-natafoods-goi-1kg-202203161350437396.jpg',
          'https://cdn.tgdd.vn/Products/Images/2806/247343/bhx/hat-nem-thit-heo-natafoods-goi-1kg-202108141817540320.jpg',
          'https://cdn.tgdd.vn/Products/Images/2806/247343/bhx/hat-nem-thit-heo-natafoods-goi-1kg-202108141818121703.jpg',
          'https://cdn.tgdd.vn/Products/Images/2806/247343/bhx/hat-nem-thit-heo-natafoods-goi-1kg-202108141818573008.jpg'
        ]
      },
      {
        category_id: categories[13]._id, // Hạt nêm, bột ngọt, bột canh
        name: 'Hạt nêm Knorr thịt thăn, xương ống, tủy gói 400g',
        price: 39000,
        original_price: 35000,
        in_stock: 65,
        status: 'active',
        description: 'Hạt nêm Knorr thịt thăn, xương ống, tủy gói 400g, hạt nêm với hương vị thịt thăn, xương ống, tủy đậm đà.',
        images: [
          'https://cdn.tgdd.vn/Products/Images/2806/82271/bhx/hat-nem-thit-than-xuong-ong-tuy-knorr-goi-400g-202202161925416725.jpg',
          'https://cdnv2.tgdd.vn/bhx-static/bhx/Products/Images/2806/82271/bhx/82271-slide_202409241054430157.jpg',
          'https://cdnv2.tgdd.vn/bhx-static/bhx/Products/Images/2806/82271/bhx/82271-slide-moi_202409301037454217.jpg'
        ]
      },
      {
        category_id: categories[13]._id, // Hạt nêm, bột ngọt, bột canh
        name: 'Hạt nêm Aji-ngon vị heo gói 900g',
        price: 75500,
        original_price: 68000,
        in_stock: 55,
        status: 'active',
        description: 'Hạt nêm Aji-ngon vị heo gói 900g, hạt nêm với hương vị heo tự nhiên, đậm đà.',
        images: [
          'https://cdnv2.tgdd.vn/bhx-static/bhx/Products/Images/2806/77238/bhx/77238-slide_202409300925114415.jpg',
          'https://cdnv2.tgdd.vn/bhx-static/bhx/Products/Images/2806/77238/bhx/77238-slidee_202409300922440802.jpg',
          'https://cdnv2.tgdd.vn/bhx-static/bhx/Products/Images/2806/77238/bhx/77238-slide-moi_202409300922444575.jpg'
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
      },
      // Biến thể cho bia Sài Gòn Lager
      {
        product_id: products[23]._id, // Thùng 24 lon bia Sài Gòn Lager 330ml
        name: 'Bia Sài Gòn Lager lon 330ml',
        sku: 'SAIGON-LAGER-330ML',
        unit: 'lon',
        quantity_per_unit: 1,
        price: 8500,
        original_price: 7500,
        in_stock: 200,
        status: 'active',
        is_default: false,
        description: 'Bia Sài Gòn Lager lon 330ml, hương vị đậm đà, tươi mát',
        images: [
          'https://cdn.tgdd.vn/Products/Images/2282/158346/bhx/bia-sai-gon-lager-330ml-202202101244236776.jpg',
          'https://cdn.tgdd.vn/Products/Images/2282/195208/bhx/6-lon-bia-sai-gon-lager-330ml-202110111038506128.jpg'
        ]
      },
      {
        product_id: products[23]._id, // Thùng 24 lon bia Sài Gòn Lager 330ml
        name: '6 lon bia Sài Gòn Lager 330ml',
        sku: 'SAIGON-LAGER-6LON',
        unit: 'lốc',
        quantity_per_unit: 6,
        price: 45000,
        original_price: 40000,
        in_stock: 80,
        status: 'active',
        is_default: false,
        description: '6 lon bia Sài Gòn Lager 330ml, tiết kiệm cho gia đình',
        images: [
          'https://cdn.tgdd.vn/Products/Images/2282/195208/bhx/6-lon-bia-sai-gon-lager-330ml-202110111038506128.jpg',
          'https://cdn.tgdd.vn/Products/Images/2282/158346/bhx/bia-sai-gon-lager-330ml-202202101244236776.jpg'
        ]
      },
      // Biến thể cho bia Sài Gòn Chill
      {
        product_id: products[24]._id, // Thùng 24 lon bia Sài Gòn Chill 330ml
        name: 'Bia Sài Gòn Chill lon 330ml',
        sku: 'SAIGON-CHILL-330ML',
        unit: 'lon',
        quantity_per_unit: 1,
        price: 9000,
        original_price: 8000,
        in_stock: 180,
        status: 'active',
        is_default: false,
        description: 'Bia Sài Gòn Chill lon 330ml, hương vị mới lạ, tươi mát',
        images: [
          'https://cdn.tgdd.vn/Products/Images/2282/245538/bhx/bia-sai-gon-chill-lon-330ml-202202191518191078.jpg',
          'https://cdn.tgdd.vn/Products/Images/2282/245540/bhx/6-lon-bia-sai-gon-chill-330ml-202202191519059129.jpg'
        ]
      },
      {
        product_id: products[24]._id, // Thùng 24 lon bia Sài Gòn Chill 330ml
        name: '6 lon bia Sài Gòn Chill 330ml',
        sku: 'SAIGON-CHILL-6LON',
        unit: 'lốc',
        quantity_per_unit: 6,
        price: 48000,
        original_price: 43000,
        in_stock: 70,
        status: 'active',
        is_default: false,
        description: '6 lon bia Sài Gòn Chill 330ml, tiết kiệm cho gia đình',
        images: [
          'https://cdn.tgdd.vn/Products/Images/2282/245540/bhx/6-lon-bia-sai-gon-chill-330ml-202202191519059129.jpg',
          'https://cdn.tgdd.vn/Products/Images/2282/245538/bhx/bia-sai-gon-chill-lon-330ml-202202191518191078.jpg'
        ]
      },
      {
        product_id: products[24]._id, // Thùng 24 lon bia Sài Gòn Chill 330ml
        name: 'Thùng 18 lon bia Sài Gòn Chill 330ml',
        sku: 'SAIGON-CHILL-18LON',
        unit: 'thùng',
        quantity_per_unit: 18,
        price: 140000,
        original_price: 125000,
        in_stock: 25,
        status: 'active',
        is_default: false,
        description: 'Thùng 18 lon bia Sài Gòn Chill 330ml, tiết kiệm cho nhà hàng',
        images: [
          'https://cdn.tgdd.vn/Products/Images/2282/297400/bhx/thung-18-lon-bia-sai-gon-chill-330ml-202211271345226732.jpg',
          'https://cdn.tgdd.vn/Products/Images/2282/245540/bhx/6-lon-bia-sai-gon-chill-330ml-202202191519059129.jpg'
        ]
      },
      // Biến thể cho bia 333
      {
        product_id: products[25]._id, // Bia 333 lon cao 250ml
        name: 'Bia 333 lon cao 250ml',
        sku: 'BIA333-250ML',
        unit: 'lon',
        quantity_per_unit: 1,
        price: 8500,
        original_price: 7500,
        in_stock: 300,
        status: 'active',
        is_default: true,
        description: 'Bia 333 lon cao 250ml, hương vị truyền thống, tươi mát',
        images: [
          'https://cdnv2.tgdd.vn/bhx-static/bhx/Products/Images/2282/328901/bhx/httpscdnv2tgddvnbhx-staticbhxproductsimages2282328901bhx1202411271524241358_202412041000310687.jpg',
          'https://cdnv2.tgdd.vn/bhx-static/bhx/Products/Images/2282/328902/bhx/412208-4-1_202501040903412829.jpg'
        ]
      },
      // Biến thể cho bia Tiger
      {
        product_id: products[26]._id, // Thùng 24 lon bia Tiger lon cao 330ml
        name: 'Bia Tiger lon cao 330ml',
        sku: 'TIGER-330ML',
        unit: 'lon',
        quantity_per_unit: 1,
        price: 12000,
        original_price: 10000,
        in_stock: 150,
        status: 'active',
        is_default: false,
        description: 'Bia Tiger lon cao 330ml, hương vị quốc tế, tươi mát',
        images: [
          'https://cdnv2.tgdd.vn/bhx-static/bhx/Products/Images/2282/316845/bhx/httpscdnv2tgddvnbhx-staticbhxproductsimages2282316845bhxlon-330ml-1202412031318045954_202412040956494059.jpg',
          'https://cdnv2.tgdd.vn/bhx-static/bhx/Products/Images/2282/319485/bhx/412208-5-1_202501031425346431.jpg'
        ]
      },
      {
        product_id: products[26]._id, // Thùng 24 lon bia Tiger lon cao 330ml
        name: '6 lon bia Tiger lon cao 330ml',
        sku: 'TIGER-6LON',
        unit: 'lốc',
        quantity_per_unit: 6,
        price: 65000,
        original_price: 55000,
        in_stock: 60,
        status: 'active',
        is_default: false,
        description: '6 lon bia Tiger lon cao 330ml, tiết kiệm cho gia đình',
        images: [
          'https://cdnv2.tgdd.vn/bhx-static/bhx/Products/Images/2282/319485/bhx/412208-5-1_202501031425346431.jpg',
          'https://cdnv2.tgdd.vn/bhx-static/bhx/Products/Images/2282/316845/bhx/httpscdnv2tgddvnbhx-staticbhxproductsimages2282316845bhxlon-330ml-1202412031318045954_202412040956494059.jpg'
        ]
      },
      // Biến thể cho bia Heineken
      {
        product_id: products[27]._id, // Thùng 24 lon bia Heineken Silver 330ml
        name: 'Bia Heineken Silver 330ml',
        sku: 'HEINEKEN-330ML',
        unit: 'lon',
        quantity_per_unit: 1,
        price: 15000,
        original_price: 12000,
        in_stock: 120,
        status: 'active',
        is_default: false,
        description: 'Bia Heineken Silver 330ml, hương vị quốc tế, tươi mát',
        images: [
          'https://cdn.tgdd.vn/Products/Images/2282/200637/bhx/bia-heineken-silver-330ml-201903281046586878.jpg',
          'https://cdn.tgdd.vn/Products/Images/2282/200638/bhx/6-lon-bia-heineken-silver-330ml-202301152339137476.jpg'
        ]
      },
      {
        product_id: products[27]._id, // Thùng 24 lon bia Heineken Silver 330ml
        name: '6 lon bia Heineken Silver 330ml',
        sku: 'HEINEKEN-6LON',
        unit: 'lốc',
        quantity_per_unit: 6,
        price: 80000,
        original_price: 70000,
        in_stock: 50,
        status: 'active',
        is_default: false,
        description: '6 lon bia Heineken Silver 330ml, tiết kiệm cho gia đình',
        images: [
          'https://cdn.tgdd.vn/Products/Images/2282/200638/bhx/6-lon-bia-heineken-silver-330ml-202301152339137476.jpg',
          'https://cdn.tgdd.vn/Products/Images/2282/200637/bhx/bia-heineken-silver-330ml-201903281046586878.jpg'
        ]
      },
      // Biến thể cho sữa TH True Milk
      {
        product_id: products[28]._id, // Thùng 48 hộp sữa tươi tiệt trùng ít đường TH True Milk 180ml
        name: 'Lốc 4 hộp sữa tươi tiệt trùng ít đường TH True Milk 180ml',
        sku: 'TH-TRUE-4HOP',
        unit: 'lốc',
        quantity_per_unit: 4,
        price: 18000,
        original_price: 16000,
        in_stock: 200,
        status: 'active',
        is_default: false,
        description: 'Lốc 4 hộp sữa tươi tiệt trùng ít đường TH True Milk 180ml, tiện lợi cho gia đình',
        images: [
          'https://cdn.tgdd.vn/Products/Images/2386/80492/bhx/loc-4-hop-sua-tuoi-tiet-trung-it-duong-th-true-milk-180ml-202203042221008284.jpg',
          'https://cdn.tgdd.vn/Products/Images/2386/85853/bhx/thung-48-hop-sua-tuoi-tiet-trung-it-duong-th-true-milk-180ml-202104081706329168.jpg'
        ]
      },
      // Biến thể cho sữa Vinamilk 100%
      {
        product_id: products[29]._id, // Thùng 48 hộp sữa tươi tiệt trùng ít đường Vinamilk 100% sữa tươi 180ml
        name: 'Lốc 4 hộp sữa tươi tiệt trùng ít đường Vinamilk 100% sữa tươi 180ml',
        sku: 'VINAMILK-4HOP',
        unit: 'lốc',
        quantity_per_unit: 4,
        price: 17000,
        original_price: 15000,
        in_stock: 220,
        status: 'active',
        is_default: false,
        description: 'Lốc 4 hộp sữa tươi tiệt trùng ít đường Vinamilk 100% sữa tươi 180ml, tiện lợi cho gia đình',
        images: [
          'https://cdn.tgdd.vn/Products/Images/2386/80604/bhx/loc-4-hop-sua-tuoi-tiet-trung-it-duong-vinamilk-100-sua-tuoi-180ml-202310071421530162.jpg',
          'https://cdn.tgdd.vn/Products/Images/2386/85530/bhx/thung-48-hop-sua-tuoi-tiet-trung-it-duong-vinamilk-100-sua-tuoi-180ml-202310071419459272.jpg'
        ]
      },
      // Biến thể cho sữa Vinamilk 1 lít
      {
        product_id: products[30]._id, // Thùng 12 hộp sữa tươi tiệt trùng không đường Vinamilk 100% sữa tươi 1 lít
        name: 'Sữa tươi tiệt trùng không đường Vinamilk 100% sữa tươi hộp 1 lít',
        sku: 'VINAMILK-1L',
        unit: 'hộp',
        quantity_per_unit: 1,
        price: 12000,
        original_price: 10000,
        in_stock: 150,
        status: 'active',
        is_default: false,
        description: 'Sữa tươi tiệt trùng không đường Vinamilk 100% sữa tươi hộp 1 lít, tiện lợi cho gia đình',
        images: [
          'https://cdn.tgdd.vn/Products/Images/2386/76888/bhx/sua-tuoi-tiet-trung-khong-duong-vinamilk-100-sua-tuoi-hop-1-lit-202403281355125054.jpg',
          'https://cdn.tgdd.vn/Products/Images/2386/88762/bhx/thung-12-hop-sua-tuoi-tiet-trung-khong-duong-vinamilk-sua-tuoi-100-1-lit-202404021058296104.jpg'
        ]
      },
      // Biến thể cho sữa Milo A2
      {
        product_id: products[31]._id, // Thùng 48 hộp sữa lúa mạch ít đường Milo A2 180ml
        name: 'Lốc 4 hộp sữa lúa mạch ít đường Milo A2 180ml',
        sku: 'MILO-A2-4HOP',
        unit: 'lốc',
        quantity_per_unit: 4,
        price: 20000,
        original_price: 18000,
        in_stock: 180,
        status: 'active',
        is_default: false,
        description: 'Lốc 4 hộp sữa lúa mạch ít đường Milo A2 180ml, tiện lợi cho gia đình',
        images: [
          'https://cdnv2.tgdd.vn/bhx-static/bhx/Products/Images/2945/336177/bhx/loc-4-hop-sua-lua-mach-it-duong-milo-a2-180ml_202504101051223453.jpg',
          'https://cdnv2.tgdd.vn/bhx-static/bhx/Products/Images/2945/336178/bhx/thung-48-hop-sua-lua-mach-it-duong-milo-a2-180ml_202504101039251295.jpg'
        ]
      },
      // Biến thể cho sữa Lof Kun
      {
        product_id: products[32]._id, // Thùng 48 hộp sữa socola lúa mạch Lof Kun có thạch 170ml
        name: 'Lốc 4 hộp sữa socola lúa mạch Lof Kun có thạch 170ml',
        sku: 'LOFKUN-4HOP',
        unit: 'lốc',
        quantity_per_unit: 4,
        price: 22000,
        original_price: 20000,
        in_stock: 160,
        status: 'active',
        is_default: false,
        description: 'Lốc 4 hộp sữa socola lúa mạch Lof Kun có thạch 170ml, tiện lợi cho gia đình',
        images: [
          'https://cdn.tgdd.vn/Products/Images/2945/327986/bhx/loc-4-hop-sua-socola-lua-mach-lif-kun-co-thach-170ml-202407161553487408.jpg',
          'https://cdnv2.tgdd.vn/bhx-static/bhx/Products/Images/2945/327987/bhx/327987-slide-1_202501211456144244.jpg'
        ]
      },
      // Biến thể cho gạo tám thơm
      {
        product_id: products[33]._id, // Gạo tám thơm 5kg
        name: 'Gạo tám thơm 1kg',
        sku: 'GAO-TAM-1KG',
        unit: 'kg',
        quantity_per_unit: 1,
        price: 18000,
        original_price: 16000,
        in_stock: 200,
        status: 'active',
        is_default: false,
        description: 'Gạo tám thơm 1kg, hạt gạo dài, thơm ngon',
        images: [
          'https://cdn.tgdd.vn/Products/Images/2286/123456/bhx/gao-tam-thom-1kg-202401251130536710.jpg',
          'https://cdn.tgdd.vn/Products/Images/2286/123456/bhx/gao-tam-thom-1kg-202401251130539737.jpg'
        ]
      },
      {
        product_id: products[33]._id, // Gạo tám thơm 5kg
        name: 'Gạo tám thơm 10kg',
        sku: 'GAO-TAM-10KG',
        unit: 'kg',
        quantity_per_unit: 10,
        price: 160000,
        original_price: 140000,
        in_stock: 50,
        status: 'active',
        is_default: false,
        description: 'Gạo tám thơm 10kg, tiết kiệm cho gia đình',
        images: [
          'https://cdn.tgdd.vn/Products/Images/2286/123456/bhx/gao-tam-thom-10kg-202401251130536710.jpg',
          'https://cdn.tgdd.vn/Products/Images/2286/123456/bhx/gao-tam-thom-10kg-202401251130539737.jpg'
        ]
      },
      // Biến thể cho gạo nếp cái hoa vàng
      {
        product_id: products[34]._id, // Gạo nếp cái hoa vàng 2kg
        name: 'Gạo nếp cái hoa vàng 1kg',
        sku: 'GAO-NEP-1KG',
        unit: 'kg',
        quantity_per_unit: 1,
        price: 25000,
        original_price: 22000,
        in_stock: 150,
        status: 'active',
        is_default: false,
        description: 'Gạo nếp cái hoa vàng 1kg, hạt gạo tròn, dẻo thơm',
        images: [
          'https://cdn.tgdd.vn/Products/Images/2286/123457/bhx/gao-nep-cai-hoa-vang-1kg-202401251130536710.jpg',
          'https://cdn.tgdd.vn/Products/Images/2286/123457/bhx/gao-nep-cai-hoa-vang-1kg-202401251130539737.jpg'
        ]
      },
      {
        product_id: products[34]._id, // Gạo nếp cái hoa vàng 2kg
        name: 'Gạo nếp cái hoa vàng 5kg',
        sku: 'GAO-NEP-5KG',
        unit: 'kg',
        quantity_per_unit: 5,
        price: 100000,
        original_price: 90000,
        in_stock: 60,
        status: 'active',
        is_default: false,
        description: 'Gạo nếp cái hoa vàng 5kg, tiết kiệm cho gia đình',
        images: [
          'https://cdn.tgdd.vn/Products/Images/2286/123457/bhx/gao-nep-cai-hoa-vang-5kg-202401251130536710.jpg',
          'https://cdn.tgdd.vn/Products/Images/2286/123457/bhx/gao-nep-cai-hoa-vang-5kg-202401251130539737.jpg'
        ]
      },
      // Biến thể cho gạo ST25
      {
        product_id: products[35]._id, // Gạo ST25 10kg
        name: 'Gạo ST25 5kg',
        sku: 'GAO-ST25-5KG',
        unit: 'kg',
        quantity_per_unit: 5,
        price: 95000,
        original_price: 85000,
        in_stock: 80,
        status: 'active',
        is_default: false,
        description: 'Gạo ST25 5kg, gạo thơm ngon nhất thế giới',
        images: [
          'https://cdn.tgdd.vn/Products/Images/2286/123458/bhx/gao-st25-5kg-202401251130536710.jpg',
          'https://cdn.tgdd.vn/Products/Images/2286/123458/bhx/gao-st25-5kg-202401251130539737.jpg'
        ]
      },
      {
        product_id: products[35]._id, // Gạo ST25 10kg
        name: 'Gạo ST25 25kg',
        sku: 'GAO-ST25-25KG',
        unit: 'kg',
        quantity_per_unit: 25,
        price: 400000,
        original_price: 350000,
        in_stock: 30,
        status: 'active',
        is_default: false,
        description: 'Gạo ST25 25kg, tiết kiệm cho gia đình lớn',
        images: [
          'https://cdn.tgdd.vn/Products/Images/2286/123458/bhx/gao-st25-25kg-202401251130536710.jpg',
          'https://cdn.tgdd.vn/Products/Images/2286/123458/bhx/gao-st25-25kg-202401251130539737.jpg'
        ]
      },
      // Biến thể cho gạo Jasmine
      {
        product_id: products[36]._id, // Gạo Jasmine 5kg
        name: 'Gạo Jasmine 1kg',
        sku: 'GAO-JASMINE-1KG',
        unit: 'kg',
        quantity_per_unit: 1,
        price: 20000,
        original_price: 18000,
        in_stock: 120,
        status: 'active',
        is_default: false,
        description: 'Gạo Jasmine 1kg, gạo thơm Thái Lan',
        images: [
          'https://cdn.tgdd.vn/Products/Images/2286/123459/bhx/gao-jasmine-1kg-202401251130536710.jpg',
          'https://cdn.tgdd.vn/Products/Images/2286/123459/bhx/gao-jasmine-1kg-202401251130539737.jpg'
        ]
      },
      {
        product_id: products[36]._id, // Gạo Jasmine 5kg
        name: 'Gạo Jasmine 10kg',
        sku: 'GAO-JASMINE-10KG',
        unit: 'kg',
        quantity_per_unit: 10,
        price: 180000,
        original_price: 160000,
        in_stock: 40,
        status: 'active',
        is_default: false,
        description: 'Gạo Jasmine 10kg, tiết kiệm cho gia đình',
        images: [
          'https://cdn.tgdd.vn/Products/Images/2286/123459/bhx/gao-jasmine-10kg-202401251130536710.jpg',
          'https://cdn.tgdd.vn/Products/Images/2286/123459/bhx/gao-jasmine-10kg-202401251130539737.jpg'
        ]
      },
      // Biến thể cho gạo lứt đỏ
      {
        product_id: products[37]._id, // Gạo lứt đỏ 1kg
        name: 'Gạo lứt đỏ 500g',
        sku: 'GAO-LUT-DO-500G',
        unit: 'gram',
        quantity_per_unit: 500,
        price: 15000,
        original_price: 13000,
        in_stock: 200,
        status: 'active',
        is_default: false,
        description: 'Gạo lứt đỏ 500g, gạo nguyên cám giàu dinh dưỡng',
        images: [
          'https://cdn.tgdd.vn/Products/Images/2286/123460/bhx/gao-lut-do-500g-202401251130536710.jpg',
          'https://cdn.tgdd.vn/Products/Images/2286/123460/bhx/gao-lut-do-500g-202401251130539737.jpg'
        ]
      },
      {
        product_id: products[37]._id, // Gạo lứt đỏ 1kg
        name: 'Gạo lứt đỏ 2kg',
        sku: 'GAO-LUT-DO-2KG',
        unit: 'kg',
        quantity_per_unit: 2,
        price: 45000,
        original_price: 40000,
        in_stock: 80,
        status: 'active',
        is_default: false,
        description: 'Gạo lứt đỏ 2kg, tiết kiệm cho gia đình',
        images: [
          'https://cdn.tgdd.vn/Products/Images/2286/123460/bhx/gao-lut-do-2kg-202401251130536710.jpg',
          'https://cdn.tgdd.vn/Products/Images/2286/123460/bhx/gao-lut-do-2kg-202401251130539737.jpg'
        ]
      },
      // Biến thể cho nước tương Maggi
      {
        product_id: products[42]._id, // Nước tương đậu nành Maggi thanh dịu chai 450ml
        name: 'Nước tương đậu nành Maggi thanh dịu chai 700ml',
        sku: 'MAGGI-700ML',
        unit: 'chai',
        quantity_per_unit: 1,
        price: 30000,
        original_price: 27000,
        in_stock: 50,
        status: 'active',
        is_default: false,
        description: 'Nước tương đậu nành Maggi thanh dịu chai 700ml, tiết kiệm cho gia đình',
        images: [
          'https://cdn.tgdd.vn/Products/Images/2683/79060/bhx/nuoc-tuong-dau-nanh-thanh-diu-maggi-chai-700ml-202304131533080005.jpg',
          'https://cdn.tgdd.vn/Products/Images/2683/79060/bhx/nuoc-tuong-dau-nanh-thanh-diu-maggi-chai-700ml-202304131530127244.jpg',
          'https://cdn.tgdd.vn/Products/Images/2683/79060/bhx/nuoc-tuong-dau-nanh-thanh-diu-maggi-chai-700ml-202304131530271233.jpg'
        ]
      },
      // Biến thể cho hạt nêm Knorr
      {
        product_id: products[46]._id, // Hạt nêm Knorr thịt thăn, xương ống, tủy gói 400g
        name: 'Hạt nêm Knorr thịt thăn, xương ống, tủy gói 1.2kg (Tặng 1kg gạo)',
        sku: 'KNORR-1.2KG',
        unit: 'gói',
        quantity_per_unit: 1,
        price: 99000,
        original_price: 89000,
        in_stock: 30,
        status: 'active',
        is_default: false,
        description: 'Hạt nêm Knorr thịt thăn, xương ống, tủy gói 1.2kg (Tặng 1kg gạo), tiết kiệm cho gia đình',
        images: [
          'https://cdnv2.tgdd.vn/bhx-static/bhx/Products/Images/2806/335690/bhx/hat-nem-knorr-thit-than-xuong-ong-tuy-goi-12kg-tang-1kg-gao_202504160910373980.jpg'
        ]
      },
      // Biến thể cho hạt nêm Aji-ngon
      {
        product_id: products[47]._id, // Hạt nêm Aji-ngon vị heo gói 900g
        name: 'Hạt nêm Aji-ngon vị heo gói 55g',
        sku: 'AJI-NGON-55G',
        unit: 'gói',
        quantity_per_unit: 1,
        price: 5000,
        original_price: 4500,
        in_stock: 300,
        status: 'active',
        is_default: false,
        description: 'Hạt nêm Aji-ngon vị heo gói 55g, tiện lợi cho nấu ăn',
        images: [
          'https://cdn.tgdd.vn/Products/Images/2806/198893/bhx/hat-nem-vi-heo-aji-ngon-goi-55g-202211051018410088.jpg',
          'https://cdn.tgdd.vn/Products/Images/2806/198893/bhx/hat-nem-vi-heo-aji-ngon-goi-55g-202211051018384374.jpg'
        ]
      },
      {
        product_id: products[47]._id, // Hạt nêm Aji-ngon vị heo gói 900g
        name: 'Hạt nêm Aji-ngon vị heo gói 170g',
        sku: 'AJI-NGON-170G',
        unit: 'gói',
        quantity_per_unit: 1,
        price: 17000,
        original_price: 15000,
        in_stock: 150,
        status: 'active',
        is_default: false,
        description: 'Hạt nêm Aji-ngon vị heo gói 170g, tiện lợi cho gia đình',
        images: [
          'https://cdn.tgdd.vn/Products/Images/2806/177826/bhx/hat-nem-aji-ngon-vi-heo-goi-170g-202407021018299777.jpg',
          'https://cdnv2.tgdd.vn/bhx-static/bhx/Products/Images/2806/177826/bhx/177826-slide-moi_202409271647007891.jpg'
        ]
      },
      {
        product_id: products[47]._id, // Hạt nêm Aji-ngon vị heo gói 900g
        name: 'Hạt nêm Aji-ngon vị heo gói 400g',
        sku: 'AJI-NGON-400G',
        unit: 'gói',
        quantity_per_unit: 1,
        price: 32500,
        original_price: 29000,
        in_stock: 100,
        status: 'active',
        is_default: false,
        description: 'Hạt nêm Aji-ngon vị heo gói 400g, tiết kiệm cho gia đình',
        images: [
          'https://cdn.tgdd.vn/Products/Images/2806/82259/bhx/hat-nem-vi-heo-aji-ngon-goi-400g-202303281033540192.jpg',
          'https://cdnv2.tgdd.vn/bhx-static/bhx/Products/Images/2806/82259/bhx/82259-slide-moi_202409300935251423.jpg',
          'https://cdnv2.tgdd.vn/bhx-static/bhx/Products/Images/2806/82259/bhx/82259-mat-sau_202409300935243227.jpg'
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
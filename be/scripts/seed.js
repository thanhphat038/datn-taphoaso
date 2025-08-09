import bcrypt from "bcrypt";
import { connectDB } from "../src/config/database.js";
import User from "../src/models/user.model.js";
import Category from "../src/models/category.model.js";
import Product from "../src/models/product.model.js";
import Voucher from "../src/models/voucher.model.js";
import Variant from "../src/models/variant.model.js";

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
    const adminPassword = await bcrypt.hash("admin123", 10);
    const admin = await User.create({
      username: "admin",
      password: adminPassword,
      email: "admin@taphoaso.com",
      full_name: "Admin",
      phone: "0123456789",
      role: "admin",
      status: "active",
    });

    // Create normal user
    const userPassword = await bcrypt.hash("user123", 10);
    const user = await User.create({
      username: "user",
      password: userPassword,
      email: "user@taphoaso.com",
      full_name: "Normal User",
      phone: "0987654321",
      role: "user",
      status: "active",
    });

    // Create categories
    const categories = await Category.create([
      {
        name: "Rau củ",
        description: "Các loại rau củ tươi ngon",
        status: "active",
      },
      {
        name: "Trái cây",
        description: "Các loại trái cây tươi ngon",
        status: "active",
      },
      {
        name: "Thịt cá",
        description: "Các loại thịt cá tươi ngon",
        status: "active",
      },
      {
        name: "Gia vị",
        description: "Các loại gia vị",
        status: "active",
      },
      {
        name: "Dầu ăn",
        description: "Các loại dầu ăn chất lượng",
        status: "active",
      },
      {
        name: "Nước mắm",
        description: "Các loại nước mắm truyền thống",
        status: "active",
      },
      {
        name: "Đường",
        description: "Các loại đường tự nhiên",
        status: "active",
      },
      {
        name: "Nước ngọt",
        description: "Các loại nước ngọt giải khát",
        status: "active",
      },
      {
        name: "Thịt heo",
        description: "Các loại thịt heo tươi ngon",
        status: "active",
      },
      {
        name: "Bia",
        description: "Các loại bia giải khát",
        status: "active",
      },
      {
        name: "Sữa",
        description: "Các loại sữa tươi và sữa đóng hộp",
        status: "active",
      },
      {
        name: "Gạo",
        description: "Các loại gạo chất lượng cao",
        status: "active",
      },
      {
        name: "Nước tương",
        description: "Các loại nước tương đậu nành",
        status: "active",
      },
      {
        name: "Hạt nêm, bột ngọt, bột canh",
        description: "Các loại hạt nêm, bột ngọt, bột canh",
        status: "active",
      },
      {
        name: "Mì",
        description: "Các loại mì, phở, bún khô",
        status: "active",
      },
      {
        name: "Kem",
        description: "Các loại kem tươi, kem que",
        status: "active",
      },
      {
        name: "Sữa chua",
        description: "Các loại sữa chua tự nhiên",
        status: "active",
      },
      {
        name: "Muối",
        description: "Các loại muối ăn, muối chấm",
        status: "active",
      },
      {
        name: "Các loại tương",
        description: "Tương ớt, tương cà, tương đen",
        status: "active",
      },
      {
        name: "Dầu hào, Giấm, Bơ",
        description: "Dầu hào, giấm ăn, bơ thực vật",
        status: "active",
      },
      {
        name: "Nước chấm",
        description: "Các loại nước chấm, xốt ăn kèm",
        status: "active",
      },
      {
        name: "Tiêu, sa tế",
        description: "Tiêu xay, sa tế tôm, sa tế cay",
        status: "active",
      },
      {
        name: "Sữa tươi",
        description: "Sữa tươi tiệt trùng các loại",
        status: "active",
      },
    ]);

    // Create products
    const products = await Product.create([
      {
        category_id: categories[0]._id,
        name: "Rau muống tươi",
        price: 5000,
        original_price: 4000,
        in_stock: 100,
        status: "active",
        description:
          "Rau muống tươi ngon, sạch, không thuốc trừ sâu. Rau muống giàu chất xơ, vitamin và khoáng chất tốt cho sức khỏe.",
        images: [
          "https://cdnv2.tgdd.vn/bhx-static/bhx/Products/Images/8820/335480/bhx/rau-muong-nuoc-400gr_202505081440524383.jpg",
          "https://cdnv2.tgdd.vn/bhx-static/bhx/Products/Images/8820/335480/bhx/rau-muong-nuoc-400gr_202505071517577794.jpg",
          "https://cdnv2.tgdd.vn/bhx-static/bhx/Products/Images/8820/335480/bhx/rau-muong-nuoc-400gr_202505091532251089.jpg",
          "https://cdnv2.tgdd.vn/bhx-static/bhx/Products/Images/8820/335480/bhx/rau-muong-nuoc-400gr_202503271012135926.jpg",
        ],
      },
      {
        category_id: categories[0]._id,
        name: "Rau cải xanh",
        price: 5000,
        original_price: 4000,
        in_stock: 80,
        status: "active",
        description:
          "Rau cải xanh tươi ngon, giàu vitamin C và chất chống oxy hóa. Rau cải giúp tăng cường miễn dịch và tốt cho tim mạch.",
        images: [
          "https://cdnv2.tgdd.vn/bhx-static/bhx/Products/Images/8820/309156/bhx/cai-be-xanh_202505081455284799.jpg",
          "https://cdn.tgdd.vn/Products/Images/8820/309156/bhx/cai-be-xanh-500g-202401121613149216.jpg",
          "https://cdn.tgdd.vn/Products/Images/8820/309156/bhx/cai-be-xanh-500g-202401121613156170.jpg",
          "https://cdn.tgdd.vn/Products/Images/8820/309156/bhx/cai-be-xanh-400gr-202408141351036981.jpg",
        ],
      },
      {
        category_id: categories[0]._id,
        name: "Rau mồng tơi 400gr",
        price: 5000,
        original_price: 4000,
        in_stock: 90,
        status: "active",
        description:
          "Rau mồng tơi tươi ngon, giàu chất xơ và vitamin. Rau mồng tơi giúp thanh nhiệt, giải độc và tốt cho hệ tiêu hóa.",
        images: [
          "https://cdnv2.tgdd.vn/bhx-static/bhx/Products/Images/8820/310775/bhx/rau-mong-toi-500-g_202505081431588846.jpg",
          "https://cdn.tgdd.vn/Products/Images/8820/310775/bhx/rau-mong-toi-500-g-202310201702541388.jpg",
          "https://cdn.tgdd.vn/Products/Images/8820/310775/bhx/rau-mong-toi-500g-202307170925491678.jpg",
          "https://cdn.tgdd.vn/Products/Images/8820/310775/bhx/rau-mong-toi-400gr-202408141544286699.jpg",
        ],
      },
      {
        category_id: categories[0]._id,
        name: "Hành lá 300g",
        price: 15000,
        original_price: 12000,
        in_stock: 70,
        status: "active",
        description:
          "Hành lá tươi ngon, thơm nồng. Hành lá giúp tăng hương vị món ăn và có tác dụng kháng khuẩn tự nhiên.",
        images: [
          "https://cdnv2.tgdd.vn/bhx-static/bhx/Products/Images/8820/232791/bhx/hanh-la-goi-50g_202505100847399340.jpg",
          "https://cdn.tgdd.vn/Products/Images/8820/232791/bhx/hanh-la-goi-50g-202012282236343442.jpg",
          "https://cdn.tgdd.vn/Products/Images/8820/232791/bhx/hanh-la-goi-50g-202012282236355259.jpg",
        ],
      },
      {
        category_id: categories[0]._id,
        name: "Xà lách ta 300g",
        price: 12000,
        original_price: 10000,
        in_stock: 60,
        status: "active",
        description:
          "Xà lách ta tươi giòn, giàu vitamin và khoáng chất. Xà lách giúp làm mát cơ thể và tốt cho hệ tiêu hóa.",
        images: [
          "https://cdnv2.tgdd.vn/bhx-static/bhx/Products/Images/8820/325723/bhx/xa-lach-ta-300g_202505240908090022.jpg",
          "https://cdnv2.tgdd.vn/bhx-static/bhx/Products/Images/8820/325723/bhx/xa-lach-ta-300g_202505240921170604.jpg",
          "https://cdnv2.tgdd.vn/bhx-static/bhx/Products/Images/8820/325723/bhx/xa-lach-ta-300g_202505240921167970.jpg",
        ],
      },

      // Dầu ăn
      {
        category_id: categories[4]._id,
        name: "Dầu thực vật Tường An Cooking Oil chai 1 lít",
        price: 59000,
        original_price: 57000,
        in_stock: 100,
        status: "active",
        description:
          "Dầu thực vật Tường An có công thức đặc biệt, kết hợp từ dầu đậu nành, dầu hạt cải và dầu olein. Dầu thực vật Tường An Cooking oil chai 1 lít ngoài công dụng nấu nướng, dầu ăn còn giúp bổ sung Omega 3, 6, 9 và vitamin A, E có lợi cho cơ thể.",
        images: [
          "https://cdn.tgdd.vn/Products/Images/2286/88739/bhx/dau-thuc-vat-tuong-an-cooking-oil-chai-1-lit-202105201322134036.jpg",
          "https://cdn.tgdd.vn/Products/Images/2286/88739/bhx/dau-thuc-vat-tuong-an-cooking-oil-chai-1-lit-202308081904021096.jpg",
          "https://cdn.tgdd.vn/Products/Images/2286/88739/bhx/dau-thuc-vat-tuong-an-cooking-oil-chai-1-lit-202105201322146485.jpg",
          "https://cdn.tgdd.vn/Products/Images/2286/88739/bhx/dau-thuc-vat-tuong-an-cooking-oil-chai-1-lit-202212031648567252.png",
          "https://cdn.tgdd.vn/Products/Images/2286/88739/bhx/dau-thuc-vat-tuong-an-cooking-oil-chai-1-lit-202105201322144043.jpg",
        ],
      },
      {
        category_id: categories[4]._id,
        name: "Dầu thực vật tinh luyện Cái Lân chai 1 lít",
        price: 46500,
        original_price: 44000,
        in_stock: 80,
        status: "active",
        description:
          "Dầu ăn Cái Lân là thương hiệu dầu ăn được ưa chuộng hàng đầu của người nội trợ Việt. Dầu thực vật tinh luyện Cái Lân chai 1 lít được làm từ dầu Olein cọ, dầu đậu nành tinh luyện,...giúp tăng hương vị cho các món ăn, đặc biệt là những món chiên giòn trở nên hấp dẫn, thơm ngon.",
        images: [
          "https://cdn.tgdd.vn/Products/Images/2286/76153/bhx/dau-thuc-vat-tinh-luyen-cai-lan-chai-1-lit-202209082036584963.png",
          "https://cdn.tgdd.vn/Products/Images/2286/76153/bhx/dau-thuc-vat-tinh-luyen-cai-lan-chai-1-lit-202209082037577263.jpg",
          "https://cdn.tgdd.vn/Products/Images/2286/76153/bhx/dau-thuc-vat-tinh-luyen-cai-lan-chai-1-lit-202209082037175335.jpg",
          "https://cdnv2.tgdd.vn/bhx-static/bhx/Products/Images/2286/76153/bhx/76153-slide_202409121314413879.jpg",
        ],
      },
      {
        category_id: categories[4]._id,
        name: "Dầu thực vật tinh luyện Bếp Hồng chai 1 lít",
        price: 45500,
        original_price: 40000,
        in_stock: 75,
        status: "active",
        description:
          "Dầu thực vật tinh luyện Bếp Hồng chai 1 lít không sử dụng chất bảo quản, bổ sung năng lượng và vitamin A, E tốt cho cơ thể. Dầu ăn Bếp Hồng là thương hiệu dầu ăn thông dụng, được rất nhiều người tiêu dùng ưa chuộng bởi chất lượng cùng giá thành tốt trên thị trường.",
        images: [
          "https://cdn.tgdd.vn/Products/Images/2286/323026/bhx/dau-thuc-vat-tinh-luyen-bep-hong-chai-1-lit-202404041526093241.jpg",
          "https://cdn.tgdd.vn/Products/Images/2286/323026/bhx/dau-thuc-vat-tinh-luyen-bep-hong-chai-1-lit-202404041526096419.jpg",
          "https://cdn.tgdd.vn/Products/Images/2286/323026/bhx/dau-thuc-vat-tinh-luyen-bep-hong-chai-1-lit-202404041526099653.jpg",
          "https://cdn.tgdd.vn/Products/Images/2286/323026/bhx/dau-thuc-vat-tinh-luyen-bep-hong-chai-1-lit-202404041526105256.jpg",
        ],
      },
      {
        category_id: categories[4]._id,
        name: "Dầu đậu nành tinh luyện Janbee chai 1 lít",
        price: 69500,
        original_price: 50000,
        in_stock: 60,
        status: "active",
        description:
          "Dầu đậu nành tinh luyện Janbee chai 1 lít có màu sáng trong và mùi thơm nhẹ, dầu ăn Janbee là dầu thực vật thích hợp để chế biến nhiều món ăn như chiên, xào, trộn salad và làm nước sốt, tăng thêm hương vị thơm ngon đậm đà cho món ăn.",
        images: [
          "https://cdn.tgdd.vn/Products/Images/2286/207833/bhx/dau-dau-nanh-tinh-luyen-janbee-chai-1-lit-202202181454147254.jpg",
          "https://cdn.tgdd.vn/Products/Images/2286/207833/bhx/dau-dau-nanh-tinh-luyen-janbee-chai-1-lit-202405271438244348.jpg",
          "https://cdn.tgdd.vn/Products/Images/2286/207833/bhx/dau-dau-nanh-tinh-luyen-janbee-chai-1-lit-202308070916295121.jpg",
          "https://cdn.tgdd.vn/Products/Images/2286/207833/bhx/dau-dau-nanh-tinh-luyen-janbee-chai-1-lit-202405271438246251.jpg",
        ],
      },
      {
        category_id: categories[4]._id,
        name: "Dầu gạo lứt nguyên chất Simply chai 1 lít",
        price: 69500,
        original_price: 50000,
        in_stock: 50,
        status: "active",
        description:
          "Sản phẩm sản xuất trên dây chuyền công nghệ hiện đại, chứa nhiều dưỡng chất quý giá, không chứa Cholesterol và chứa hàm lượng Omega3, Omega6, Omega9 cao giúp mang lại một trái tim khỏe. Dầu gạo chịu được nhiệt độ cao (240 độ C), giúp giảm nguy cơ cháy khét và mang đến hương vị thơm ngon cho món ăn.",
        images: [
          "https://cdn.tgdd.vn/Products/Images/2286/138691/bhx/dau-gao-lut-nguyen-chat-simply-chai-1-lit-202308081054380735.jpg",
          "https://cdnv2.tgdd.vn/bhx-static/bhx/Products/Images/2286/138691/bhx/138691-sdlie_202409121351169807.jpg",
          "https://cdn.tgdd.vn/Products/Images/2286/138691/bhx/dau-gao-lut-nguyen-chat-simply-chai-1-lit-202212031614405883.png",
          "https://cdn.tgdd.vn/Products/Images/2286/138691/bhx/dau-gao-nguyen-chat-simply-chai-1-lit-202106120415504774.jpg",
          "https://cdn.tgdd.vn/Products/Images/2286/138691/bhx/dau-gao-lut-nguyen-chat-simply-chai-1-lit-202212031615244352.png",
        ],
      },
      // Nước mắm
      {
        category_id: categories[5]._id,
        name: "Nước mắm cá cơm than Knorr 15 độ đạm chai 242ml",
        price: 15500,
        original_price: 7000,
        in_stock: 120,
        status: "active",
        description:
          "Nước mắm cá cơm than Knorr 15 độ đạm chai 242ml được làm từ 95% cá cơm than tươi, nước mắm Knorr có vị ngọt nguyên bản của cá cơm, đậm ngọt hài hòa, nước mắm Knorr với hương thơm dịu từ đạm cá tự nhiên, mang đến vị ngon đậm đà, hấp dẫn cho các món ăn hằng ngày.",
        images: [
          "https://cdn.tgdd.vn/Products/Images/2289/324685/bhx/nuoc-mam-ca-com-than-knorr-15-do-dam-chai-242ml-202405131017167788.jpg",
          "https://cdnv2.tgdd.vn/bhx-static/bhx/Products/Images/2289/324685/bhx/nuoc-mam-ca-com-than-knorr-15-do-dam-chai-242ml_202505271010544834.jpg",
          "https://cdnv2.tgdd.vn/bhx-static/bhx/Products/Images/2289/324685/bhx/nuoc-mam-ca-com-than-knorr-15-do-dam-chai-242ml_202505271010547514.jpg",
        ],
      },
      {
        category_id: categories[5]._id,
        name: "Nước chấm Nam Ngư Đệ Nhị chai 900ml",
        price: 25500,
        original_price: 15000,
        in_stock: 90,
        status: "active",
        description:
          "Nước mắm Nam Ngư là thương hiệu nước mắm rất nổi tiếng tại Việt Nam. Nước chấm Nam Ngư đệ nhị chai 900ml với thành phần cá cơm tươi ngon cùng với công thức pha chế đặc biệt, mang đến những bữa ăn trọn vẹn, đảm bảo an toàn cho gia đình.",
        images: [
          "https://cdn.tgdd.vn/Products/Images/2289/76428/bhx/nuoc-cham-nam-ngu-de-nhi-chai-900ml-202202161406558410.jpg",
          "https://cdn.tgdd.vn/Products/Images/2289/76428/bhx/nuoc-cham-nam-ngu-de-nhi-chai-900ml-201903151030027270.jpg",
          "https://cdn.tgdd.vn/Products/Images/2289/76428/bhx/nuoc-mam-nam-ngu-de-nhi-900ml-15-3-700x467.jpg",
          "https://cdn.tgdd.vn/Products/Images/2289/76428/bhx/nuoc-cham-nam-ngu-de-nhi-chai-900ml-201902141417257416.jpg",
          "https://cdn.tgdd.vn/Products/Images/2289/76428/bhx/nuoc-mam-nam-ngu-de-nhi-900ml-15-4-700x467.jpg",
        ],
      },
      {
        category_id: categories[5]._id,
        name: "Nước mắm Nam Ngư nhãn vàng 14 độ đạm chai 650ml",
        price: 50500,
        original_price: 43000,
        in_stock: 70,
        status: "active",
        description:
          "Nước mắm Nam Ngư đem đến cho người tiêu dùng những giọt nước mắm thơm ngon, là sự lựa chọn hàng đầu của người Việt. Nước mắm Nam Ngư nhãn vàng chai 650ml có hơn 15 loại axit amin cần thiết cho cơ thể, đậm đặc hơn, sánh quyện hơn, có hậu vị ngọt đặc trưng của cá, và màu vàng nâu mật ong.",
        images: [
          "https://cdn.tgdd.vn/Products/Images/2289/158062/bhx/nuoc-mam-nam-ngu-nhan-vang-14-do-dam-chai-650ml-202212051137096288.png",
          "https://cdn.tgdd.vn/Products/Images/2289/158062/bhx/nuoc-mam-nam-ngu-nhan-vang-14-do-dam-chai-650ml-202212051137093617.png",
          "https://cdn.tgdd.vn/Products/Images/2289/158062/bhx/nuoc-mam-nam-ngu-nhan-vang-chai-650ml-202110192034191035.jpeg",
          "https://cdn.tgdd.vn/Products/Images/2289/158062/bhx/nuoc-mam-nam-ngu-nhan-vang-14-do-dam-chai-650ml-202212051137087596.png",
        ],
      },
      {
        category_id: categories[5]._id,
        name: "Nước mắm hương cá hồi hảo hạng Chinsu 16 độ đạm chai 500ml",
        price: 50500,
        original_price: 40000,
        in_stock: 65,
        status: "active",
        description:
          "Là loại nước mắm hảo hạng với hương thơm cá hồi đặc trưng đậm đà, tròn vị, dậy mùi thơm, thích hợp chấm, ướp, nấu đều ngon đến từ thương hiệu nước mắm Chinsu. Nước mắm hương cá hồi hảo hạng Chinsu chai 500ml luôn được tin dùng bởi hàng triệu gia đình Việt.",
        images: [
          "https://cdn.tgdd.vn/Products/Images/2289/209456/bhx/nuoc-mam-huong-ca-hoi-hao-hang-chinsu-12-do-dam-chai-500ml-202309211050421242.jpg",
          "https://cdnv2.tgdd.vn/bhx-static/bhx/Products/Images/2289/209456/bhx/nuoc-mam-huong-ca-hoi-hao-hang-chinsu-chai-500ml_202507251054208135.jpg",
          "https://cdn.tgdd.vn/Products/Images/2289/209456/bhx/nuoc-mam-huong-ca-hoi-hao-hang-chinsu-12-do-dam-chai-500ml-202309211050423407.jpg",
          "https://cdn.tgdd.vn/Products/Images/2289/209456/bhx/nuoc-mam-huong-ca-hoi-hao-hang-chinsu-12-do-dam-chai-500ml-202309211050425195.jpg",
        ],
      },
      {
        category_id: categories[5]._id,
        name: "Nước mắm cao cấp Vị Xưa Barona 40 độ đạm chai 50ml",
        price: 30500,
        original_price: 10000,
        in_stock: 40,
        status: "active",
        description:
          "Nước mắm Barona tự hào với nguồn nước mắm được ủ bằng phương pháp thủ công, tạo nên từng giọt nước chấm sóng sánh, vị đậm đà của nước mắm xưa. Nước mắm Vị Xưa Barona 40 độ đạm chai 50ml sử dụng nguồn nguyên liệu nước mắm Phú Quốc, cam kết không chất bảo quản, không đường tổng hợp.",
        images: [
          "https://cdn.tgdd.vn/Products/Images/2289/91349/bhx/sellingpoint.jpg",
          "https://cdn.tgdd.vn/Products/Images/2289/91349/bhx/nuoc-mam-cao-cap-barona-vi-xua-40-do-dam-chai-50ml-201910241410185260.jpg",
          "https://cdn.tgdd.vn/Products/Images/2289/91349/bhx/nuoc-mam-cao-cap-barona-vi-xua-40-do-dam-chai-50ml-201910241410193105.jpg",
          "https://cdn.tgdd.vn/Products/Images/2289/91349/bhx/nuoc-mam-cao-cap-barona-vi-xua-40-do-dam-chai-50ml-201910241410195071.jpg",
        ],
      },
      // Đường
      {
        category_id: categories[6]._id,
        name: "Đường phèn hạt Hoàng Hải gói 500g",
        price: 30500,
        original_price: 10000,
        in_stock: 150,
        status: "active",
        description:
          "Đường phèn được sản xuất từ mía đường tự nhiên tinh khiết bằng công nghệ an toàn đến từ thương hiệu đường Hoàng Hải. Đường phèn hạt Hoàng Hải gói 500g có màu trắng tự nhiên, dạng bột dễ hoà tan, nên có thể dùng để pha chế, làm bánh,... giúp tiết kiệm thời gian.",
        images: [
          "https://cdn.tgdd.vn/Products/Images/2804/204364/bhx/duong-phen-hat-hoang-hai-goi-500g-201906251320195872.jpg",
          "https://cdn.tgdd.vn/Products/Images/2804/204364/bhx/duong-phen-hat-hoang-hai-goi-500g-201906251320194461.jpg",
          "https://cdn.tgdd.vn/Products/Images/2804/204364/bhx/duong-phen-hat-hoang-hai-goi-500g-202202160901187116.jpg",
        ],
      },
      {
        category_id: categories[6]._id,
        name: "Đường vàng Quảng Ngãi gói 1kg",
        price: 40500,
        original_price: 15000,
        in_stock: 100,
        status: "active",
        description:
          "Đường vàng Quảng Ngãi gói 1kg chiết xuất từ mật mía tự nhiên, an toàn cho sức khỏe, hoàn toàn không sử dụng chất tạo màu. Đường Quảng Ngãi làm từ nguồn nguyên liệu mía chất lượng, đường được đóng gói trên dây chuyền tự động, đảm bảo vệ sinh.",
        images: [
          "https://cdn.tgdd.vn/Products/Images/2804/321751/bhx/duong-vang-quang-ngai-goi-1kg-202401251130539737.jpg",
          "https://cdn.tgdd.vn/Products/Images/2804/321751/bhx/duong-vang-quang-ngai-goi-1kg-202403121131038324.jpg",
          "https://cdn.tgdd.vn/Products/Images/2804/321751/bhx/duong-vang-quang-ngai-goi-1kg-202403121131041775.jpg",
          "https://cdn.tgdd.vn/Products/Images/2804/321751/bhx/duong-vang-quang-ngai-goi-1kg-202403121131046591.jpg",
          "https://cdn.tgdd.vn/Products/Images/2804/321751/bhx/duong-vang-quang-ngai-goi-1kg-202403121131046591.jpg",
        ],
      },
      {
        category_id: categories[6]._id,
        name: "Đường thốt nốt dạng viên Moun7ains gói 500g",
        price: 35500,
        original_price: 10000,
        in_stock: 80,
        status: "active",
        description:
          "Đường thốt nốt không chỉ thay thế cho các chất tạo ngọt khác trong các bữa ăn mà còn mang đến nhiều lợi ích về sức khỏe đến từ đường Moun7ains. Đường thốt nốt dạng viên Moun7ains gói 500g mang đến hương vị đặc trưng, thơm ngon, khó cưỡng cho mọi món ăn của bạn.",
        images: [
          "https://cdn.tgdd.vn/Products/Images/2804/207731/bhx/duong-thot-not-dang-vien-7-moutains-goi-500g-201907241728193833.jpg",
          "https://cdn.tgdd.vn/Products/Images/2804/207731/bhx/duong-thot-not-dang-vien-7-moutains-goi-500g-201907241728195103.jpg",
          "https://cdn.tgdd.vn/Products/Images/2804/207731/bhx/duong-thot-not-dang-vien-7-moutains-goi-500g-201907241728196933.jpg",
          "https://cdn.tgdd.vn/Products/Images/2804/207731/bhx/duong-thot-not-dang-vien-7-moutains-goi-500g-201907241728262073.jpg",
        ],
      },
      {
        category_id: categories[6]._id,
        name: "Đường mía thiên nhiên Biên Hòa gói 1kg",
        price: 35500,
        original_price: 10000,
        in_stock: 90,
        status: "active",
        description:
          "Đường mía thiên nhiên Biên Hoà 1kg được làm từ 100% mật mía đường tinh khiết, tự nhiên, mang lại vị ngọt dễ chịu, giúp món ăn có màu sắc và hương vị hấp dẫn hơn. Đường Biên Hòa sản xuất bằng phương pháp kết tinh hiện đại, không chất tạo màu, an toàn sử dụng.",
        images: [
          "https://cdnv2.tgdd.vn/bhx-static/bhx/Products/Images/2804/193562/bhx/duong-vang-thien-nhien-bien-hoa-goi-1kg_202506041047178929.jpg",
          "https://cdn.tgdd.vn/Products/Images/2804/193562/bhx/duong-vang-thien-nhien-bien-hoa-gold-goi-1kg-202104230135249977.jpeg",
          "https://cdn.tgdd.vn/Products/Images/2804/193562/bhx/duong-vang-thien-nhien-bien-hoa-gold-goi-1kg-202104230135254630.jpeg",
          "https://cdn.tgdd.vn/Products/Images/2804/193562/bhx/duong-vang-thien-nhien-bien-hoa-gold-goi-1kg-202104230135260971.jpeg",
        ],
      },
      {
        category_id: categories[6]._id,
        name: "Đường phèn Hoàng Long gói 500g",
        price: 27500,
        original_price: 17000,
        in_stock: 120,
        status: "active",
        description:
          "Đường phèn được sản xuất từ mía đường tự nhiên tinh khiết bằng công nghệ hiện đại đến từ thương hiệu đường Hoàng Long. Đường phèn hạt to Hoàng Long gói 500g có màu trắng tự nhiên nên có thể dùng để nấu chè, pha chế các loại thức uống giải nhiệt,...",
        images: [
          "https://cdn.tgdd.vn/Products/Images/2804/77187/bhx/duong-phen-hat-to-hoang-long-goi-500g-201912121527430211.jpg",
          "https://cdn.tgdd.vn/Products/Images/2804/77187/bhx/duong-phen-hat-to-hoang-long-goi-500g-201912121527433674.jpg",
          "https://cdn.tgdd.vn/Products/Images/2804/77187/bhx/duong-phen-hat-to-hoang-long-goi-500g-201912121527436425.jpg",
          "https://cdn.tgdd.vn/Products/Images/2804/77187/bhx/duong-phen-hat-to-hoang-long-goi-500g-201912121527439507.jpg",
          "https://cdn.tgdd.vn/Products/Images/2804/77187/bhx/duong-phen-tui-05kg-hl-4-700x467.jpg",
        ],
      },
      // Thêm 50 sản phẩm mới
      // Rau củ thêm

      {
        category_id: categories[3]._id,
        name: "Sả tươi 200gr",
        price: 10000,
        original_price: 8000,
        in_stock: 90,
        status: "active",
        description:
          "Sả tươi thơm nồng, có tác dụng kháng khuẩn. Sả giúp tăng hương vị món ăn và tốt cho tiêu hóa.",
        images: [
          "https://cdnv2.tgdd.vn/bhx-static/bhx/Products/Images/8785/292740/bhx/cdntgddvnproductsimages8785292740bhxsa-cay-goi-200g-202210031601138393_202409041611032864.jpg",
        ],
      },
      // Dầu ăn thêm
      {
        category_id: categories[4]._id,
        name: "Dầu olive Extra Virgin Olivoilà chai 250ml",
        price: 120000,
        original_price: 100000,
        in_stock: 40,
        status: "active",
        description:
          "Dầu oliu nguyên chất cao cấp, giàu chất chống oxy hóa. Dầu oliu tốt cho tim mạch và làm đẹp da.",
        images: [
          "https://cdnv2.tgdd.vn/bhx-static/bhx/Products/Images/2286/79397/bhx/79397-sldie_202409121337056916.jpg",
          "https://cdn.tgdd.vn/Products/Images/2286/79397/bhx/dau-olive-extra-virgin-olivoila-chai-250ml-202407130903572803.jpg",
          "https://cdn.tgdd.vn/Products/Images/2286/79397/bhx/dau-olive-extra-virgin-olivoila-chai-250ml-202407130903574162.jpg",
          "https://cdn.tgdd.vn/Products/Images/2286/79397/bhx/dau-olive-extra-virgin-olivoila-chai-250ml-202407130903575666.jpg",
          "https://cdn.tgdd.vn/Products/Images/2286/79397/bhx/dau-olive-extra-virgin-olivoila-chai-250ml-202407130903577053.jpg",
        ],
      },
      {
        category_id: categories[4]._id,
        name: "Dầu mè thơm Tường An chai 100ml",
        price: 38000,
        original_price: 35000,
        in_stock: 35,
        status: "active",
        description: "Dầu mè thơm Tường An chai 100ml",
        images: [
          "https://cdn.tgdd.vn/Products/Images/2286/228302/bhx/dau-me-thom-tuong-an-chai-100ml-202407121521338294.png",
          "https://cdn.tgdd.vn/Products/Images/2286/228302/bhx/dau-me-thom-tuong-an-chai-100ml-202407121521340192.png",
          "https://cdnv2.tgdd.vn/bhx-static/bhx/Products/Images/2286/228302/bhx/228302-tem_202409121542387249.jpg",
          "https://cdn.tgdd.vn/Products/Images/2286/228302/bhx/dau-me-thom-tuong-an-chai-100ml-202407121521344497.jpg",
          "https://cdn.tgdd.vn/Products/Images/2286/228302/bhx/dau-me-thom-tuong-an-chai-100ml-202407121521347116.jpg",
        ],
      },

      // Nước mắm thêm

      // Sản phẩm đa dạng thêm

      // Bia sản phẩm
      {
        category_id: categories[9]._id, // Bia
        name: "Thùng 24 lon bia Sài Gòn Lager 330ml",
        price: 180000,
        original_price: 160000,
        in_stock: 50,
        status: "active",
        description:
          "Bia Sài Gòn Lager thùng 24 lon 330ml, hương vị đậm đà, tươi mát. Bia truyền thống Việt Nam với hương vị độc đáo.",
        images: [
          "https://cdn.tgdd.vn/Products/Images/2282/158349/bhx/thung-24-lon-bia-sai-gon-lager-330ml-202110111038141085.jpg",
          "https://cdn.tgdd.vn/Products/Images/2282/158349/bhx/thung-24-lon-bia-sai-gon-lager-330ml-202110111038144356.jpg",
          "https://cdn.tgdd.vn/Products/Images/2282/158349/bhx/thung-24-lon-bia-sai-gon-lager-330ml-202110111038148147.jpg",
          "https://cdn.tgdd.vn/Products/Images/2282/158349/bhx/thung-24-lon-bia-sai-gon-lager-330ml-202110111038154351.jpg",
        ],
      },
      {
        category_id: categories[9]._id, // Bia
        name: "Thùng 24 lon bia Sài Gòn Chill 330ml",
        price: 190000,
        original_price: 170000,
        in_stock: 45,
        status: "active",
        description:
          "Bia Sài Gòn Chill thùng 24 lon 330ml, hương vị mới lạ, tươi mát. Bia với hương vị độc đáo, phù hợp cho mọi dịp.",
        images: [
          "https://cdn.tgdd.vn/Products/Images/2282/245542/bhx/thung-24-lon-bia-sai-gon-chill-330ml-202110211035111771.jpg",
          "https://cdn.tgdd.vn/Products/Images/2282/245542/bhx/thung-24-lon-bia-sai-gon-chill-330ml-202202191519360768.jpg",
          "https://cdn.tgdd.vn/Products/Images/2282/245542/bhx/thung-24-lon-bia-sai-gon-chill-330ml-202201211123355563.jpg",
          "https://cdn.tgdd.vn/Products/Images/2282/245542/bhx/thung-24-lon-bia-sai-gon-chill-330ml-202201211123359568.jpg",
        ],
      },
      {
        category_id: categories[9]._id, // Bia
        name: "Thùng 24 lon bia Tiger Bạc 250ml",
        price: 8500,
        original_price: 7500,
        in_stock: 200,
        status: "active",
        description:
          "Thùng 24 lon bia Tiger Bạc 250ml, hương vị truyền thống, tươi mát. Bia Việt Nam với hương vị đặc trưng, độ cồn 4.5%, phù hợp cho các buổi tiệc và tụ tập bạn bè.",
        images: [
          "https://cdnv2.tgdd.vn/bhx-static/bhx/Products/Images/2282/328902/bhx/412208-4-1_202501040903412829.jpg",
          "https://cdnv2.tgdd.vn/bhx-static/bhx/Products/Images/2282/328902/bhx/httpscdnv2tgddvnbhx-staticbhxproductsimages2282328902bhxlon-250ml202412031319189029_202412041001229346.jpg",
        ],
      },
      {
        category_id: categories[9]._id, // Bia
        name: "Thùng 24 lon bia Tiger lon cao 330ml",
        price: 220000,
        original_price: 200000,
        in_stock: 40,
        status: "active",
        description:
          "Bia Tiger thùng 24 lon cao 330ml, hương vị quốc tế, tươi mát. Bia cao cấp với hương vị đặc trưng.",
        images: [
          "https://cdnv2.tgdd.vn/bhx-static/bhx/Products/Images/2282/316846/bhx/412208-2_202501031430339626.jpg",
          "https://cdnv2.tgdd.vn/bhx-static/bhx/Products/Images/2282/316846/bhx/httpscdnv2tgddvnbhx-staticbhxproductsimages2282316846bhxlon-330ml-1202412031318226970_202412040935166288.jpg",
          "https://cdnv2.tgdd.vn/bhx-static/bhx/Products/Images/2282/316846/bhx/412208-1_202501031430336921.jpg",
        ],
      },
      {
        category_id: categories[9]._id, // Bia
        name: "Thùng 24 lon bia Heineken Silver 330ml",
        price: 280000,
        original_price: 250000,
        in_stock: 35,
        status: "active",
        description:
          "Bia Heineken Silver thùng 24 lon 330ml, hương vị quốc tế, tươi mát. Bia cao cấp với hương vị đặc trưng.",
        images: [
          "https://cdn.tgdd.vn/Products/Images/2282/200639/bhx/thung-24-lon-bia-heineken-silver-330ml-202205111635132939.jpg",
          "https://cdn.tgdd.vn/Products/Images/2282/200639/bhx/thung-24-lon-bia-heineken-silver-330ml-201903281046300671.jpg",
          "https://cdn.tgdd.vn/Products/Images/2282/200639/bhx/thung-24-lon-bia-heineken-silver-330ml-201903281046301735.jpg",
          "https://cdn.tgdd.vn/Products/Images/2282/200639/bhx/thung-24-lon-bia-heineken-silver-330ml-201910091038476393.jpg",
          "https://cdn.tgdd.vn/Products/Images/2282/200639/bhx/thung-24-lon-bia-heineken-silver-330ml-201903281046302976.JPG",
        ],
      },
      // Bia sản phẩm mới
      {
        category_id: categories[9]._id, // Bia
        name: "Thùng 20 lon bia Budweiser 330ml",
        price: 305000,
        original_price: 280000,
        in_stock: 50,
        status: "active",
        description:
          "Thùng 20 lon bia Budweiser 330ml, hương vị quốc tế, tươi mát. Bia Budweiser với hương vị đặc trưng, độ cồn 5%, phù hợp cho các buổi tiệc và tụ tập bạn bè.",
        images: [
          "https://cdnv2.tgdd.vn/bhx-static/bhx/Products/Images/2282/214410/bhx/412208_202412280909557313.jpg",
          "https://cdnv2.tgdd.vn/bhx-static/bhx/Products/Images/2282/214410/bhx/1469307049_202412280909559840.jpg",
          "https://cdn.tgdd.vn/Products/Images/2282/214410/bhx/thung-20-lon-bia-budweiser-330ml-202110111017513686.jpg",
          "https://cdn.tgdd.vn/Products/Images/2282/214410/bhx/thung-20-lon-bia-budweiser-330ml-202110111017518284.jpg",
          "https://cdn.tgdd.vn/Products/Images/2282/214410/bhx/thung-20-lon-bia-budweiser-330ml-202110111017525644.jpg",
        ],
      },
      {
        category_id: categories[9]._id, // Bia
        name: "Thùng 12 lon bia Hoegaarden Peach vị đào 500ml",
        price: 445000,
        original_price: 420000,
        in_stock: 40,
        status: "active",
        description:
          "Thùng 12 lon bia Hoegaarden Peach vị đào 500ml, hương vị độc đáo, tươi mát. Bia Hoegaarden với hương vị đào tự nhiên, độ cồn 3.3%, phù hợp cho các buổi tiệc và tụ tập bạn bè.",
        images: [
          "https://cdn.tgdd.vn/Products/Images/2282/303826/bhx/thung-12-lon-bia-hoegaarden-peach-vi-dao-500ml-202303151341125768.jpg",
          "https://cdn.tgdd.vn/Products/Images/2282/303826/bhx/thung-12-lon-bia-hoegaarden-peach-vi-dao-500ml-202303151341136282.jpg",
          "https://cdn.tgdd.vn/Products/Images/2282/303826/bhx/thung-12-lon-bia-hoegaarden-peach-vi-dao-500ml-202303151341138457.jpg",
          "https://cdn.tgdd.vn/Products/Images/2282/303826/bhx/thung-12-lon-bia-hoegaarden-peach-vi-dao-500ml-202303151341141186.jpg",
          "https://cdn.tgdd.vn/Products/Images/2282/303826/bhx/thung-12-lon-bia-hoegaarden-peach-vi-dao-500ml-202303151341143231.jpg",
        ],
      },
      {
        category_id: categories[9]._id, // Bia
        name: "Thùng 24 lon bia Huda 330ml",
        price: 282000,
        original_price: 260000,
        in_stock: 60,
        status: "active",
        description:
          "Thùng 24 lon bia Huda 330ml, hương vị truyền thống, tươi mát. Bia Huda với hương vị đặc trưng, độ cồn 4.5%, phù hợp cho các buổi tiệc và tụ tập bạn bè.",
        images: [
          "https://cdn.tgdd.vn/Products/Images/2282/113154/bhx/thung-24-lon-bia-huda-330ml-202309191319343524.jpg",
          "https://cdn.tgdd.vn/Products/Images/2282/113154/bhx/thung-24-lon-bia-huda-330ml-202309191319361732.jpg",
          "https://cdn.tgdd.vn/Products/Images/2282/113154/bhx/thung-24-lon-bia-huda-330ml-202309191319371329.jpg",
          "https://cdn.tgdd.vn/Products/Images/2282/113154/bhx/thung-24-lon-bia-huda-330ml-202309191320130719.jpg",
          "https://cdn.tgdd.vn/Products/Images/2282/113154/bhx/thung-24-lon-bia-huda-330ml-202309191320171492.jpg",
        ],
      },
      {
        category_id: categories[9]._id, // Bia
        name: "Thùng 24 lon Bia Red Ruby 330ml",
        price: 235000,
        original_price: 220000,
        in_stock: 55,
        status: "active",
        description:
          "Thùng 24 lon Bia Red Ruby 330ml, hương vị độc đáo, tươi mát. Bia Red Ruby với hương vị đặc trưng, độ cồn 4.5%, phù hợp cho các buổi tiệc và tụ tập bạn bè.",
        images: [
          "https://cdnv2.tgdd.vn/bhx-static/bhx/Products/Images/2282/266318/bhx/cdntgddvnproductsimages2282266318bhx-202212201621493739_202409241313367514.jpg",
          "https://cdnv2.tgdd.vn/bhx-static/bhx/Products/Images/2282/266318/bhx/cdntgddvnproductsimages2282266318bhx-202212201621497176_202409241313369621.jpg",
          "https://cdnv2.tgdd.vn/bhx-static/bhx/Products/Images/2282/266318/bhx/cdntgddvnproductsimages2282266318bhx-202212201621500800_202409241313372014.jpg",
          "https://cdnv2.tgdd.vn/bhx-static/bhx/Products/Images/2282/266318/bhx/cdntgddvnproductsimages2282266318bhx-202212201621503334_202409241313374733.jpg",
          "https://cdnv2.tgdd.vn/bhx-static/bhx/Products/Images/2282/266318/bhx/cdntgddvnproductsimages2282266318bhx-202212201621506467_202409241313377942.jpg",
        ],
      },
      {
        category_id: categories[9]._id, // Bia
        name: "Thùng 24 lon bia Blanc 1664 330ml",
        price: 410000,
        original_price: 390000,
        in_stock: 45,
        status: "active",
        description:
          "Thùng 24 lon bia Blanc 1664 330ml, hương vị quốc tế, tươi mát. Bia Blanc 1664 với hương vị đặc trưng, độ cồn 5%, phù hợp cho các buổi tiệc và tụ tập bạn bè.",
        images: [
          "https://cdn.tgdd.vn/Products/Images/2282/252737/bhx/thung-24-lon-bia-blanc-1664-330ml-202407061001226425.jpg",
          "https://cdn.tgdd.vn/Products/Images/2282/252737/bhx/thung-24-lon-bia-blanc-1664-330ml-202407061001228689.jpg",
          "https://cdn.tgdd.vn/Products/Images/2282/252737/bhx/thung-24-lon-bia-blanc-1664-330ml-202407061001230422.jpg",
          "https://cdn.tgdd.vn/Products/Images/2282/252737/bhx/thung-24-lon-bia-blanc-1664-330ml-202407061001232261.jpg",
        ],
      },
      {
        category_id: categories[9]._id, // Bia
        name: "Thùng 12 lon bia Sapporo 500ml",
        price: 361000,
        original_price: 340000,
        in_stock: 35,
        status: "active",
        description:
          "Thùng 12 lon bia Sapporo 500ml, hương vị quốc tế, tươi mát. Bia Sapporo với hương vị đặc trưng, độ cồn 5%, phù hợp cho các buổi tiệc và tụ tập bạn bè.",
        images: [
          "https://cdnv2.tgdd.vn/bhx-static/bhx/Products/Images/2282/242597/bhx/slide-5_202411131021360341.jpg",
          "https://cdnv2.tgdd.vn/bhx-static/bhx/Products/Images/2282/242597/bhx/slide-6_202411131021365501.jpg",
          "https://cdnv2.tgdd.vn/bhx-static/bhx/Products/Images/2282/242597/bhx/slide-1-copy_202411131021371684.jpg",
          "https://cdnv2.tgdd.vn/bhx-static/bhx/Products/Images/2282/242597/bhx/slide-3_202411131021377540.jpg",
        ],
      },
      {
        category_id: categories[9]._id, // Bia
        name: "Thùng 24 lon bia Heineken Silver 330ml",
        price: 455000,
        original_price: 430000,
        in_stock: 40,
        status: "active",
        description:
          "Thùng 24 lon bia Heineken Silver 330ml, hương vị quốc tế, tươi mát. Bia Heineken Silver với hương vị đặc trưng, độ cồn 4.5%, phù hợp cho các buổi tiệc và tụ tập bạn bè.",
        images: [
          "https://cdn.tgdd.vn/Products/Images/2282/200639/bhx/thung-24-lon-bia-heineken-silver-330ml-202205111635132939.jpg",
          "https://cdn.tgdd.vn/Products/Images/2282/200639/bhx/thung-24-lon-bia-heineken-silver-330ml-201903281046300671.jpg",
          "https://cdn.tgdd.vn/Products/Images/2282/200639/bhx/thung-24-lon-bia-heineken-silver-330ml-201903281046301735.jpg",
          "https://cdn.tgdd.vn/Products/Images/2282/200639/bhx/thung-24-lon-bia-heineken-silver-330ml-201905221020252011.jpg",
          "https://cdn.tgdd.vn/Products/Images/2282/200639/bhx/thung-24-lon-bia-heineken-silver-330ml-201903281046302976.JPG",
        ],
      },
      {
        category_id: categories[9]._id, // Bia
        name: "Thùng 24 lon bia Heineken Sleek 330ml",
        price: 450000,
        original_price: 425000,
        in_stock: 38,
        status: "active",
        description:
          "Thùng 24 lon bia Heineken Sleek 330ml, hương vị quốc tế, tươi mát. Bia Heineken Sleek với hương vị đặc trưng, độ cồn 4.5%, phù hợp cho các buổi tiệc và tụ tập bạn bè.",
        images: [
          "https://cdnv2.tgdd.vn/bhx-static/bhx/Products/Images/2282/148787/bhx/412208-4-1_202501031416246058.jpg",
          "https://cdn.tgdd.vn/Products/Images/2282/148787/bhx/thung-24-lon-bia-heineken-sleek-330ml-202003250707536087.JPG",
          "https://cdn.tgdd.vn/Products/Images/2282/148787/bhx/thung-24-lon-bia-heineken-sleek-330ml-202003250707540167.JPG",
          "https://cdn.tgdd.vn/Products/Images/2282/148787/bhx/thung-24-lon-bia-heineken-sleek-330ml-202003250707547837.JPG",
          "https://cdn.tgdd.vn/Products/Images/2282/148787/bhx/thung-24-lon-cao-bia-heineken-330ml-201905101414341729.JPG",
        ],
      },
      {
        category_id: categories[9]._id, // Bia
        name: "Thùng 24 lon bia Bia Việt 330ml",
        price: 255000,
        original_price: 240000,
        in_stock: 65,
        status: "active",
        description:
          "Thùng 24 lon bia Bia Việt 330ml, hương vị truyền thống, tươi mát. Bia Việt với hương vị đặc trưng, độ cồn 4.5%, phù hợp cho các buổi tiệc và tụ tập bạn bè.",
        images: [
          "https://cdnv2.tgdd.vn/bhx-static/bhx/Products/Images/2282/229518/bhx/frame-3475095_202412071251499712.jpg",
          "https://cdn.tgdd.vn/Products/Images/2282/229518/bhx/cdntgddvnproductsimages2282229507bhx6-lon-bia-viet-330ml-202407101630590785_202501211344380800.jpg",
          "https://cdn.tgdd.vn/Products/Images/2282/229518/bhx/cdntgddvnproductsimages2282229507bhx6-lon-bia-viet-330ml-202407101630594914_202501211344383181.jpg",
          "https://cdn.tgdd.vn/Products/Images/2282/229518/bhx/cdntgddvnproductsimages2282229507bhx6-lon-bia-viet-330ml-202407101630598443_202501211344385250.jpg",
          "https://cdn.tgdd.vn/Products/Images/2282/229518/bhx/cdntgddvnproductsimages2282229507bhx6-lon-bia-viet-330ml-202407101631002513_202501211344388826.jpg",
        ],
      },
      {
        category_id: categories[9]._id, // Bia
        name: "Thùng 24 lon Strongbow Kiwi và thanh long lon 320ml",
        price: 489000,
        original_price: 460000,
        in_stock: 30,
        status: "active",
        description:
          "Thùng 24 lon Strongbow Kiwi và thanh long lon 320ml, hương vị độc đáo, tươi mát. Strongbow với hương vị kiwi và thanh long tự nhiên, độ cồn 4.5%, phù hợp cho các buổi tiệc và tụ tập bạn bè.",
        images: [
          "https://cdn.tgdd.vn/Products/Images/2282/327837/bhx/loc-6-lon-strongbow-kiwi-va-thanh-long-lon-320ml-clone-202407101338018343.jpg",
          "https://cdn.tgdd.vn/Products/Images/2282/327837/bhx/thung-24-lon-strongbow-kiwi-va-thanh-long-lon-320ml-202407101357393680.jpg",
        ],
      },
      // Sữa sản phẩm
      {
        category_id: categories[10]._id, // Sữa
        name: "Thùng 48 hộp sữa tươi tiệt trùng ít đường TH True Milk 180ml",
        price: 180000,
        original_price: 160000,
        in_stock: 60,
        status: "active",
        description:
          "Sữa tươi tiệt trùng TH True Milk thùng 48 hộp 180ml, ít đường, giàu dinh dưỡng. Sữa tươi tự nhiên, an toàn cho sức khỏe.",
        images: [
          "https://cdn.tgdd.vn/Products/Images/2386/85853/bhx/thung-48-hop-sua-tuoi-tiet-trung-it-duong-th-true-milk-180ml-202104081706329168.jpg",
          "https://cdn.tgdd.vn/Products/Images/2386/85853/bhx/thung-48-hop-sua-tuoi-tiet-trung-it-duong-th-true-milk-180ml-202207151050154094.jpg",
          "https://cdn.tgdd.vn/Products/Images/2386/85853/bhx/thung-48-hop-sua-tuoi-tiet-trung-it-duong-th-true-milk-180ml-202207151050159958.jpg",
          "https://cdn.tgdd.vn/Products/Images/2386/85853/bhx/thung-sua-tuoi-tiet-trung-th-true-milk-it-duong-180ml-48-hop-201811262347284349.jpg",
          "https://cdn.tgdd.vn/Products/Images/2386/85853/bhx/thung-sua-tuoi-tiet-trung-th-true-milk-it-duong-180ml-48-hop-201811262347301480.jpg",
          "https://cdn.tgdd.vn/Products/Images/2386/85853/bhx/thung-sua-tuoi-tiet-trung-th-true-milk-it-duong-180ml-48-hop-201811262347319031.jpg",
        ],
      },
      {
        category_id: categories[10]._id, // Sữa
        name: "Thùng 48 hộp sữa tươi tiệt trùng ít đường Vinamilk 100% sữa tươi 180ml",
        price: 170000,
        original_price: 150000,
        in_stock: 65,
        status: "active",
        description:
          "Sữa tươi tiệt trùng Vinamilk 100% thùng 48 hộp 180ml, ít đường, giàu dinh dưỡng. Sữa tươi tự nhiên, an toàn cho sức khỏe.",
        images: [
          "https://cdn.tgdd.vn/Products/Images/2386/85530/bhx/thung-48-hop-sua-tuoi-tiet-trung-it-duong-vinamilk-100-sua-tuoi-180ml-202310071419459272.jpg",
          "https://cdn.tgdd.vn/Products/Images/2386/85530/bhx/thung-48-hop-sua-tuoi-tiet-trung-it-duong-vinamilk-100-sua-tuoi-180ml-202310071419462141.jpg",
          "https://cdn.tgdd.vn/Products/Images/2386/85530/bhx/thung-48-hop-sua-tuoi-tiet-trung-it-duong-vinamilk-100-sua-tuoi-180ml-202310071419465238.jpg",
          "https://cdn.tgdd.vn/Products/Images/2386/85530/bhx/thung-48-hop-sua-tuoi-tiet-trung-it-duong-vinamilk-100-sua-tuoi-180ml-202310071419467951.jpg",
          "https://cdn.tgdd.vn/Products/Images/2386/85530/bhx/thung-48-hop-sua-tuoi-tiet-trung-it-duong-vinamilk-100-sua-tuoi-180ml-202310071419472266.jpg",
        ],
      },
      {
        category_id: categories[10]._id, // Sữa
        name: "Thùng 12 hộp sữa tươi tiệt trùng không đường Vinamilk 100% sữa tươi 1 lít",
        price: 120000,
        original_price: 100000,
        in_stock: 40,
        status: "active",
        description:
          "Sữa tươi tiệt trùng Vinamilk 100% thùng 12 hộp 1 lít, không đường, giàu dinh dưỡng. Sữa tươi tự nhiên, an toàn cho sức khỏe.",
        images: [
          "https://cdn.tgdd.vn/Products/Images/2386/88762/bhx/thung-12-hop-sua-tuoi-tiet-trung-khong-duong-vinamilk-sua-tuoi-100-1-lit-202404021058296104.jpg",
          "https://cdn.tgdd.vn/Products/Images/2386/88762/bhx/thung-12-hop-sua-tuoi-tiet-trung-khong-duong-vinamilk-sua-tuoi-100-1-lit-202404021058276647.jpg",
          "https://cdn.tgdd.vn/Products/Images/2386/88762/bhx/thung-12-hop-sua-tuoi-tiet-trung-khong-duong-vinamilk-sua-tuoi-100-1-lit-202404021058279023.jpg",
          "https://cdn.tgdd.vn/Products/Images/2386/88762/bhx/thung-12-hop-sua-tuoi-tiet-trung-khong-duong-vinamilk-sua-tuoi-100-1-lit-202404021058281593.jpg",
          "https://cdn.tgdd.vn/Products/Images/2386/88762/bhx/thung-12-hop-sua-tuoi-tiet-trung-khong-duong-vinamilk-sua-tuoi-100-1-lit-202404021058283574.jpg",
        ],
      },
      {
        category_id: categories[10]._id, // Sữa
        name: "Thùng 48 hộp sữa lúa mạch ít đường Milo A2 180ml",
        price: 200000,
        original_price: 180000,
        in_stock: 50,
        status: "active",
        description:
          "Sữa lúa mạch Milo A2 thùng 48 hộp 180ml, ít đường, giàu dinh dưỡng. Sữa với hương vị lúa mạch độc đáo.",
        images: [
          "https://cdnv2.tgdd.vn/bhx-static/bhx/Products/Images/2945/336178/bhx/thung-48-hop-sua-lua-mach-it-duong-milo-a2-180ml_202504101039251295.jpg",
          "https://cdnv2.tgdd.vn/bhx-static/bhx/Products/Images/2945/336178/bhx/thung-48-hop-sua-lua-mach-it-duong-milo-a2-180ml_202504101108334742.jpg",
          "https://cdnv2.tgdd.vn/bhx-static/bhx/Products/Images/2945/336178/bhx/thung-48-hop-sua-lua-mach-it-duong-milo-a2-180ml_202504110913175937.jpg",
          "https://cdnv2.tgdd.vn/bhx-static/bhx/Products/Images/2945/336178/bhx/thung-48-hop-sua-lua-mach-it-duong-milo-a2-180ml_202504101108372522.jpg",
          "https://cdnv2.tgdd.vn/bhx-static/bhx/Products/Images/2945/336178/bhx/thung-48-hop-sua-lua-mach-it-duong-milo-a2-180ml_202504110913179972.jpg",
        ],
      },
      {
        category_id: categories[10]._id, // Sữa
        name: "Thùng 48 hộp sữa socola lúa mạch Lof Kun có thạch 170ml",
        price: 220000,
        original_price: 200000,
        in_stock: 45,
        status: "active",
        description:
          "Sữa socola lúa mạch Lof Kun có thạch thùng 48 hộp 170ml, hương vị độc đáo. Sữa với hương vị socola và thạch ngon.",
        images: [
          "https://cdnv2.tgdd.vn/bhx-static/bhx/Products/Images/2945/327987/bhx/327987-slide-1_202501211456144244.jpg",
          "https://cdn.tgdd.vn/Products/Images/2945/327987/bhx/thung-48-hop-sua-socola-lua-mach-lif-kun-co-thach-170ml-202407161605449380.jpg",
          "https://cdn.tgdd.vn/Products/Images/2945/327987/bhx/thung-48-hop-sua-socola-lua-mach-lif-kun-co-thach-170ml-202407161605455121.jpg",
          "https://cdnv2.tgdd.vn/bhx-static/bhx/Products/Images/2945/327987/bhx/327987-slide-2_202501211456292887.jpg",
          "https://cdnv2.tgdd.vn/bhx-static/bhx/Products/Images/2945/327987/bhx/bs9a8874_202412231017247836.jpg",
          "https://cdnv2.tgdd.vn/bhx-static/bhx/Products/Images/2945/327987/bhx/bs9a8872_202412231017252705.jpg",
        ],
      },
      // Gạo sản phẩm
      {
        category_id: categories[11]._id, // Gạo
        name: "Gạo thơm A An ST25+ túi 5kg",
        price: 95000,
        original_price: 85000,
        in_stock: 100,
        status: "active",
        description:
          "Gạo thơm A An ST25+ túi 5kg, gạo thơm ngon nhất thế giới. Gạo ST25 có hương thơm đặc trưng, hạt gạo dài, trắng bóng và vị ngọt tự nhiên. Được đóng gói trong túi 5kg tiện lợi.",
        images: [
          "https://cdnv2.tgdd.vn/bhx-static/bhx/Products/Images/2513/332920/bhx/thiet-ke-chua-co-ten-2024-12-17t142205261_202412171422573674.jpg",
          "https://cdnv2.tgdd.vn/bhx-static/bhx/Products/Images/2513/332920/bhx/thiet-ke-chua-co-ten-2024-12-17t142238369_202412171422575934.jpg",
          "https://cdnv2.tgdd.vn/bhx-static/bhx/Products/Images/2513/332920/bhx/bs9a9650_202412241548531678.jpg",
          "https://cdnv2.tgdd.vn/bhx-static/bhx/Products/Images/2513/332920/bhx/bs9a9653_202412241548528679.jpg",
          "https://cdnv2.tgdd.vn/bhx-static/bhx/Products/Images/2513/332920/bhx/preview_202412241548525787.jpg",
        ],
      },
      {
        category_id: categories[11]._id, // Gạo
        name: "Gạo thơm Neptune ST25+ Extra túi 5kg",
        price: 98000,
        original_price: 88000,
        in_stock: 80,
        status: "active",
        description:
          "Gạo thơm Neptune ST25+ Extra túi 5kg, gạo thơm ngon nhất thế giới. Gạo ST25 có hương thơm đặc trưng, hạt gạo dài, trắng bóng và vị ngọt tự nhiên. Được đóng gói trong túi 5kg tiện lợi.",
        images: [
          "https://cdn.tgdd.vn/Products/Images/2513/324448/bhx/gao-thom-neptune-st25-extra-tui-5kg-202403300918336881.jpg",
          "https://cdn.tgdd.vn/Products/Images/2513/324448/bhx/gao-thom-neptune-st25-extra-tui-5kg-202403300918339138.jpg",
          "https://cdn.tgdd.vn/Products/Images/2513/324448/bhx/gao-thom-neptune-st25-extra-tui-5kg-202403300918341944.jpg",
          "https://cdn.tgdd.vn/Products/Images/2513/324448/bhx/gao-thom-neptune-st25-extra-tui-5kg-202403300918344226.jpg",
          "https://cdn.tgdd.vn/Products/Images/2513/324448/bhx/gao-thom-neptune-st25-extra-tui-5kg-202403300918346554.jpg",
        ],
      },
      {
        category_id: categories[11]._id, // Gạo
        name: "Gạo lứt tím Vĩnh Hiển túi 1kg",
        price: 28000,
        original_price: 25000,
        in_stock: 120,
        status: "active",
        description:
          "Gạo lứt tím Vĩnh Hiển túi 1kg, gạo nguyên cám giàu dinh dưỡng. Gạo lứt tím chứa nhiều chất xơ, vitamin và khoáng chất tốt cho sức khỏe.",
        images: [
          "https://cdn.tgdd.vn/Products/Images/2513/262354/bhx/gao-lut-tim-vinh-hien-tui-1kg-202112151155237174.jpg",
          "https://cdn.tgdd.vn/Products/Images/2513/262354/bhx/gao-lut-tim-vinh-hien-tui-1kg-202112151155242817.jpg",
          "https://cdn.tgdd.vn/Products/Images/2513/262354/bhx/gao-lut-tim-vinh-hien-tui-1kg-202112151155248108.jpg",
          "https://cdn.tgdd.vn/Products/Images/2513/262354/bhx/gao-lut-tim-vinh-hien-tui-1kg-202112151155252908.jpg",
        ],
      },
      {
        category_id: categories[11]._id, // Gạo
        name: "Gạo lứt huyết rồng Bảo Minh thương hiệu túi 1kg",
        price: 32000,
        original_price: 28000,
        in_stock: 90,
        status: "active",
        description:
          "Gạo lứt huyết rồng Bảo Minh thương hiệu túi 1kg, gạo nguyên cám giàu dinh dưỡng. Gạo lứt huyết rồng chứa nhiều chất xơ, vitamin và khoáng chất tốt cho sức khỏe.",
        images: [
          "https://cdnv2.tgdd.vn/bhx-static/bhx/Products/Images/2513/338447/bhx/gao-lut-huyet-rong-bao-minh-thuong-hang-tui-1kg-clone_202505231104568186.jpg",
        ],
      },
      {
        category_id: categories[11]._id, // Gạo
        name: "Gạo thơm Vua Gạo ST25 + túi 5kg",
        price: 95000,
        original_price: 85000,
        in_stock: 100,
        status: "active",
        description:
          "Gạo thơm Vua Gạo ST25 + túi 5kg, gạo thơm ngon nhất thế giới. Gạo ST25 có hương thơm đặc trưng, hạt gạo dài, trắng bóng và vị ngọt tự nhiên. Được đóng gói trong túi 5kg tiện lợi.",
        images: [
          "https://cdnv2.tgdd.vn/bhx-static/bhx/Products/Images/2513/332640/bhx/thiet-ke-chua-co-ten-2024-12-02t101141121_202412021017531362.jpg",
          "https://cdnv2.tgdd.vn/bhx-static/bhx/Products/Images/2513/332640/bhx/thiet-ke-chua-co-ten-2024-12-12t093138530_202412120932036499.jpg",
          "https://cdnv2.tgdd.vn/bhx-static/bhx/Products/Images/2513/332640/bhx/thiet-ke-chua-co-ten-2024-12-12t092511764_202412120925334751.jpg",
          "https://cdnv2.tgdd.vn/bhx-static/bhx/Products/Images/2513/332640/bhx/thiet-ke-chua-co-ten-2024-12-12t093042713_202412120930516264.jpg",
          "https://cdnv2.tgdd.vn/bhx-static/bhx/Products/Images/2513/332640/bhx/thiet-ke-chua-co-ten-2024-12-12t093024810_202412120930598920.jpg",
        ],
      },
      // Nước tương sản phẩm
      {
        category_id: categories[12]._id, // Nước tương
        name: "Nước tương Nhất Ca Tam Thái Tử chai 500ml",
        price: 20500,
        original_price: 18000,
        in_stock: 80,
        status: "active",
        description:
          "Nước tương Nhất Ca Tam Thái Tử chai 500ml, nước tương đậu nành truyền thống, hương vị đậm đà tự nhiên.",
        images: [
          "https://cdnv2.tgdd.vn/bhx-static/bhx/Products/Images/2683/82802/bhx/82802-slide-mau-moi_202501211043008763.jpg",
          "https://cdn.tgdd.vn/Products/Images/2683/82802/bhx/nuoc-tuong-nhat-ca-tam-thai-tu-chai-500ml-202308111729325157.jpg",
          "https://cdn.tgdd.vn/Products/Images/2683/82802/bhx/nuoc-tuong-nhat-ca-tam-thai-tu-chai-500ml-202308111729327061.jpg",
        ],
      },
      {
        category_id: categories[12]._id, // Nước tương
        name: "Nước tương đậu nành đậm đặc Cholimex chai 300ml",
        price: 15000,
        original_price: 13000,
        in_stock: 90,
        status: "active",
        description:
          "Nước tương đậu nành đậm đặc Cholimex chai 300ml, nước tương truyền thống, hương vị đậm đà.",
        images: [
          "https://cdn.tgdd.vn/Products/Images/2683/194598/bhx/nuoc-tuong-dau-nanh-dam-dac-cholimex-chai-300ml-202203152312042979.jpg",
          "https://cdn.tgdd.vn/Products/Images/2683/194598/bhx/nuoc-tuong-cholimex-dam-dac-chai-300ml-201902171540189232.JPG",
          "https://cdn.tgdd.vn/Products/Images/2683/194598/bhx/nuoc-tuong-dau-nanh-dam-dac-cholimex-chai-300ml-4-700x467.jpg",
          "https://cdn.tgdd.vn/Products/Images/2683/194598/bhx/nuoc-tuong-dau-nanh-dam-dac-cholimex-chai-300ml-3-700x467.jpg",
        ],
      },
      {
        category_id: categories[12]._id, // Nước tương
        name: "Nước tương đậu nành Maggi thanh dịu chai 450ml",
        price: 19000,
        original_price: 17000,
        in_stock: 75,
        status: "active",
        description:
          "Nước tương đậu nành Maggi thanh dịu chai 450ml, nước tương thanh dịu, hương vị tự nhiên.",
        images: [
          "https://cdn.tgdd.vn/Products/Images/2683/278943/bhx/nuoc-tuong-dau-nanh-thanh-diu-maggi-chai-450ml-202308121813519516.jpg",
          "https://cdn.tgdd.vn/Products/Images/2683/278943/bhx/nuoc-tuong-dau-nanh-thanh-diu-maggi-chai-450ml-202308121813517143.jpg",
          "https://cdn.tgdd.vn/Products/Images/2683/278943/bhx/nuoc-tuong-dau-nanh-thanh-diu-maggi-chai-450ml-202308121813522060.jpg",
          "https://cdn.tgdd.vn/Products/Images/2683/278943/bhx/nuoc-tuong-dau-nanh-thanh-diu-maggi-chai-450ml-202308121813529551.jpg",
        ],
      },
      {
        category_id: categories[12]._id, // Nước tương
        name: "Nước tương Chinsu tỏi ớt chai 330ml",
        price: 21000,
        original_price: 19000,
        in_stock: 70,
        status: "active",
        description:
          "Nước tương Chinsu tỏi ớt chai 330ml, nước tương với hương vị tỏi ớt độc đáo.",
        images: [
          "https://cdn.tgdd.vn/Products/Images/2683/278939/bhx/sellingpoint.jpg",
          "https://cdn.tgdd.vn/Products/Images/2683/278939/bhx/nuoc-tuong-chinsu-toi-ot-chai-330ml-202205060918487846.jpg",
          "https://cdn.tgdd.vn/Products/Images/2683/278939/bhx/nuoc-tuong-chinsu-toi-ot-chai-330ml-202205060918503635.jpg",
          "https://cdn.tgdd.vn/Products/Images/2683/278939/bhx/nuoc-tuong-chinsu-toi-ot-chai-330ml-202205060918506095.jpg",
        ],
      },
      {
        category_id: categories[12]._id, // Nước tương
        name: "Nước tương Phú Sĩ Ajinomoto chai 500ml",
        price: 17600,
        original_price: 16000,
        in_stock: 85,
        status: "active",
        description:
          "Nước tương Phú Sĩ Ajinomoto chai 500ml, nước tương đậu nành truyền thống, hương vị đậm đà.",
        images: [
          "https://cdn.tgdd.vn/Products/Images/2683/76555/bhx/nuoc-tuong-phu-si-ajinomoto-chai-500ml-202308092053176050.jpg",
          "https://cdn.tgdd.vn/Products/Images/2683/76555/bhx/nuoc-tuong-phu-si-ajinomoto-chai-500ml-202308092053301017.jpg",
          "https://cdn.tgdd.vn/Products/Images/2683/76555/bhx/nuoc-tuong-phu-si-ajinomoto-chai-500ml-202308092053311632.jpg",
          "https://cdn.tgdd.vn/Products/Images/2683/76555/bhx/nuoc-tuong-phu-si-ajinomoto-chai-500ml-202308092053313609.jpg",
        ],
      },
      // Hạt nêm, bột ngọt, bột canh sản phẩm
      {
        category_id: categories[13]._id, // Hạt nêm, bột ngọt, bột canh
        name: "Hạt nêm Chinsu ngọt tôm thơm thịt gói 900g",
        price: 69000,
        original_price: 60000,
        in_stock: 60,
        status: "active",
        description:
          "Hạt nêm Chinsu ngọt tôm thơm thịt gói 900g, hạt nêm cao cấp với hương vị tôm thơm thịt đậm đà.",
        images: [
          "https://cdn.tgdd.vn/Products/Images/2806/312764/bhx/hat-nem-chinsu-ngot-tom-thom-thit-goi-900g-202308181104413992.jpg",
          "https://cdn.tgdd.vn/Products/Images/2806/312764/bhx/hat-nem-chinsu-ngot-tom-thom-thit-goi-900g-202308051850002856.jpg",
          "https://cdn.tgdd.vn/Products/Images/2806/312764/bhx/hat-nem-chinsu-ngot-tom-thom-thit-goi-900g-202308181104417074.jpg",
          "https://cdn.tgdd.vn/Products/Images/2806/312764/bhx/hat-nem-chinsu-ngot-tom-thom-thit-goi-900g-202308181104424097.jpg",
        ],
      },
      {
        category_id: categories[13]._id, // Hạt nêm, bột ngọt, bột canh
        name: "Hạt nêm cao cấp Maggi nấm hương gói 450g",
        price: 53500,
        original_price: 48000,
        in_stock: 50,
        status: "active",
        description:
          "Hạt nêm cao cấp Maggi nấm hương gói 450g, hạt nêm với hương vị nấm hương tự nhiên.",
        images: [
          "https://cdn.tgdd.vn/Products/Images/2806/198877/bhx/sellingpoint.jpg",
          "https://cdn.tgdd.vn/Products/Images/2806/198877/bhx/hat-nem-cao-cap-vi-nam-huong-maggi-goi-450g-202207291105505226.jpg",
          "https://cdn.tgdd.vn/Products/Images/2806/198877/bhx/hat-nem-cao-cap-vi-nam-huong-maggi-goi-202207291104146361.jpg",
          "https://cdn.tgdd.vn/Products/Images/2806/198877/bhx/hat-nem-cao-cap-vi-nam-huong-maggi-goi-202207291104156962.jpg",
        ],
      },
      {
        category_id: categories[13]._id, // Hạt nêm, bột ngọt, bột canh
        name: "Hạt nêm Natafoods thịt heo gói 1kg",
        price: 49000,
        original_price: 45000,
        in_stock: 70,
        status: "active",
        description:
          "Hạt nêm Natafoods thịt heo gói 1kg, hạt nêm với hương vị thịt heo tự nhiên.",
        images: [
          "https://cdn.tgdd.vn/Products/Images/2806/247343/bhx/hat-nem-thit-heo-natafoods-goi-1kg-202203161350437396.jpg",
          "https://cdn.tgdd.vn/Products/Images/2806/247343/bhx/hat-nem-thit-heo-natafoods-goi-1kg-202108141817540320.jpg",
          "https://cdn.tgdd.vn/Products/Images/2806/247343/bhx/hat-nem-thit-heo-natafoods-goi-1kg-202108141818121703.jpg",
          "https://cdn.tgdd.vn/Products/Images/2806/247343/bhx/hat-nem-thit-heo-natafoods-goi-1kg-202108141818573008.jpg",
        ],
      },
      {
        category_id: categories[13]._id, // Hạt nêm, bột ngọt, bột canh
        name: "Hạt nêm Knorr thịt thăn, xương ống, tủy gói 400g",
        price: 39000,
        original_price: 35000,
        in_stock: 65,
        status: "active",
        description:
          "Hạt nêm Knorr thịt thăn, xương ống, tủy gói 400g, hạt nêm với hương vị thịt thăn, xương ống, tủy đậm đà.",
        images: [
          "https://cdn.tgdd.vn/Products/Images/2806/82271/bhx/hat-nem-thit-than-xuong-ong-tuy-knorr-goi-400g-202202161925416725.jpg",
          "https://cdnv2.tgdd.vn/bhx-static/bhx/Products/Images/2806/82271/bhx/82271-slide_202409241054430157.jpg",
          "https://cdnv2.tgdd.vn/bhx-static/bhx/Products/Images/2806/82271/bhx/82271-slide-moi_202409301037454217.jpg",
        ],
      },
      {
        category_id: categories[13]._id, // Hạt nêm, bột ngọt, bột canh
        name: "Hạt nêm Aji-ngon vị heo gói 900g",
        price: 75500,
        original_price: 68000,
        in_stock: 55,
        status: "active",
        description:
          "Hạt nêm Aji-ngon vị heo gói 900g, hạt nêm với hương vị heo tự nhiên, đậm đà.",
        images: [
          "https://cdnv2.tgdd.vn/bhx-static/bhx/Products/Images/2806/77238/bhx/77238-slide_202409300925114415.jpg",
          "https://cdnv2.tgdd.vn/bhx-static/bhx/Products/Images/2806/77238/bhx/77238-slidee_202409300922440802.jpg",
          "https://cdnv2.tgdd.vn/bhx-static/bhx/Products/Images/2806/77238/bhx/77238-slide-moi_202409300922444575.jpg",
        ],
      },
      // Mì sản phẩm
      {
        category_id: categories[14]._id, // Mì
        name: "Hủ tiếu Nhịp Sống Việt Nam vàng 70g thùng 30 gói",
        price: 45000,
        original_price: 40000,
        in_stock: 80,
        status: "active",
        description:
          "Hủ tiếu Nhịp Sống Việt Nam vàng 70g thùng 30 gói, hương vị truyền thống, tiện lợi cho gia đình.",
        images: [
          "https://cdnv2.tgdd.vn/bhx-static/bhx/Products/Images/2965/175885/bhx/hu-tieu-nhip-song-vi-nam-vang-70g-thung-30_202505281458581395.jpg",
          "https://cdnv2.tgdd.vn/bhx-static/bhx/Products/Images/2965/175885/bhx/hu-tieu-nhip-song-vi-nam-vang-70g-thung-30_202505281458578377.jpg",
        ],
      },
      {
        category_id: categories[14]._id, // Mì
        name: "Thùng 24 gói mì Phú Hương thịt bằm 55g",
        price: 72000,
        original_price: 65000,
        in_stock: 60,
        status: "active",
        description:
          "Thùng 24 gói mì Phú Hương thịt bằm 55g, hương vị thịt bằm đậm đà, tiện lợi cho gia đình.",
        images: [
          "https://cdn.tgdd.vn/Products/Images/2965/86012/bhx/thung-24-goi-mien-phu-huong-thit-bam-55g-202209121417399278.jpg",
          "https://cdn.tgdd.vn/Products/Images/2965/86012/bhx/thung-24-goi-mien-phu-huong-thit-bam-55g-202209121417406299.jpg",
          "https://cdn.tgdd.vn/Products/Images/2965/86012/bhx/thung-24-goi-mien-phu-huong-thit-bam-55g-202209121417388176.jpg",
          "https://cdn.tgdd.vn/Products/Images/2965/86012/bhx/thung-24-goi-mien-phu-huong-thit-bam-55g-202209121417402885.jpg",
        ],
      },
      {
        category_id: categories[14]._id, // Mì
        name: "Thùng 24 gói mì Phú Hương sườn heo 58g",
        price: 78000,
        original_price: 70000,
        in_stock: 55,
        status: "active",
        description:
          "Thùng 24 gói mì Phú Hương sườn heo 58g, hương vị sườn heo đậm đà, tiện lợi cho gia đình.",
        images: [
          "https://cdn.tgdd.vn/Products/Images/2965/86017/bhx/thung-24-goi-mien-phu-huong-suon-heo-58g-202209101650105733.jpg",
          "https://cdn.tgdd.vn/Products/Images/2965/86017/bhx/thung-24-goi-mien-phu-huong-suon-heo-58g-202209101649017843.jpg",
          "https://cdn.tgdd.vn/Products/Images/2965/86017/bhx/thung-24-goi-mien-phu-huong-suon-heo-58g-202209101649442959.jpg",
          "https://cdn.tgdd.vn/Products/Images/2965/86017/bhx/thung-24-goi-mien-phu-huong-suon-heo-58g-202209101649015797.jpg",
        ],
      },
      {
        category_id: categories[14]._id, // Mì
        name: "Hủ tiếu sườn heo Cung Đình gói 84g",
        price: 8500,
        original_price: 7500,
        in_stock: 120,
        status: "active",
        description:
          "Hủ tiếu sườn heo Cung Đình gói 84g, hương vị sườn heo đậm đà, tiện lợi cho gia đình.",
        images: [
          "https://cdn.tgdd.vn/Products/Images/2965/309206/bhx/hu-tieu-suon-heo-cung-dinh-goi-84g-202307271513378863.jpg",
          "https://cdn.tgdd.vn/Products/Images/2965/309206/bhx/hu-tieu-suon-heo-cung-dinh-goi-84g-202307271513382114.jpg",
          "https://cdn.tgdd.vn/Products/Images/2965/309206/bhx/hu-tieu-suon-heo-cung-dinh-goi-84g-202307271513376006.jpg",
          "https://cdn.tgdd.vn/Products/Images/2965/309206/bhx/hu-tieu-suon-heo-cung-dinh-goi-84g-202307271513392191.jpg",
        ],
      },
      {
        category_id: categories[14]._id, // Mì
        name: "Lốc 4 gói miến sườn heo Vifon 58g",
        price: 15000,
        original_price: 13000,
        in_stock: 90,
        status: "active",
        description:
          "Lốc 4 gói miến sườn heo Vifon 58g, hương vị sườn heo đậm đà, tiện lợi cho gia đình.",
        images: [
          "https://cdn.tgdd.vn/Products/Images/2965/292938/bhx/loc-4-goi-mien-suon-heo-vifon-58g-202210052010358454.jpg",
          "https://cdn.tgdd.vn/Products/Images/2965/292938/bhx/loc-4-goi-mien-suon-heo-vifon-58g-202210052010401279.jpg",
          "https://cdn.tgdd.vn/Products/Images/2965/292938/bhx/loc-4-goi-mien-suon-heo-vifon-58g-202210052010345458.jpg",
          "https://cdn.tgdd.vn/Products/Images/2965/292938/bhx/loc-4-goi-mien-suon-heo-vifon-58g-202210151630339636.jpg",
        ],
      },
      {
        category_id: categories[14]._id, // Mì
        name: "Lốc 4 gói miến măng vịt Vifon 58g",
        price: 15000,
        original_price: 13000,
        in_stock: 85,
        status: "active",
        description:
          "Lốc 4 gói miến măng vịt Vifon 58g, hương vị măng vịt đậm đà, tiện lợi cho gia đình.",
        images: [
          "https://cdn.tgdd.vn/Products/Images/2965/292928/bhx/loc-4-goi-mien-mang-vit-vifon-58g-202210051954115291.jpg",
          "https://cdn.tgdd.vn/Products/Images/2965/292928/bhx/loc-4-goi-mien-mang-vit-vifon-58g-202210051954128682.jpg",
          "https://cdn.tgdd.vn/Products/Images/2965/292928/bhx/loc-4-goi-mien-mang-vit-vifon-58g-202210151627562258.jpg",
        ],
      },
      {
        category_id: categories[14]._id, // Mì
        name: "Thùng 20 gói mì Koreno UP tôm chua cay 67g",
        price: 120000,
        original_price: 100000,
        in_stock: 40,
        status: "active",
        description:
          "Thùng 20 gói mì Koreno UP tôm chua cay 67g, hương vị tôm chua cay độc đáo, tiện lợi cho gia đình.",
        images: [
          "https://cdn.tgdd.vn/Products/Images/2565/320754/bhx/thung-20-goi-mi-koreno-up-tom-chua-cay-67g-202401071919386064.jpg",
          "https://cdn.tgdd.vn/Products/Images/2565/320754/bhx/thung-20-goi-mi-koreno-up-tom-chua-cay-67g-202401071919389993.jpg",
          "https://cdn.tgdd.vn/Products/Images/2565/320754/bhx/thung-20-goi-mi-koreno-up-tom-chua-cay-67g-202401071922302522.jpg",
        ],
      },
      {
        category_id: categories[14]._id, // Mì
        name: "Thùng 20 gói mì Yeul cay Ottogi 120g",
        price: 180000,
        original_price: 150000,
        in_stock: 35,
        status: "active",
        description:
          "Thùng 20 gói mì Yeul cay Ottogi 120g, hương vị cay độc đáo, tiện lợi cho gia đình.",
        images: [
          "https://cdn.tgdd.vn/Products/Images/2565/215572/bhx/thung-20-goi-mi-yeul-cay-ottogi-120g-202009181120561035.jpg",
          "https://cdn.tgdd.vn/Products/Images/2565/215572/bhx/thung-20-goi-mi-yeul-cay-ottogi-120g-202009181120565548.jpg",
          "https://cdn.tgdd.vn/Products/Images/2565/215572/bhx/thung-20-goi-mi-yeul-cay-ottogi-120g-202202220011203502.jpg",
          "https://cdn.tgdd.vn/Products/Images/2565/215572/bhx/thung-20-goi-mi-yeul-cay-ottogi-120g-202009181119123585.jpg",
        ],
      },
      {
        category_id: categories[14]._id, // Mì
        name: "Mì 3 miền cay 3 cấp độ gói 75g",
        price: 8500,
        original_price: 7500,
        in_stock: 100,
        status: "active",
        description:
          "Mì 3 miền cay 3 cấp độ gói 75g, hương vị cay độc đáo, tiện lợi cho gia đình.",
        images: [
          "https://cdn.tgdd.vn/Products/Images/2565/326815/bhx/mi-3-mien-cay-3-cap-do-goi-75g-clone-202406131514170743.jpg",
          "https://cdn.tgdd.vn/Products/Images/2565/326815/bhx/mi-3-mien-cay-3-cap-do-goi-75g-clone-202406131514169110.jpg",
        ],
      },
      {
        category_id: categories[14]._id, // Mì
        name: "Thùng 20 gói mì kim chi Ottogi 120g",
        price: 180000,
        original_price: 150000,
        in_stock: 30,
        status: "active",
        description:
          "Thùng 20 gói mì kim chi Ottogi 120g, hương vị kim chi độc đáo, tiện lợi cho gia đình.",
        images: [
          "https://cdn.tgdd.vn/Products/Images/2565/214535/bhx/thung-20-goi-mi-kim-chi-ottogi-120g-202009181057062507.jpg",
          "https://cdn.tgdd.vn/Products/Images/2565/214535/bhx/thung-20-goi-mi-kim-chi-ottogi-120g-202009181057069061.jpg",
          "https://cdn.tgdd.vn/Products/Images/2565/214535/bhx/thung-20-goi-mi-kim-chi-ottogi-120g-202202241239585144.jpg",
        ],
      },
      {
        category_id: categories[14]._id, // Mì
        name: "Lốc 5 gói phở bò Đệ Nhất 68g",
        price: 25000,
        original_price: 22000,
        in_stock: 70,
        status: "active",
        description:
          "Lốc 5 gói phở bò Đệ Nhất 68g, hương vị phở bò đậm đà, tiện lợi cho gia đình.",
        images: [
          "https://cdn.tgdd.vn/Products/Images/2566/322596/bhx/loc-5-goi-pho-bo-de-nhat-68g-202403131105085473.jpg",
          "https://cdn.tgdd.vn/Products/Images/2566/322596/bhx/loc-5-goi-pho-bo-de-nhat-68g-202403131105094292.jpg",
          "https://cdn.tgdd.vn/Products/Images/2566/322596/bhx/loc-5-goi-pho-bo-de-nhat-68g-202403131105102433.jpg",
          "https://cdn.tgdd.vn/Products/Images/2566/322596/bhx/loc-5-goi-pho-bo-de-nhat-68g-202403131105048278.jpg",
        ],
      },
      {
        category_id: categories[14]._id, // Mì
        name: "Phở bò tái lăn Đệ Nhất gói 68g",
        price: 5500,
        original_price: 4800,
        in_stock: 150,
        status: "active",
        description:
          "Phở bò tái lăn Đệ Nhất gói 68g, hương vị phở bò đậm đà, tiện lợi cho gia đình.",
        images: [
          "https://cdn.tgdd.vn/Products/Images/2566/298754/bhx/pho-bo-tai-lan-de-nhat-goi-68g-202212251138304495.jpg",
          "https://cdn.tgdd.vn/Products/Images/2566/298754/bhx/pho-bo-tai-lan-de-nhat-goi-68g-202212251138307604.jpg",
          "https://cdn.tgdd.vn/Products/Images/2566/298754/bhx/pho-bo-tai-lan-de-nhat-goi-68g-202212251138322021.jpg",
        ],
      },
      {
        category_id: categories[14]._id, // Mì
        name: "Phở trộn vị thập cẩm cay Đệ Nhất gói 82g",
        price: 6500,
        original_price: 5800,
        in_stock: 120,
        status: "active",
        description:
          "Phở trộn vị thập cẩm cay Đệ Nhất gói 82g, hương vị thập cẩm cay độc đáo, tiện lợi cho gia đình.",
        images: [
          "https://cdn.tgdd.vn/Products/Images/2566/197493/bhx/pho-tron-vi-thap-cam-cay-de-nhat-goi-82g-201912311525119585.jpg",
          "https://cdn.tgdd.vn/Products/Images/2566/197493/bhx/pho-tron-vi-thap-cam-cay-de-nhat-goi-82g-201912311525124585.jpg",
          "https://cdn.tgdd.vn/Products/Images/2566/197493/bhx/pho-tron-vi-thap-cam-cay-de-nhat-goi-82g-201812231019130337.JPG",
        ],
      },
      {
        category_id: categories[14]._id, // Mì
        name: "Phở Ăn Liền Vifon vị bò gói 70g",
        price: 5500,
        original_price: 4800,
        in_stock: 130,
        status: "active",
        description:
          "Phở Ăn Liền Vifon vị bò gói 70g, hương vị phở bò đậm đà, tiện lợi cho gia đình.",
        images: [
          "https://cdnv2.tgdd.vn/bhx-static/bhx/Products/Images/2566/230170/bhx/pho-an-lien-vifon-vi-bo-goi-70g_202504211358001432.jpg",
          "https://cdnv2.tgdd.vn/bhx-static/bhx/Products/Images/2566/230170/bhx/pho-an-lien-vifon-vi-bo-goi-70g_202504211358007067.jpg",
          "https://cdnv2.tgdd.vn/bhx-static/bhx/Products/Images/2566/230170/bhx/pho-an-lien-vifon-vi-bo-goi-70g_202504211408572307.jpg",
          "https://cdn.tgdd.vn/Products/Images/2566/230170/bhx/pho-an-lien-vifon-vi-bo-goi-70g-202312150910236392.jpg",
        ],
      },
      {
        category_id: categories[14]._id, // Mì
        name: "Phở chay rau nấm Vifon gói 65g",
        price: 4800,
        original_price: 4200,
        in_stock: 100,
        status: "active",
        description:
          "Phở chay rau nấm Vifon gói 65g, hương vị chay thanh đạm, tiện lợi cho gia đình.",
        images: [
          "https://cdn.tgdd.vn/Products/Images/2566/96244/bhx/pho-chay-rau-nam-vifon-goi-65g-201911061451366193.jpg",
          "https://cdn.tgdd.vn/Products/Images/2566/96244/bhx/pho-chay-rau-nam-vifon-goi-65g-201911061451370313.jpg",
          "https://cdn.tgdd.vn/Products/Images/2566/96244/bhx/pho-chay-rau-nam-vifon-goi-65g-202202121048583660.jpg",
          "https://cdn.tgdd.vn/Products/Images/2566/96244/bhx/pho-chay-rau-nam-vifon-goi-65g-201911061451386853.jpg",
        ],
      },
      // Kem sản phẩm
      {
        category_id: categories[15]._id, // Kem
        name: "Kem que Topten vanila Walls cay 55g",
        price: 12000,
        original_price: 10000,
        in_stock: 200,
        status: "active",
        description:
          "Kem que Topten vanila Walls cay 55g, hương vị vanila thơm ngon, mát lạnh.",
        images: [
          "https://cdn.tgdd.vn/Products/Images/7462/250227/bhx/kem-que-topten-vanila-walls-cay-55g-202308231020269976.jpg",
          "https://cdn.tgdd.vn/Products/Images/7462/250227/bhx/kem-que-topten-vanila-walls-cay-55g-202308231020272511.jpg",
          "https://cdn.tgdd.vn/Products/Images/7462/250227/bhx/kem-que-topten-vanila-walls-cay-55g-202308231020274985.jpg",
          "https://cdn.tgdd.vn/Products/Images/7462/250227/bhx/kem-que-topten-vanila-walls-cay-57g-202205141502324266.jpg",
          "https://cdn.tgdd.vn/Products/Images/7462/250227/bhx/sellingpoint.jpg",
        ],
      },
      {
        category_id: categories[15]._id, // Kem
        name: "Kem que Topten socola Walls cay 55g",
        price: 12000,
        original_price: 10000,
        in_stock: 180,
        status: "active",
        description:
          "Kem que Topten socola Walls cay 55g, hương vị socola đậm đà, mát lạnh.",
        images: [
          "https://cdn.tgdd.vn/Products/Images/7462/250226/bhx/kem-que-topten-socola-walls-55g-202401031541273583.jpg",
          "https://cdn.tgdd.vn/Products/Images/7462/250226/bhx/kem-que-topten-socola-walls-55g-202401031541268662.jpg",
          "https://cdn.tgdd.vn/Products/Images/7462/250226/bhx/kem-que-topten-socola-walls-55g-202401031541276267.jpg",
          "https://cdn.tgdd.vn/Products/Images/7462/250226/bhx/kem-que-topten-socola-walls-55g-202401031541284587.jpg",
        ],
      },
      {
        category_id: categories[15]._id, // Kem
        name: "Hộp 6 cây kem ốc quế vani socola dâu socola Merino 60g",
        price: 72000,
        original_price: 65000,
        in_stock: 50,
        status: "active",
        description:
          "Hộp 6 cây kem ốc quế vani socola dâu socola Merino 60g, hương vị đa dạng, mát lạnh.",
        images: [
          "https://cdnv2.tgdd.vn/bhx-static/bhx/Products/Images/7462/336256/bhx/hop-6-cay-kem-oc-que-vani-socola-dau-socola-merino-60g_202506110937291635.jpg",
          "https://cdnv2.tgdd.vn/bhx-static/bhx/Products/Images/7462/336256/bhx/hop-6-cay-kem-oc-que-vani-socola-dau-socola-merino-60g_202506110937294881.jpg",
          "https://cdnv2.tgdd.vn/bhx-static/bhx/Products/Images/7462/336256/bhx/hop-6-cay-kem-oc-que-vani-socola-dau-socola-merino-60g_202506110937280628.jpg",
        ],
      },
      {
        category_id: categories[15]._id, // Kem
        name: "Kem socola nhân mứt dâu tây Hùng Linh Snow Baby X cây 60ml",
        price: 15000,
        original_price: 13000,
        in_stock: 80,
        status: "active",
        description:
          "Kem socola nhân mứt dâu tây Hùng Linh Snow Baby X cây 60ml, hương vị độc đáo, mát lạnh.",
        images: [
          "https://cdn.tgdd.vn/Products/Images/7462/327945/bhx/kem-socola-nhan-mut-dau-tay-hung-linh-snow-baby-x-cay-60ml-202407151352546511.jpg",
          "https://cdn.tgdd.vn/Products/Images/7462/327945/bhx/kem-socola-nhan-mut-dau-tay-hung-linh-snow-baby-x-cay-60ml-202407151352534951.jpg",
        ],
      },
      {
        category_id: categories[15]._id, // Kem
        name: "Kem khoai môn yến mạch Hùng Linh Snow Baby X cây 60ml",
        price: 15000,
        original_price: 13000,
        in_stock: 75,
        status: "active",
        description:
          "Kem khoai môn yến mạch Hùng Linh Snow Baby X cây 60ml, hương vị độc đáo, mát lạnh.",
        images: [
          "https://cdn.tgdd.vn/Products/Images/7462/327944/bhx/kem-khoai-mon-yen-mach-hung-linh-snow-baby-x-cay-60ml-202407151350000799.jpg",
          "https://cdn.tgdd.vn/Products/Images/7462/327944/bhx/kem-khoai-mon-yen-mach-hung-linh-snow-baby-x-cay-60ml-202407151349597463.jpg",
        ],
      },
      {
        category_id: categories[15]._id, // Kem
        name: "Kem dâu đỏ yến mạch Hùng Linh Snow Baby X cây 60ml",
        price: 15000,
        original_price: 13000,
        in_stock: 70,
        status: "active",
        description:
          "Kem dâu đỏ yến mạch Hùng Linh Snow Baby X cây 60ml, hương vị độc đáo, mát lạnh.",
        images: [
          "https://cdn.tgdd.vn/Products/Images/7462/327943/bhx/kem-dau-do-yen-mach-hung-linh-snow-baby-x-cay-60ml-202407151345155123.jpg",
          "https://cdn.tgdd.vn/Products/Images/7462/327943/bhx/kem-dau-do-yen-mach-hung-linh-snow-baby-x-cay-60ml-202407151345144435.jpg",
        ],
      },
      {
        category_id: categories[15]._id, // Kem
        name: "Kem dâu xanh yến mạch Hùng Linh Snow Baby X cây 60ml",
        price: 15000,
        original_price: 13000,
        in_stock: 65,
        status: "active",
        description:
          "Kem dâu xanh yến mạch Hùng Linh Snow Baby X cây 60ml, hương vị độc đáo, mát lạnh.",
        images: [
          "https://cdn.tgdd.vn/Products/Images/7462/327942/bhx/kem-dau-xanh-yen-mach-hung-linh-snow-baby-x-cay-60ml-202407151316222667.jpg",
          "https://cdn.tgdd.vn/Products/Images/7462/327942/bhx/kem-dau-xanh-yen-mach-hung-linh-snow-baby-x-cay-60ml-202407151316229507.jpg",
        ],
      },
      {
        category_id: categories[15]._id, // Kem
        name: "Kem Walls Cheesy Bar cây 72g",
        price: 18000,
        original_price: 15000,
        in_stock: 90,
        status: "active",
        description:
          "Kem Walls Cheesy Bar cây 72g, hương vị phô mai độc đáo, mát lạnh.",
        images: [
          "https://cdn.tgdd.vn/Products/Images/7462/306808/bhx/kem-walls-cheesy-bar-cay-72g-202305122340545633.jpg",
          "https://cdn.tgdd.vn/Products/Images/7462/306808/bhx/kem-walls-cheesy-bar-cay-72g-202305122340550195.jpg",
          "https://cdn.tgdd.vn/Products/Images/7462/306808/bhx/kem-walls-cheesy-bar-cay-72g-202305041659065565.jpg",
          "https://cdn.tgdd.vn/Products/Images/7462/306808/bhx/kem-walls-cheesy-bar-cay-72g-202305041659055351.jpg",
          "https://cdn.tgdd.vn/Products/Images/7462/306808/bhx/kem-walls-cheesy-bar-cay-72g-202305041659061611.jpg",
        ],
      },
      {
        category_id: categories[15]._id, // Kem
        name: "Kem Magnum Almond Walls cây 64.5g",
        price: 25000,
        original_price: 22000,
        in_stock: 60,
        status: "active",
        description:
          "Kem Magnum Almond Walls cây 64.5g, hương vị hạnh nhân độc đáo, mát lạnh.",
        images: [
          "https://cdn.tgdd.vn/Products/Images/7462/306557/bhx/kem-magnum-almond-walls-cay-645g-202304280849376446.jpg",
          "https://cdn.tgdd.vn/Products/Images/7462/306557/bhx/kem-magnum-almond-walls-cay-645g-202305130036071622.jpg",
          "https://cdn.tgdd.vn/Products/Images/7462/306557/bhx/kem-magnum-almond-walls-cay-645g-202305130036076178.jpg",
          "https://cdn.tgdd.vn/Products/Images/7462/306557/bhx/sellingpoint.jpg",
        ],
      },
      {
        category_id: categories[15]._id, // Kem
        name: "Kem khoai môn lõi xốt Merino X Plus cây 60g",
        price: 18000,
        original_price: 15000,
        in_stock: 85,
        status: "active",
        description:
          "Kem khoai môn lõi xốt Merino X Plus cây 60g, hương vị độc đáo, mát lạnh.",
        images: [
          "https://cdn.tgdd.vn/Products/Images/7462/291148/bhx/kem-khoai-mon-loi-xot-merino-x-plus-cay-60g-202209171441584819.jpg",
          "https://cdn.tgdd.vn/Products/Images/7462/291148/bhx/kem-khoai-mon-loi-xot-merino-x-plus-cay-60g-202209171441588791.jpg",
          "https://cdn.tgdd.vn/Products/Images/7462/291148/bhx/sellingpoint.jpg",
          "https://cdn.tgdd.vn/Products/Images/7462/291148/bhx/kem-khoai-mon-loi-xot-merino-x-plus-cay-60g-202210072055485661.jpg",
        ],
      },
      {
        category_id: categories[15]._id, // Kem
        name: "Kem dâu đỏ lõi xốp Merino X Plus cây 60g",
        price: 18000,
        original_price: 15000,
        in_stock: 80,
        status: "active",
        description:
          "Kem dâu đỏ lõi xốp Merino X Plus cây 60g, hương vị độc đáo, mát lạnh.",
        images: [
          "https://cdn.tgdd.vn/Products/Images/7462/289021/bhx/kem-dau-do-loi-xop-merino-x-plus-cay-60g-202209171437195254.jpg",
          "https://cdn.tgdd.vn/Products/Images/7462/289021/bhx/kem-dau-do-loi-xop-merino-x-plus-cay-60g-202209171437198700.jpg",
          "https://cdn.tgdd.vn/Products/Images/7462/289021/bhx/sellingpoint.jpg",
        ],
      },
      {
        category_id: categories[15]._id, // Kem
        name: "Kem chuối Merino cây 80g",
        price: 20000,
        original_price: 18000,
        in_stock: 70,
        status: "active",
        description:
          "Kem chuối Merino cây 80g, hương vị chuối tự nhiên, mát lạnh.",
        images: [
          "https://cdnv2.tgdd.vn/bhx-static/bhx/Products/Images/7462/250175/bhx/kem-chuoi-merino-cay-80g_202505191418127160.jpg",
          "https://cdn.tgdd.vn/Products/Images/7462/250175/bhx/kem-chuoi-merino-truyen-thong-cay-80g-202210072035346567.jpg",
        ],
      },
      {
        category_id: categories[15]._id, // Kem
        name: "Kem que Milky Chocolate Merino Kool Cutie Bear 64g",
        price: 22000,
        original_price: 20000,
        in_stock: 55,
        status: "active",
        description:
          "Kem que Milky Chocolate Merino Kool Cutie Bear 64g, hương vị socola sữa độc đáo, mát lạnh.",
        images: [
          "https://cdn.tgdd.vn/Products/Images/7462/206556/bhx/kem-que-milky-chocolate-merino-kool-cutie-bear-64g-202210072051220173.jpg",
          "https://cdn.tgdd.vn/Products/Images/7462/206556/bhx/kem-que-milky-chocolate-merino-kool-cutie-bear-64g-202210072051316568.jpg",
          "https://cdn.tgdd.vn/Products/Images/7462/206556/bhx/kem-que-milky-chocolate-merino-kool-cutie-bear-64g-202210072051339724.jpg",
          "https://cdn.tgdd.vn/Products/Images/7462/206556/bhx/kem-que-milky-chocolate-merino-kool-cutie-bear-64g-202203081610115616.jpg",
        ],
      },
      {
        category_id: categories[15]._id, // Kem
        name: "Kem hộp vani dâu Merino 900ml",
        price: 120000,
        original_price: 100000,
        in_stock: 25,
        status: "active",
        description:
          "Kem hộp vani dâu Merino 900ml, hương vị vani dâu thơm ngon, mát lạnh.",
        images: [
          "https://cdn.tgdd.vn/Products/Images/7462/274141/bhx/kem-hop-vani-dau-merino-900ml-202210292137419760.jpg",
          "https://cdn.tgdd.vn/Products/Images/7462/274141/bhx/kem-hop-vani-dau-merino-900ml-202210292137414097.jpg",
          "https://cdn.tgdd.vn/Products/Images/7462/274141/bhx/kem-hop-vani-dau-merino-900ml-202210292137499667.jpg",
          "https://cdn.tgdd.vn/Products/Images/7462/274141/bhx/kem-hop-vani-dau-merino-900ml-202210292137504307.jpg",
          "https://cdn.tgdd.vn/Products/Images/7462/274141/bhx/sellingpoint.jpg",
        ],
      },
      // Sữa chua sản phẩm
      {
        category_id: categories[16]._id, // Sữa chua
        name: "Lốc 4 hộp sữa chua ăn nhà đậm đặc Lothamilk 100g",
        price: 45000,
        original_price: 40000,
        in_stock: 80,
        status: "active",
        description:
          "Lốc 4 hộp sữa chua ăn nhà đậm đặc Lothamilk 100g, hương vị tự nhiên, tốt cho tiêu hóa.",
        images: [
          "https://cdnv2.tgdd.vn/bhx-static/bhx/Products/Images/7558/333033/bhx/loc-4-hop-sua-chua-an-nha-dam-lothamilk-100g_202507171318041892.jpg",
          "https://cdnv2.tgdd.vn/bhx-static/bhx/Products/Images/7558/333033/bhx/loc-4-hop-sua-chua-an-nha-dam-lothamilk-100g_202504101637080017.jpg",
          "https://cdnv2.tgdd.vn/bhx-static/bhx/Products/Images/7558/333033/bhx/loc-4-hop-sua-chua-an-nha-dam-lothamilk-100g_202504101637084537.jpg",
        ],
      },
      {
        category_id: categories[16]._id, // Sữa chua
        name: "Lốc 4 hộp sữa chua Nutifood có đường 100g",
        price: 35000,
        original_price: 32000,
        in_stock: 90,
        status: "active",
        description:
          "Lốc 4 hộp sữa chua Nutifood có đường 100g, hương vị tự nhiên, tốt cho tiêu hóa.",
        images: [
          "https://cdn.tgdd.vn/Products/Images/7558/222522/bhx/loc-4-hop-sua-chua-nutifood-co-duong-100g-202207011041548525.jpg",
          "https://cdn.tgdd.vn/Products/Images/7558/222522/bhx/loc-4-hop-sua-chua-nutifood-co-duong-100g-202207011041544838.jpg",
          "https://cdn.tgdd.vn/Products/Images/7558/222522/bhx/sellingpoint.jpg",
        ],
      },
      {
        category_id: categories[16]._id, // Sữa chua
        name: "Lốc 4 hộp sữa chua ăn ít đường Nutimilk 100g",
        price: 38000,
        original_price: 35000,
        in_stock: 85,
        status: "active",
        description:
          "Lốc 4 hộp sữa chua ăn ít đường Nutimilk 100g, hương vị tự nhiên, tốt cho tiêu hóa.",
        images: [
          "https://cdn.tgdd.vn/Products/Images/7558/324700/bhx/loc-4-hop-sua-chua-an-it-duong-nutimilk-100g-202405200928563578.jpg",
          "https://cdn.tgdd.vn/Products/Images/7558/324700/bhx/loc-4-hop-sua-chua-an-it-duong-nutimilk-100g-202405200928568050.jpg",
          "https://cdn.tgdd.vn/Products/Images/7558/324700/bhx/loc-4-hop-sua-chua-an-it-duong-nutimilk-100g-202405200928574243.jpg",
        ],
      },
      {
        category_id: categories[16]._id, // Sữa chua
        name: "Lốc 4 hộp sữa chua Nutimilk nhà đậm 100g",
        price: 40000,
        original_price: 37000,
        in_stock: 75,
        status: "active",
        description:
          "Lốc 4 hộp sữa chua Nutimilk nhà đậm 100g, hương vị tự nhiên, tốt cho tiêu hóa.",
        images: [
          "https://cdn.tgdd.vn/Products/Images/7558/222523/bhx/loc-4-hop-sua-chua-nutimilk-nha-dam-100g-202207301559467894.jpg",
          "https://cdn.tgdd.vn/Products/Images/7558/222523/bhx/loc-4-hop-sua-chua-nutimilk-nha-dam-100g-202207301559471957.jpg",
          "https://cdn.tgdd.vn/Products/Images/7558/222523/bhx/loc-4-hop-sua-chua-nutimilk-nha-dam-100g-202207301559525677.jpg",
          "https://cdn.tgdd.vn/Products/Images/7558/222523/bhx/loc-4-hop-sua-chua-nha-dam-nutimilk-100g-202404161332456312.jpg",
        ],
      },
      {
        category_id: categories[16]._id, // Sữa chua
        name: "Lốc 2 hũ sữa chua Sài Gòn Milk phô mai 100g",
        price: 25000,
        original_price: 22000,
        in_stock: 100,
        status: "active",
        description:
          "Lốc 2 hũ sữa chua Sài Gòn Milk phô mai 100g, hương vị phô mai độc đáo, tốt cho tiêu hóa.",
        images: [
          "https://cdn.tgdd.vn/Products/Images/7558/290307/bhx/loc-2-hu-sua-chua-sai-gon-milk-pho-mai-100g-202209171652108054.jpg",
          "https://cdn.tgdd.vn/Products/Images/7558/290307/bhx/loc-2-hu-sua-chua-sai-gon-milk-pho-mai-100g-202209171652120163.jpg",
          "https://cdn.tgdd.vn/Products/Images/7558/290307/bhx/loc-2-hu-sua-chua-sai-gon-milk-pho-mai-100g-202209171652123445.jpg",
          "https://cdn.tgdd.vn/Products/Images/7558/290307/bhx/sellingpoint.jpg",
        ],
      },
      {
        category_id: categories[16]._id, // Sữa chua
        name: "Lốc 4 hộp sữa chua ăn thanh trùng có đường Delifres hộp 80g",
        price: 42000,
        original_price: 38000,
        in_stock: 70,
        status: "active",
        description:
          "Lốc 4 hộp sữa chua ăn thanh trùng có đường Delifres hộp 80g, hương vị tự nhiên, tốt cho tiêu hóa.",
        images: [
          "https://cdnv2.tgdd.vn/bhx-static/bhx/Products/Images/7558/335124/bhx/loc-4-hop-sua-chua-an-thanh-trung-co-duong-delifres-hop-80g_202504101609022542.jpg",
          "https://cdnv2.tgdd.vn/bhx-static/bhx/Products/Images/7558/335124/bhx/loc-4-hop-sua-chua-an-thanh-trung-co-duong-delifres-hop-80g_202504101609028324.jpg",
          "https://cdnv2.tgdd.vn/bhx-static/bhx/Products/Images/7558/335124/bhx/sua-chua-an-thanh-trung-co-duong-delifres-hop-80g-clone_202502271622123662.jpg",
          "https://cdnv2.tgdd.vn/bhx-static/bhx/Products/Images/7558/335124/bhx/sua-chua-an-thanh-trung-co-duong-delifres-hop-80g-clone_202502271622126543.jpg",
        ],
      },
      {
        category_id: categories[16]._id, // Sữa chua
        name: "Lốc 2 hũ sữa chua Sài Gòn Milk nếp cẩm 120g",
        price: 28000,
        original_price: 25000,
        in_stock: 80,
        status: "active",
        description:
          "Lốc 2 hũ sữa chua Sài Gòn Milk nếp cẩm 120g, hương vị nếp cẩm độc đáo, tốt cho tiêu hóa.",
        images: [
          "https://cdn.tgdd.vn/Products/Images/7558/290308/bhx/loc-2-hu-sua-chua-sai-gon-milk-nep-cam-120g-202209171649472335.jpg",
          "https://cdn.tgdd.vn/Products/Images/7558/290308/bhx/loc-2-hu-sua-chua-sai-gon-milk-nep-cam-120g-202209171649475629.jpg",
          "https://cdn.tgdd.vn/Products/Images/7558/290308/bhx/loc-2-hu-sua-chua-sai-gon-milk-nep-cam-120g-202209171649486856.jpg",
          "https://cdn.tgdd.vn/Products/Images/7558/290308/bhx/sellingpoint.jpg",
        ],
      },
      {
        category_id: categories[16]._id, // Sữa chua
        name: "Thùng 48 hộp sữa chua men sống Việt quất tự nhiên TH True Yogurt 100g",
        price: 180000,
        original_price: 160000,
        in_stock: 30,
        status: "active",
        description:
          "Thùng 48 hộp sữa chua men sống Việt quất tự nhiên TH True Yogurt 100g, hương vị việt quất tự nhiên, tốt cho tiêu hóa.",
        images: [
          "https://cdn.tgdd.vn/Products/Images/7558/325360/bhx/thung-48-hop-sua-chua-men-song-viet-quat-tu-nhien-th-true-yogurt-100g-202405031207137007.jpg",
          "https://cdn.tgdd.vn/Products/Images/7558/325360/bhx/thung-48-hop-sua-chua-men-song-viet-quat-tu-nhien-th-true-yogurt-100g-202405031207140797.jpg",
          "https://cdn.tgdd.vn/Products/Images/7558/325360/bhx/thung-48-hop-sua-chua-men-song-viet-quat-tu-nhien-th-true-yogurt-100g-202405031207143924.jpg",
          "https://cdn.tgdd.vn/Products/Images/7558/325360/bhx/thung-48-hop-sua-chua-men-song-viet-quat-tu-nhien-th-true-yogurt-100g-202405031207134500.jpg",
        ],
      },
      {
        category_id: categories[16]._id, // Sữa chua
        name: "Lốc 4 hộp vàng sữa hương vani Hoff 55g",
        price: 22000,
        original_price: 20000,
        in_stock: 95,
        status: "active",
        description:
          "Lốc 4 hộp vàng sữa hương vani Hoff 55g, hương vị vani thơm ngon, tốt cho tiêu hóa.",
        images: [
          "https://cdn.tgdd.vn/Products/Images/7558/323731/bhx/loc-4-hop-vang-sua-huong-vani-hoff-55g-202403221326577753.jpg",
          "https://cdn.tgdd.vn/Products/Images/7558/323731/bhx/loc-4-hop-vang-sua-huong-vani-hoff-55g-202403302034132915.jpg",
          "https://cdn.tgdd.vn/Products/Images/7558/323731/bhx/loc-4-hop-vang-sua-huong-vani-hoff-55g-202403302034128169.jpg",
          "https://cdn.tgdd.vn/Products/Images/7558/323731/bhx/sellingpoint.jpg",
        ],
      },
      {
        category_id: categories[16]._id, // Sữa chua
        name: "Lốc 4 hộp sữa chua ít đường Green Farm Vinamilk 100g",
        price: 40000,
        original_price: 37000,
        in_stock: 75,
        status: "active",
        description:
          "Lốc 4 hộp sữa chua ít đường Green Farm Vinamilk 100g, hương vị tự nhiên, tốt cho tiêu hóa.",
        images: [
          "https://cdnv2.tgdd.vn/bhx-static//loc-4-hop-sua-chua-it-duong-green-farm-vinamilk-100g_202502141557192764.jpg",
          "https://cdnv2.tgdd.vn/bhx-static//loc-4-hop-sua-chua-it-duong-green-farm-vinamilk-100g_202502141557196287.jpg",
        ],
      },
      {
        category_id: categories[16]._id, // Sữa chua
        name: "Thùng 48 hộp sữa chua dâu Vinamilk 100g",
        price: 180000,
        original_price: 160000,
        in_stock: 35,
        status: "active",
        description:
          "Thùng 48 hộp sữa chua dâu Vinamilk 100g, hương vị dâu tự nhiên, tốt cho tiêu hóa.",
        images: [
          "https://cdn.tgdd.vn/Products/Images/7558/317075/bhx/thung-48-hop-sua-chua-dau-vinamilk-100g-202407241602392105.jpg",
          "https://cdn.tgdd.vn/Products/Images/7558/317075/bhx/thung-48-hop-sua-chua-dau-vinamilk-100g-202407241602387981.jpg",
          "https://cdn.tgdd.vn/Products/Images/7558/317075/bhx/thung-48-hop-sua-chua-dau-vinamilk-100g-202310161101379514.jpg",
          "https://cdn.tgdd.vn/Products/Images/7558/317075/bhx/thung-48-hop-sua-chua-dau-vinamilk-100g-202407241602383630.jpg",
          "https://cdn.tgdd.vn/Products/Images/7558/317075/bhx/thung-48-hop-sua-chua-dau-vinamilk-100g-202407241602363101.jpg",
        ],
      },
      {
        category_id: categories[16]._id, // Sữa chua
        name: "Thùng 48 hộp sữa chua cho trẻ em có đường IQ Susu 80g",
        price: 160000,
        original_price: 140000,
        in_stock: 40,
        status: "active",
        description:
          "Thùng 48 hộp sữa chua cho trẻ em có đường IQ Susu 80g, hương vị tự nhiên, tốt cho tiêu hóa trẻ em.",
        images: [
          "https://cdn.tgdd.vn/Products/Images/7558/317074/bhx/thung-48-hop-sua-chua-cho-tre-em-co-duong-iq-susu-80g-202310161053513205.jpg",
          "https://cdn.tgdd.vn/Products/Images/7558/317074/bhx/thung-48-hop-sua-chua-cho-tre-em-co-duong-iq-susu-80g-202310161053515838.jpg",
          "https://cdn.tgdd.vn/Products/Images/7558/317074/bhx/thung-48-hop-sua-chua-cho-tre-em-co-duong-iq-susu-80g-202310161053510493.jpg",
          "https://cdn.tgdd.vn/Products/Images/7558/317074/bhx/thung-48-hop-sua-chua-cho-tre-em-co-duong-iq-susu-80g-202310161053391662.jpg",
        ],
      },
      {
        category_id: categories[16]._id, // Sữa chua
        name: "Lốc 4 hộp vàng sữa hương vani Monte 55g",
        price: 22000,
        original_price: 20000,
        in_stock: 85,
        status: "active",
        description:
          "Lốc 4 hộp vàng sữa hương vani Monte 55g, hương vị vani thơm ngon, tốt cho tiêu hóa.",
        images: [
          "https://cdn.tgdd.vn/Products/Images/7558/207651/bhx/loc-4-hop-vang-sua-vani-monte-55g-201907290829096920.jpg",
          "https://cdnv2.tgdd.vn/bhx-static/bhx/Products/Images/7558/207651/bhx/loc-4-hop-vang-sua-vani-monte-55g_202503260926389844.jpg",
          "https://cdn.tgdd.vn/Products/Images/7558/207651/bhx/loc-4-hop-vang-sua-vani-monte-55g-201907290829140933.jpg",
          "https://cdn.tgdd.vn/Products/Images/7558/207651/bhx/sellingpoint.jpg",
        ],
      },
      {
        category_id: categories[16]._id, // Sữa chua
        name: "Lốc 4 hộp vàng sữa socola Monte 55g",
        price: 22000,
        original_price: 20000,
        in_stock: 80,
        status: "active",
        description:
          "Lốc 4 hộp vàng sữa socola Monte 55g, hương vị socola đậm đà, tốt cho tiêu hóa.",
        images: [
          "https://cdnv2.tgdd.vn/bhx-static/bhx/Products/Images/7558/203442/bhx/loc-4-hop-vang-sua-socola-monte-55g_202503251649052901.jpg",
          "https://cdn.tgdd.vn/Products/Images/7558/203442/bhx/loc-4-hop-vang-sua-monte-socola-55g-202308041557177527.jpg",
          "https://cdn.tgdd.vn/Products/Images/7558/203442/bhx/loc-4-hop-vang-sua-monte-socola-55g-202308041557185746.jpg",
          "https://cdn.tgdd.vn/Products/Images/7558/203442/bhx/loc-4-hop-vang-sua-monte-socola-55g-202308041557196778.jpg",
          "https://cdn.tgdd.vn/Products/Images/7558/203442/bhx/loc-4-hop-vang-sua-socola-monte-55g-202309251658457687.jpg",
        ],
      },
      {
        category_id: categories[16]._id, // Sữa chua
        name: "Lốc 4 hộp sữa chua Vinamilk trái cây 100g",
        price: 35000,
        original_price: 32000,
        in_stock: 90,
        status: "active",
        description:
          "Lốc 4 hộp sữa chua Vinamilk trái cây 100g, hương vị trái cây tự nhiên, tốt cho tiêu hóa.",
        images: [
          "https://cdn.tgdd.vn/Products/Images/7558/197951/bhx/loc-4-hop-sua-chua-vinamilk-trai-cay-100g-202407241605187135.jpg",
          "https://cdn.tgdd.vn/Products/Images/7558/197951/bhx/loc-4-hop-sua-chua-vinamilk-trai-cay-100g-202407241605189822.jpg",
          "https://cdn.tgdd.vn/Products/Images/7558/197951/bhx/loc-4-hop-sua-chua-vinamilk-trai-cay-100g-202303241442417515.jpg",
          "https://cdn.tgdd.vn/Products/Images/7558/197951/bhx/loc-4-hop-sua-chua-vinamilk-trai-cay-100g-202407241605184740.jpg",
        ],
      },
      // Gạo sản phẩm
      {
        category_id: categories[11]._id, // Gạo
        name: "Gạo thơm Vua Gạo ST25+ túi 5kg",
        price: 85000,
        original_price: 75000,
        in_stock: 60,
        status: "active",
        description:
          "Gạo thơm Vua Gạo ST25+ túi 5kg, hạt gạo dài, thơm ngon, chất lượng cao.",
        images: [
          "https://cdnv2.tgdd.vn/bhx-static/bhx/Products/Images/2513/332640/bhx/thiet-ke-chua-co-ten-2024-12-02t101141121_202412021017531362.jpg",
          "https://cdnv2.tgdd.vn/bhx-static/bhx/Products/Images/2513/332640/bhx/thiet-ke-chua-co-ten-2024-12-12t093138530_202412120932036499.jpg",
          "https://cdnv2.tgdd.vn/bhx-static/bhx/Products/Images/2513/332640/bhx/thiet-ke-chua-co-ten-2024-12-12t092511764_202412120925334751.jpg",
          "https://cdnv2.tgdd.vn/bhx-static/bhx/Products/Images/2513/332640/bhx/thiet-ke-chua-co-ten-2024-12-12t093042713_202412120930516264.jpg",
        ],
      },
      {
        category_id: categories[11]._id, // Gạo
        name: "Gạo thơm A An ST25+ túi 5kg",
        price: 90000,
        original_price: 80000,
        in_stock: 50,
        status: "active",
        description:
          "Gạo thơm A An ST25+ túi 5kg, hạt gạo dài, thơm ngon, chất lượng cao.",
        images: [
          "https://cdnv2.tgdd.vn/bhx-static/bhx/Products/Images/2513/332920/bhx/thiet-ke-chua-co-ten-2024-12-17t142205261_202412171422573674.jpg",
          "https://cdnv2.tgdd.vn/bhx-static/bhx/Products/Images/2513/332920/bhx/thiet-ke-chua-co-ten-2024-12-17t142238369_202412171422575934.jpg",
          "https://cdnv2.tgdd.vn/bhx-static/bhx/Products/Images/2513/332920/bhx/preview_202412241548525787.jpg",
        ],
      },
      {
        category_id: categories[11]._id, // Gạo
        name: "Gạo thơm Neptune ST25 Extra túi 5kg",
        price: 95000,
        original_price: 85000,
        in_stock: 45,
        status: "active",
        description:
          "Gạo thơm Neptune ST25 Extra túi 5kg, hạt gạo dài, thơm ngon, chất lượng cao.",
        images: [
          "https://cdn.tgdd.vn/Products/Images/2513/324448/bhx/gao-thom-neptune-st25-extra-tui-5kg-202403300918336881.jpg",
          "https://cdn.tgdd.vn/Products/Images/2513/324448/bhx/gao-thom-neptune-st25-extra-tui-5kg-202403300918339138.jpg",
          "https://cdn.tgdd.vn/Products/Images/2513/324448/bhx/gao-thom-neptune-st25-extra-tui-5kg-202403300918341944.jpg",
          "https://cdn.tgdd.vn/Products/Images/2513/324448/bhx/gao-thom-neptune-st25-extra-tui-5kg-202403300918346554.jpg",
        ],
      },
      {
        category_id: categories[11]._id, // Gạo
        name: "Gạo thơm Vua Gạo ST25+ túi 10kg",
        price: 160000,
        original_price: 140000,
        in_stock: 30,
        status: "active",
        description:
          "Gạo thơm Vua Gạo ST25+ túi 10kg, hạt gạo dài, thơm ngon, chất lượng cao.",
        images: [
          "https://cdnv2.tgdd.vn/bhx-static/bhx/Products/Images/2513/220504/bhx/thiet-ke-chua-co-ten-2024-12-03t094114079_202412030942196840.jpg",
          "https://cdnv2.tgdd.vn/bhx-static/bhx/Products/Images/2513/220504/bhx/thiet-ke-chua-co-ten-2024-12-03t094240478_202412030942445737.jpg",
        ],
      },
      {
        category_id: categories[11]._id, // Gạo
        name: "Gạo trắng Thiên Nhật túi 5kg",
        price: 65000,
        original_price: 58000,
        in_stock: 80,
        status: "active",
        description:
          "Gạo trắng Thiên Nhật túi 5kg, hạt gạo trắng, dẻo ngon, chất lượng tốt.",
        images: [
          "https://cdn.tgdd.vn/Products/Images/2513/282955/bhx/gao-trang-thien-nhat-tui-5kg-202404080937017302.jpg",
          "https://cdn.tgdd.vn/Products/Images/2513/282955/bhx/gao-trang-thien-nhat-tui-5kg-202404080937020799.jpg",
          "https://cdn.tgdd.vn/Products/Images/2513/282955/bhx/gao-trang-thien-nhat-tui-5kg-202404080937026874.jpg",
          "https://cdnv2.tgdd.vn/bhx-static/bhx/Products/Images/2513/282955/bhx/gao-trang-thien-nhat-tui-5kg_202504090856555554.jpg",
        ],
      },
      {
        category_id: categories[11]._id, // Gạo
        name: "Gạo lứt tím Vĩnh Hiền túi 1kg",
        price: 25000,
        original_price: 22000,
        in_stock: 100,
        status: "active",
        description:
          "Gạo lứt tím Vĩnh Hiền túi 1kg, hạt gạo lứt tím, giàu dinh dưỡng, tốt cho sức khỏe.",
        images: [
          "https://cdn.tgdd.vn/Products/Images/2513/262354/bhx/gao-lut-tim-vinh-hien-tui-1kg-202112151155237174.jpg",
          "https://cdn.tgdd.vn/Products/Images/2513/262354/bhx/gao-lut-tim-vinh-hien-tui-1kg-202112151155242817.jpg",
          "https://cdn.tgdd.vn/Products/Images/2513/262354/bhx/gao-lut-tim-vinh-hien-tui-1kg-202112151155252908.jpg",
          "https://cdn.tgdd.vn/Products/Images/2513/262354/bhx/sellingpoint.jpg",
        ],
      },
      {
        category_id: categories[11]._id, // Gạo
        name: "Gạo lứt hỗn hợp 10 loại hạt Ong Của hộp 1kg",
        price: 35000,
        original_price: 32000,
        in_stock: 70,
        status: "active",
        description:
          "Gạo lứt hỗn hợp 10 loại hạt Ong Của hộp 1kg, giàu dinh dưỡng, tốt cho sức khỏe.",
        images: [
          "https://cdnv2.tgdd.vn/bhx-static/bhx/Products/Images/2513/338436/bhx/anh-slide-2_202505230905427843.jpg",
          "https://cdnv2.tgdd.vn/bhx-static/bhx/Products/Images/2513/338436/bhx/anh-slide-1_202505230905433797.jpg",
          "https://cdnv2.tgdd.vn/bhx-static/bhx/Products/Images/2513/338436/bhx/anh-slide_202505230905440612.jpg",
          "https://cdnv2.tgdd.vn/bhx-static/bhx/Products/Images/2513/338436/bhx/anh-slide-3_202505230905418658.jpg",
        ],
      },
      {
        category_id: categories[11]._id, // Gạo
        name: "Gạo Nhật Shinichi Vua Gạo túi 5kg",
        price: 120000,
        original_price: 100000,
        in_stock: 40,
        status: "active",
        description:
          "Gạo Nhật Shinichi Vua Gạo túi 5kg, hạt gạo dài, thơm ngon, chất lượng cao.",
        images: [
          "https://cdn.tgdd.vn/Products/Images/2513/236057/bhx/gao-nhat-shinichi-vua-gao-tui-5kg-202103131637374593.jpg",
          "https://cdn.tgdd.vn/Products/Images/2513/236057/bhx/gao-nhat-shinichi-vua-gao-tui-5kg-202103131637378266.jpg",
          "https://cdn.tgdd.vn/Products/Images/2513/236057/bhx/gao-nhat-shinichi-vua-gao-tui-5kg-202103131637380957.jpg",
          "https://cdn.tgdd.vn/Products/Images/2513/236057/bhx/gao-nhat-shinichi-vua-gao-tui-5kg-202103131637387421.jpg",
          "https://cdn.tgdd.vn/Products/Images/2513/236057/bhx/sellingpoint.jpg",
        ],
      },
      {
        category_id: categories[11]._id, // Gạo
        name: "Gạo lứt đỏ Vĩnh Hiền túi 1kg",
        price: 25000,
        original_price: 22000,
        in_stock: 90,
        status: "active",
        description:
          "Gạo lứt đỏ Vĩnh Hiền túi 1kg, hạt gạo lứt đỏ, giàu dinh dưỡng, tốt cho sức khỏe.",
        images: [
          "https://cdn.tgdd.vn/Products/Images/2513/229221/bhx/gao-lut-do-vinh-hien-tui-1kg-202010171224597621.jpg",
          "https://cdn.tgdd.vn/Products/Images/2513/229221/bhx/gao-lut-do-vinh-hien-tui-1kg-202010171225000994.jpg",
          "https://cdn.tgdd.vn/Products/Images/2513/229221/bhx/gao-lut-do-vinh-hien-tui-1kg-202010171225005146.jpg",
          "https://cdn.tgdd.vn/Products/Images/2513/229221/bhx/gao-lut-do-vinh-hien-tui-1kg-202010171225008919.jpg",
          "https://cdn.tgdd.vn/Products/Images/2513/229221/bhx/sellingpoint.jpg",
        ],
      },
      {
        category_id: categories[11]._id, // Gạo
        name: "Nếp chum Vĩnh Hiền túi 1kg",
        price: 30000,
        original_price: 27000,
        in_stock: 75,
        status: "active",
        description:
          "Nếp chum Vĩnh Hiền túi 1kg, hạt nếp chum, dẻo ngon, thích hợp làm xôi.",
        images: [
          "https://cdn.tgdd.vn/Products/Images/2513/229220/bhx/nep-chum-vinh-hien-tui-1kg-202009291012214293.jpg",
          "https://cdn.tgdd.vn/Products/Images/2513/229220/bhx/nep-chum-vinh-hien-tui-1kg-202009291012218836.jpg",
          "https://cdn.tgdd.vn/Products/Images/2513/229220/bhx/nep-chum-vinh-hien-tui-1kg-202009291012221888.jpg",
          "https://cdn.tgdd.vn/Products/Images/2513/229220/bhx/nep-chum-vinh-hien-tui-1kg-202009291012227201.jpg",
          "https://cdn.tgdd.vn/Products/Images/2513/229220/bhx/sellingpoint.jpg",
        ],
      },
      {
        category_id: categories[11]._id, // Gạo
        name: "Nếp cái hoa vàng Vĩnh Hiền túi 1kg",
        price: 28000,
        original_price: 25000,
        in_stock: 80,
        status: "active",
        description:
          "Nếp cái hoa vàng Vĩnh Hiền túi 1kg, hạt nếp cái hoa vàng, dẻo ngon, thích hợp làm xôi.",
        images: [
          "https://cdn.tgdd.vn/Products/Images/2513/227004/bhx/nep-cai-hoa-vang-vinh-hien-tui-1kg-202008150913276084.jpg",
          "https://cdn.tgdd.vn/Products/Images/2513/227004/bhx/nep-cai-hoa-vang-vinh-hien-tui-1kg-202008150913278996.jpg",
          "https://cdn.tgdd.vn/Products/Images/2513/227004/bhx/nep-cai-hoa-vang-vinh-hien-tui-1kg-202008150913284749.jpg",
          "https://cdn.tgdd.vn/Products/Images/2513/227004/bhx/sellingpoint.jpg",
        ],
      },
      {
        category_id: categories[11]._id, // Gạo
        name: "Nếp sáp Vĩnh Hiền túi 1kg",
        price: 32000,
        original_price: 29000,
        in_stock: 65,
        status: "active",
        description:
          "Nếp sáp Vĩnh Hiền túi 1kg, hạt nếp sáp, dẻo ngon, thích hợp làm xôi.",
        images: [
          "https://cdn.tgdd.vn/Products/Images/2513/225003/bhx/nep-sap-vinh-hien-tui-1kg-202006251846038687.jpg",
          "https://cdn.tgdd.vn/Products/Images/2513/225003/bhx/nep-sap-vinh-hien-tui-1kg-202006251846045041.jpg",
          "https://cdn.tgdd.vn/Products/Images/2513/225003/bhx/nep-sap-vinh-hien-tui-1kg-202006251846060917.jpg",
          "https://cdn.tgdd.vn/Products/Images/2513/225003/bhx/sellingpoint.jpg",
        ],
      },
      {
        category_id: categories[11]._id, // Gạo
        name: "Gạo lứt Vĩnh Hiền túi 2kg",
        price: 45000,
        original_price: 40000,
        in_stock: 55,
        status: "active",
        description:
          "Gạo lứt Vĩnh Hiền túi 2kg, hạt gạo lứt, giàu dinh dưỡng, tốt cho sức khỏe.",
        images: [
          "https://cdn.tgdd.vn/Products/Images/2513/216076/bhx/gao-lut-vinh-hien-tui-2kg-201912101414494008.jpg",
          "https://cdn.tgdd.vn/Products/Images/2513/216076/bhx/gao-lut-vinh-hien-tui-2kg-201912101414496630.jpg",
          "https://cdn.tgdd.vn/Products/Images/2513/216076/bhx/gao-lut-vinh-hien-tui-2kg-201912101414507837.jpg",
          "https://cdn.tgdd.vn/Products/Images/2513/216076/bhx/gao-lut-vinh-hien-tui-2kg-201912101414523627.jpg",
          "https://cdn.tgdd.vn/Products/Images/2513/216076/bhx/sellingpoint.jpg",
        ],
      },
      {
        category_id: categories[11]._id, // Gạo
        name: "Gạo thơm Vua Gạo Làng Tạ túi 2kg",
        price: 35000,
        original_price: 32000,
        in_stock: 85,
        status: "active",
        description:
          "Gạo thơm Vua Gạo Làng Tạ túi 2kg, hạt gạo dài, thơm ngon, chất lượng tốt.",
        images: [
          "https://cdn.tgdd.vn/Products/Images/2513/159559/bhx/gao-thom-vua-gao-lang-ta-tui-2kg-202105041530202000.jpeg",
          "https://cdn.tgdd.vn/Products/Images/2513/159559/bhx/gao-thom-vua-gao-lang-ta-tui-2kg-202105041530205743.jpeg",
          "https://cdn.tgdd.vn/Products/Images/2513/159559/bhx/gao-thom-vua-gao-lang-ta-tui-2kg-202105041530205743.jpeg",
          "https://cdn.tgdd.vn/Products/Images/2513/159559/bhx/gao-thom-vua-gao-lang-ta-tui-2kg-202105041530209385.jpeg",
        ],
      },
      // Nước ngọt sản phẩm
      {
        category_id: categories[7]._id, // Nước ngọt
        name: "Thùng 24 chai nước ngọt Coca Cola 390ml",
        price: 180000,
        original_price: 160000,
        in_stock: 50,
        status: "active",
        description:
          "Thùng 24 chai nước ngọt Coca Cola 390ml, hương vị đặc trưng, sảng khoái. Thích hợp cho các buổi tiệc và giải khát.",
        images: [
          "https://cdnv2.tgdd.vn/bhx-static/bhx/Products/Images/2443/195225/bhx/o87ih_202410121037590192.jpg",
          "https://cdnv2.tgdd.vn/bhx-static/bhx/Products/Images/2443/195225/bhx/u7uo9_202410121037592215.jpg",
          "https://cdnv2.tgdd.vn/bhx-static/bhx/Products/Images/2443/195225/bhx/kiu8i_202410121037594115.jpg",
        ],
      },
      {
        category_id: categories[7]._id, // Nước ngọt
        name: "Nước ngọt có ga Coca Cola chai 390ml",
        price: 8000,
        original_price: 7000,
        in_stock: 200,
        status: "active",
        description:
          "Nước ngọt có ga Coca Cola chai 390ml, hương vị đặc trưng, sảng khoái. Thích hợp cho giải khát.",
        images: [
          "https://cdnv2.tgdd.vn/bhx-static/bhx/Products/Images/2443/76450/bhx/u7uo9_202410121035383451.jpg",
          "https://cdnv2.tgdd.vn/bhx-static/bhx/Products/Images/2443/76450/bhx/kiu8i_202410121035385217.jpg",
        ],
      },
      {
        category_id: categories[7]._id, // Nước ngọt
        name: "6 chai nước ngọt Coca Cola 390ml",
        price: 45000,
        original_price: 40000,
        in_stock: 100,
        status: "active",
        description:
          "6 chai nước ngọt Coca Cola 390ml, hương vị đặc trưng, sảng khoái. Thích hợp cho gia đình.",
        images: [
          "https://cdnv2.tgdd.vn/bhx-static/bhx/Products/Images/2443/88651/bhx/rh6y45_202410121036392022.jpg",
          "https://cdnv2.tgdd.vn/bhx-static/bhx/Products/Images/2443/88651/bhx/u7uo9_202410121036394090.jpg",
          "https://cdnv2.tgdd.vn/bhx-static/bhx/Products/Images/2443/88651/bhx/kiu8i_202410121036396138.jpg",
        ],
      },
      {
        category_id: categories[7]._id, // Nước ngọt
        name: "Thùng 24 lon nước ngọt Pepsi không calo 320ml",
        price: 180000,
        original_price: 160000,
        in_stock: 45,
        status: "active",
        description:
          "Thùng 24 lon nước ngọt Pepsi không calo 320ml, hương vị đặc trưng, không calo. Thích hợp cho người ăn kiêng.",
        images: [
          "https://cdn.tgdd.vn/Products/Images/2443/227314/bhx/thung-24-lon-nuoc-ngot-pepsi-khong-calo-320ml-202405140932308541.jpg",
          "https://cdn.tgdd.vn/Products/Images/2443/227314/bhx/thung-24-lon-nuoc-ngot-pepsi-khong-calo-320ml-202405140932311005.jpg",
          "https://cdn.tgdd.vn/Products/Images/2443/227314/bhx/thung-24-lon-nuoc-ngot-pepsi-khong-calo-320ml-202405140932314124.jpg",
          "https://cdn.tgdd.vn/Products/Images/2443/227314/bhx/thung-24-lon-nuoc-ngot-pepsi-khong-calo-320ml-202405140932318424.jpg",
        ],
      },
      {
        category_id: categories[7]._id, // Nước ngọt
        name: "Nước ngọt Pepsi không calo lon 320ml",
        price: 8000,
        original_price: 7000,
        in_stock: 180,
        status: "active",
        description:
          "Nước ngọt Pepsi không calo lon 320ml, hương vị đặc trưng, không calo. Thích hợp cho người ăn kiêng.",
        images: [
          "https://cdn.tgdd.vn/Products/Images/2443/227312/bhx/nuoc-ngot-pepsi-khong-calo-lon-320ml-202405140927583779.jpg",
          "https://cdn.tgdd.vn/Products/Images/2443/227312/bhx/nuoc-ngot-pepsi-khong-calo-lon-320ml-202405140927585301.jpg",
          "https://cdn.tgdd.vn/Products/Images/2443/227312/bhx/nuoc-ngot-pepsi-khong-calo-lon-320ml-202405140927587680.jpg",
        ],
      },
      {
        category_id: categories[7]._id, // Nước ngọt
        name: "6 lon nước ngọt Pepsi không calo 320ml",
        price: 45000,
        original_price: 40000,
        in_stock: 90,
        status: "active",
        description:
          "6 lon nước ngọt Pepsi không calo 320ml, hương vị đặc trưng, không calo. Thích hợp cho gia đình.",
        images: [
          "https://cdn.tgdd.vn/Products/Images/2443/227313/bhx/6-lon-nuoc-ngot-pepsi-khong-calo-320ml-202405140930319101.jpg",
          "https://cdn.tgdd.vn/Products/Images/2443/227313/bhx/6-lon-nuoc-ngot-pepsi-khong-calo-320ml-202405140930321493.jpg",
          "https://cdn.tgdd.vn/Products/Images/2443/227313/bhx/6-lon-nuoc-ngot-pepsi-khong-calo-320ml-202405140930324415.jpg",
        ],
      },
      {
        category_id: categories[7]._id, // Nước ngọt
        name: "Thùng 24 lon nước ngọt Coca Cola 320ml",
        price: 180000,
        original_price: 160000,
        in_stock: 55,
        status: "active",
        description:
          "Thùng 24 lon nước ngọt Coca Cola 320ml, hương vị đặc trưng, sảng khoái. Thích hợp cho các buổi tiệc.",
        images: [
          "https://cdn.tgdd.vn/Products/Images/2443/87880/bhx/thung-24-lon-nuoc-ngot-coca-cola-320ml-202304170912479439.jpg",
          "https://cdnv2.tgdd.vn/bhx-static/bhx/Products/Images/2443/87880/bhx/nuoc-ngot-coke-sleek-330ml-thung-24-lon_202503111648310125.jpg",
          "https://cdn.tgdd.vn/Products/Images/2443/87880/bhx/thung-24-lon-nuoc-ngot-coca-cola-320ml-202304131109287672.jpg",
          "https://cdn.tgdd.vn/Products/Images/2443/87880/bhx/thung-24-lon-nuoc-ngot-coca-cola-320ml-202304131109289909.jpg",
        ],
      },
      {
        category_id: categories[7]._id, // Nước ngọt
        name: "Nước ngọt Coca Cola lon 320ml",
        price: 8000,
        original_price: 7000,
        in_stock: 220,
        status: "active",
        description:
          "Nước ngọt Coca Cola lon 320ml, hương vị đặc trưng, sảng khoái. Thích hợp cho giải khát.",
        images: [
          "https://cdn.tgdd.vn/Products/Images/2443/76451/bhx/nuoc-ngot-coca-cola-lon-320ml-202304131107525481.jpg",
          "https://cdn.tgdd.vn/Products/Images/2443/76451/bhx/nuoc-ngot-coca-cola-lon-320ml-202304131107527790.jpg",
          "https://cdn.tgdd.vn/Products/Images/2443/76451/bhx/nuoc-ngot-coca-cola-lon-320ml-202304131107529957.jpg",
          "https://cdn.tgdd.vn/Products/Images/2443/76451/bhx/nuoc-ngot-coca-cola-lon-320ml-202304131107532011.jpg",
        ],
      },
      {
        category_id: categories[7]._id, // Nước ngọt
        name: "6 lon nước ngọt Coca Cola 320ml",
        price: 45000,
        original_price: 40000,
        in_stock: 110,
        status: "active",
        description:
          "6 lon nước ngọt Coca Cola 320ml, hương vị đặc trưng, sảng khoái. Thích hợp cho gia đình.",
        images: [
          "https://cdn.tgdd.vn/Products/Images/2443/125398/bhx/6-lon-nuoc-ngot-coca-cola-320ml-202303181532309738.jpg",
          "https://cdn.tgdd.vn/Products/Images/2443/125398/bhx/6-lon-nuoc-ngot-coca-cola-320ml-202304131108497884.jpg",
          "https://cdn.tgdd.vn/Products/Images/2443/125398/bhx/6-lon-nuoc-ngot-coca-cola-320ml-202304131108500275.jpg",
          "https://cdn.tgdd.vn/Products/Images/2443/125398/bhx/6-lon-nuoc-ngot-coca-cola-320ml-202304131108502335.jpg",
        ],
      },
      {
        category_id: categories[7]._id, // Nước ngọt
        name: "Thùng 24 lon nước ngọt Sprite hương chanh 320ml",
        price: 180000,
        original_price: 160000,
        in_stock: 40,
        status: "active",
        description:
          "Thùng 24 lon nước ngọt Sprite hương chanh 320ml, hương vị chanh tươi mát. Thích hợp cho giải khát.",
        images: [
          "https://cdn.tgdd.vn/Products/Images/2443/194417/bhx/thung-24-lon-nuoc-ngot-sprite-huong-chanh-320ml-202407121623253988.jpg",
          "https://cdn.tgdd.vn/Products/Images/2443/194417/bhx/thung-24-lon-nuoc-ngot-sprite-huong-chanh-320ml-202407121623260163.jpg",
          "https://cdn.tgdd.vn/Products/Images/2443/194417/bhx/thung-24-lon-nuoc-ngot-sprite-huong-chanh-320ml-202407121623266808.jpg",
          "https://cdn.tgdd.vn/Products/Images/2443/194417/bhx/thung-24-lon-nuoc-ngot-sprite-huong-chanh-320ml-202407121623274580.jpg",
          "https://cdn.tgdd.vn/Products/Images/2443/194417/bhx/thung-24-lon-nuoc-ngot-sprite-huong-chanh-320ml-202407121623285101.jpg",
        ],
      },
      {
        category_id: categories[7]._id, // Nước ngọt
        name: "Nước ngọt Sprite hương chanh lon 320ml",
        price: 8000,
        original_price: 7000,
        in_stock: 190,
        status: "active",
        description:
          "Nước ngọt Sprite hương chanh lon 320ml, hương vị chanh tươi mát. Thích hợp cho giải khát.",
        images: [
          "https://cdn.tgdd.vn/Products/Images/2443/85146/bhx/nuoc-ngot-sprite-huong-chanh-lon-320ml-202306200909131864.jpg",
          "https://cdn.tgdd.vn/Products/Images/2443/85146/bhx/nuoc-ngot-sprite-huong-chanh-lon-320ml-202306200909134750.jpg",
          "https://cdn.tgdd.vn/Products/Images/2443/85146/bhx/nuoc-ngot-sprite-huong-chanh-lon-320ml-202306200909137681.jpg",
          "https://cdn.tgdd.vn/Products/Images/2443/85146/bhx/nuoc-ngot-sprite-huong-chanh-lon-320ml-202306200909141431.jpg",
        ],
      },
      {
        category_id: categories[7]._id, // Nước ngọt
        name: "6 lon nước ngọt Sprite hương chanh 320ml",
        price: 45000,
        original_price: 40000,
        in_stock: 95,
        status: "active",
        description:
          "6 lon nước ngọt Sprite hương chanh 320ml, hương vị chanh tươi mát. Thích hợp cho gia đình.",
        images: [
          "https://cdn.tgdd.vn/Products/Images/2443/195224/bhx/6-lon-nuoc-ngot-sprite-huong-chanh-320ml-202306200911339539.jpg",
          "https://cdn.tgdd.vn/Products/Images/2443/195224/bhx/6-lon-nuoc-ngot-sprite-huong-chanh-320ml-202306200911345909.jpg",
          "https://cdn.tgdd.vn/Products/Images/2443/195224/bhx/6-lon-nuoc-ngot-sprite-huong-chanh-320ml-202306200911349006.jpg",
          "https://cdn.tgdd.vn/Products/Images/2443/195224/bhx/6-lon-nuoc-ngot-sprite-huong-chanh-320ml-202306200911352214.jpg",
        ],
      },
      {
        category_id: categories[7]._id, // Nước ngọt
        name: "Thùng 24 lon nước ngọt Fanta hương cam 320ml",
        price: 180000,
        original_price: 160000,
        in_stock: 35,
        status: "active",
        description:
          "Thùng 24 lon nước ngọt Fanta hương cam 320ml, hương vị cam tươi mát. Thích hợp cho giải khát.",
        images: [
          "https://cdnv2.tgdd.vn/bhx-static/bhx/Products/Images/2443/91176/bhx/z-3_202411041457060787.jpg",
          "https://cdnv2.tgdd.vn/bhx-static/bhx/Products/Images/2443/91176/bhx/z-2_202411041457065358.jpg",
        ],
      },
      {
        category_id: categories[7]._id, // Nước ngọt
        name: "Nước ngọt Fanta hương cam lon 320ml",
        price: 8000,
        original_price: 7000,
        in_stock: 170,
        status: "active",
        description:
          "Nước ngọt Fanta hương cam lon 320ml, hương vị cam tươi mát. Thích hợp cho giải khát.",
        images: [
          "https://cdnv2.tgdd.vn/bhx-static/bhx/Products/Images/2443/76453/bhx/z-2_202411041431130825.jpg",
          "https://cdnv2.tgdd.vn/bhx-static/bhx/Products/Images/2443/76453/bhx/z_202411041431127560.jpg",
        ],
      },
      {
        category_id: categories[7]._id, // Nước ngọt
        name: "6 lon nước ngọt Fanta hương cam 320ml",
        price: 45000,
        original_price: 40000,
        in_stock: 85,
        status: "active",
        description:
          "6 lon nước ngọt Fanta hương cam 320ml, hương vị cam tươi mát. Thích hợp cho gia đình.",
        images: [
          "https://cdnv2.tgdd.vn/bhx-static/bhx/Products/Images/2443/193332/bhx/z-29_202411041516025891.jpg",
          "https://cdnv2.tgdd.vn/bhx-static/bhx/Products/Images/2443/193332/bhx/z-2_202411041516031783.jpg",
          "https://cdnv2.tgdd.vn/bhx-static/bhx/Products/Images/2443/193332/bhx/z_202411041516021448.jpg",
        ],
      },
      // Sản phẩm từ biến thể nước ngọt
      {
        category_id: categories[7]._id, // Nước ngọt
        name: "Nước ngọt Coca Cola chai 390ml",
        price: 8000,
        original_price: 7000,
        in_stock: 200,
        status: "active",
        description:
          "Nước ngọt Coca Cola chai 390ml, hương vị đặc trưng, sảng khoái. Thích hợp cho giải khát cá nhân.",
        images: [
          "https://cdnv2.tgdd.vn/bhx-static/bhx/Products/Images/2443/76450/bhx/vrfgbyu78i7_202410121035379000.jpg",
          "https://cdnv2.tgdd.vn/bhx-static/bhx/Products/Images/2443/76450/bhx/kiu8i_202410121035385217.jpg",
        ],
      },
      {
        category_id: categories[7]._id, // Nước ngọt
        name: "Nước ngọt Pepsi không calo lon 320ml",
        price: 8000,
        original_price: 7000,
        in_stock: 180,
        status: "active",
        description:
          "Nước ngọt Pepsi không calo lon 320ml, hương vị đặc trưng, không calo. Thích hợp cho người ăn kiêng.",
        images: [
          "https://cdn.tgdd.vn/Products/Images/2443/227312/bhx/nuoc-ngot-pepsi-khong-calo-lon-320ml-202405140927583779.jpg",
          "https://cdn.tgdd.vn/Products/Images/2443/227312/bhx/nuoc-ngot-pepsi-khong-calo-lon-320ml-202405140927585301.jpg",
          "https://cdn.tgdd.vn/Products/Images/2443/227312/bhx/nuoc-ngot-pepsi-khong-calo-lon-320ml-202405140927587680.jpg",
        ],
      },
      {
        category_id: categories[7]._id, // Nước ngọt
        name: "Nước ngọt Coca Cola lon 320ml",
        price: 8000,
        original_price: 7000,
        in_stock: 220,
        status: "active",
        description:
          "Nước ngọt Coca Cola lon 320ml, hương vị đặc trưng, sảng khoái. Thích hợp cho giải khát cá nhân.",
        images: [
          "https://cdn.tgdd.vn/Products/Images/2443/76451/bhx/nuoc-ngot-coca-cola-lon-320ml-202304131107525481.jpg",
          "https://cdn.tgdd.vn/Products/Images/2443/76451/bhx/nuoc-ngot-coca-cola-lon-320ml-202304131107527790.jpg",
          "https://cdn.tgdd.vn/Products/Images/2443/76451/bhx/nuoc-ngot-coca-cola-lon-320ml-202304131107529957.jpg",
          "https://cdn.tgdd.vn/Products/Images/2443/76451/bhx/nuoc-ngot-coca-cola-lon-320ml-202304131107532011.jpg",
        ],
      },
      {
        category_id: categories[7]._id, // Nước ngọt
        name: "Nước ngọt Sprite hương chanh lon 320ml",
        price: 8000,
        original_price: 7000,
        in_stock: 190,
        status: "active",
        description:
          "Nước ngọt Sprite hương chanh lon 320ml, hương vị chanh tươi mát. Thích hợp cho giải khát cá nhân.",
        images: [
          "https://cdn.tgdd.vn/Products/Images/2443/85146/bhx/nuoc-ngot-sprite-huong-chanh-lon-320ml-202306200909131864.jpg",
          "https://cdn.tgdd.vn/Products/Images/2443/85146/bhx/nuoc-ngot-sprite-huong-chanh-lon-320ml-202306200909134750.jpg",
          "https://cdn.tgdd.vn/Products/Images/2443/85146/bhx/nuoc-ngot-sprite-huong-chanh-lon-320ml-202306200909137681.jpg",
          "https://cdn.tgdd.vn/Products/Images/2443/85146/bhx/nuoc-ngot-sprite-huong-chanh-lon-320ml-202306200909141431.jpg",
        ],
      },
      {
        category_id: categories[7]._id, // Nước ngọt
        name: "Nước ngọt Fanta hương cam lon 320ml",
        price: 8000,
        original_price: 7000,
        in_stock: 170,
        status: "active",
        description:
          "Nước ngọt Fanta hương cam lon 320ml, hương vị cam tươi mát. Thích hợp cho giải khát cá nhân.",
        images: [
          "https://cdnv2.tgdd.vn/bhx-static/bhx/Products/Images/2443/76453/bhx/z-2_202411041431130825.jpg",
          "https://cdnv2.tgdd.vn/bhx-static/bhx/Products/Images/2443/76453/bhx/z_202411041431127560.jpg",
        ],
      },
      // Sản phẩm từ biến thể gạo
      {
        category_id: categories[11]._id, // Gạo
        name: "Gạo thơm Vua Gạo ST25+ túi 2kg",
        price: 42000,
        original_price: 38000,
        in_stock: 120,
        status: "active",
        description:
          "Gạo thơm Vua Gạo ST25+ túi 2kg, gạo thơm ngon nhất thế giới, đóng gói nhỏ tiện lợi cho gia đình nhỏ.",
        images: [
          "https://cdn.tgdd.vn/Products/Images/2513/159559/bhx/gao-thom-vua-gao-lang-ta-tui-2kg-202105041530202000.jpeg",
          "https://cdn.tgdd.vn/Products/Images/2513/159559/bhx/gao-thom-vua-gao-lang-ta-tui-2kg-202105041530205743.jpeg",
        ],
      },
      {
        category_id: categories[11]._id, // Gạo
        name: "Gạo thơm Vua Gạo ST25+ túi 10kg",
        price: 185000,
        original_price: 175000,
        in_stock: 45,
        status: "active",
        description:
          "Gạo thơm Vua Gạo ST25+ túi 10kg, gạo thơm ngon nhất thế giới, tiết kiệm cho gia đình đông người.",
        images: [
          "https://cdnv2.tgdd.vn/bhx-static/bhx/Products/Images/2513/332640/bhx/thiet-ke-chua-co-ten-2024-12-02t101141121_202412021017531362.jpg",
        ],
      },
      {
        category_id: categories[11]._id, // Gạo
        name: "Gạo A An ST25+ túi 2kg",
        price: 40000,
        original_price: 36000,
        in_stock: 100,
        status: "active",
        description:
          "Gạo A An ST25+ túi 2kg, gạo thơm ngon chất lượng cao, đóng gói nhỏ tiện lợi cho gia đình nhỏ.",
        images: [
          "https://cdnv2.tgdd.vn/bhx-static/bhx/Products/Images/2513/332920/bhx/bs9a9653_202412241548528679.jpg",
          "https://cdnv2.tgdd.vn/bhx-static/bhx/Products/Images/2513/332920/bhx/preview_202412241548525787.jpg",
        ],
      },
      // Sản phẩm từ biến thể kem
      {
        category_id: categories[15]._id, // Kem
        name: "Hộp 24 cây kem que Topten vanila Walls 55g",
        price: 280000,
        original_price: 240000,
        in_stock: 30,
        status: "active",
        description:
          "Hộp 24 cây kem que Topten vanila Walls 55g, tiết kiệm cho cửa hàng, quán cà phê.",
        images: [
          "https://cdn.tgdd.vn/Products/Images/7462/250227/bhx/kem-que-topten-vanila-walls-cay-55g-202308231020269976.jpg",
        ],
      },
      {
        category_id: categories[15]._id, // Kem
        name: "Hộp 24 cây kem que Topten socola Walls 55g",
        price: 280000,
        original_price: 240000,
        in_stock: 25,
        status: "active",
        description:
          "Hộp 24 cây kem que Topten socola Walls 55g, tiết kiệm cho cửa hàng, quán cà phê.",
        images: [
          "https://cdn.tgdd.vn/Products/Images/7462/250226/bhx/kem-que-topten-socola-walls-55g-202401031541273583.jpg",
        ],
      },
      // Sản phẩm từ biến thể sữa chua
      {
        category_id: categories[16]._id, // Sữa chua
        name: "Hộp sữa chua vàng hương vani Monte 55g",
        price: 4500,
        original_price: 4000,
        in_stock: 200,
        status: "active",
        description:
          "Hộp sữa chua vàng hương vani Monte 55g, hương vị vani thơm ngon, tươi mát.",
        images: [
          "https://cdn.tgdd.vn/Products/Images/7558/207651/bhx/loc-4-hop-vang-sua-vani-monte-55g-201907290829096920.jpg",
        ],
      },
      {
        category_id: categories[16]._id, // Sữa chua
        name: "Thùng 48 hộp sữa chua vàng hương vani Monte 55g",
        price: 200000,
        original_price: 190000,
        in_stock: 20,
        status: "active",
        description:
          "Thùng 48 hộp sữa chua vàng hương vani Monte 55g, tiết kiệm cho cửa hàng, siêu thị.",
        images: [
          "https://cdnv2.tgdd.vn/bhx-static/bhx/Products/Images/7558/207651/bhx/loc-4-hop-vang-sua-vani-monte-55g_202503260926389844.jpg",
        ],
      },
      // Danh mục Hạt nêm, bột ngọt, bột canh
      {
        category_id: categories[13]._id, // Hạt nêm, bột ngọt, bột canh
        name: "Hạt nêm vị heo Meizan thịt, xương ống, tủy & cà rốt gói 1kg",
        price: 85000,
        original_price: 75000,
        in_stock: 80,
        status: "active",
        description: "Hạt nêm vị heo Meizan thịt, xương ống, tủy & cà rốt gói 1kg, hương vị đậm đà từ thịt heo, xương ống, tủy và cà rốt. Tạo nên những món ăn thơm ngon, bổ dưỡng.",
        images: [
          "https://cdn.tgdd.vn/Products/Images/2806/271777/bhx/hat-nem-thit-xuong-ong-tuy-va-ca-rot-meizan-goi-1kg-202303240918455560.jpg",
          "https://cdnv2.tgdd.vn/bhx-static/bhx/Products/Images/2806/271777/bhx/271777-slidee_202409121449040291.jpg",
          "https://cdn.tgdd.vn/Products/Images/2806/271777/bhx/hat-nem-thit-xuong-ong-tuy-va-ca-rot-meizan-goi-1kg-202303311038505837.jpg",
          "https://cdn.tgdd.vn/Products/Images/2806/271777/bhx/hat-nem-thit-xuong-ong-tuy-va-ca-rot-meizan-goi-1kg-202303311038511366.jpg",
        ],
      },
      {
        category_id: categories[13]._id, // Hạt nêm, bột ngọt, bột canh
        name: "Bột ngọt Meizan gói 400g",
        price: 35000,
        original_price: 30000,
        in_stock: 120,
        status: "active",
        description: "Bột ngọt Meizan gói 400g, chất lượng cao, tăng cường hương vị cho món ăn. Sản phẩm từ thương hiệu uy tín, an toàn cho sức khỏe.",
        images: [
          "https://cdnv2.tgdd.vn/bhx-static/bhx/Products/Images/2806/330509/bhx/bot-ngot-meizan-goi-400g_202506041044240795.jpg",
          "https://cdnv2.tgdd.vn/bhx-static/bhx/Products/Images/2806/330509/bhx/330509-slide_202410101039134492.jpg",
        ],
      },
      {
        category_id: categories[13]._id, // Hạt nêm, bột ngọt, bột canh
        name: "Hạt nêm Ajinomoto tôm thịt gói 900g",
        price: 78000,
        original_price: 70000,
        in_stock: 90,
        status: "active",
        description: "Hạt nêm Ajinomoto tôm thịt gói 900g, kết hợp hương vị tôm và thịt đậm đà. Sản phẩm chất lượng từ thương hiệu Ajinomoto nổi tiếng.",
        images: [
          "https://cdn.tgdd.vn/Products/Images/2806/317594/bhx/hat-nem-ajinomoto-tom-thit-goi-900g-202311041324569766.jpg",
          "https://cdn.tgdd.vn/Products/Images/2806/317594/bhx/hat-nem-ajinomoto-tom-thit-goi-900g-202311041324573050.jpg",
          "https://cdn.tgdd.vn/Products/Images/2806/317594/bhx/hat-nem-ajinomoto-tom-thit-goi-900g-202311041324581538.jpg",
          "https://cdn.tgdd.vn/Products/Images/2806/317594/bhx/hat-nem-ajinomoto-tom-thit-goi-900g-202311041324584334.jpg",
        ],
      },
      {
        category_id: categories[13]._id, // Hạt nêm, bột ngọt, bột canh
        name: "Bột ngọt hạt lớn Ajinomoto gói 1kg",
        price: 55000,
        original_price: 50000,
        in_stock: 100,
        status: "active",
        description: "Bột ngọt hạt lớn Ajinomoto gói 1kg, sản phẩm chất lượng cao từ thương hiệu Ajinomoto uy tín. Tăng cường hương vị tự nhiên cho món ăn.",
        images: [
          "https://cdn.tgdd.vn/Products/Images/2806/77080/bhx/bot-ngot-hat-lon-ajinomoto-goi-1kg-202202110748243423.jpg",
          "https://cdn.tgdd.vn/Products/Images/2806/77080/bhx/bot-ngot-ajinomoto-goi-1kg-201912111050340356.jpg",
          "https://cdn.tgdd.vn/Products/Images/2806/77080/bhx/bot-ngot-ajinomoto-goi-1kg-201912111050342848.jpg",
        ],
      },
      {
        category_id: categories[13]._id, // Hạt nêm, bột ngọt, bột canh
        name: "Bột ngọt hạt lớn Ajinomoto gói 454g",
        price: 28000,
        original_price: 25000,
        in_stock: 150,
        status: "active",
        description: "Bột ngọt hạt lớn Ajinomoto gói 454g, kích thước tiện lợi cho gia đình. Chất lượng đảm bảo từ thương hiệu Ajinomoto.",
        images: [
          "https://cdn.tgdd.vn/Products/Images/2806/77081/bhx/bot-ngot-hat-lon-ajinomoto-goi-454g-202202110747482138.jpg",
          "https://cdn.tgdd.vn/Products/Images/2806/77081/bhx/bot-ngot-ajinomoto-goi-454g-202006172147080428.jpg",
          "https://cdn.tgdd.vn/Products/Images/2806/77081/bhx/bot-ngot-ajinomoto-goi-454g-202006172147088307.jpg",
          "https://cdn.tgdd.vn/Products/Images/2806/77081/bhx/bot-ngot-ajinomoto-goi-454g-202006172147111232.jpg",
        ],
      },
      {
        category_id: categories[13]._id, // Hạt nêm, bột ngọt, bột canh
        name: "Hạt nêm chay Knorr nấm hương organic gói 380g",
        price: 45000,
        original_price: 40000,
        in_stock: 75,
        status: "active",
        description: "Hạt nêm chay Knorr nấm hương organic gói 380g, dành cho người ăn chay. Từ nấm hương organic tự nhiên, đảm bảo an toàn sức khỏe.",
        images: [
          "https://cdn.tgdd.vn/Products/Images/2806/158021/bhx/hat-nem-chay-nam-huong-knorr-goi-380g-202203301952210726.jpg",
          "https://cdn.tgdd.vn/Products/Images/2806/158021/bhx/hat-nem-chay-nam-huong-knorr-goi-380g-202203301952215258.jpg",
          "https://cdn.tgdd.vn/Products/Images/2806/158021/bhx/hat-nem-chay-nam-huong-knorr-goi-380g-202203301952225595.jpg",
          "https://cdn.tgdd.vn/Products/Images/2806/158021/bhx/hat-nem-chay-nam-huong-knorr-goi-380g-202203301953396927.jpg",
        ],
      },
      {
        category_id: categories[13]._id, // Hạt nêm, bột ngọt, bột canh
        name: "Hạt nêm Aji-ngon vị heo gói 900g",
        price: 65000,
        original_price: 58000,
        in_stock: 110,
        status: "active",
        description: "Hạt nêm Aji-ngon vị heo gói 900g, hương vị heo đậm đà, thơm ngon. Sản phẩm chất lượng cao, tạo nên những món ăn hấp dẫn.",
        images: [
          "https://cdnv2.tgdd.vn/bhx-static/bhx/Products/Images/2806/77238/bhx/77238-slide_202409300925114415.jpg",
          "https://cdnv2.tgdd.vn/bhx-static/bhx/Products/Images/2806/77238/bhx/77238-slidee_202409300922440802.jpg",
          "https://cdnv2.tgdd.vn/bhx-static/bhx/Products/Images/2806/77238/bhx/77238-slide-moi_202409300922444575.jpg",
        ],
      },
      {
        category_id: categories[13]._id, // Hạt nêm, bột ngọt, bột canh
        name: "Hạt nêm 3 Miền thịt và xương gói 900g",
        price: 58000,
        original_price: 52000,
        in_stock: 95,
        status: "active",
        description: "Hạt nêm 3 Miền thịt và xương gói 900g, hương vị thịt và xương đậm đà. Thương hiệu Việt Nam chất lượng cao, được tin dùng rộng rãi.",
        images: [
          "https://cdnv2.tgdd.vn/bhx-static/bhx/Products/Images/2806/333578/bhx/333578-slide-moi_202412251430430400.jpg",
          "https://cdnv2.tgdd.vn/bhx-static/bhx/Products/Images/2806/333578/bhx/hat-nem-3-mien-thit-va-xuong-goi-900g_202504190849560879.jpg",
          "https://cdnv2.tgdd.vn/bhx-static/bhx/Products/Images/2806/333578/bhx/hat-nem-3-mien-thit-va-xuong-goi-900g_202504190848317743.jpg",
        ],
      },
      {
        category_id: categories[13]._id, // Hạt nêm, bột ngọt, bột canh
        name: "Bột canh nấm Vifon gói 200g",
        price: 18000,
        original_price: 15000,
        in_stock: 200,
        status: "active",
        description: "Bột canh nấm Vifon gói 200g, hương vị nấm tự nhiên, thơm ngon. Sản phẩm từ thương hiệu Vifon uy tín, dễ sử dụng.",
        images: [
          "https://cdn.tgdd.vn/Products/Images/2806/311453/bhx/bot-canh-nam-vifon-goi-200g-202308181052417950.jpg",
          "https://cdn.tgdd.vn/Products/Images/2806/311453/bhx/bot-canh-nam-vifon-goi-200g-202308181052421225.jpg",
          "https://cdn.tgdd.vn/Products/Images/2806/311453/bhx/bot-canh-nam-vifon-goi-200g-202308181052430983.jpg",
        ],
      },
      {
        category_id: categories[13]._id, // Hạt nêm, bột ngọt, bột canh
        name: "Bột canh I-ốt Vifon gói 200g",
        price: 20000,
        original_price: 17000,
        in_stock: 180,
        status: "active",
        description: "Bột canh I-ốt Vifon gói 200g, bổ sung I-ốt cần thiết cho cơ thể. Hương vị đậm đà, phù hợp cho mọi món ăn.",
        images: [
          "https://cdn.tgdd.vn/Products/Images/2806/311451/bhx/bot-canh-i-ot-vifon-goi-200g-202308181049175249.jpg",
          "https://cdn.tgdd.vn/Products/Images/2806/311451/bhx/bot-canh-i-ot-vifon-goi-200g-202308181049178527.jpg",
          "https://cdn.tgdd.vn/Products/Images/2806/311451/bhx/bot-canh-i-ot-vifon-goi-200g-202308181049198518.jpg",
        ],
      },
      {
        category_id: categories[13]._id, // Hạt nêm, bột ngọt, bột canh
        name: "Bột canh tôm Vifon gói 200g",
        price: 22000,
        original_price: 19000,
        in_stock: 160,
        status: "active",
        description: "Bột canh tôm Vifon gói 200g, hương vị tôm tự nhiên, thơm ngon. Tạo nên nước dùng đậm đà cho các món canh, phở.",
        images: [
          "https://cdn.tgdd.vn/Products/Images/2806/311452/bhx/bot-canh-tom-vifon-goi-200g-202308181050445655.jpg",
          "https://cdn.tgdd.vn/Products/Images/2806/311452/bhx/bot-canh-tom-vifon-goi-200g-202308181050449505.jpg",
          "https://cdn.tgdd.vn/Products/Images/2806/311452/bhx/bot-canh-tom-vifon-goi-200g-202308181050460564.jpg",
        ],
      },
      // Danh mục Muối
      {
        category_id: categories[16]._id, // Muối
        name: "Muối hạt thiên nhiên Ông Chà Và gói 1kg",
        price: 25000,
        original_price: 22000,
        in_stock: 150,
        status: "active",
        description: "Muối hạt thiên nhiên Ông Chà Và gói 1kg, muối biển tự nhiên, tinh khiết. Không chứa chất bảo quản, an toàn cho sức khỏe.",
        images: [
          "https://cdn.tgdd.vn/Products/Images/2803/328643/bhx/muoi-hat-thien-nhien-ong-cha-va-goi-1kg-202408051352267322.jpg",
          "https://cdnv2.tgdd.vn/bhx-static/bhx/Products/Images/2803/328643/bhx/328643-tem_202409131524181300.jpg",
        ],
      },
      {
        category_id: categories[16]._id, // Muối
        name: "Muối chấm Hảo Hảo tôm chua cay hũ 120g",
        price: 15000,
        original_price: 12000,
        in_stock: 200,
        status: "active",
        description: "Muối chấm Hảo Hảo tôm chua cay hũ 120g, vị tôm chua cay đặc trưng. Thích hợp chấm với trái cây, rau củ quả.",
        images: [
          "https://cdnv2.tgdd.vn/bhx-static/bhx/Products/Images/2803/275670/bhx/muoi-cham-hao-hao-tom-chua-cay-hu-120g_202506041108209886.jpg",
          "https://cdnv2.tgdd.vn/bhx-static/bhx/Products/Images/2803/275670/bhx/muoi-cham-hao-hao-tom-chua-cay-hu-120g_202506041317140629.jpg",
          "https://cdnv2.tgdd.vn/bhx-static/bhx/Products/Images/2803/275670/bhx/muoi-cham-hao-hao-tom-chua-cay-hu-120g_202506111117327991.jpg",
          "https://cdnv2.tgdd.vn/bhx-static/bhx/Products/Images/2803/275670/bhx/muoi-cham-hao-hao-tom-chua-cay-hu-120g_202506111117331431.jpg",
        ],
      },
      {
        category_id: categories[16]._id, // Muối
        name: "Muối tôm Trần Lâm Food hũ 100g",
        price: 18000,
        original_price: 15000,
        in_stock: 120,
        status: "active",
        description: "Muối tôm Trần Lâm Food hũ 100g, muối tôm thượng hạng từ tôm tươi. Hương vị đặc trưng, thích hợp chấm với nhiều món ăn.",
        images: [
          "https://cdnv2.tgdd.vn/bhx-static/bhx/Products/Images/2803/238664/bhx/238664-slide-moi_202409261649122385.jpg",
          "https://cdn.tgdd.vn/Products/Images/2803/238664/bhx/muoi-tom-thuong-hang-my-lien-food-hu-100g-202106030923188312.jpg",
          "https://cdn.tgdd.vn/Products/Images/2803/238664/bhx/muoi-tom-thuong-hang-my-lien-food-hu-100g-202106030923234432.jpg",
        ],
      },
      {
        category_id: categories[16]._id, // Muối
        name: "Muối tiêu Guyumi hũ 60g",
        price: 12000,
        original_price: 10000,
        in_stock: 180,
        status: "active",
        description: "Muối tiêu Guyumi hũ 60g, kết hợp muối và tiêu đen thơm cay. Gia vị hoàn hảo cho nhiều món ăn, đặc biệt món nướng.",
        images: [
          "https://cdn.tgdd.vn/Products/Images/2803/233029/bhx/sellingpoint.jpg",
          "https://cdn.tgdd.vn/Products/Images/2803/233029/bhx/muoi-tieu-guyumi-chai-60g-202101091710434309.jpg",
          "https://cdn.tgdd.vn/Products/Images/2803/233029/bhx/muoi-tieu-guyumi-chai-60g-202101091710438592.jpg",
          "https://cdn.tgdd.vn/Products/Images/2803/233029/bhx/muoi-tieu-guyumi-chai-60g-202101091710441434.jpg",
        ],
      },
      {
        category_id: categories[16]._id, // Muối
        name: "Muối ớt Guyumi hũ 110g",
        price: 14000,
        original_price: 12000,
        in_stock: 160,
        status: "active",
        description: "Muối ớt Guyumi hũ 110g, muối ớt kiểu Tây Ninh truyền thống. Vị cay nồng đặc trưng, thích hợp chấm với trái cây.",
        images: [
          "https://cdn.tgdd.vn/Products/Images/2803/233022/bhx/sellingpoint.jpg",
          "https://cdn.tgdd.vn/Products/Images/2803/233022/bhx/muoi-ot-kieu-tay-ninh-guyumi-chai-110g-202101091722009078.jpg",
          "https://cdn.tgdd.vn/Products/Images/2803/233022/bhx/muoi-ot-kieu-tay-ninh-guyumi-chai-110g-202101091722015512.jpg",
          "https://cdn.tgdd.vn/Products/Images/2803/233022/bhx/muoi-ot-kieu-tay-ninh-guyumi-chai-110g-202101091722018284.jpg",
        ],
      },
      {
        category_id: categories[16]._id, // Muối
        name: "Muối tôm siêu cay Fadely hũ 60g",
        price: 16000,
        original_price: 14000,
        in_stock: 140,
        status: "active",
        description: "Muối tôm siêu cay Fadely hũ 60g, độ cay cao, hương vị tôm đặc trưng. Thích hợp cho những ai yêu thích vị cay nồng.",
        images: [
          "https://cdn.tgdd.vn/Products/Images/2803/221875/bhx/muoi-tom-sieu-cay-fadely-hu-60g-202211111347145416.png",
          "https://cdn.tgdd.vn/Products/Images/2803/221875/bhx/muoi-tom-sieu-cay-tinh-nguyen-fadely-hu-60g-202005091309516274.jpg",
          "https://cdn.tgdd.vn/Products/Images/2803/221875/bhx/muoi-tom-sieu-cay-tinh-nguyen-fadely-hu-60g-202005091309525029.jpg",
          "https://cdn.tgdd.vn/Products/Images/2803/221875/bhx/muoi-tom-sieu-cay-tinh-nguyen-fadely-hu-60g-202005091309527071.jpg",
        ],
      },
      {
        category_id: categories[16]._id, // Muối
        name: "Muối tiêu lá chanh Dh Foods Natural hũ 55g",
        price: 13000,
        original_price: 11000,
        in_stock: 170,
        status: "active",
        description: "Muối tiêu lá chanh Dh Foods Natural hũ 55g, kết hợp muối, tiêu và lá chanh thơm. Gia vị tự nhiên, không chất bảo quản.",
        images: [
          "https://cdn.tgdd.vn/Products/Images/2803/212175/bhx/sellingpoint.jpg",
          "https://cdn.tgdd.vn/Products/Images/2803/212175/bhx/muoi-tieu-la-chanh-dh-foods-natural-hu-55g-201910042116527594.jpg",
          "https://cdn.tgdd.vn/Products/Images/2803/212175/bhx/muoi-tieu-la-chanh-dh-foods-natural-hu-55g-201910042116529786.jpg",
          "https://cdn.tgdd.vn/Products/Images/2803/212175/bhx/muoi-tieu-la-chanh-dh-foods-natural-hu-55g-201910042116530636.jpg",
        ],
      },
      {
        category_id: categories[16]._id, // Muối
        name: "Muối ớt hột Dh Foods hũ 65g",
        price: 15000,
        original_price: 13000,
        in_stock: 150,
        status: "active",
        description: "Muối ớt hột Dh Foods hũ 65g, muối ớt với hạt ớt cay nồng. Thích hợp cho những ai yêu thích vị cay đậm đà.",
        images: [
          "https://cdn.tgdd.vn/Products/Images/2803/206049/bhx/sellingpoint.jpg",
          "https://cdn.tgdd.vn/Products/Images/2803/206049/bhx/muoi-ot-hot-dh-foods-hu-65g-201907080935479400.jpg",
          "https://cdn.tgdd.vn/Products/Images/2803/206049/bhx/muoi-ot-hot-dh-foods-hu-65g-201907080935477510.jpg",
          "https://cdn.tgdd.vn/Products/Images/2803/206049/bhx/muoi-ot-hot-dh-foods-hu-65g-201907080935482100.jpg",
        ],
      },
      {
        category_id: categories[16]._id, // Muối
        name: "Muối tiêu Natas hũ 100g",
        price: 17000,
        original_price: 15000,
        in_stock: 130,
        status: "active",
        description: "Muối tiêu Natas hũ 100g, gia vị truyền thống từ muối và tiêu đen. Hương vị đậm đà, thích hợp với nhiều món ăn.",
        images: [
          "https://cdn.tgdd.vn/Products/Images/2803/174544/bhx/sellingpoint.jpg",
          "https://cdn.tgdd.vn/Products/Images/2803/174544/bhx/muoi-tieu-natas-hu-100g-201911042323250737.JPG",
          "https://cdn.tgdd.vn/Products/Images/2803/174544/bhx/muoi-tieu-natas-hu-100g-201911042323254149.JPG",
          "https://cdn.tgdd.vn/Products/Images/2803/174544/bhx/muoi-tieu-natas-hu-100g-201911042323479108.JPG",
        ],
      },
      {
        category_id: categories[16]._id, // Muối
        name: "Muối tôm Tinh Nguyên hũ 90g",
        price: 16000,
        original_price: 14000,
        in_stock: 140,
        status: "active",
        description: "Muối tôm Tinh Nguyên hũ 90g, muối tôm Tây Ninh truyền thống. Hương vị tôm đậm đà, được chế biến theo công thức cổ truyền.",
        images: [
          "https://cdn.tgdd.vn/Products/Images/2803/174524/bhx/muoi-tom-tay-ninh-tinh-nguyen-hu-90g-202210141006118247.png",
          "https://cdn.tgdd.vn/Products/Images/2803/174524/bhx/muoi-tom-tinh-nguyen-hu-90g-202107100141290218.jpg",
          "https://cdn.tgdd.vn/Products/Images/2803/174524/bhx/muoi-tom-tinh-nguyen-hu-90g-202107100141304334.jpg",
          "https://cdn.tgdd.vn/Products/Images/2803/174524/bhx/muoi-tom-tinh-nguyen-hu-90g-202107100141309263.jpg",
        ],
      },
      // Danh mục Các loại tương
      {
        category_id: categories[17]._id, // Các loại tương
        name: "Tương ớt Chinsu chai 1kg",
        price: 45000,
        original_price: 40000,
        in_stock: 80,
        status: "active",
        description: "Tương ớt Chinsu chai 1kg, hương vị cay nồng đậm đà. Sản phẩm từ thương hiệu Chinsu uy tín, phù hợp với nhiều món ăn Việt Nam.",
        images: [
          "https://cdn.tgdd.vn/Products/Images/2567/278938/bhx/tuong-ot-chinsu-chai-1kg-202301061115529307.jpg",
          "https://cdn.tgdd.vn/Products/Images/2567/278938/bhx/tuong-ot-chinsu-chai-1kg-202301061115532529.jpg",
          "https://cdn.tgdd.vn/Products/Images/2567/278938/bhx/tuong-ot-chinsu-chai-1kg-202301061115538419.jpg",
          "https://cdn.tgdd.vn/Products/Images/2567/278938/bhx/tuong-ot-chinsu-chai-1kg-202301061115541133.jpg",
        ],
      },
      {
        category_id: categories[17]._id, // Các loại tương
        name: "Tương cà Ông Chà Và chai 290g",
        price: 15000,
        original_price: 12000,
        in_stock: 150,
        status: "active",
        description: "Tương cà Ông Chà Và chai 290g, hương vị cà chua tự nhiên, chua ngọt hài hòa. Thích hợp làm nước chấm và gia vị nấu ăn.",
        images: [
          "https://cdnv2.tgdd.vn/bhx-static/bhx/Products/Images/2567/338711/bhx/tuong-ca-ong-cha-va-chai-830g-clone_202505271653425358.jpg",
        ],
      },
      {
        category_id: categories[17]._id, // Các loại tương
        name: "Tương đen chai dẹp Ông Chà Và 300g",
        price: 18000,
        original_price: 15000,
        in_stock: 120,
        status: "active",
        description: "Tương đen chai dẹp Ông Chà Và 300g, tương đen đậm đà truyền thống. Hương vị đặc trưng của đậu nành lên men, thích hợp cho nhiều món ăn.",
        images: [
          "https://cdn.tgdd.vn/Products/Images/2567/76913/bhx/tuong-den-chai-dep-ong-cha-va-250g-202307071641075739.jpg",
          "https://cdn.tgdd.vn/Products/Images/2567/76913/bhx/tuong-den-chai-dep-ong-cha-va-250g-202307071641078317.jpg",
          "https://cdn.tgdd.vn/Products/Images/2567/76913/bhx/tuong-den-chai-dep-ong-cha-va-250g-202307071641083039.jpg",
          "https://cdn.tgdd.vn/Products/Images/2567/76913/bhx/tuong-den-chai-dep-ong-cha-va-250g-202307071641085411.jpg",
        ],
      },
      {
        category_id: categories[17]._id, // Các loại tương
        name: "Tương ớt xanh Ông Chà Và chai 210g",
        price: 14000,
        original_price: 12000,
        in_stock: 130,
        status: "active",
        description: "Tương ớt xanh Ông Chà Và chai 210g, từ ớt xanh tươi, vị cay nhẹ, thơm mát. Thích hợp chấm với bánh tráng, nem nướng.",
        images: [
          "https://cdn.tgdd.vn/Products/Images/2567/208213/bhx/tuong-ot-xanh-ong-cha-va-chai-210g-201907310853277194.JPG",
          "https://cdn.tgdd.vn/Products/Images/2567/208213/bhx/tuong-ot-xanh-ong-cha-va-chai-210g-201907310853278299.JPG",
          "https://cdn.tgdd.vn/Products/Images/2567/208213/bhx/tuong-ot-xanh-ong-cha-va-chai-210g-201907310853279489.JPG",
          "https://cdn.tgdd.vn/Products/Images/2567/208213/bhx/tuong-ot-xanh-ong-cha-va-chai-210g-201907310853281139.JPG",
        ],
      },
      {
        category_id: categories[17]._id, // Các loại tương
        name: "Tương ớt Nam Dương đặc biệt cay chai 400g",
        price: 25000,
        original_price: 22000,
        in_stock: 90,
        status: "active",
        description: "Tương ớt Nam Dương đặc biệt cay chai 400g, độ cay cao, hương vị đậm đà. Sản phẩm từ thương hiệu Nam Dương nổi tiếng.",
        images: [
          "https://cdnv2.tgdd.vn/bhx-static/bhx/Products/Images/2567/338710/bhx/tuong-ot-nam-duong-chai-470g-clone_202505271647400918.jpg",
        ],
      },
      {
        category_id: categories[17]._id, // Các loại tương
        name: "Tương ớt Chinsu Sriracha chai 250g",
        price: 20000,
        original_price: 18000,
        in_stock: 110,
        status: "active",
        description: "Tương ớt Chinsu Sriracha chai 250g, phong cách Thái Lan, vị cay ngọt hài hòa. Thích hợp cho các món ăn Á Đông.",
        images: [
          "https://cdnv2.tgdd.vn/bhx-static/bhx/Products/Images/2567/335767/bhx/tuong-ot-chinsu-sriracha-chai-250g_202504082131093544.jpg",
          "https://cdnv2.tgdd.vn/bhx-static/bhx/Products/Images/2567/335767/bhx/tuong-ot-chinsu-sriracha-chai-250g_202503191532167810.jpg",
          "https://cdnv2.tgdd.vn/bhx-static/bhx/Products/Images/2567/335767/bhx/tuong-ot-chinsu-sriracha-chai-250g_202503191532170817.jpg",
        ],
      },
      {
        category_id: categories[17]._id, // Các loại tương
        name: "Tương ớt Nam Dương chai 255g",
        price: 16000,
        original_price: 14000,
        in_stock: 140,
        status: "active",
        description: "Tương ớt Nam Dương chai 255g, độ cay vừa phải, hương vị truyền thống. Thích hợp cho gia đình Việt Nam.",
        images: [
          "https://cdn.tgdd.vn/Products/Images/2567/283101/bhx/tuong-ot-cay-vua-nam-duong-chai-255g-202207081046071974.png",
          "https://cdnv2.tgdd.vn/bhx-static/bhx/Products/Images/2567/283101/bhx/283101-slide_202409121503053080.jpg",
          "https://cdnv2.tgdd.vn/bhx-static/bhx/Products/Images/2567/283101/bhx/283101-slidee_202409121503050830.jpg",
          "https://cdn.tgdd.vn/Products/Images/2567/283101/bhx/tuong-ot-cay-vua-nam-duong-chai-255g-202207081039317137.png",
        ],
      },
      {
        category_id: categories[17]._id, // Các loại tương
        name: "Tương ớt cay nồng Cholimex chai 270g",
        price: 22000,
        original_price: 19000,
        in_stock: 100,
        status: "active",
        description: "Tương ớt cay nồng Cholimex chai 270g, độ cay cao, hương vị đặc trưng. Sản phẩm từ thương hiệu Cholimex uy tín.",
        images: [
          "https://cdn.tgdd.vn/Products/Images/2567/96206/bhx/tuong-ot-cay-nong-cholimex-chai-270g-202202161414421585.jpg",
          "https://cdn.tgdd.vn/Products/Images/2567/96206/bhx/tuong-ot-cholimex-cay-nong-chai-270g-2-700x467.jpg",
        ],
      },
    ]);

    // Create vouchers
    const vouchers = await Voucher.create([
      {
        code: "WELCOME10",
        discount_type: "percentage",
        discount_value: 10,
        max_discount: 50000,
        min_order_value: 200000,
        start_date: new Date(),
        end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        status: "active",
      },
      {
        code: "SAVE20K",
        discount_type: "fixed",
        discount_value: 20000,
        max_discount: 20000,
        min_order_value: 100000,
        start_date: new Date(),
        end_date: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15 days from now
        status: "active",
      },
    ]);

    // Create variants for products
    const variants = await Variant.create([
      // Biến thể cho dầu ăn Tường An
      {
        product_id: products[11]._id, // Dầu thực vật Tường An Cooking Oil chai 1 lít
        name: "Dầu thực vật Tường An Cooking Oil can 2 lít",
        sku: "TUONGAN-2L",
        unit: "can",
        quantity_per_unit: 1,
        price: 91500,
        original_price: 81000,
        in_stock: 50,
        status: "active",
        is_default: false,
        description:
          "Dầu thực vật Tường An Cooking Oil can 2 lít, tiết kiệm hơn cho gia đình",
        images: [
          "https://cdn.tgdd.vn/Products/Images/2286/79387/bhx/dau-thuc-vat-tuong-an-cooking-oil-can-2-lit-202212031341070283.png",
          "https://cdn.tgdd.vn/Products/Images/2286/79387/bhx/dau-thuc-vat-tuong-an-cooking-oil-can-2-lit-202212031344184629.png",
        ],
      },
      // Biến thể cho dầu ăn Cái Lân
      {
        product_id: products[12]._id, // Dầu thực vật tinh luyện Cái Lân chai 1 lít
        name: "Dầu thực vật tinh luyện Cái Lân can 2 lít",
        sku: "CAILAN-2L",
        unit: "can",
        quantity_per_unit: 1,
        price: 91500,
        original_price: 81000,
        in_stock: 45,
        status: "active",
        is_default: false,
        description:
          "Dầu thực vật tinh luyện Cái Lân can 2 lít, tiết kiệm cho gia đình",
        images: [
          "https://cdn.tgdd.vn/Products/Images/2286/76154/bhx/dau-thuc-vat-tinh-luyen-cai-lan-can-2-lit-202209281748108000.png",
          "https://cdnv2.tgdd.vn/bhx-static/bhx/Products/Images/2286/76154/bhx/76154-slidee_202409121128194183.jpg",
        ],
      },
      // Biến thể cho dầu ăn Janbee
      {
        product_id: products[14]._id, // Dầu đậu nành tinh luyện Janbee chai 1 lít
        name: "Dầu đậu nành tinh luyện Janbee can 2 lít",
        sku: "JANBEE-2L",
        unit: "can",
        quantity_per_unit: 1,
        price: 139500,
        original_price: 99000,
        in_stock: 30,
        status: "active",
        is_default: false,
        description:
          "Dầu đậu nành tinh luyện Janbee can 2 lít, tiết kiệm cho gia đình",
        images: [
          "https://cdn.tgdd.vn/Products/Images/2286/211349/bhx/dau-dau-nanh-tinh-luyen-janbee-can-2-lit-202407091034245023.jpg",
          "https://cdn.tgdd.vn/Products/Images/2286/211349/bhx/dau-dau-nanh-tinh-luyen-janbee-can-2-lit-202407091034247787.jpg",
        ],
      },
      // Biến thể cho nước mắm Knorr
      {
        product_id: products[17]._id, // Nước mắm cá cơm than Knorr 15 độ đạm chai 242ml
        name: "Nước mắm cá cơm than Knorr 15 độ đạm chai 750ml",
        sku: "KNORR-750ML",
        unit: "chai",
        quantity_per_unit: 1,
        price: 53500,
        original_price: 29000,
        in_stock: 60,
        status: "active",
        is_default: false,
        description:
          "Nước mắm cá cơm than Knorr 15 độ đạm chai 750ml, tiết kiệm hơn",
        images: [
          "https://cdnv2.tgdd.vn/bhx-static/bhx/Products/Images/2289/289775/bhx/nuoc-mam-knorr-ngon-tron-vi-chai-750ml_202505271012011408.jpg",
          "https://cdnv2.tgdd.vn/bhx-static/bhx/Products/Images/2289/289775/bhx/nuoc-mam-knorr-ngon-tron-vi-chai-750ml_202505271012014126.jpg",
        ],
      },
      // Biến thể cho nước mắm Nam Ngư
      {
        product_id: products[18]._id, // Nước chấm Nam Ngư Đệ Nhị chai 900ml
        name: "Thùng 15 chai nước chấm Nam Ngư Đệ Nhị chai 900ml",
        sku: "NAMNGU-15CHAI",
        unit: "thùng",
        quantity_per_unit: 15,
        price: 382500,
        original_price: 200000,
        in_stock: 10,
        status: "active",
        is_default: false,
        description:
          "Thùng 15 chai nước chấm Nam Ngư Đệ Nhị chai 900ml, tiết kiệm cho nhà hàng",
        images: [
          "https://cdnv2.tgdd.vn/bhx-static/bhx/Products/Images/2289/331153/bhx/331153-slide_202410161622435274.jpg",
          "https://cdn.tgdd.vn/Products/Images/2289/76428/bhx/nuoc-cham-nam-ngu-de-nhi-chai-900ml-201903151030027270.jpg",
        ],
      },
      // Biến thể cho nước mắm Chinsu
      {
        product_id: products[21]._id, // Nước mắm hương cá hồi hảo hạng Chinsu 16 độ đạm chai 500ml
        name: "Nước mắm Chinsu cá cơm biển đông 25 độ đạm chai 720ml",
        sku: "CHINSU-720ML",
        unit: "chai",
        quantity_per_unit: 1,
        price: 62500,
        original_price: 53000,
        in_stock: 35,
        status: "active",
        is_default: false,
        description:
          "Nước mắm Chinsu cá cơm biển đông 25 độ đạm chai 720ml, đậm đà hơn",
        images: [
          "https://cdnv2.tgdd.vn/bhx-static/bhx/Products/Images/2289/260183/bhx/260183-slide-mau-moi_202501211043294970.jpg",
          "https://cdn.tgdd.vn/Products/Images/2289/260183/bhx/nuoc-mam-chinsu-ca-com-bien-dong-20-do-dam-chai-720ml-202407181130191704.jpg",
        ],
      },
      // Biến thể cho nước mắm Barona
      {
        product_id: products[22]._id, // Nước mắm cao cấp Vị Xưa Barona 40 độ đạm chai 50ml
        name: "Nước mắm cao cấp Vị Xưa Barona 40 độ đạm chai 500ml",
        sku: "BARONA-500ML",
        unit: "chai",
        quantity_per_unit: 1,
        price: 92500,
        original_price: 80000,
        in_stock: 20,
        status: "active",
        is_default: false,
        description:
          "Nước mắm cao cấp Vị Xưa Barona 40 độ đạm chai 500ml, tiết kiệm hơn",
        images: [
          "https://cdn.tgdd.vn/Products/Images/2289/82719/bhx/sellingpoint.jpg",
          "https://cdn.tgdd.vn/Products/Images/2289/82719/bhx/nuoc-mam-cao-cap-vi-xua-barona-40-do-dam-chai-500ml-201910241415220050.jpg",
        ],
      },
      // Biến thể cho bia Sài Gòn Lager
      {
        product_id: products[23]._id, // Thùng 24 lon bia Sài Gòn Lager 330ml
        name: "Bia Sài Gòn Lager lon 330ml",
        sku: "SAIGON-LAGER-330ML",
        unit: "lon",
        quantity_per_unit: 1,
        price: 8500,
        original_price: 7500,
        in_stock: 200,
        status: "active",
        is_default: false,
        description: "Bia Sài Gòn Lager lon 330ml, hương vị đậm đà, tươi mát",
        images: [
          "https://cdn.tgdd.vn/Products/Images/2282/158346/bhx/bia-sai-gon-lager-330ml-202202101244236776.jpg",
          "https://cdn.tgdd.vn/Products/Images/2282/195208/bhx/6-lon-bia-sai-gon-lager-330ml-202110111038506128.jpg",
        ],
      },
      {
        product_id: products[23]._id, // Thùng 24 lon bia Sài Gòn Lager 330ml
        name: "6 lon bia Sài Gòn Lager 330ml",
        sku: "SAIGON-LAGER-6LON",
        unit: "lốc",
        quantity_per_unit: 6,
        price: 45000,
        original_price: 40000,
        in_stock: 80,
        status: "active",
        is_default: false,
        description: "6 lon bia Sài Gòn Lager 330ml, tiết kiệm cho gia đình",
        images: [
          "https://cdn.tgdd.vn/Products/Images/2282/195208/bhx/6-lon-bia-sai-gon-lager-330ml-202110111038506128.jpg",
          "https://cdn.tgdd.vn/Products/Images/2282/158346/bhx/bia-sai-gon-lager-330ml-202202101244236776.jpg",
        ],
      },
      // Biến thể cho bia Sài Gòn Chill
      {
        product_id: products[24]._id, // Thùng 24 lon bia Sài Gòn Chill 330ml
        name: "Bia Sài Gòn Chill lon 330ml",
        sku: "SAIGON-CHILL-330ML",
        unit: "lon",
        quantity_per_unit: 1,
        price: 9000,
        original_price: 8000,
        in_stock: 180,
        status: "active",
        is_default: false,
        description: "Bia Sài Gòn Chill lon 330ml, hương vị mới lạ, tươi mát",
        images: [
          "https://cdn.tgdd.vn/Products/Images/2282/245538/bhx/bia-sai-gon-chill-lon-330ml-202202191518191078.jpg",
          "https://cdn.tgdd.vn/Products/Images/2282/245540/bhx/6-lon-bia-sai-gon-chill-330ml-202202191519059129.jpg",
        ],
      },
      {
        product_id: products[24]._id, // Thùng 24 lon bia Sài Gòn Chill 330ml
        name: "6 lon bia Sài Gòn Chill 330ml",
        sku: "SAIGON-CHILL-6LON",
        unit: "lốc",
        quantity_per_unit: 6,
        price: 48000,
        original_price: 43000,
        in_stock: 70,
        status: "active",
        is_default: false,
        description: "6 lon bia Sài Gòn Chill 330ml, tiết kiệm cho gia đình",
        images: [
          "https://cdn.tgdd.vn/Products/Images/2282/245540/bhx/6-lon-bia-sai-gon-chill-330ml-202202191519059129.jpg",
          "https://cdn.tgdd.vn/Products/Images/2282/245538/bhx/bia-sai-gon-chill-lon-330ml-202202191518191078.jpg",
        ],
      },
      {
        product_id: products[24]._id, // Thùng 24 lon bia Sài Gòn Chill 330ml
        name: "Thùng 18 lon bia Sài Gòn Chill 330ml",
        sku: "SAIGON-CHILL-18LON",
        unit: "thùng",
        quantity_per_unit: 18,
        price: 140000,
        original_price: 125000,
        in_stock: 25,
        status: "active",
        is_default: false,
        description:
          "Thùng 18 lon bia Sài Gòn Chill 330ml, tiết kiệm cho nhà hàng",
        images: [
          "https://cdn.tgdd.vn/Products/Images/2282/297400/bhx/thung-18-lon-bia-sai-gon-chill-330ml-202211271345226732.jpg",
          "https://cdn.tgdd.vn/Products/Images/2282/245540/bhx/6-lon-bia-sai-gon-chill-330ml-202202191519059129.jpg",
        ],
      },
      // Biến thể cho bia Tiger Bạc
      {
        product_id: products[25]._id, // Thùng 24 lon bia Tiger Bạc 250ml
        name: "Lon bia Tiger Bạc 250ml",
        sku: "TIGER-BAC-250ML",
        unit: "lon",
        quantity_per_unit: 1,
        price: 8500,
        original_price: 7500,
        in_stock: 300,
        status: "active",
        is_default: true,
        description:
          "Lon bia Tiger Bạc 250ml, hương vị truyền thống, tươi mát. Bia Việt Nam với hương vị đặc trưng, độ cồn 4.5%, phù hợp cho các buổi tiệc và tụ tập bạn bè.",
        images: [
          "https://cdnv2.tgdd.vn/bhx-static/bhx/Products/Images/2282/328901/bhx/httpscdnv2tgddvnbhx-staticbhxproductsimages2282328901bhx1202411271524241358_202412041000310687.jpg",
          "https://cdnv2.tgdd.vn/bhx-static/bhx/Products/Images/2282/328902/bhx/412208-4-1_202501040903412829.jpg",
        ],
      },
      {
        product_id: products[25]._id, // Thùng 24 lon bia Tiger Bạc 250ml
        name: "Lốc 6 lon bia Tiger Bạc 250ml",
        sku: "TIGER-BAC-6LON",
        unit: "lốc",
        quantity_per_unit: 6,
        price: 45000,
        original_price: 40000,
        in_stock: 80,
        status: "active",
        is_default: false,
        description:
          "Lốc 6 lon bia Tiger Bạc 250ml, tiết kiệm cho gia đình. Bia Việt Nam với hương vị đặc trưng, độ cồn 4.5%.",
        images: [
          "https://cdnv2.tgdd.vn/bhx-static/bhx/Products/Images/2282/328902/bhx/412208-4-1_202501040903412829.jpg",
          "https://cdnv2.tgdd.vn/bhx-static/bhx/Products/Images/2282/328901/bhx/httpscdnv2tgddvnbhx-staticbhxproductsimages2282328901bhx1202411271524241358_202412041000310687.jpg",
        ],
      },
      {
        product_id: products[25]._id, // Thùng 24 lon bia Tiger Bạc 250ml
        name: "Thùng 24 lon bia Tiger Bạc 250ml",
        sku: "TIGER-BAC-24LON",
        unit: "thùng",
        quantity_per_unit: 24,
        price: 180000,
        original_price: 160000,
        in_stock: 50,
        status: "active",
        is_default: false,
        description:
          "Thùng 24 lon bia Tiger Bạc 250ml, tiết kiệm tối đa cho tiệc tùng. Bia Việt Nam với hương vị đặc trưng, độ cồn 4.5%.",
        images: [
          "https://cdnv2.tgdd.vn/bhx-static/bhx/Products/Images/2282/328902/bhx/412208-4-1_202501040903412829.jpg",
          "https://cdnv2.tgdd.vn/bhx-static/bhx/Products/Images/2282/328902/bhx/httpscdnv2tgddvnbhx-staticbhxproductsimages2282328902bhxlon-250ml202412031319189029_202412041001229346.jpg",
        ],
      },
      // Biến thể cho bia Tiger
      {
        product_id: products[26]._id, // Thùng 24 lon bia Tiger lon cao 330ml
        name: "Bia Tiger lon cao 330ml",
        sku: "TIGER-330ML",
        unit: "lon",
        quantity_per_unit: 1,
        price: 12000,
        original_price: 10000,
        in_stock: 150,
        status: "active",
        is_default: false,
        description: "Bia Tiger lon cao 330ml, hương vị quốc tế, tươi mát",
        images: [
          "https://cdnv2.tgdd.vn/bhx-static/bhx/Products/Images/2282/316845/bhx/httpscdnv2tgddvnbhx-staticbhxproductsimages2282316845bhxlon-330ml-1202412031318045954_202412040956494059.jpg",
          "https://cdnv2.tgdd.vn/bhx-static/bhx/Products/Images/2282/319485/bhx/412208-5-1_202501031425346431.jpg",
        ],
      },
      {
        product_id: products[26]._id, // Thùng 24 lon bia Tiger lon cao 330ml
        name: "6 lon bia Tiger lon cao 330ml",
        sku: "TIGER-6LON",
        unit: "lốc",
        quantity_per_unit: 6,
        price: 65000,
        original_price: 55000,
        in_stock: 60,
        status: "active",
        is_default: false,
        description: "6 lon bia Tiger lon cao 330ml, tiết kiệm cho gia đình",
        images: [
          "https://cdnv2.tgdd.vn/bhx-static/bhx/Products/Images/2282/319485/bhx/412208-5-1_202501031425346431.jpg",
          "https://cdnv2.tgdd.vn/bhx-static/bhx/Products/Images/2282/316845/bhx/httpscdnv2tgddvnbhx-staticbhxproductsimages2282316845bhxlon-330ml-1202412031318045954_202412040956494059.jpg",
        ],
      },
      // Biến thể cho bia Heineken
      {
        product_id: products[27]._id, // Thùng 24 lon bia Heineken Silver 330ml
        name: "Bia Heineken Silver 330ml",
        sku: "HEINEKEN-330ML",
        unit: "lon",
        quantity_per_unit: 1,
        price: 15000,
        original_price: 12000,
        in_stock: 120,
        status: "active",
        is_default: false,
        description: "Bia Heineken Silver 330ml, hương vị quốc tế, tươi mát",
        images: [
          "https://cdn.tgdd.vn/Products/Images/2282/200637/bhx/bia-heineken-silver-330ml-201903281046586878.jpg",
          "https://cdn.tgdd.vn/Products/Images/2282/200638/bhx/6-lon-bia-heineken-silver-330ml-202301152339137476.jpg",
        ],
      },
      {
        product_id: products[27]._id, // Thùng 24 lon bia Heineken Silver 330ml
        name: "6 lon bia Heineken Silver 330ml",
        sku: "HEINEKEN-6LON",
        unit: "lốc",
        quantity_per_unit: 6,
        price: 80000,
        original_price: 70000,
        in_stock: 50,
        status: "active",
        is_default: false,
        description: "6 lon bia Heineken Silver 330ml, tiết kiệm cho gia đình",
        images: [
          "https://cdn.tgdd.vn/Products/Images/2282/200638/bhx/6-lon-bia-heineken-silver-330ml-202301152339137476.jpg",
          "https://cdn.tgdd.vn/Products/Images/2282/200637/bhx/bia-heineken-silver-330ml-201903281046586878.jpg",
        ],
      },
      // Biến thể cho sữa TH True Milk
      {
        product_id: products[28]._id, // Thùng 48 hộp sữa tươi tiệt trùng ít đường TH True Milk 180ml
        name: "Lốc 4 hộp sữa tươi tiệt trùng ít đường TH True Milk 180ml",
        sku: "TH-TRUE-4HOP",
        unit: "lốc",
        quantity_per_unit: 4,
        price: 18000,
        original_price: 16000,
        in_stock: 200,
        status: "active",
        is_default: false,
        description:
          "Lốc 4 hộp sữa tươi tiệt trùng ít đường TH True Milk 180ml, tiện lợi cho gia đình",
        images: [
          "https://cdn.tgdd.vn/Products/Images/2386/80492/bhx/loc-4-hop-sua-tuoi-tiet-trung-it-duong-th-true-milk-180ml-202203042221008284.jpg",
          "https://cdn.tgdd.vn/Products/Images/2386/85853/bhx/thung-48-hop-sua-tuoi-tiet-trung-it-duong-th-true-milk-180ml-202104081706329168.jpg",
        ],
      },
      // Biến thể cho sữa Vinamilk 100%
      {
        product_id: products[29]._id, // Thùng 48 hộp sữa tươi tiệt trùng ít đường Vinamilk 100% sữa tươi 180ml
        name: "Lốc 4 hộp sữa tươi tiệt trùng ít đường Vinamilk 100% sữa tươi 180ml",
        sku: "VINAMILK-4HOP",
        unit: "lốc",
        quantity_per_unit: 4,
        price: 17000,
        original_price: 15000,
        in_stock: 220,
        status: "active",
        is_default: false,
        description:
          "Lốc 4 hộp sữa tươi tiệt trùng ít đường Vinamilk 100% sữa tươi 180ml, tiện lợi cho gia đình",
        images: [
          "https://cdn.tgdd.vn/Products/Images/2386/80604/bhx/loc-4-hop-sua-tuoi-tiet-trung-it-duong-vinamilk-100-sua-tuoi-180ml-202310071421530162.jpg",
          "https://cdn.tgdd.vn/Products/Images/2386/85530/bhx/thung-48-hop-sua-tuoi-tiet-trung-it-duong-vinamilk-100-sua-tuoi-180ml-202310071419459272.jpg",
        ],
      },
      // Biến thể cho sữa Vinamilk 1 lít
      {
        product_id: products[30]._id, // Thùng 12 hộp sữa tươi tiệt trùng không đường Vinamilk 100% sữa tươi 1 lít
        name: "Sữa tươi tiệt trùng không đường Vinamilk 100% sữa tươi hộp 1 lít",
        sku: "VINAMILK-1L",
        unit: "hộp",
        quantity_per_unit: 1,
        price: 12000,
        original_price: 10000,
        in_stock: 150,
        status: "active",
        is_default: false,
        description:
          "Sữa tươi tiệt trùng không đường Vinamilk 100% sữa tươi hộp 1 lít, tiện lợi cho gia đình",
        images: [
          "https://cdn.tgdd.vn/Products/Images/2386/76888/bhx/sua-tuoi-tiet-trung-khong-duong-vinamilk-100-sua-tuoi-hop-1-lit-202403281355125054.jpg",
          "https://cdn.tgdd.vn/Products/Images/2386/88762/bhx/thung-12-hop-sua-tuoi-tiet-trung-khong-duong-vinamilk-sua-tuoi-100-1-lit-202404021058296104.jpg",
        ],
      },
      // Biến thể cho sữa Milo A2
      {
        product_id: products[31]._id, // Thùng 48 hộp sữa lúa mạch ít đường Milo A2 180ml
        name: "Lốc 4 hộp sữa lúa mạch ít đường Milo A2 180ml",
        sku: "MILO-A2-4HOP",
        unit: "lốc",
        quantity_per_unit: 4,
        price: 20000,
        original_price: 18000,
        in_stock: 180,
        status: "active",
        is_default: false,
        description:
          "Lốc 4 hộp sữa lúa mạch ít đường Milo A2 180ml, tiện lợi cho gia đình",
        images: [
          "https://cdnv2.tgdd.vn/bhx-static/bhx/Products/Images/2945/336177/bhx/loc-4-hop-sua-lua-mach-it-duong-milo-a2-180ml_202504101051223453.jpg",
          "https://cdnv2.tgdd.vn/bhx-static/bhx/Products/Images/2945/336178/bhx/thung-48-hop-sua-lua-mach-it-duong-milo-a2-180ml_202504101039251295.jpg",
        ],
      },
      // Biến thể cho sữa Lof Kun
      {
        product_id: products[32]._id, // Thùng 48 hộp sữa socola lúa mạch Lof Kun có thạch 170ml
        name: "Lốc 4 hộp sữa socola lúa mạch Lof Kun có thạch 170ml",
        sku: "LOFKUN-4HOP",
        unit: "lốc",
        quantity_per_unit: 4,
        price: 22000,
        original_price: 20000,
        in_stock: 160,
        status: "active",
        is_default: false,
        description:
          "Lốc 4 hộp sữa socola lúa mạch Lof Kun có thạch 170ml, tiện lợi cho gia đình",
        images: [
          "https://cdn.tgdd.vn/Products/Images/2945/327986/bhx/loc-4-hop-sua-socola-lua-mach-lif-kun-co-thach-170ml-202407161553487408.jpg",
          "https://cdnv2.tgdd.vn/bhx-static/bhx/Products/Images/2945/327987/bhx/327987-slide-1_202501211456144244.jpg",
        ],
      },
      // Biến thể cho gạo tám thơm
      {
        product_id: products[33]._id, // Gạo tám thơm 5kg
        name: "Gạo tám thơm 1kg",
        sku: "GAO-TAM-1KG",
        unit: "kg",
        quantity_per_unit: 1,
        price: 18000,
        original_price: 16000,
        in_stock: 200,
        status: "active",
        is_default: false,
        description: "Gạo tám thơm 1kg, hạt gạo dài, thơm ngon",
        images: [
          "https://cdn.tgdd.vn/Products/Images/2286/123456/bhx/gao-tam-thom-1kg-202401251130536710.jpg",
          "https://cdn.tgdd.vn/Products/Images/2286/123456/bhx/gao-tam-thom-1kg-202401251130539737.jpg",
        ],
      },
      {
        product_id: products[33]._id, // Gạo tám thơm 5kg
        name: "Gạo tám thơm 10kg",
        sku: "GAO-TAM-10KG",
        unit: "kg",
        quantity_per_unit: 10,
        price: 160000,
        original_price: 140000,
        in_stock: 50,
        status: "active",
        is_default: false,
        description: "Gạo tám thơm 10kg, tiết kiệm cho gia đình",
        images: [
          "https://cdn.tgdd.vn/Products/Images/2286/123456/bhx/gao-tam-thom-10kg-202401251130536710.jpg",
          "https://cdn.tgdd.vn/Products/Images/2286/123456/bhx/gao-tam-thom-10kg-202401251130539737.jpg",
        ],
      },
      // Biến thể cho gạo nếp cái hoa vàng
      {
        product_id: products[34]._id, // Gạo nếp cái hoa vàng 2kg
        name: "Gạo nếp cái hoa vàng 1kg",
        sku: "GAO-NEP-1KG",
        unit: "kg",
        quantity_per_unit: 1,
        price: 25000,
        original_price: 22000,
        in_stock: 150,
        status: "active",
        is_default: false,
        description: "Gạo nếp cái hoa vàng 1kg, hạt gạo tròn, dẻo thơm",
        images: [
          "https://cdn.tgdd.vn/Products/Images/2286/123457/bhx/gao-nep-cai-hoa-vang-1kg-202401251130536710.jpg",
          "https://cdn.tgdd.vn/Products/Images/2286/123457/bhx/gao-nep-cai-hoa-vang-1kg-202401251130539737.jpg",
        ],
      },
      {
        product_id: products[34]._id, // Gạo nếp cái hoa vàng 2kg
        name: "Gạo nếp cái hoa vàng 5kg",
        sku: "GAO-NEP-5KG",
        unit: "kg",
        quantity_per_unit: 5,
        price: 100000,
        original_price: 90000,
        in_stock: 60,
        status: "active",
        is_default: false,
        description: "Gạo nếp cái hoa vàng 5kg, tiết kiệm cho gia đình",
        images: [
          "https://cdn.tgdd.vn/Products/Images/2286/123457/bhx/gao-nep-cai-hoa-vang-5kg-202401251130536710.jpg",
          "https://cdn.tgdd.vn/Products/Images/2286/123457/bhx/gao-nep-cai-hoa-vang-5kg-202401251130539737.jpg",
        ],
      },
      // Biến thể cho gạo ST25
      {
        product_id: products[35]._id, // Gạo ST25 10kg
        name: "Gạo ST25 5kg",
        sku: "GAO-ST25-5KG",
        unit: "kg",
        quantity_per_unit: 5,
        price: 95000,
        original_price: 85000,
        in_stock: 80,
        status: "active",
        is_default: false,
        description: "Gạo ST25 5kg, gạo thơm ngon nhất thế giới",
        images: [
          "https://cdn.tgdd.vn/Products/Images/2286/123458/bhx/gao-st25-5kg-202401251130536710.jpg",
          "https://cdn.tgdd.vn/Products/Images/2286/123458/bhx/gao-st25-5kg-202401251130539737.jpg",
        ],
      },
      {
        product_id: products[35]._id, // Gạo ST25 10kg
        name: "Gạo ST25 25kg",
        sku: "GAO-ST25-25KG",
        unit: "kg",
        quantity_per_unit: 25,
        price: 400000,
        original_price: 350000,
        in_stock: 30,
        status: "active",
        is_default: false,
        description: "Gạo ST25 25kg, tiết kiệm cho gia đình lớn",
        images: [
          "https://cdn.tgdd.vn/Products/Images/2286/123458/bhx/gao-st25-25kg-202401251130536710.jpg",
          "https://cdn.tgdd.vn/Products/Images/2286/123458/bhx/gao-st25-25kg-202401251130539737.jpg",
        ],
      },
      // Biến thể cho gạo Jasmine
      {
        product_id: products[36]._id, // Gạo Jasmine 5kg
        name: "Gạo Jasmine 1kg",
        sku: "GAO-JASMINE-1KG",
        unit: "kg",
        quantity_per_unit: 1,
        price: 20000,
        original_price: 18000,
        in_stock: 120,
        status: "active",
        is_default: false,
        description: "Gạo Jasmine 1kg, gạo thơm Thái Lan",
        images: [
          "https://cdn.tgdd.vn/Products/Images/2286/123459/bhx/gao-jasmine-1kg-202401251130536710.jpg",
          "https://cdn.tgdd.vn/Products/Images/2286/123459/bhx/gao-jasmine-1kg-202401251130539737.jpg",
        ],
      },
      {
        product_id: products[36]._id, // Gạo Jasmine 5kg
        name: "Gạo Jasmine 10kg",
        sku: "GAO-JASMINE-10KG",
        unit: "kg",
        quantity_per_unit: 10,
        price: 180000,
        original_price: 160000,
        in_stock: 40,
        status: "active",
        is_default: false,
        description: "Gạo Jasmine 10kg, tiết kiệm cho gia đình",
        images: [
          "https://cdn.tgdd.vn/Products/Images/2286/123459/bhx/gao-jasmine-10kg-202401251130536710.jpg",
          "https://cdn.tgdd.vn/Products/Images/2286/123459/bhx/gao-jasmine-10kg-202401251130539737.jpg",
        ],
      },
      // Biến thể cho gạo lứt đỏ
      {
        product_id: products[37]._id, // Gạo lứt đỏ 1kg
        name: "Gạo lứt đỏ 500g",
        sku: "GAO-LUT-DO-500G",
        unit: "gram",
        quantity_per_unit: 500,
        price: 15000,
        original_price: 13000,
        in_stock: 200,
        status: "active",
        is_default: false,
        description: "Gạo lứt đỏ 500g, gạo nguyên cám giàu dinh dưỡng",
        images: [
          "https://cdn.tgdd.vn/Products/Images/2286/123460/bhx/gao-lut-do-500g-202401251130536710.jpg",
          "https://cdn.tgdd.vn/Products/Images/2286/123460/bhx/gao-lut-do-500g-202401251130539737.jpg",
        ],
      },
      {
        product_id: products[37]._id, // Gạo lứt đỏ 1kg
        name: "Gạo lứt đỏ 2kg",
        sku: "GAO-LUT-DO-2KG",
        unit: "kg",
        quantity_per_unit: 2,
        price: 45000,
        original_price: 40000,
        in_stock: 80,
        status: "active",
        is_default: false,
        description: "Gạo lứt đỏ 2kg, tiết kiệm cho gia đình",
        images: [
          "https://cdn.tgdd.vn/Products/Images/2286/123460/bhx/gao-lut-do-2kg-202401251130536710.jpg",
          "https://cdn.tgdd.vn/Products/Images/2286/123460/bhx/gao-lut-do-2kg-202401251130539737.jpg",
        ],
      },
      // Biến thể cho nước tương Maggi
      {
        product_id: products[42]._id, // Nước tương đậu nành Maggi thanh dịu chai 450ml
        name: "Nước tương đậu nành Maggi thanh dịu chai 700ml",
        sku: "MAGGI-700ML",
        unit: "chai",
        quantity_per_unit: 1,
        price: 30000,
        original_price: 27000,
        in_stock: 50,
        status: "active",
        is_default: false,
        description:
          "Nước tương đậu nành Maggi thanh dịu chai 700ml, tiết kiệm cho gia đình",
        images: [
          "https://cdn.tgdd.vn/Products/Images/2683/79060/bhx/nuoc-tuong-dau-nanh-thanh-diu-maggi-chai-700ml-202304131533080005.jpg",
          "https://cdn.tgdd.vn/Products/Images/2683/79060/bhx/nuoc-tuong-dau-nanh-thanh-diu-maggi-chai-700ml-202304131530127244.jpg",
          "https://cdn.tgdd.vn/Products/Images/2683/79060/bhx/nuoc-tuong-dau-nanh-thanh-diu-maggi-chai-700ml-202304131530271233.jpg",
        ],
      },
      // Biến thể cho hạt nêm Knorr
      {
        product_id: products[46]._id, // Hạt nêm Knorr thịt thăn, xương ống, tủy gói 400g
        name: "Hạt nêm Knorr thịt thăn, xương ống, tủy gói 1.2kg (Tặng 1kg gạo)",
        sku: "KNORR-1.2KG",
        unit: "gói",
        quantity_per_unit: 1,
        price: 99000,
        original_price: 89000,
        in_stock: 30,
        status: "active",
        is_default: false,
        description:
          "Hạt nêm Knorr thịt thăn, xương ống, tủy gói 1.2kg (Tặng 1kg gạo), tiết kiệm cho gia đình",
        images: [
          "https://cdnv2.tgdd.vn/bhx-static/bhx/Products/Images/2806/335690/bhx/hat-nem-knorr-thit-than-xuong-ong-tuy-goi-12kg-tang-1kg-gao_202504160910373980.jpg",
        ],
      },
      // Biến thể cho hạt nêm Aji-ngon
      {
        product_id: products[47]._id, // Hạt nêm Aji-ngon vị heo gói 900g
        name: "Hạt nêm Aji-ngon vị heo gói 55g",
        sku: "AJI-NGON-55G",
        unit: "gói",
        quantity_per_unit: 1,
        price: 5000,
        original_price: 4500,
        in_stock: 300,
        status: "active",
        is_default: false,
        description: "Hạt nêm Aji-ngon vị heo gói 55g, tiện lợi cho nấu ăn",
        images: [
          "https://cdn.tgdd.vn/Products/Images/2806/198893/bhx/hat-nem-vi-heo-aji-ngon-goi-55g-202211051018410088.jpg",
          "https://cdn.tgdd.vn/Products/Images/2806/198893/bhx/hat-nem-vi-heo-aji-ngon-goi-55g-202211051018384374.jpg",
        ],
      },
      {
        product_id: products[47]._id, // Hạt nêm Aji-ngon vị heo gói 900g
        name: "Hạt nêm Aji-ngon vị heo gói 170g",
        sku: "AJI-NGON-170G",
        unit: "gói",
        quantity_per_unit: 1,
        price: 17000,
        original_price: 15000,
        in_stock: 150,
        status: "active",
        is_default: false,
        description: "Hạt nêm Aji-ngon vị heo gói 170g, tiện lợi cho gia đình",
        images: [
          "https://cdn.tgdd.vn/Products/Images/2806/177826/bhx/hat-nem-aji-ngon-vi-heo-goi-170g-202407021018299777.jpg",
          "https://cdnv2.tgdd.vn/bhx-static/bhx/Products/Images/2806/177826/bhx/177826-slide-moi_202409271647007891.jpg",
        ],
      },
      {
        product_id: products[47]._id, // Hạt nêm Aji-ngon vị heo gói 900g
        name: "Hạt nêm Aji-ngon vị heo gói 400g",
        sku: "AJI-NGON-400G",
        unit: "gói",
        quantity_per_unit: 1,
        price: 32500,
        original_price: 29000,
        in_stock: 100,
        status: "active",
        is_default: false,
        description: "Hạt nêm Aji-ngon vị heo gói 400g, tiết kiệm cho gia đình",
        images: [
          "https://cdn.tgdd.vn/Products/Images/2806/82259/bhx/hat-nem-vi-heo-aji-ngon-goi-400g-202303281033540192.jpg",
          "https://cdnv2.tgdd.vn/bhx-static/bhx/Products/Images/2806/82259/bhx/82259-slide-moi_202409300935251423.jpg",
          "https://cdnv2.tgdd.vn/bhx-static/bhx/Products/Images/2806/82259/bhx/82259-mat-sau_202409300935243227.jpg",
        ],
      },
      // Biến thể cho bia Budweiser
      {
        product_id: products[28]._id, // Thùng 20 lon bia Budweiser 330ml
        name: "Bia Budweiser lon 330ml",
        sku: "BUDWEISER-330ML",
        unit: "lon",
        quantity_per_unit: 1,
        price: 15000,
        original_price: 14000,
        in_stock: 200,
        status: "active",
        is_default: true,
        description: "Bia Budweiser lon 330ml, hương vị quốc tế, tươi mát",
        images: [
          "https://cdn.tgdd.vn/Products/Images/2282/176453/bhx/bia-budweiser-lon-330ml-202110111018291885.jpg",
        ],
      },
      {
        product_id: products[28]._id, // Thùng 20 lon bia Budweiser 330ml
        name: "6 lon bia Budweiser 330ml",
        sku: "BUDWEISER-6LON",
        unit: "lốc",
        quantity_per_unit: 6,
        price: 85000,
        original_price: 80000,
        in_stock: 100,
        status: "active",
        is_default: false,
        description: "6 lon bia Budweiser 330ml, tiết kiệm cho gia đình",
        images: [
          "https://cdn.tgdd.vn/Products/Images/2282/195212/bhx/6-lon-bia-budweiser-330ml-202110111020026125.jpg",
        ],
      },
      // Biến thể cho bia Hoegaarden Peach
      {
        product_id: products[29]._id, // Thùng 12 lon bia Hoegaarden Peach vị đào 500ml
        name: "Bia Hoegaarden Peach vị đào lon 500ml",
        sku: "HOEGAARDEN-PEACH-500ML",
        unit: "lon",
        quantity_per_unit: 1,
        price: 35000,
        original_price: 33000,
        in_stock: 150,
        status: "active",
        is_default: true,
        description:
          "Bia Hoegaarden Peach vị đào lon 500ml, hương vị độc đáo, tươi mát",
        images: [
          "https://cdn.tgdd.vn/Products/Images/2282/303818/bhx/bia-hoegaarden-peach-vi-dao-lon-500ml-202303151340438081.jpg",
        ],
      },
      // Biến thể cho bia Huda
      {
        product_id: products[30]._id, // Thùng 24 lon bia Huda 330ml
        name: "6 lon bia Huda 330ml",
        sku: "HUDA-6LON",
        unit: "lốc",
        quantity_per_unit: 6,
        price: 70000,
        original_price: 65000,
        in_stock: 120,
        status: "active",
        is_default: true,
        description: "6 lon bia Huda 330ml, tiết kiệm cho gia đình",
        images: [
          "https://cdn.tgdd.vn/Products/Images/2282/113153/bhx/6-lon-bia-huda-330ml-202309191329088559.jpg",
        ],
      },
      {
        product_id: products[30]._id, // Thùng 24 lon bia Huda 330ml
        name: "Bia Huda 330ml",
        sku: "HUDA-330ML",
        unit: "lon",
        quantity_per_unit: 1,
        price: 12000,
        original_price: 11000,
        in_stock: 300,
        status: "active",
        is_default: false,
        description: "Bia Huda 330ml, hương vị truyền thống, tươi mát",
        images: [
          "https://cdn.tgdd.vn/Products/Images/2282/113152/bhx/bia-huda-330ml-202309191327455945.jpg",
        ],
      },
      // Biến thể cho bia Red Ruby
      {
        product_id: products[31]._id, // Thùng 24 lon Bia Red Ruby 330ml
        name: "Bia Red Ruby lon 330ml",
        sku: "RED-RUBY-330ML",
        unit: "lon",
        quantity_per_unit: 1,
        price: 10000,
        original_price: 9500,
        in_stock: 250,
        status: "active",
        is_default: true,
        description: "Bia Red Ruby lon 330ml, hương vị độc đáo, tươi mát",
        images: [
          "https://cdnv2.tgdd.vn/bhx-static/bhx/Products/Images/2282/266235/bhx/cdntgddvnproductsimages2282266318bhx-202212201621497176_202409241318343626.jpg",
        ],
      },
      {
        product_id: products[31]._id, // Thùng 24 lon Bia Red Ruby 330ml
        name: "Lốc 6 lon Bia Red Ruby 330ml",
        sku: "RED-RUBY-6LON",
        unit: "lốc",
        quantity_per_unit: 6,
        price: 55000,
        original_price: 52000,
        in_stock: 80,
        status: "active",
        is_default: false,
        description: "Lốc 6 lon Bia Red Ruby 330ml, tiết kiệm cho gia đình",
        images: [
          "https://cdnv2.tgdd.vn/bhx-static/bhx/Products/Images/2282/266426/bhx/vfv_202409241317322883.jpg",
        ],
      },
      // Biến thể cho bia Blanc 1664
      {
        product_id: products[32]._id, // Thùng 24 lon bia Blanc 1664 330ml
        name: "Bia Blanc 1664 lon 330ml",
        sku: "BLANC-1664-330ML",
        unit: "lon",
        quantity_per_unit: 1,
        price: 17000,
        original_price: 16000,
        in_stock: 180,
        status: "active",
        is_default: true,
        description: "Bia Blanc 1664 lon 330ml, hương vị quốc tế, tươi mát",
        images: [
          "https://cdn.tgdd.vn/Products/Images/2282/252734/bhx/bia-blanc-1664-lon-330ml-202407111000458266.jpg",
        ],
      },
      {
        product_id: products[32]._id, // Thùng 24 lon bia Blanc 1664 330ml
        name: "Lốc 6 lon bia Blanc 1664 330ml",
        sku: "BLANC-1664-6LON",
        unit: "lốc",
        quantity_per_unit: 6,
        price: 95000,
        original_price: 90000,
        in_stock: 60,
        status: "active",
        is_default: false,
        description: "Lốc 6 lon bia Blanc 1664 330ml, tiết kiệm cho gia đình",
        images: [
          "https://cdn.tgdd.vn/Products/Images/2282/252736/bhx/loc-6-lon-bia-blanc-1664-330ml-202407111440578192.jpg",
        ],
      },
      // Biến thể cho bia Sapporo
      {
        product_id: products[33]._id, // Thùng 12 lon bia Sapporo 500ml
        name: "Lốc 6 lon bia Sapporo 500ml",
        sku: "SAPPORO-6LON",
        unit: "lốc",
        quantity_per_unit: 6,
        price: 180000,
        original_price: 170000,
        in_stock: 70,
        status: "active",
        is_default: true,
        description: "Lốc 6 lon bia Sapporo 500ml, tiết kiệm cho gia đình",
        images: [
          "https://cdnv2.tgdd.vn/bhx-static/bhx/Products/Images/2282/242598/bhx/slide-8_202411131020363944.jpg",
        ],
      },
      {
        product_id: products[33]._id, // Thùng 12 lon bia Sapporo 500ml
        name: "Bia Sapporo lon 500ml",
        sku: "SAPPORO-500ML",
        unit: "lon",
        quantity_per_unit: 1,
        price: 30000,
        original_price: 28000,
        in_stock: 150,
        status: "active",
        is_default: false,
        description: "Bia Sapporo lon 500ml, hương vị quốc tế, tươi mát",
        images: [
          "https://cdnv2.tgdd.vn/bhx-static/bhx/Products/Images/2282/242599/bhx/slide-1-copy_202411131019492958.jpg",
        ],
      },
      // Biến thể cho bia Heineken Silver (thứ 2)
      {
        product_id: products[34]._id, // Thùng 24 lon bia Heineken Silver 330ml (thứ 2)
        name: "6 lon bia Heineken Silver 330ml",
        sku: "HEINEKEN-SILVER-6LON-2",
        unit: "lốc",
        quantity_per_unit: 6,
        price: 110000,
        original_price: 105000,
        in_stock: 80,
        status: "active",
        is_default: true,
        description: "6 lon bia Heineken Silver 330ml, tiết kiệm cho gia đình",
        images: [
          "https://cdn.tgdd.vn/Products/Images/2282/200638/bhx/6-lon-bia-heineken-silver-330ml-202301152339137476.jpg",
        ],
      },
      {
        product_id: products[34]._id, // Thùng 24 lon bia Heineken Silver 330ml (thứ 2)
        name: "Bia Heineken Bạc lon 330ml",
        sku: "HEINEKEN-SILVER-330ML-2",
        unit: "lon",
        quantity_per_unit: 1,
        price: 19000,
        original_price: 18000,
        in_stock: 200,
        status: "active",
        is_default: false,
        description: "Bia Heineken Bạc lon 330ml, hương vị quốc tế, tươi mát",
        images: [
          "https://cdn.tgdd.vn/Products/Images/2282/200637/bhx/bia-heineken-silver-330ml-201903281046586878.jpg",
        ],
      },
      // Biến thể cho bia Heineken Sleek
      {
        product_id: products[35]._id, // Thùng 24 lon bia Heineken Sleek 330ml
        name: "Bia Heineken Sleek 330ml",
        sku: "HEINEKEN-SLEEK-330ML",
        unit: "lon",
        quantity_per_unit: 1,
        price: 19000,
        original_price: 18000,
        in_stock: 200,
        status: "active",
        is_default: true,
        description: "Bia Heineken Sleek 330ml, hương vị quốc tế, tươi mát",
        images: [
          "https://cdn.tgdd.vn/Products/Images/2282/148785/bhx/bia-heineken-sleek-330ml-202003250703333577.JPG",
        ],
      },
      {
        product_id: products[35]._id, // Thùng 24 lon bia Heineken Sleek 330ml
        name: "6 lon bia Heineken Sleek 330ml",
        sku: "HEINEKEN-SLEEK-6LON",
        unit: "lốc",
        quantity_per_unit: 6,
        price: 110000,
        original_price: 105000,
        in_stock: 80,
        status: "active",
        is_default: false,
        description: "6 lon bia Heineken Sleek 330ml, tiết kiệm cho gia đình",
        images: [
          "https://cdnv2.tgdd.vn/bhx-static/bhx/Products/Images/2282/148786/bhx/412208-3-1_202501031413302535.jpg",
        ],
      },
      // Biến thể cho bia Bia Việt
      {
        product_id: products[36]._id, // Thùng 24 lon bia Bia Việt 330ml
        name: "Bia Việt lon 330ml",
        sku: "BIA-VIET-330ML",
        unit: "lon",
        quantity_per_unit: 1,
        price: 11000,
        original_price: 10000,
        in_stock: 250,
        status: "active",
        is_default: true,
        description: "Bia Việt lon 330ml, hương vị truyền thống, tươi mát",
        images: [
          "https://cdnv2.tgdd.vn/bhx-static/bhx/Products/Images/2282/229494/bhx/cdntgddvnproductsimages2282229494bhxbia-viet-lon-330ml-202308180906450788_202410160902402100.jpg",
        ],
      },
      {
        product_id: products[36]._id, // Thùng 24 lon bia Bia Việt 330ml
        name: "6 lon bia Việt 330ml",
        sku: "BIA-VIET-6LON",
        unit: "lốc",
        quantity_per_unit: 6,
        price: 60000,
        original_price: 55000,
        in_stock: 100,
        status: "active",
        is_default: false,
        description: "6 lon bia Việt 330ml, tiết kiệm cho gia đình",
        images: [
          "https://cdn.tgdd.vn/Products/Images/2282/229507/bhx/6-lon-bia-viet-330ml-202407101630590785.jpg",
        ],
      },
      // Biến thể cho Strongbow Kiwi và thanh long
      {
        product_id: products[37]._id, // Thùng 24 lon Strongbow Kiwi và thanh long lon 320ml
        name: "Strongbow thơm và lựu lon 320ml",
        sku: "STRONGBOW-320ML",
        unit: "lon",
        quantity_per_unit: 1,
        price: 20000,
        original_price: 19000,
        in_stock: 120,
        status: "active",
        is_default: true,
        description:
          "Strongbow thơm và lựu lon 320ml, hương vị độc đáo, tươi mát",
        images: [
          "https://cdn.tgdd.vn/Products/Images/2282/327834/bhx/strongbow-thom-va-luu-lon-320ml-clone-202407101327455799.jpg",
        ],
      },
      {
        product_id: products[37]._id, // Thùng 24 lon Strongbow Kiwi và thanh long lon 320ml
        name: "Strongbow Kiwi và thanh long lon 320ml",
        sku: "STRONGBOW-KIWI-320ML",
        unit: "lon",
        quantity_per_unit: 1,
        price: 20000,
        original_price: 19000,
        in_stock: 120,
        status: "active",
        is_default: false,
        description:
          "Strongbow Kiwi và thanh long lon 320ml, hương vị độc đáo, tươi mát",
        images: [
          "https://cdn.tgdd.vn/Products/Images/2282/327836/bhx/strongbow-kiwi-va-thanh-long-lon-320ml-clone-202407101334461833.jpg",
        ],
      },
      // Biến thể cho nước ngọt (giữ nguyên các chỉ số gốc)
      // Biến thể cho Thùng 24 chai nước ngọt Coca Cola 390ml
      {
        product_id: products[38]._id, // Thùng 24 chai nước ngọt Coca Cola 390ml  
        name: "Nước ngọt Coca Cola chai 390ml",
        sku: "COCA-390ML-CHAI",
        unit: "chai",
        quantity_per_unit: 1,
        price: 8000,
        original_price: 7000,
        in_stock: 200,
        status: "active",
        is_default: true,
        description: "Nước ngọt Coca Cola chai 390ml, hương vị đặc trưng, sảng khoái",
        images: [
          "https://cdnv2.tgdd.vn/bhx-static/bhx/Products/Images/2443/76450/bhx/vrfgbyu78i7_202410121035379000.jpg",
          "https://cdnv2.tgdd.vn/bhx-static/bhx/Products/Images/2443/76450/bhx/kiu8i_202410121035385217.jpg",
        ],
      },
      {
        product_id: products[38]._id, // Thùng 24 chai nước ngọt Coca Cola 390ml
        name: "6 chai nước ngọt Coca Cola 390ml", 
        sku: "COCA-390ML-6CHAI",
        unit: "lốc",
        quantity_per_unit: 6,
        price: 45000,
        original_price: 40000,
        in_stock: 100,
        status: "active",
        is_default: false,
        description: "6 chai nước ngọt Coca Cola 390ml, tiết kiệm cho gia đình",
        images: [
          "https://cdnv2.tgdd.vn/bhx-static/bhx/Products/Images/2443/88651/bhx/rh6y45_202410121036392022.jpg",
          "https://cdnv2.tgdd.vn/bhx-static/bhx/Products/Images/2443/88651/bhx/u7uo9_202410121036394090.jpg",
          "https://cdnv2.tgdd.vn/bhx-static/bhx/Products/Images/2443/88651/bhx/kiu8i_202410121036396138.jpg",
        ],
      },
      // Biến thể cho Thùng 24 lon nước ngọt Pepsi không calo 320ml
      {
        product_id: products[41]._id, // Thùng 24 lon nước ngọt Pepsi không calo 320ml
        name: "Nước ngọt Pepsi không calo lon 320ml",
        sku: "PEPSI-ZERO-320ML",
        unit: "lon", 
        quantity_per_unit: 1,
        price: 8000,
        original_price: 7000,
        in_stock: 180,
        status: "active",
        is_default: true,
        description: "Nước ngọt Pepsi không calo lon 320ml, hương vị đặc trưng, không calo",
        images: [
          "https://cdn.tgdd.vn/Products/Images/2443/227312/bhx/nuoc-ngot-pepsi-khong-calo-lon-320ml-202405140927583779.jpg",
          "https://cdn.tgdd.vn/Products/Images/2443/227312/bhx/nuoc-ngot-pepsi-khong-calo-lon-320ml-202405140927585301.jpg",
          "https://cdn.tgdd.vn/Products/Images/2443/227312/bhx/nuoc-ngot-pepsi-khong-calo-lon-320ml-202405140927587680.jpg",
        ],
      },
      {
        product_id: products[41]._id, // Thùng 24 lon nước ngọt Pepsi không calo 320ml
        name: "6 lon nước ngọt Pepsi không calo 320ml",
        sku: "PEPSI-ZERO-6LON", 
        unit: "lốc",
        quantity_per_unit: 6,
        price: 45000,
        original_price: 40000,
        in_stock: 90,
        status: "active",
        is_default: false,
        description: "6 lon nước ngọt Pepsi không calo 320ml, tiết kiệm cho gia đình",
        images: [
          "https://cdn.tgdd.vn/Products/Images/2443/227313/bhx/6-lon-nuoc-ngot-pepsi-khong-calo-320ml-202405140930319101.jpg",
          "https://cdn.tgdd.vn/Products/Images/2443/227313/bhx/6-lon-nuoc-ngot-pepsi-khong-calo-320ml-202405140930321493.jpg",
          "https://cdn.tgdd.vn/Products/Images/2443/227313/bhx/6-lon-nuoc-ngot-pepsi-khong-calo-320ml-202405140930324415.jpg",
        ],
      },
      // Biến thể cho Thùng 24 lon nước ngọt Coca Cola 320ml
      {
        product_id: products[44]._id, // Thùng 24 lon nước ngọt Coca Cola 320ml
        name: "Nước ngọt Coca Cola lon 320ml",
        sku: "COCA-320ML-LON",
        unit: "lon",
        quantity_per_unit: 1,
        price: 8000,
        original_price: 7000,
        in_stock: 220,
        status: "active",
        is_default: true,
        description: "Nước ngọt Coca Cola lon 320ml, hương vị đặc trưng, sảng khoái",
        images: [
          "https://cdn.tgdd.vn/Products/Images/2443/76451/bhx/nuoc-ngot-coca-cola-lon-320ml-202304131107525481.jpg",
          "https://cdn.tgdd.vn/Products/Images/2443/76451/bhx/nuoc-ngot-coca-cola-lon-320ml-202304131107527790.jpg",
          "https://cdn.tgdd.vn/Products/Images/2443/76451/bhx/nuoc-ngot-coca-cola-lon-320ml-202304131107529957.jpg",
          "https://cdn.tgdd.vn/Products/Images/2443/76451/bhx/nuoc-ngot-coca-cola-lon-320ml-202304131107532011.jpg",
        ],
      },
      {
        product_id: products[44]._id, // Thùng 24 lon nước ngọt Coca Cola 320ml
        name: "6 lon nước ngọt Coca Cola 320ml",
        sku: "COCA-320ML-6LON",
        unit: "lốc",
        quantity_per_unit: 6,
        price: 45000,
        original_price: 40000,
        in_stock: 110,
        status: "active",
        is_default: false,
        description: "6 lon nước ngọt Coca Cola 320ml, tiết kiệm cho gia đình",
        images: [
          "https://cdn.tgdd.vn/Products/Images/2443/125398/bhx/6-lon-nuoc-ngot-coca-cola-320ml-202303181532309738.jpg",
          "https://cdn.tgdd.vn/Products/Images/2443/125398/bhx/6-lon-nuoc-ngot-coca-cola-320ml-202304131108497884.jpg",
          "https://cdn.tgdd.vn/Products/Images/2443/125398/bhx/6-lon-nuoc-ngot-coca-cola-320ml-202304131108500275.jpg",
          "https://cdn.tgdd.vn/Products/Images/2443/125398/bhx/6-lon-nuoc-ngot-coca-cola-320ml-202304131108502335.jpg",
        ],
      },
      // Biến thể cho Thùng 24 lon nước ngọt Sprite hương chanh 320ml
      {
        product_id: products[47]._id, // Thùng 24 lon nước ngọt Sprite hương chanh 320ml
        name: "Nước ngọt Sprite hương chanh lon 320ml",
        sku: "SPRITE-320ML-LON",
        unit: "lon",
        quantity_per_unit: 1,
        price: 8000,
        original_price: 7000,
        in_stock: 190,
        status: "active",
        is_default: true,
        description: "Nước ngọt Sprite hương chanh lon 320ml, hương vị chanh tươi mát",
        images: [
          "https://cdn.tgdd.vn/Products/Images/2443/85146/bhx/nuoc-ngot-sprite-huong-chanh-lon-320ml-202306200909131864.jpg",
          "https://cdn.tgdd.vn/Products/Images/2443/85146/bhx/nuoc-ngot-sprite-huong-chanh-lon-320ml-202306200909134750.jpg",
          "https://cdn.tgdd.vn/Products/Images/2443/85146/bhx/nuoc-ngot-sprite-huong-chanh-lon-320ml-202306200909137681.jpg",
          "https://cdn.tgdd.vn/Products/Images/2443/85146/bhx/nuoc-ngot-sprite-huong-chanh-lon-320ml-202306200909141431.jpg",
        ],
      },
      {
        product_id: products[47]._id, // Thùng 24 lon nước ngọt Sprite hương chanh 320ml
        name: "6 lon nước ngọt Sprite hương chanh 320ml",
        sku: "SPRITE-320ML-6LON",
        unit: "lốc",
        quantity_per_unit: 6,
        price: 45000,
        original_price: 40000,
        in_stock: 95,
        status: "active",
        is_default: false,
        description: "6 lon nước ngọt Sprite hương chanh 320ml, tiết kiệm cho gia đình",
        images: [
          "https://cdn.tgdd.vn/Products/Images/2443/195224/bhx/6-lon-nuoc-ngot-sprite-huong-chanh-320ml-202306200911339539.jpg",
          "https://cdn.tgdd.vn/Products/Images/2443/195224/bhx/6-lon-nuoc-ngot-sprite-huong-chanh-320ml-202306200911345909.jpg",
          "https://cdn.tgdd.vn/Products/Images/2443/195224/bhx/6-lon-nuoc-ngot-sprite-huong-chanh-320ml-202306200911349006.jpg",
          "https://cdn.tgdd.vn/Products/Images/2443/195224/bhx/6-lon-nuoc-ngot-sprite-huong-chanh-320ml-202306200911352214.jpg",
        ],
      },
      // Biến thể cho Thùng 24 lon nước ngọt Fanta hương cam 320ml
      {
        product_id: products[50]._id, // Thùng 24 lon nước ngọt Fanta hương cam 320ml
        name: "Nước ngọt Fanta hương cam lon 320ml",
        sku: "FANTA-320ML-LON",
        unit: "lon",
        quantity_per_unit: 1,
        price: 8000,
        original_price: 7000,
        in_stock: 170,
        status: "active",
        is_default: true,
        description: "Nước ngọt Fanta hương cam lon 320ml, hương vị cam tươi mát",
        images: [
          "https://cdnv2.tgdd.vn/bhx-static/bhx/Products/Images/2443/76453/bhx/z-2_202411041431130825.jpg",
          "https://cdnv2.tgdd.vn/bhx-static/bhx/Products/Images/2443/76453/bhx/z_202411041431127560.jpg",
        ],
      },
      {
        product_id: products[50]._id, // Thùng 24 lon nước ngọt Fanta hương cam 320ml
        name: "6 lon nước ngọt Fanta hương cam 320ml",
        sku: "FANTA-320ML-6LON",
        unit: "lốc",
        quantity_per_unit: 6,
        price: 45000,
        original_price: 40000,
        in_stock: 85,
        status: "active",
        is_default: false,
        description: "6 lon nước ngọt Fanta hương cam 320ml, tiết kiệm cho gia đình",
        images: [
          "https://cdnv2.tgdd.vn/bhx-static/bhx/Products/Images/2443/193332/bhx/z-29_202411041516025891.jpg",
          "https://cdnv2.tgdd.vn/bhx-static/bhx/Products/Images/2443/193332/bhx/z-2_202411041516031783.jpg",
          "https://cdnv2.tgdd.vn/bhx-static/bhx/Products/Images/2443/193332/bhx/z_202411041516021448.jpg",
        ],
      },
      // Biến thể cho gạo (giữ nguyên index gốc)
      // Biến thể cho Gạo thơm Vua Gạo ST25+ túi 5kg
      {
        product_id: products[32]._id, // Gạo thơm Vua Gạo ST25+ túi 5kg
        name: "Gạo thơm Vua Gạo ST25+ túi 2kg",
        sku: "VUAGAO-ST25-2KG",
        unit: "túi",
        quantity_per_unit: 1,
        price: 42000,
        original_price: 38000,
        in_stock: 120,
        status: "active",
        is_default: false,
        description: "Gạo thơm Vua Gạo ST25+ túi 2kg, gạo thơm ngon nhất thế giới, đóng gói nhỏ tiện lợi",
        images: [
          "https://cdn.tgdd.vn/Products/Images/2513/159559/bhx/gao-thom-vua-gao-lang-ta-tui-2kg-202105041530202000.jpeg",
          "https://cdn.tgdd.vn/Products/Images/2513/159559/bhx/gao-thom-vua-gao-lang-ta-tui-2kg-202105041530205743.jpeg",
        ],
      },
      {
        product_id: products[32]._id, // Gạo thơm Vua Gạo ST25+ túi 5kg
        name: "Gạo thơm Vua Gạo ST25+ túi 10kg",
        sku: "VUAGAO-ST25-10KG",
        unit: "túi",
        quantity_per_unit: 1,
        price: 185000,
        original_price: 175000,
        in_stock: 45,
        status: "active",
        is_default: false,
        description: "Gạo thơm Vua Gạo ST25+ túi 10kg, gạo thơm ngon nhất thế giới, tiết kiệm cho gia đình",
        images: [
          "https://cdnv2.tgdd.vn/bhx-static/bhx/Products/Images/2513/332640/bhx/thiet-ke-chua-co-ten-2024-12-02t101141121_202412021017531362.jpg",
        ],
      },
      // Biến thể cho Gạo A An ST25+ túi 5kg
      {
        product_id: products[33]._id, // Gạo A An ST25+ túi 5kg
        name: "Gạo A An ST25+ túi 2kg",
        sku: "AAN-ST25-2KG",
        unit: "túi",
        quantity_per_unit: 1,
        price: 40000,
        original_price: 36000,
        in_stock: 100,
        status: "active",
        is_default: false,
        description: "Gạo A An ST25+ túi 2kg, gạo thơm ngon chất lượng cao, đóng gói nhỏ tiện lợi",
        images: [
          "https://cdnv2.tgdd.vn/bhx-static/bhx/Products/Images/2513/332920/bhx/bs9a9653_202412241548528679.jpg",
          "https://cdnv2.tgdd.vn/bhx-static/bhx/Products/Images/2513/332920/bhx/preview_202412241548525787.jpg",
        ],
      },
      // Biến thể cho kem (giữ nguyên index gốc)
      // Biến thể cho Kem que Topten vanila Walls cay 55g
      {
        product_id: products[27]._id, // Kem que Topten vanila Walls cay 55g
        name: "Hộp 24 cây kem que Topten vanila Walls 55g",
        sku: "TOPTEN-VANILA-24CAY",
        unit: "hộp",
        quantity_per_unit: 24,
        price: 280000,
        original_price: 240000,
        in_stock: 30,
        status: "active",
        is_default: false,
        description: "Hộp 24 cây kem que Topten vanila Walls 55g, tiết kiệm cho cửa hàng",
        images: [
          "https://cdn.tgdd.vn/Products/Images/7462/250227/bhx/kem-que-topten-vanila-walls-cay-55g-202308231020269976.jpg",
        ],
      },
      // Biến thể cho Kem que Topten socola Walls cay 55g  
      {
        product_id: products[28]._id, // Kem que Topten socola Walls cay 55g
        name: "Hộp 24 cây kem que Topten socola Walls 55g",
        sku: "TOPTEN-SOCOLA-24CAY",
        unit: "hộp",
        quantity_per_unit: 24,
        price: 280000,
        original_price: 240000,
        in_stock: 25,
        status: "active",
        is_default: false,
        description: "Hộp 24 cây kem que Topten socola Walls 55g, tiết kiệm cho cửa hàng",
        images: [
          "https://cdn.tgdd.vn/Products/Images/7462/250226/bhx/kem-que-topten-socola-walls-55g-202401031541273583.jpg",
        ],
      },
      // Biến thể cho sữa chua (giữ nguyên index gốc)
      // Biến thể cho Lốc 4 hộp vàng sữa hương vani Monte 55g
      {
        product_id: products[31]._id, // Lốc 4 hộp vàng sữa hương vani Monte 55g
        name: "Hộp sữa chua vàng hương vani Monte 55g",
        sku: "MONTE-VANI-55G",
        unit: "hộp",
        quantity_per_unit: 1,
        price: 4500,
        original_price: 4000,
        in_stock: 200,
        status: "active",
        is_default: true,
        description: "Hộp sữa chua vàng hương vani Monte 55g, hương vị vani thơm ngon",
        images: [
          "https://cdn.tgdd.vn/Products/Images/7558/207651/bhx/loc-4-hop-vang-sua-vani-monte-55g-201907290829096920.jpg",
        ],
      },
      {
        product_id: products[31]._id, // Lốc 4 hộp vàng sữa hương vani Monte 55g
        name: "Thùng 48 hộp sữa chua vàng hương vani Monte 55g",
        sku: "MONTE-VANI-48HOP",
        unit: "thùng",
        quantity_per_unit: 48,
        price: 200000,
        original_price: 190000,
        in_stock: 20,
        status: "active",
        is_default: false,
        description: "Thùng 48 hộp sữa chua vàng hương vani Monte 55g, tiết kiệm cho cửa hàng",
        images: [
          "https://cdnv2.tgdd.vn/bhx-static/bhx/Products/Images/7558/207651/bhx/loc-4-hop-vang-sua-vani-monte-55g_202503260926389844.jpg",
        ],
      },
    ]);

    console.log("Seed data created successfully!");
    console.log("Admin user:", admin.username);
    console.log("Normal user:", user.username);
    console.log("Categories:", categories.length);
    console.log("Products:", products.length);
    console.log("Variants:", variants.length);
    console.log("Vouchers:", vouchers.length);

    process.exit(0);
  } catch (error) {
    console.error("Error seeding data:", error);
    process.exit(1);
  }
};

seedData(); 

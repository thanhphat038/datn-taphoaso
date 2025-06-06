import bcrypt from 'bcrypt';
import { connectDB } from '../src/config/database.js';
import User from '../src/models/user.model.js';
import Category from '../src/models/category.model.js';
import Product from '../src/models/product.model.js';
import Voucher from '../src/models/voucher.model.js';

const seedData = async () => {
  try {
    // Connect to MongoDB
    await connectDB();

    // Clear existing data
    await User.deleteMany({});
    await Category.deleteMany({});
    await Product.deleteMany({});
    await Voucher.deleteMany({});

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
      }
    ]);

    // Create products
    const products = await Product.create([
      {
        category_id: categories[0]._id,
        name: 'Rau muống',
        price: 15000,
        status: 'active',
        description: 'Rau muống tươi ngon',
        images: ['https://example.com/rau-muong.jpg']
      },
      {
        category_id: categories[0]._id,
        name: 'Rau cải',
        price: 20000,
        status: 'active',
        description: 'Rau cải tươi ngon',
        images: ['https://example.com/rau-cai.jpg']
      },
      {
        category_id: categories[1]._id,
        name: 'Táo',
        price: 45000,
        status: 'active',
        description: 'Táo tươi ngon',
        images: ['https://example.com/tao.jpg']
      },
      {
        category_id: categories[1]._id,
        name: 'Cam',
        price: 35000,
        status: 'active',
        description: 'Cam tươi ngon',
        images: ['https://example.com/cam.jpg']
      },
      {
        category_id: categories[2]._id,
        name: 'Thịt heo',
        price: 150000,
        status: 'active',
        description: 'Thịt heo tươi ngon',
        images: ['https://example.com/thit-heo.jpg']
      },
      {
        category_id: categories[2]._id,
        name: 'Cá basa',
        price: 120000,
        status: 'active',
        description: 'Cá basa tươi ngon',
        images: ['https://example.com/ca-basa.jpg']
      },
      {
        category_id: categories[3]._id,
        name: 'Muối',
        price: 5000,
        status: 'active',
        description: 'Muối tinh khiết',
        images: ['https://example.com/muoi.jpg']
      },
      {
        category_id: categories[3]._id,
        name: 'Tiêu',
        price: 25000,
        status: 'active',
        description: 'Tiêu đen',
        images: ['https://example.com/tieu.jpg']
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

    console.log('Seed data created successfully!');
    console.log('Admin user:', admin.username);
    console.log('Normal user:', user.username);
    console.log('Categories:', categories.length);
    console.log('Products:', products.length);
    console.log('Vouchers:', vouchers.length);

    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData(); 
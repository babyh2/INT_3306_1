import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sequelize from './src/config/database.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runMigration() {
  try {
    console.log('🔄 Đang kết nối database...');
    await sequelize.authenticate();
    console.log('✅ Kết nối database thành công!');

    const sqlFile = path.join(__dirname, 'database', 'chat_tables.sql');
    console.log(`📄 Đọc file: ${sqlFile}`);
    
    const sql = fs.readFileSync(sqlFile, 'utf8');
    
    // Split by semicolon and filter out empty statements
    const statements = sql
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0);

    console.log(`📝 Tìm thấy ${statements.length} câu lệnh SQL`);

    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      console.log(`\n⚙️  Đang thực thi câu lệnh ${i + 1}/${statements.length}...`);
      await sequelize.query(statement);
      console.log(`✅ Hoàn thành câu lệnh ${i + 1}`);
    }

    console.log('\n🎉 Migration hoàn tất!');
    console.log('✅ Đã tạo bảng: chats, messages');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Lỗi khi chạy migration:', error.message);
    process.exit(1);
  }
}

runMigration();

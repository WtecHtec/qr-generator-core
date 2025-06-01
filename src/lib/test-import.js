// 测试导入修复
const { createQRGenerator } = require('./dist/index.js');

console.log('测试 CommonJS 导入...');
console.log('createQRGenerator:', typeof createQRGenerator);

// 测试创建生成器
try {
  const generator = createQRGenerator({
    text: 'Hello World',
    width: 400,
    height: 400
  });
  console.log('QR生成器创建成功:', typeof generator);
  console.log('配置验证:', generator.validateConfig());
} catch (error) {
  console.error('创建失败:', error.message);
}

console.log('基本导入测试完成'); 
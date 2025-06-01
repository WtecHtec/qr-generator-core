// 图片加载工具函数
export const loadImageFromUrl = async (url: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        if (!ctx) {
          throw new Error('无法创建canvas上下文');
        }

        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        
        const dataUrl = canvas.toDataURL('image/png');
        resolve(dataUrl);
      } catch (error) {
        reject(new Error('图片转换失败'));
      }
    };
    
    img.onerror = () => {
      reject(new Error('图片加载失败，请检查URL是否正确或图片是否支持跨域访问'));
    };
    
    img.src = url;
  });
};

// 验证URL是否为图片
export const isValidImageUrl = (url: string): boolean => {
  const imageExtensions = /\.(jpg|jpeg|png|gif|webp|svg|bmp|ico)(\?.*)?$/i;
  return imageExtensions.test(url) || url.includes('data:image/');
};

// 获取图片信息
export const getImageInfo = async (url: string): Promise<{width: number, height: number, size?: number}> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    img.onload = () => {
      resolve({
        width: img.width,
        height: img.height,
      });
    };
    
    img.onerror = () => {
      reject(new Error('无法获取图片信息'));
    };
    
    img.src = url;
  });
}; 
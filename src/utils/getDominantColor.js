export const getDominantColor = (imageUrl) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.src = imageUrl;
    
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = img.width;
      canvas.height = img.height;
      
      ctx.drawImage(img, 0, 0);
      
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      const colorCount = {};
      let maxCount = 0;
      let dominantColor = 'transparent';

      for (let i = 0; i < data.length; i += 4) {
        const rgba = `rgba(${data[i]},${data[i+1]},${data[i+2]},${data[i+3]})`;
        colorCount[rgba] = (colorCount[rgba] || 0) + 1;
        
        if (colorCount[rgba] > maxCount) {
          maxCount = colorCount[rgba];
          dominantColor = rgba;
        }
      }

      resolve(dominantColor);
    };

    img.onerror = reject;
  });
}; 
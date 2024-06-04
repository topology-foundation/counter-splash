import { updatePixels } from './store/wall';

export function generateRandomPixels(width: number, height: number, count: number) {
  const updates = [];
  for (let i = 0; i < count; i++) {
    const x = Math.floor(Math.random() * width);
    const y = Math.floor(Math.random() * height);
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    const a = 255;
   // updates.push({ x, y, r, g, b, a });
  }


  for(let i = 500; i < 1000; i++) {
    for(let j = 500; j < 1000; j++) {
      updates.push( i, j , 255, 255, 255, 255)
    }
  }
  updatePixels(updates);
}

export function initPixelToImage(imageUrl: string) {

  // Create an image element
  const image = new Image();

  // Set the image source to the URL
  image.src = imageUrl;

  // Wait for the image to load
  image.onload = () => {
    // Create a canvas element
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    // Set the canvas dimensions to match the image
    canvas.width = image.width;
    canvas.height = image.height;

    // Draw the image onto the canvas
    ctx.drawImage(image, 0, 0);

    // Get the pixel data
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    // Iterate through each pixel
    const updates = [];
    for (let i = 0; i < data.length; i += 4) {
      // Extract RGBA values for each pixel
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const a = data[i + 3];

      // Calculate x and y coordinates based on pixel index
      const x = (i / 4) % canvas.width;
      const y = canvas.height - Math.floor((i / 4) / canvas.width);

      // Push pixel data to updates array
      updates.push({ x, y, r, g, b, a });
    }

    // 'updates' array now contains pixel data for the entire image
    updatePixels(updates);
  };

}
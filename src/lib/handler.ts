import { updatePixels, width, height } from "./store/wall";

export function initPixelToImage(imageUrl: string) {
  // Create an image element
  const image = new Image();

  // Set the image source to the URL
  image.src = imageUrl;

  // Wait for the image to load
  image.onload = () => {
    // Create a canvas element
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    if (!ctx) {
      console.error('Failed to get 2D context');
      return;
    }

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
      const y = canvas.height - Math.floor(i / 4 / canvas.width);

      // Push pixel data to updates array
      updates.push({ x, y, r, g, b, a });
    }

    // 'updates' array now contains pixel data for the entire image
    updatePixels(updates);
  };
}


export function sprayCanvas(imageUrl: string, offsetX: number, offsetY: number) {
  const IMAGE_SIZE = 256;
  const image = new Image();

  image.src = imageUrl;

  image.onload = () => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    if (!ctx) {
      console.error('Failed to get 2D context');
      return;
    }

    canvas.width = IMAGE_SIZE;
    canvas.height = IMAGE_SIZE;

    ctx.drawImage(image, 0, 0, IMAGE_SIZE, IMAGE_SIZE);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    const updates = [];
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const a = data[i + 3];

      if (a === 0) continue; // Skip transparent pixels

      const x = offsetX + (i / 4) % canvas.width;
      const y = offsetY + canvas.height - Math.floor(i / 4 / canvas.width);

      // Ensure coordinates are within bounds
      if (x >= 0 && x < width && y >= 0 && y < height) {
        updates.push({ x, y, r, g, b, a });
      }
    }

    updatePixels(updates);
  };
  image.onerror = () => {
    console.error(`Failed to load image: ${imageUrl}`);
  };
}
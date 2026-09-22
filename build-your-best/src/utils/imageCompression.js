const DEFAULT_MAX_WIDTH = 1600;
const DEFAULT_MAX_HEIGHT = 900;
const DEFAULT_QUALITY = 0.78;

const getCanvasBlob = (canvas, type, quality) =>
  new Promise((resolve) => {
    canvas.toBlob(resolve, type, quality);
  });

export const compressImageFile = async (
  file,
  { maxWidth = DEFAULT_MAX_WIDTH, maxHeight = DEFAULT_MAX_HEIGHT, quality = DEFAULT_QUALITY } = {}
) => {
  if (!file || !file.type?.startsWith("image/")) return file;

  const imageUrl = URL.createObjectURL(file);
  const image = new Image();

  try {
    await new Promise((resolve, reject) => {
      image.onload = resolve;
      image.onerror = reject;
      image.src = imageUrl;
    });

    const scale = Math.min(maxWidth / image.width, maxHeight / image.height, 1);
    const width = Math.round(image.width * scale);
    const height = Math.round(image.height * scale);

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;

    const context = canvas.getContext("2d");
    context.drawImage(image, 0, 0, width, height);

    const outputType = file.type === "image/png" ? "image/png" : "image/jpeg";
    const blob = await getCanvasBlob(canvas, outputType, quality);

    if (!blob || blob.size >= file.size) return file;

    const extension = outputType === "image/png" ? "png" : "jpg";
    const baseName = file.name.replace(/\.[^.]+$/, "");

    return new File([blob], `${baseName}-compressed.${extension}`, {
      type: outputType,
      lastModified: Date.now(),
    });
  } finally {
    URL.revokeObjectURL(imageUrl);
  }
};

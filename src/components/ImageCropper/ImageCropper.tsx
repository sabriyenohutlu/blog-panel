import React, { useState, useRef } from 'react';
import ReactCrop, { Crop, PixelCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

const ImageCropper: React.FC = () => {
    const [selectedImage, setSelectedImage] = useState<string>('public/logo192.png');
  const [crop, setCrop] = useState<Crop>({
    unit: '%', // Boyutlandırma birimi (% veya px)
    width: 50,
    height: 50,
    x: 0,
    y: 0,
  //) aspect: 16 / 9, // İsteğe bağlı
  });
  const [completedCrop, setCompletedCrop] = useState<PixelCrop | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCropComplete = (crop: PixelCrop) => {
    if (imgRef.current && previewCanvasRef.current && crop.width && crop.height) {
      const canvas = previewCanvasRef.current;
      const ctx = canvas.getContext('2d');
      const scaleX = imgRef.current.naturalWidth / imgRef.current.width;
      const scaleY = imgRef.current.naturalHeight / imgRef.current.height;

      canvas.width = crop.width;
      canvas.height = crop.height;

      ctx?.drawImage(
        imgRef.current,
        crop.x * scaleX,
        crop.y * scaleY,
        crop.width * scaleX,
        crop.height * scaleY,
        0,
        0,
        crop.width,
        crop.height
      );
    }
  };

  const handleDownloadCroppedImage = () => {
    if (previewCanvasRef.current) {
      const link = document.createElement('a');
      link.download = 'cropped-image.png';
      link.href = previewCanvasRef.current.toDataURL();
      link.click();
    }
  };

  return (
    <></>
    // <div className="flex flex-col items-center space-y-4">
    //   <input type="file" accept="image/*" onChange={handleImageChange} className="mb-4" />
    //   {selectedImage && (
    //     <ReactCrop
    //       src={selectedImage}
    //       crop={crop}
    //       onImageLoaded={(img:any) => (imgRef.current = img)}
    //       onChange={(newCrop) => setCrop(newCrop as Crop)}
    //       onComplete={(c) => setCompletedCrop(c)}
    //     />
    //   )}
    //   <div className="mt-4">
    //     <canvas ref={previewCanvasRef} style={{ border: '1px solid #ccc', maxWidth: '100%' }} />
    //   </div>
    //   {completedCrop && (
    //     <button
    //       onClick={handleDownloadCroppedImage}
    //       className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
    //     >
    //       Download Cropped Image
    //     </button>
    //   )}
    // </div>
  );
};

export default ImageCropper;

"use client";

import Image from "next/image";
import { Printer } from "lucide-react";

interface Props {
  qrImageUrl: string;
}

export default function QrImage({ qrImageUrl }: Props) {
  const handleQRImagePrint = () => {
    const imageWindow = window.open("");
    if (imageWindow) {
      imageWindow.document.write(
        `<html><head><title>Print QR Code</title></head><body style="text-align: center; margin-top: 50px;"><img src="${qrImageUrl}" onload="window.print();window.close()" style="width: 300px; height: 300px;" /></body></html>`
      );
    }
  };

  return (
    <div className="w-full flex flex-col items-center justify-center p-4 bg-white rounded-xl shadow-sm border border-slate-100 max-w-sm mx-auto">
      <div className="relative w-48 h-48 mb-6 p-4 border-2 border-dashed border-slate-200 rounded-xl flex items-center justify-center">
        <Image 
          src={qrImageUrl} 
          width={160} 
          height={160} 
          alt="QR code for table"
          className="object-contain"
        />
      </div>
      
      <button 
        onClick={handleQRImagePrint}
        className="flex items-center justify-center gap-2 w-full max-w-[200px] bg-slate-900 text-white font-medium py-2.5 px-4 rounded-lg hover:bg-slate-800 transition-colors shadow-sm"
      >
        <Printer className="w-4 h-4" />
        Print QR Code
      </button>
    </div>
  );
}
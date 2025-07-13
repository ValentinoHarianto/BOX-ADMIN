'use client'

import { useEffect, useState } from "react";
import { Button } from "./button";
import { ImagePlus, Trash } from "lucide-react";
import Image from "next/image";
import { CldUploadWidget } from "next-cloudinary";

interface ImageUploadProps {
  cloudName: string;
  disabled?: boolean;
  onChange: (value: string) => void;
  onRemove: (value: string) => void;
  value: string[];
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  cloudName,
  disabled,
  onChange,
  onRemove,
  value
}) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <div>
      <div className="mb-4 flex items-center gap-4 flex-wrap">
        {value.map((url) => (
          <div
            key={url}
            className="relative w-[200px] h-[200px] rounded-md overflow-hidden border"
          >
            <div className="z-10 absolute top-2 right-2">
              <Button
                type="button"
                onClick={() => onRemove(url)}
                variant="destructive"
                size="icon"
              >
                <Trash className="h-4 w-4" />
              </Button>
            </div>
            <Image fill className="object-cover" src={url} alt="Uploaded" />
          </div>
        ))}
      </div>

      <CldUploadWidget
        uploadPreset="bosxup"
        onSuccess={(result: any) => {
          console.log("Upload success:", result);
          onChange(result.info.secure_url);
        }}
        options={{
          cloudName: cloudName,
          sources: ['local'],
          multiple: true,
          maxFiles: 3,
        }}
      >
        {({ open }) => {
          const onClick = () => open?.();
          return (
            <Button
              type="button"
              disabled={disabled}
              variant="secondary"
              onClick={onClick}
            >
              <ImagePlus className="h-4 w-4 mr-2" />
              Upload image
            </Button>
          );
        }}
      </CldUploadWidget>
    </div>
  );
};

export default ImageUpload;

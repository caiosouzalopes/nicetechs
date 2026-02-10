"use client";

import { useRef } from "react";
import { ImagePlus } from "lucide-react";

const MAX_SIZE = 800; // largura máxima em px para evitar localStorage cheio
const MAX_FILE_SIZE_MB = 2; // rejeitar arquivos > 2MB antes de processar
const QUALITY = 0.85; // qualidade JPEG ao comprimir

function compressImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    const reader = new FileReader();

    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      img.src = dataUrl;
    };

    reader.onerror = () => reject(new Error("Erro ao ler arquivo"));
    reader.readAsDataURL(file);

    img.onload = () => {
      const canvas = document.createElement("canvas");
      let { width, height } = img;
      if (width > MAX_SIZE || height > MAX_SIZE) {
        if (width > height) {
          height = Math.round((height * MAX_SIZE) / width);
          width = MAX_SIZE;
        } else {
          width = Math.round((width * MAX_SIZE) / height);
          height = MAX_SIZE;
        }
      }
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("Canvas não disponível"));
        return;
      }
      ctx.drawImage(img, 0, 0, width, height);
      const compressed = canvas.toDataURL("image/jpeg", QUALITY);
      resolve(compressed);
    };

    img.onerror = () => reject(new Error("Imagem inválida"));
  });
}

interface ImagePickerProps {
  value: string;
  onChange: (dataUrl: string) => void;
  label?: string;
  className?: string;
}

export function ImagePicker({ value, onChange, label = "Foto do produto", className = "" }: ImagePickerProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      alert("Selecione um arquivo de imagem (JPG, PNG, etc.).");
      return;
    }
    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      alert(`Imagem muito grande. Máximo ${MAX_FILE_SIZE_MB}MB.`);
      return;
    }
    try {
      const dataUrl = await compressImage(file);
      onChange(dataUrl);
    } catch (err) {
      alert("Erro ao processar a imagem. Tente outra.");
      console.error(err);
    }
    e.target.value = "";
  };

  const triggerInput = () => inputRef.current?.click();

  return (
    <div className={className}>
      <label className="block text-xs font-medium text-muted-foreground mb-1 sm:text-sm">
        {label}
      </label>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleChange}
        className="hidden"
      />
      <button
        type="button"
        onClick={triggerInput}
        className="w-full flex flex-col sm:flex-row items-center justify-center gap-3 p-4 rounded-xl border-2 border-dashed border-border bg-muted/30 hover:border-primary/40 hover:bg-primary/5 transition-colors min-h-[120px]"
      >
        {value ? (
          <>
            <div className="relative w-20 h-20 shrink-0 rounded-lg overflow-hidden bg-muted">
              {/* eslint-disable-next-line @next/next/no-img-element -- preview de base64 */}
              <img
                src={value}
                alt="Preview"
                className="w-full h-full object-cover"
              />
            </div>
            <span className="text-sm font-medium text-foreground">
              Trocar foto
            </span>
          </>
        ) : (
          <>
            <ImagePlus size={32} className="text-muted-foreground shrink-0" />
            <span className="text-sm font-medium text-muted-foreground text-center">
              Clique para selecionar foto da galeria ou câmera
            </span>
          </>
        )}
      </button>
      <p className="text-xs text-muted-foreground mt-1">
        Computador: pastas. Celular: galeria ou câmera.
      </p>
    </div>
  );
}

import { CloudUpload } from "@mui/icons-material";
import { UploadButtonProps } from "@/types/UploadButtonProps";
import { useRef } from "react";

function UploadButton({
  onFileSelected,
  accept = "application/pdf",
  label = "Subir archivo",
  buttonClassName = "bg-black text-white font-bold py-2 px-4 rounded flex items-center",
  icon = <CloudUpload className="mr-2 w-5 h-5 text-white" />,
}: UploadButtonProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fileData = {
      name: file.name,
      lastModified: new Date(file.lastModified).toLocaleString(),
      file,
    };

    onFileSelected?.(fileData);
  };
  return (
    <div className="m-2 p-2">
      <input
        ref={fileInputRef}
        id="fileInput"
        title="uploadFile"
        type="file"
        onChange={handleFileChange}
        className="hidden"
        accept={accept}
      />
      <button
        onClick={handleButtonClick}
        type="button"
        className={`${buttonClassName}`}
      >
        {icon}
        {label}
      </button>
    </div>
  );
}

export default UploadButton;

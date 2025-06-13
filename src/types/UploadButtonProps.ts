import { FileData } from "./FileData";

export interface UploadButtonProps {
  onFileSelected?: (fileData: FileData) => void;
  accept?: string;
  label?: string;  
  buttonClassName?: string;
  icon?: React.ReactNode;
}

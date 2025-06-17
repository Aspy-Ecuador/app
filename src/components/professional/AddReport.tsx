import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Edit, UploadFile } from "@mui/icons-material";
import { FileData } from "@/types/FileData";
import CancelButton from "../buttons/CancelButton";
import CreationButton from "../buttons/CreationButton";
import UploadButton from "../buttons/UploadButton";

export default function AddReport() {
  const [signature, setSignature] = useState<FileData | null>(null);
  const [report, setReport] = useState<FileData | null>(null);
  const [comment, setComment] = useState<string>("");
  const navigate = useNavigate();
  const handleBack = () => {
    navigate(-1);
  };
  console.log(report?.file);
  return (
    <div className="bg-white p-6 rounded-xl shadow-md w-full  space-y-6 flex flex-col relative">
      <div>
        <div className="flex items-center mb-2">
          <Edit className="mr-2 text-gray-600" />
          <h2 className="text-lg font-semibold">Firma del profesional</h2>
        </div>
        <UploadButton
          accept="image/*"
          label="Subir firma"
          icon={<UploadFile className="mr-2 text-blue-600" />}
          buttonClassName="bg-white text-black font-bold border border-blue-600 hover:bg-blue-50"
          onFileSelected={(fileData) => setSignature(fileData)}
        />
        {signature && (
          <p className="text-sm text-gray-500 mt-1">
            Firma cargada: <strong>{signature.name}</strong>
          </p>
        )}
      </div>

      <div>
        <div className="flex items-center mb-2">
          <Edit className="mr-2 text-gray-600" />
          <h2 className="text-lg font-semibold">Reporte del profesional</h2>
        </div>
        <UploadButton
          accept="pdf/*"
          label="Subir Reporte"
          icon={<UploadFile className="mr-2 text-blue-600" />}
          buttonClassName="bg-white text-black font-bold border border-blue-600 hover:bg-blue-50"
          onFileSelected={(fileData) => setReport(fileData)}
        />
        {report && (
          <p className="text-sm text-gray-500 mt-1">
            Reporte cargado: <strong>{report.name}</strong>
          </p>
        )}
      </div>

      <div className="flex justify-end gap-3 mt-auto">
        <CancelButton
          onClick={() => {
            setSignature(null);
            setComment("");
            setReport(null);
            handleBack();
          }}
          text="Cancelar"
        />
        <CreationButton
          text="Enviar reporte"
          onClick={() => {
            console.log("Comentario:", comment);
            console.log("Firma:", signature);
          }}
        />
      </div>
    </div>
  );
}

interface PDFViewerProps {
  url: string;
}

const PDFViewer: React.FC<PDFViewerProps> = ({ url }) => {
  return (
    <div className="w-full h-full">
      <iframe
        src={url}
        title="PDF Viewer"
        className="w-full h-full"
        style={{ border: "none" }}
      />
    </div>
  );
};

export default PDFViewer;

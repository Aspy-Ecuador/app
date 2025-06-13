function CreationButton({ onClick, text }: { onClick: () => void; text: string }) {
  return (
    <button
      onClick={onClick}
      className="bg-gray-100 text-gray-700 hover:bg-gray-300 hover:text-gray-900 min-w-[140px] w-auto py-2  rounded "
    >
      {text}
    </button>
  );
}
export default CreationButton;

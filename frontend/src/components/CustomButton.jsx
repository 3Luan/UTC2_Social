const CustomButton = ({
  title,
  containerStyles,
  iconRight,
  type,
  onClick,
  img,
}) => {
  return (
    <button
      onClick={onClick}
      type={type || "button"}
      className={`inline-flex items-center text-base ${containerStyles}`}
    >
      {img && <img src={img} alt="Logo" className="mr-1 h-5 w-5" />}
      {title}

      {iconRight && <div className="ml-2">{iconRight}</div>}
    </button>
  );
};

export default CustomButton;

interface LoadingParams {
  loading: boolean;
  className?: string;
  color?: string;
}

const Loading = ({ loading, className, color }: LoadingParams) => {
  return (
    <div className={`${loading ? "animate-spin" : ""} ${className}`}>
      <svg xmlns="http://www.w3.org/2000/svg" id="visual" version="1.1" viewBox="248.8 156.8 352.4 352.4">
        <g>
          <g transform="translate(425 333)">
            <path d="M0 -176.2L176.2 0L0 176.2L-176.2 0Z" fill="none" stroke="#fff" strokeWidth="20" className={`${color ? color : ""}`}></path>
          </g>
        </g>
      </svg>
    </div>
  );
};

export { Loading };

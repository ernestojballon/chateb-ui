import { RotatingLines } from "react-loader-spinner";

const Spinner = ({ size }) => {
  if (size === "tiny") {
    return (
      <RotatingLines
        visible={true}
        height="16"
        width="16"
        color="red"
        strokeWidth="5"
        animationDuration="0.75"
        ariaLabel="rotating-lines-loading"
        wrapperStyle={{}}
        wrapperClass=""
        strokeColor="#6b5de0"
      />
    );
  }
  if (size === "small") {
    return (
      <RotatingLines
        visible={true}
        height="32"
        width="32"
        color="red"
        strokeWidth="5"
        animationDuration="0.75"
        ariaLabel="rotating-lines-loading"
        wrapperStyle={{}}
        wrapperClass=""
        strokeColor="#6b5de0"
      />
    );
  }
  return (
    <RotatingLines
      visible={true}
      height="96"
      width="96"
      color="red"
      strokeWidth="5"
      animationDuration="0.75"
      ariaLabel="rotating-lines-loading"
      wrapperStyle={{}}
      wrapperClass=""
      strokeColor="#6b5de0"
    />
  );
};

export default Spinner;

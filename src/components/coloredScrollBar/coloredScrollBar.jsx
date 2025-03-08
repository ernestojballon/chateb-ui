import { useState, useCallback } from "react";
import { Scrollbars } from "react-custom-scrollbars";

const ColoredScrollbars = ({ children, ...props }) => {
  const [top, setTop] = useState(0);

  const handleUpdate = useCallback((values) => {
    setTop(values.top);
  }, []);

  const renderView = useCallback(
    ({ style, ...props }) => {
      const viewStyle = {
        padding: 15,
        backgroundColor: `rgb(${Math.round(255 - top * 255)}, ${Math.round(top * 255)}, ${Math.round(255)})`,
        color: `rgb(${Math.round(255 - top * 255)}, ${Math.round(255 - top * 255)}, ${Math.round(255 - top * 255)})`,
      };
      return (
        <div className="box" style={{ ...style, ...viewStyle }} {...props} />
      );
    },
    [top],
  );

  const renderThumb = useCallback(
    ({ style, ...props }) => {
      const thumbStyle = {
        backgroundColor: `rgb(${Math.round(255 - top * 255)}, ${Math.round(255 - top * 255)}, ${Math.round(255 - top * 255)})`,
      };
      return <div style={{ ...style, ...thumbStyle }} {...props} />;
    },
    [top],
  );

  return (
    <Scrollbars
      renderView={renderView}
      renderThumbHorizontal={renderThumb}
      renderThumbVertical={renderThumb}
      onUpdate={handleUpdate}
      {...props}
    >
      {children}
    </Scrollbars>
  );
};

export default ColoredScrollbars;

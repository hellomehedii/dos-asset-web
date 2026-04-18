import { useEffect, useRef } from "react";

const CustomCursor = () => {
  const innerRef = useRef<HTMLDivElement>(null);
  const outerRef = useRef<HTMLDivElement>(null);
  const requestRef = useRef<number>();
  const position = useRef({ x: 0, y: 0 });
  const target = useRef({ x: 0, y: 0 });
  const isPressed = useRef(false);

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      target.current = { x: event.clientX, y: event.clientY };
      if (innerRef.current) {
        innerRef.current.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0)`;
      }
    };

    const handleMouseDown = () => {
      isPressed.current = true;
      innerRef.current?.classList.add("cursor-pressed");
      outerRef.current?.classList.add("cursor-pressed");
    };

    const handleMouseUp = () => {
      isPressed.current = false;
      innerRef.current?.classList.remove("cursor-pressed");
      outerRef.current?.classList.remove("cursor-pressed");
    };

    const onAnimationFrame = () => {
      position.current.x += (target.current.x - position.current.x) * 0.16;
      position.current.y += (target.current.y - position.current.y) * 0.16;
      if (outerRef.current) {
        outerRef.current.style.transform = `translate3d(${position.current.x}px, ${position.current.y}px, 0)`;
      }
      requestRef.current = requestAnimationFrame(onAnimationFrame);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("mouseup", handleMouseUp);
    requestRef.current = requestAnimationFrame(onAnimationFrame);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("mouseup", handleMouseUp);
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, []);

  return (
    <div className="custom-cursor">
      <div ref={outerRef} className="custom-cursor__outer" />
      <div ref={innerRef} className="custom-cursor__inner" />
    </div>
  );
};

export default CustomCursor;

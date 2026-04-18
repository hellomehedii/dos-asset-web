import { useEffect, useRef } from "react";

const CustomCursor = () => {
  const innerRef = useRef<HTMLDivElement>(null);
  const outerRef = useRef<HTMLDivElement>(null);
  const requestRef = useRef<number>();
  const position = useRef({ x: 0, y: 0 });
  const target = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      target.current = { x: event.clientX, y: event.clientY };
      if (innerRef.current) {
        innerRef.current.style.setProperty("--cursor-x", `${event.clientX}px`);
        innerRef.current.style.setProperty("--cursor-y", `${event.clientY}px`);
      }
    };

    const handleMouseDown = () => {
      innerRef.current?.classList.add("cursor-pressed");
      outerRef.current?.classList.add("cursor-pressed");
    };

    const handleMouseUp = () => {
      innerRef.current?.classList.remove("cursor-pressed");
      outerRef.current?.classList.remove("cursor-pressed");
    };

    const handleMouseEnterInteractive = () => {
      innerRef.current?.classList.add("cursor-hover");
      outerRef.current?.classList.add("cursor-hover");
    };

    const handleMouseLeaveInteractive = () => {
      innerRef.current?.classList.remove("cursor-hover");
      outerRef.current?.classList.remove("cursor-hover");
    };

    const interactiveSelector = "a, button, input, textarea, select, [role=button], [data-cursor='hover']";

    const handleDocumentMouseOver = (event: MouseEvent) => {
      const target = (event.target as Element)?.closest(interactiveSelector);
      if (target) handleMouseEnterInteractive();
    };

    const handleDocumentMouseOut = (event: MouseEvent) => {
      const target = (event.target as Element)?.closest(interactiveSelector);
      const related = event.relatedTarget as Element | null;
      if (target && (!related || !related.closest(interactiveSelector))) {
        handleMouseLeaveInteractive();
      }
    };

    document.addEventListener("mouseover", handleDocumentMouseOver);
    document.addEventListener("mouseout", handleDocumentMouseOut);

    const onAnimationFrame = () => {
      position.current.x += (target.current.x - position.current.x) * 0.16;
      position.current.y += (target.current.y - position.current.y) * 0.16;
      if (outerRef.current) {
        outerRef.current.style.setProperty("--cursor-x", `${position.current.x}px`);
        outerRef.current.style.setProperty("--cursor-y", `${position.current.y}px`);
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
      document.removeEventListener("mouseover", handleDocumentMouseOver);
      document.removeEventListener("mouseout", handleDocumentMouseOut);
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, []);

  return (
    <div className="custom-cursor" aria-hidden="true">
      <div ref={outerRef} className="custom-cursor__outer" />
      <div ref={innerRef} className="custom-cursor__inner" />
    </div>
  );
};

export default CustomCursor;

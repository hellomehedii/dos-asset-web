import { useEffect, useRef } from "react";

const CustomCursor = () => {
  const innerRef = useRef<HTMLDivElement>(null);
  const outerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      const x = `${event.clientX}px`;
      const y = `${event.clientY}px`;

      if (innerRef.current) {
        innerRef.current.style.setProperty("--cursor-x", x);
        innerRef.current.style.setProperty("--cursor-y", y);
      }

      if (outerRef.current) {
        outerRef.current.style.setProperty("--cursor-x", x);
        outerRef.current.style.setProperty("--cursor-y", y);
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

    const handleDragStart = () => {
      innerRef.current?.classList.add("cursor-hidden");
      outerRef.current?.classList.add("cursor-hidden");
    };

    const handleDragEnd = () => {
      innerRef.current?.classList.remove("cursor-hidden");
      outerRef.current?.classList.remove("cursor-hidden");
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

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("mouseover", handleDocumentMouseOver);
    document.addEventListener("mouseout", handleDocumentMouseOut);
    document.addEventListener("dragstart", handleDragStart);
    document.addEventListener("dragend", handleDragEnd);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("mouseover", handleDocumentMouseOver);
      document.removeEventListener("mouseout", handleDocumentMouseOut);
      document.removeEventListener("dragstart", handleDragStart);
      document.removeEventListener("dragend", handleDragEnd);
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

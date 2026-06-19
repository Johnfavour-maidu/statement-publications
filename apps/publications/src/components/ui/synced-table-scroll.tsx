"use client";

import { useRef, useEffect, forwardRef, useImperativeHandle, useCallback } from "react";

interface SyncedTableScrollProps {
  children: React.ReactNode;
  loading?: boolean;
  className?: string;
}

export interface SyncedTableScrollHandle {
  tableScrollRef: React.RefObject<HTMLDivElement | null>;
  scrollToTop: () => void;
}

const SyncedTableScroll = forwardRef<SyncedTableScrollHandle, SyncedTableScrollProps>(
  ({ children, loading, className }, ref) => {
    const tableScrollRef = useRef<HTMLDivElement>(null);
    const topTrackRef = useRef<HTMLDivElement>(null);
    const topThumbRef = useRef<HTMLDivElement>(null);
    const bottomTrackRef = useRef<HTMLDivElement>(null);
    const bottomThumbRef = useRef<HTMLDivElement>(null);
    const isDragging = useRef(false);
    const dragStartX = useRef(0);
    const dragStartScrollLeft = useRef(0);
    const activeTrack = useRef<"top" | "bottom">("bottom");

    useImperativeHandle(ref, () => ({
      tableScrollRef,
      scrollToTop: () => {
        if (tableScrollRef.current) {
          tableScrollRef.current.scrollLeft = 0;
          tableScrollRef.current.scrollTop = 0;
        }
      },
    }));

    const updateThumbs = useCallback(() => {
      const table = tableScrollRef.current;
      const topTrack = topTrackRef.current;
      const topThumb = topThumbRef.current;
      const bottomTrack = bottomTrackRef.current;
      const bottomThumb = bottomThumbRef.current;
      if (!table) return;

      const scrollWidth = table.scrollWidth;
      const clientWidth = table.clientWidth;
      const ratio = clientWidth / scrollWidth;
      const maxScroll = scrollWidth - clientWidth;
      const scrollRatio = maxScroll > 0 ? table.scrollLeft / maxScroll : 0;

      const updateThumb = (track: HTMLDivElement | null, thumb: HTMLDivElement | null) => {
        if (!track || !thumb) return;
        const trackWidth = track.clientWidth;
        if (scrollWidth <= clientWidth) {
          thumb.style.width = "0px";
          thumb.style.left = "0px";
          return;
        }
        const thumbWidth = Math.max(trackWidth * ratio, 32);
        const maxThumbLeft = trackWidth - thumbWidth;
        thumb.style.width = thumbWidth + "px";
        thumb.style.left = (scrollRatio * maxThumbLeft) + "px";
      };

      updateThumb(topTrack, topThumb);
      updateThumb(bottomTrack, bottomThumb);
    }, []);

    useEffect(() => {
      const table = tableScrollRef.current;
      if (!table) return;

      const onScroll = () => updateThumbs();
      table.addEventListener("scroll", onScroll, { passive: true });

      const observer = new ResizeObserver(() => updateThumbs());
      observer.observe(table);

      updateThumbs();

      return () => {
        table.removeEventListener("scroll", onScroll);
        observer.disconnect();
      };
    }, [loading, updateThumbs]);

    const handleThumbMouseDown = useCallback((e: React.MouseEvent, track: "top" | "bottom") => {
      e.preventDefault();
      isDragging.current = true;
      activeTrack.current = track;
      dragStartX.current = e.clientX;
      dragStartScrollLeft.current = tableScrollRef.current?.scrollLeft ?? 0;
      document.body.style.cursor = "grabbing";
      document.body.style.userSelect = "none";
    }, []);

    useEffect(() => {
      const handleMouseMove = (e: MouseEvent) => {
        if (!isDragging.current) return;
        const table = tableScrollRef.current;
        const track = activeTrack.current === "top" ? topTrackRef.current : bottomTrackRef.current;
        const thumb = activeTrack.current === "top" ? topThumbRef.current : bottomThumbRef.current;
        if (!table || !track || !thumb) return;

        const dx = e.clientX - dragStartX.current;
        const scrollWidth = table.scrollWidth;
        const clientWidth = table.clientWidth;
        const trackWidth = track.clientWidth;
        const thumbWidth = parseFloat(thumb.style.width) || 0;
        const maxThumbLeft = trackWidth - thumbWidth;
        const maxScroll = scrollWidth - clientWidth;

        if (maxThumbLeft <= 0 || maxScroll <= 0) return;

        const thumbDx = (dx / maxThumbLeft) * maxScroll;
        table.scrollLeft = dragStartScrollLeft.current + thumbDx;
      };

      const handleMouseUp = () => {
        if (!isDragging.current) return;
        isDragging.current = false;
        document.body.style.cursor = "";
        document.body.style.userSelect = "";
      };

      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };
    }, []);

    useEffect(() => {
      const setupTouch = (trackEl: HTMLDivElement | null, trackName: "top" | "bottom") => {
        if (!trackEl) return;

        const handleTouchStart = (e: TouchEvent) => {
          isDragging.current = true;
          activeTrack.current = trackName;
          dragStartX.current = e.touches[0].clientX;
          dragStartScrollLeft.current = tableScrollRef.current?.scrollLeft ?? 0;
        };

        const handleTouchMove = (e: TouchEvent) => {
          if (!isDragging.current || activeTrack.current !== trackName) return;
          e.preventDefault();
          const table = tableScrollRef.current;
          if (!table) return;

          const dx = e.touches[0].clientX - dragStartX.current;
          const scrollWidth = table.scrollWidth;
          const clientWidth = table.clientWidth;
          const trackWidth = trackEl.clientWidth;
          const thumb = trackName === "top" ? topThumbRef.current : bottomThumbRef.current;
          const thumbWidth = thumb ? parseFloat(thumb.style.width) || 0 : 0;
          const maxThumbLeft = trackWidth - thumbWidth;
          const maxScroll = scrollWidth - clientWidth;

          if (maxThumbLeft <= 0 || maxScroll <= 0) return;

          const thumbDx = (dx / maxThumbLeft) * maxScroll;
          table.scrollLeft = dragStartScrollLeft.current + thumbDx;
        };

        const handleTouchEnd = () => {
          isDragging.current = false;
        };

        trackEl.addEventListener("touchstart", handleTouchStart, { passive: true });
        trackEl.addEventListener("touchmove", handleTouchMove, { passive: false });
        trackEl.addEventListener("touchend", handleTouchEnd);
        return () => {
          trackEl.removeEventListener("touchstart", handleTouchStart);
          trackEl.removeEventListener("touchmove", handleTouchMove);
          trackEl.removeEventListener("touchend", handleTouchEnd);
        };
      };

      const cleanupTop = setupTouch(topTrackRef.current, "top");
      const cleanupBottom = setupTouch(bottomTrackRef.current, "bottom");
      return () => {
        cleanupTop?.();
        cleanupBottom?.();
      };
    }, []);

    const handleTrackClick = useCallback((e: React.MouseEvent, trackEl: HTMLDivElement | null, thumbEl: HTMLDivElement | null) => {
      const table = tableScrollRef.current;
      if (!trackEl || !thumbEl || !table) return;
      const thumbWidth = parseFloat(thumbEl.style.width) || 0;
      const clickX = e.clientX - trackEl.getBoundingClientRect().left;
      const maxThumbLeft = trackEl.clientWidth - thumbWidth;
      const newScrollRatio = Math.max(0, Math.min(1, (clickX - thumbWidth / 2) / maxThumbLeft));
      table.scrollLeft = newScrollRatio * (table.scrollWidth - table.clientWidth);
    }, []);

    return (
      <div className={className ?? "rounded-xl border border-[#D8B27A]/15 shadow-sm hover:shadow-md transition-shadow overflow-hidden"}>
        {/* Top scrollbar */}
        <div
          ref={topTrackRef}
          className="relative h-4 bg-[#F2D8BE]/20 cursor-pointer"
          onClick={(e) => handleTrackClick(e, topTrackRef.current, topThumbRef.current)}
        >
          <div
            ref={topThumbRef}
            className="absolute top-1 h-2 rounded-full bg-[#8A6A4A]/50 hover:bg-[#8A6A4A]/70 transition-colors cursor-grab active:cursor-grabbing"
            style={{ width: "0px", left: "0px" }}
            onMouseDown={(e) => handleThumbMouseDown(e, "top")}
          />
        </div>

        {/* Table content - hidden native scrollbar */}
        <div
          ref={tableScrollRef}
          className="overflow-x-auto [&::-webkit-scrollbar]:h-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
        >
          {children}
        </div>

        {/* Bottom scrollbar */}
        <div
          ref={bottomTrackRef}
          className="relative h-4 bg-[#F2D8BE]/20 rounded-b-xl cursor-pointer"
          onClick={(e) => handleTrackClick(e, bottomTrackRef.current, bottomThumbRef.current)}
        >
          <div
            ref={bottomThumbRef}
            className="absolute top-1 h-2 rounded-full bg-[#8A6A4A]/50 hover:bg-[#8A6A4A]/70 transition-colors cursor-grab active:cursor-grabbing"
            style={{ width: "0px", left: "0px" }}
            onMouseDown={(e) => handleThumbMouseDown(e, "bottom")}
          />
        </div>
      </div>
    );
  }
);

SyncedTableScroll.displayName = "SyncedTableScroll";

export { SyncedTableScroll };

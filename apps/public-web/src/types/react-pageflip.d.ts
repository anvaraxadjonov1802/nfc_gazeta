declare module "react-pageflip" {
  import type {
    CSSProperties,
    Component,
    ReactNode,
  } from "react";

  export interface PageFlipEvent {
    data: number;
    object?: unknown;
  }

  export interface PageFlipStateEvent {
    data: string;
    object?: unknown;
  }

  export interface PageFlipInstance {
    flipNext: (
      corner?: "top" | "bottom",
    ) => void;
    flipPrev: (
      corner?: "top" | "bottom",
    ) => void;
    flip: (
      pageIndex: number,
      corner?: "top" | "bottom",
    ) => void;
    turnToPage: (pageIndex: number) => void;
    turnToNextPage: () => void;
    turnToPrevPage: () => void;
    getCurrentPageIndex: () => number;
    getPageCount: () => number;
  }

  export interface HTMLFlipBookProps {
    width: number;
    height: number;
    size?: "fixed" | "stretch";
    minWidth?: number;
    maxWidth?: number;
    minHeight?: number;
    maxHeight?: number;
    drawShadow?: boolean;
    flippingTime?: number;
    usePortrait?: boolean;
    startZIndex?: number;
    autoSize?: boolean;
    maxShadowOpacity?: number;
    showCover?: boolean;
    mobileScrollSupport?: boolean;
    swipeDistance?: number;
    clickEventForward?: boolean;
    useMouseEvents?: boolean;
    renderOnlyPageLengthChange?: boolean;
    startPage?: number;
    showPageCorners?: boolean;
    disableFlipByClick?: boolean;
    className?: string;
    style?: CSSProperties;
    children?: ReactNode;
    onFlip?: (event: PageFlipEvent) => void;
    onChangeOrientation?: (
      event: PageFlipStateEvent,
    ) => void;
    onChangeState?: (
      event: PageFlipStateEvent,
    ) => void;
    onInit?: (event: PageFlipEvent) => void;
  }

  export default class HTMLFlipBook extends Component<HTMLFlipBookProps> {
    pageFlip: () => PageFlipInstance;
  }
}

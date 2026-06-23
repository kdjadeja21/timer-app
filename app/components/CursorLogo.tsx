import Image from "next/image";

export default function CursorLogo({ width = 168 }: { width?: number }) {
  const height = Math.round((width * 532.09) / 2238.7);
  return (
    <Image
      src="/cursor_logo.svg"
      alt="Cursor"
      width={width}
      height={height}
      priority
    />
  );
}

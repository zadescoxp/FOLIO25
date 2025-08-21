import Link from "next/link";
import TextAnimation from "./TextAnimation";

export default function Logo({ className }: { className?: string }) {
  return (
    <Link href="/" className={`font-climate-crisis ${className}`}>
      <TextAnimation text="ZADE" />
    </Link>
  );
}
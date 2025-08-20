import Link from "next/link";
import { TextAnimate } from "../magicui/text-animate";

export default function Logo ({className} : {className?: string}) {
  return (
    <Link href="/" className={`font-climate-crisis ${className}`}>
        <TextAnimate animation="slideUp" by="word" duration={1}>ZADE</TextAnimate>
    </Link>
  );
}
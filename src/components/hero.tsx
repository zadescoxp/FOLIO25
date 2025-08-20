import Image from "next/image";
import Logo from "./UI/Logo";
import { TextAnimate } from "./magicui/text-animate";

export default function Hero() {
  return <div className="w-full">
    <div className="pt-10 flex w-full items-baseline justify-between"><Logo className="text-3xl" />
      <TextAnimate animation="slideUp" by="word" duration={1}>Say Hello</TextAnimate>
    </div>

    <div className="text-[4rem] leading-none font-semibold w-1/2 mt-40">
      <TextAnimate animation="slideUp" by="word" duration={1}>
        Full-stack developer crafting clean, impactful and creative products
      </TextAnimate>
    </div>
  </div>;
}

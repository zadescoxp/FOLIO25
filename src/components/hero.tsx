import { ConfettiFireworks } from "./UI/hello";
import Logo from "./UI/Logo";
import TextAnimation from "./UI/TextAnimation";

export default function Hero() {
  return <div className="w-full px-10">
    <div className="pt-10 flex w-full items-baseline justify-between"><Logo className="text-3xl" />
      {/* <TextAnimation text="Say Hello" /> */}
      <ConfettiFireworks>Say Hello</ConfettiFireworks>
    </div>

    <div className="text-[4.5rem] leading-none font-semibold w-2/3 mt-48">
      <TextAnimation text="Full-stack developer crafting clean, impactful and creative products" className="text-shadow-lg" />
    </div>

    <div className="mt-48 w-full">
      <video src="/video.mp4" controls={false} autoPlay muted loop className="rounded-2xl shadow-lg"></video>
      <TextAnimation text="Scaled Vouz to 2,000+ users within the first day" className="text-sm mt-2 text-neutral-600" />
    </div>
  </div>;
}

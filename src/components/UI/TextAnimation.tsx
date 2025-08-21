import { TextAnimate } from "../magicui/text-animate";

export default function TextAnimation({ text, className }: { text: string, className?: string }) {
    return (
        <TextAnimate once={true} animation="slideUp" by="word" duration={1} className={`${className}`}>
            {text}
        </TextAnimate>
    )
}
import { TextAnimate } from "../magicui/text-animate";

export default function TextAnimation({ text }: { text: string }) {
    return (
        <TextAnimate once={true} animation="slideUp" by="word" duration={1}>
            {text}
        </TextAnimate>
    )
}
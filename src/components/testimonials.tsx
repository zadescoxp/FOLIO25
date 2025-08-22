import Link from "next/link"
import { ShineBorder } from "./magicui/shine-border"
import TextAnimation from "./UI/TextAnimation"

export default function Testimonials() {
    return (
        <div className="bg-neutral-950 text-white w-screen px-4 sm:px-6 md:px-8 lg:px-10 mt-16 sm:mt-24 md:mt-32 lg:mt-48 pb-16 sm:pb-24 md:pb-32 lg:pb-48">
            <div className="text-2xl sm:text-3xl md:text-4xl lg:text-[4.5rem] leading-none font-semibold w-full sm:w-5/6 md:w-3/4 lg:w-2/3 pt-16 sm:pt-24 md:pt-32 lg:pt-48">
                <TextAnimation text="Behind every line of code and design choice, there’s trust" />
            </div>
            <TextAnimation className="mt-6 sm:mt-8 md:mt-10 text-sm sm:text-base" text="Some clients prefer their projects to remain private, but their words speak louder than any portfolio ever could." />
            <div className="mt-16 sm:mt-24 md:mt-32 lg:mt-48 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 items-stretch flex-wrap gap-6 sm:gap-8 md:gap-10 w-full">

                {testimonials.map((testimonial, index) => (
                    <div className="border-neutral-800 border-4 bg-neutral-900 text-white self-stretch gap-y-6 sm:gap-y-8 md:gap-y-10 p-6 sm:p-8 md:p-10 relative rounded-xl flex items-start justify-between flex-col" key={index}>
                        {/* <ShineBorder shineColor={["#fff", "#eee"]} duration={index + 10} /> */}
                        <TextAnimation text={`"${testimonial.feedback}"`} className="text-sm sm:text-base md:text-lg italic" />
                        <div className="flex flex-col gap-2">
                            <TextAnimation text={`- ${testimonial.name}`} className="text-sm sm:text-base md:text-lg font-bold" />
                            {testimonial.website && (
                                <Link href={testimonial.website} target="_blank" rel="noopener noreferrer" className="hover:underline transition-all duration-300">
                                    <TextAnimation text="Visit Website" className="text-xs sm:text-sm" />
                                </Link>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

const testimonials = [
    {
        name: "Mac",
        website: "https://madebymac.design",
        feedback: "You're great, we'll work again and thank you."
    },
    {
        name: "Joe De Filippo",
        website: "https://skoolwizard.com",
        feedback: "You did a fantastic job redesigning my website. 10/10 would highly recommend to anyone who needs a strong front-end developer. Given the quality of his work and professionalism, I bet his backend skills are pretty on point, too! Thank you Zade for your help and extremely fast turnaround!"
    },
    {
        name: "SpaceGal",
        feedback: "I am satisfied and I'm glad I have found someone to help with my project. Thank you so much! Have a wonderful day"
    },
    {
        name: "Rahul",
        website: "https://couple.me",
        feedback: "He helped us in improving our website's UI, functionality and performance. Working with someone who understands what he is doing is great and also he is very good at delivering fast. Thank you for your contributions in our startup."
    },
    {
        name: "Divyang Prajapati",
        website: "https://div3dasset.com",
        feedback: "Thanks for helping me with my portfolio from design to deployment. Glad to work with you."
    },
    {
        name: "Sahil",
        feedback: "Your design thinking is on point and we all loved it. Thanks for improving the UI for our store."
    }
]
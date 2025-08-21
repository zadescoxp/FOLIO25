"use client"

import { Label } from "@radix-ui/react-label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./UI/card";
import { Input } from "./UI/input";
import TextAnimation from "./UI/TextAnimation";
import { AnimatedSubscribeButton } from "./magicui/animated-subscribe-button";
import { useState } from "react";
import { TextAnimate } from "./magicui/text-animate";
import { ShineBorder } from "./magicui/shine-border";
import { motion } from "motion/react";

export default function Footer() {
    return (
        <div className="w-full px-4 sm:px-6 md:px-8 lg:px-10 bg-neutral-950 text-white pt-16 sm:pt-24 md:pt-32 lg:pt-48">
            <div className="flex flex-col lg:flex-row items-start justify-between gap-8 lg:gap-0">
                <Card className="bg-neutral-900 text-white border-none py-6 sm:py-8 md:py-10 px-3 sm:px-4 md:px-6 rounded-xl w-full lg:w-1/2 xl:w-2/5 relative">
                    <ShineBorder shineColor={["#fff", "#eee"]} duration={10} />
                    <CardHeader>
                        <CardTitle className="text-lg sm:text-xl md:text-2xl font-semibold">Contact Me</CardTitle>
                        <CardDescription className="text-sm sm:text-base">
                            Let me know what you are looking for, and I will get back to you as soon as possible.
                        </CardDescription>
                    </CardHeader>

                    <CardContent>
                        <Form />
                    </CardContent>
                </Card>

                <div className="flex flex-col items-start lg:items-end justify-center gap-2 self-start lg:self-end w-full lg:w-auto">
                    <span className="flex flex-col items-start lg:items-end gap-2 text-2xl sm:text-3xl md:text-4xl lg:text-4xl xl:text-5xl font-climate-crisis">
                        {linkList.map((link, index) => (
                            <Link key={index} href={link.href} className={link.className}>
                                {link.children}
                            </Link>
                        ))}
                    </span>
                    <TextAnimation text="Copyright © 2025 Zade" className="text-sm sm:text-base md:text-lg" />
                </div>
            </div>

            <TextAnimate by="character" duration={1} once={true} className="font-climate-crisis text-[6rem] sm:text-[12rem] md:text-[16rem] lg:text-[20rem] xl:text-[25rem] 2xl:text-[30rem] text-center w-full leading-tight mt-8 sm:mt-12 md:mt-16 lg:mt-20 whitespace-nowrap">ZADE</TextAnimate>
        </div>
    )
}

const Form = () => {

    const [name, setName] = useState<string>("")
    const [email, setEmail] = useState<string>("")
    const [message, setMessage] = useState<string>("")
    const [loading, setLoading] = useState<boolean>(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        try {
            const response = await fetch('/api/email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, email, message }),
            })

            if (response.ok) {
                const data = await response.json()
                console.log("Email sent successfully:", data)
                setName("")
                setEmail("")
                setMessage("")
                setLoading(false)
            } else {
                console.error("Failed to send email:", response.status)
                alert("Failed to send message. Please try again.")
            }
        } catch (error) {
            console.error("Error sending email:", error)
            alert("An error occurred. Please try again.")
        }
    }
    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 sm:gap-6">
            <div className="flex flex-col gap-4 sm:gap-6">
                <div className="grid gap-2">
                    <Label htmlFor="name" className="text-sm sm:text-base">Name</Label>
                    <Input
                        id="name"
                        type="text"
                        placeholder="John Doe"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="p-3 sm:p-4 md:p-5 text-sm sm:text-base"
                    />
                </div>
            </div>
            <div className="flex flex-col gap-4 sm:gap-6">
                <div className="grid gap-2">
                    <Label htmlFor="email" className="text-sm sm:text-base">Email</Label>
                    <Input
                        id="email"
                        type="email"
                        placeholder="something@example.com"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="p-3 sm:p-4 md:p-5 text-sm sm:text-base"
                    />
                </div>
            </div>
            <div className="flex flex-col gap-4 sm:gap-6">
                <div className="grid gap-2">
                    <Label htmlFor="message" className="text-sm sm:text-base">Message</Label>
                    <Input
                        id="message"
                        type="text"
                        placeholder={`Hi I'm ${name}`}
                        required
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="p-3 sm:p-4 md:p-5 text-sm sm:text-base"
                    />
                </div>
            </div>

            <AnimatedSubscribeButton className={`${loading ? "bg-gray-300 cursor-progress text-neutral-950" : "bg-white text-neutral-950"} ${!(name && email && message) ? "bg-gray-300 cursor-not-allowed" : "bg-white"} text-sm sm:text-base py-3 sm:py-4`} disabled={!(name && email && message)} type="submit">
                <span>{!(name && email && message) ? `Complete the form` : `Send`}</span>
                <span>{loading ? "Sending..." : `Sent`}</span>
            </AnimatedSubscribeButton>
        </form>
    )
}

const Link = ({ href, children, className }: { href: string; children: React.ReactNode; className?: string }) => {
    return (
        <motion.a href={href} className={className} target="_blank"
            whileHover={{
                color: "transparent",
                webkitTextStroke: "1px #C1BDA8",
                transition: {
                    duration: 0.25,
                    ease: "easeInOut"
                }
            }}>{children}</motion.a>
    )
}

const linkList = [
    {
        href: "https://www.reddit.com/user/scoop_creator/",
        className: "",
        children: "Reddit"
    },
    {
        href: "https://github.com/zadescoxp",
        className: "",
        children: "GitHub"
    },
    {
        href: "https://www.linkedin.com/in/zadescoxp/",
        className: "",
        children: "LinkedIn"
    },
]
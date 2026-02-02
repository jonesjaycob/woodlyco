"use client";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { NavigationMenuMain } from "@/components/navbar";
import { ButtonGroup } from "@/components/ui/button-group";
import { Button } from "@/components/ui/button";
import { CircleFadingArrowUpIcon } from "lucide-react"; // Note: This import seems unused; remove if not needed
import LightPost1 from "@/components/ui/light-post-1";
import Marking from "@/components/ui/marking";
import { Card } from "@/components/ui/card";

export default function Home() {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, -100]);
  const x1 = useTransform(scrollY, [0, 500], [0, 50]);
  const videoWidth = useTransform(scrollY, [0, 500], ["100%", "1%"]);

  return (
    <main>
      <div className="relative h-screen">
        <NavigationMenuMain />
        <motion.div
          className="relative mx-auto overflow-clip"
          style={{ width: videoWidth, height: videoWidth }}
        >
          <video
            src="/IMG_5555.mov"
            autoPlay
            loop
            muted
            playsInline
            className="absolute bottom-0 left-0 w-full p-2 h-full object-cover opacity-15"
          />
          <div
            className="
              absolute right-70 overflow-clip opacity-10
              top-85
              h-95 w-95 p-10
              bg-[radial-gradient(#fefce8_0%,#fde68a_10%,#fbbf24_20%,transparent_50%)]
            "
          />
          <div className="absolute right-0 overflow-clip h-full p-10">
            <LightPost1 stroke="#666666" />
          </div>
        </motion.div>
        <div className="absolute bottom-0 h-2/3 w-full">
          <div className="container mx-auto h-full flex flex-col md:flex-row items-end py-24 px-12 gap-10">
            <div className="w-full md:w-1/2">
              <h1 className="uppercase text-4xl md:text-7xl relative">
                <span className="absolute -top-10 -left-10">
                  <Marking orientation="left" stroke="white" />
                </span>
                Custom Wooden Light Posts
                <br />
                <span className="text-sm">Handcrafted by Woodly Co.</span>
              </h1>
            </div>
            <div className="w-full md:w-1/2 flex flex-col gap-5">
              <p>
                At Woodly Co., we transform your vision into premium custom
                wooden light posts, ideal for brightening your driveway, garden,
                or yard. Choose from solar-powered, battery-operated, or
                electric options for eco-friendly outdoor lighting. With
                traditional woodworking techniques, we mill high-quality timber
                to create stunning, long-lasting wooden lamp posts that boost
                your home's curb appeal and add timeless charm.
              </p>
              <ButtonGroup>
                <Button size={"lg"} variant={"outline"}>
                  Shop
                </Button>
                <Button size={"lg"} variant={"outline"}>
                  Contact Us
                </Button>
              </ButtonGroup>
            </div>
          </div>
        </div>
      </div>
      <div className="container mx-auto mt-32 flex flex-col md:flex-row items-center justify-between gap-10 px-4">
        <div className="w-full  relative rounded-2xl overflow-hidden">
          {" "}
          {/* Relative container with min-height */}
          <Image
            width={1500}
            height={1500}
            src="/IMG_5638.jpg"
            alt="Handcrafted wooden light post tools including chisel and planer"
            className="absolute inset-0 w-full h-full object-cover opacity-20" // Absolute, full cover, reduced opacity
          />
          <div className="relative z-10 flex flex-col gap-10 p-8 text-center my-10">
            {" "}
            {/* Text on top */}
            <h1 className="uppercase text-4xl md:text-7xl relative">
              <span className="absolute -top-10 right-10 md:right-10">
                <Marking orientation="right" stroke="white" />
              </span>
              Handcrafted Timber Frame
              <br />
            </h1>
            <p>
              Our handcrafted wooden light posts are made from oversized,
              high-character timber that stands the test of time. Each post
              features a durable protective coating that repels water and
              resists UV damage for years of reliable outdoor performance.
              Available in a range of sizes to fit your driveway, garden, or
              yard perfectly.
            </p>
            <div>
              <Button size={"lg"}>Learn More</Button>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-white my-10 py-10">
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-10 px-4">
          <Card className="">test</Card>
        </div>
      </div>
    </main>
  );
}

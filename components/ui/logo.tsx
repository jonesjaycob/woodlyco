import { League_Spartan, Montserrat } from "next/font/google";

const leagueSpartan = League_Spartan({
  subsets: ["latin"],
  weight: "900",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: "300",
});

export function Logo({}) {
  return (
    <div className="flex flex-col items-center p-2">
      <h1 className={`${leagueSpartan.className} text-[28px]`}>woodly</h1>
      <h1
        className={`${montserrat.className} uppercase text-[10px] tracking-[2px] mt-[-8px]`}
      >
        Company
      </h1>
    </div>
  );
}

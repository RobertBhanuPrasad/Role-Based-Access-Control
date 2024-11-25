import "@/styles/globals.css";
import { Breadcrumb } from "@/components/breadcrumbs";
import Navbar from "@/components/navbar";
import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  return (
  <div className="bg-[white]">
    <Navbar />
    <Breadcrumb/>
    <Component {...pageProps} />
  </div>
  );
}

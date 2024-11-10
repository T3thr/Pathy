// app/novel-maker/layout.js
import TopToolbar from "@/components/novel-maker/TopToolbar";
import { GlobalProvider } from "../GlobalProvider";

// This layout will be applied only to the `/novel-maker` page
export default function NovelMakerLayout({ children }) {
  return (
    <html lang="en">
      <title>PATHY - Novel Maker</title>
      <body>

        {/* No Header component here */}
        <GlobalProvider>

            {children}

        </GlobalProvider>
      </body>
    </html>
  );
}

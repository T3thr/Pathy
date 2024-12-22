import Sidebar from "@/components/layouts/Sidebar";

export default function RootLayout({ children }) {
  return (
    <div className="bg-var-background text-var-foreground dark:bg-var-container dark:text-var-foreground">

      {/* Hero Section */}
      <section className="py-4 sm:py-8 bg-gradient-to-r from-blue-500 via-indigo-600 to-purple-700 dark:from-indigo-800 dark:via-indigo-900 dark:to-purple-900 shadow-xl lg:mt-4 -mt-1 md:pb-8 sm:pb-6 transition-all">
        <div className="container max-w-screen h-auto mx-auto px-6">
          <h1 className="font-bold text-4xl sm:text-5xl text-white tracking-tight drop-shadow-xl leading-tight">
            User Dashboard
          </h1>
          <p className="text-lg sm:text-xl text-white/80">Manage your account</p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-4 sm:py-16">
        <div className="container max-w-screen mx-auto h-auto ">
          <div className="flex flex-col md:flex-row gap-2">
            
            {/* Sidebar */}

              <Sidebar />
 

            {/* Main Content Area */}
            <main className="w-screen ">
              <article className="border w-full border-gray-200 bg-white dark:border-gray-900 dark:bg-slate-900 shadow-lg dark:shadow-xl rounded-xl transition-all">
                {children}
              </article>
            </main>

          </div>
        </div>
      </section>
    </div>
  );
}

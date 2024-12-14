import Sidebar from "@/components/layouts/Sidebar";

export default function RootLayout({ children }) {
  return (
    <div className="bg-var-background text-var-foreground dark:bg-var-container dark:text-var-foreground">
      <section className="py-5 sm:py-7 bg-blue-100 dark:bg-indigo-700 mt-5 md:pb-7 sm:pb-7 transition-all">
        <div className="container max-w-screen-xl mx-auto px-4">
          <h1 className="font-semibold text-2xl text-var-foreground">User Dashboard</h1>
        </div>
      </section>

      <section className="py-10">
        <div className="container max-w-screen-xl mx-auto px-4">
          <div className="flex flex-col md:flex-row -mx-4">
            <Sidebar />
            <main className="md:w-2/3 lg:w-3/4 px-4">
              <article className="border border-gray-200 bg-white dark:border-gray-900 dark:bg-slate-900 shadow-sm dark:shadow-light rounded mb-5 p-3 lg:p-5 transition-all">
                {children}
              </article>
            </main>
          </div>
        </div>
      </section>
    </div>
  );
}

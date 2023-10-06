import { Header } from "~/components/lp/Header"

export const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Header />
      <section className="mx-auto max-h-full w-full overflow-y-auto px-2 md:max-w-screen-md">{children}</section>
    </>
  )
}

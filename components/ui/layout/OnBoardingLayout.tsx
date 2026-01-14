type Props = {
  header: React.ReactNode
  footer?: React.ReactNode
  children: React.ReactNode
}

export default function OnBoardingLayout({ header, footer, children }: Props) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-50">
        {header}
      </header>

      <main className="flex-1">
        {children}
      </main>

      {footer && (
      <footer>
        {footer}
      </footer>
      )}
    </div>
  )
}

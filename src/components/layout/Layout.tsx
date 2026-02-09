interface LayoutProps {
    children: React.ReactNode
    sidebar?: React.ReactNode
}

export const Layout: React.FC<LayoutProps> = ({ children, sidebar }) => {
    return (
        <div className="flex h-screen w-full bg-background overflow-hidden">
            {sidebar}
            <main className="flex-1 flex flex-col min-w-0">
                {children}
            </main>
        </div>
    )
}

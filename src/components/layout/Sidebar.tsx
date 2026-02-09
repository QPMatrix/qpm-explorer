import { Button } from "@/components/ui/button"
import { Home, HardDrive, Download, Music, Image, Video, FileText } from "lucide-react"

interface SidebarProps {
    onNavigate: (path: string) => void
}

export const Sidebar: React.FC<SidebarProps> = ({ onNavigate }) => {
    // These paths might need adjustment based on OS (can use tauri api to get standard paths in future)
    const quickLinks = [
        { label: "Home", path: "~", icon: Home }, // Requires backend support for '~'
        { label: "Desktop", path: "~/Desktop", icon: HardDrive },
        { label: "Downloads", path: "~/Downloads", icon: Download },
        { label: "Documents", path: "~/Documents", icon: FileText },
        { label: "Pictures", path: "~/Pictures", icon: Image },
        { label: "Music", path: "~/Music", icon: Music },
        { label: "Videos", path: "~/Videos", icon: Video },
    ]

    // Note: Backend open_folder needs to handle '~' or we resolve it here. 
    // Ideally backend handles it. For now, let's assume we pass absolute paths or names.
    // Since backend uses `dirs` crate, maybe we can expose a `get_std_paths` command. 
    // For this step, I'll stick to a simple UI shell.

    return (
        <div className="w-56 bg-muted/30 border-r h-full flex flex-col p-2 space-y-1">
            <div className="px-4 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Favorites
            </div>
            {quickLinks.map((link) => (
                <Button 
                    key={link.label} 
                    variant="ghost" 
                    className="justify-start gap-2 h-9 px-4 font-normal"
                    onClick={() => onNavigate(link.path)} // Logic needed to resolve '~' later
                >
                    <link.icon size={16} />
                    {link.label}
                </Button>
            ))}
        </div>
    )
}

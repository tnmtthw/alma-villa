import { Button } from "@/components/ui/button"

interface AnnouncementProps {
  announcement: {
    description: string;
  }
}

export default function AnnouncementItem({ announcement }: AnnouncementProps) {
  return (
    <div>
      <p className="mt-2 text-sm text-gray-500">{announcement.description}</p>
      <Button
        variant="outline"
        className="mt-3 text-[#23479A] p-0 h-auto font-medium hover:bg-transparent"
      >
        Read More
      </Button>
    </div>
  )
} 
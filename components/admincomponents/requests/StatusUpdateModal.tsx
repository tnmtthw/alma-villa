import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { DocumentRequest } from "./types"

interface StatusUpdateModalProps {
  isOpen: boolean
  onClose: () => void
  request: DocumentRequest | null
  updateStatusData: {
    newStatus: string
    adminNotes: string
    rejectionReason: string
  }
  setUpdateStatusData: (data: {
    newStatus: string
    adminNotes: string
    rejectionReason: string
  }) => void
  onSubmit: () => void
}

export default function StatusUpdateModal({
  isOpen,
  onClose,
  request,
  updateStatusData,
  setUpdateStatusData,
  onSubmit,
}: StatusUpdateModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white">
        <DialogHeader>
          <DialogTitle>Update Request Status</DialogTitle>
          <DialogDescription>
            Change the status and add notes for request {request?.id}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700">New Status</label>
            <Select
              value={updateStatusData.newStatus}
              onValueChange={(value) => setUpdateStatusData({ ...updateStatusData, newStatus: value })}
            >
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select new status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="payment_sent">Payment Sent</SelectItem>
                <SelectItem value="ready_to_claim">Ready to Claim</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* <div>
            <label className="text-sm font-medium text-gray-700">Admin Notes</label>
            <textarea
              value={updateStatusData.adminNotes}
              onChange={(e) => setUpdateStatusData({ ...updateStatusData, adminNotes: e.target.value })}
              placeholder="Add internal notes about this request..."
              className="mt-1 w-full p-3 border border-gray-300 rounded-md focus:ring-[#23479A] focus:border-[#23479A]"
              rows={3}
            />
          </div> */}

          {updateStatusData.newStatus === "rejected" && (
            <div>
              <label className="text-sm font-medium text-gray-700">Rejection Reason</label>
              <textarea
                value={updateStatusData.rejectionReason}
                onChange={(e) => setUpdateStatusData({ ...updateStatusData, rejectionReason: e.target.value })}
                placeholder="Provide reason for rejection (will be sent to user)..."
                className="mt-1 w-full p-3 border border-gray-300 rounded-md focus:ring-[#23479A] focus:border-[#23479A]"
                rows={3}
                required
              />
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={onSubmit}
            className="bg-[#23479A] hover:bg-[#23479A]/90"
            disabled={!updateStatusData.newStatus}
          >
            Update Status
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 
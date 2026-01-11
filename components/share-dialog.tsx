"use client"

import { useState } from "react"
import { Copy, Check, Link2, Mail, Users, Eye, Lock, Globe } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { ConfirmDialog } from "@/components/confirm-dialog"

interface ShareDialogProps {
  experimentId: string
  experimentName: string
  trigger?: React.ReactNode
}

type AccessLevel = "view" | "comment" | "edit"
type LinkVisibility = "private" | "team" | "public"

interface SharedUser {
  id: string
  name: string
  email: string
  avatar?: string
  accessLevel: AccessLevel
}

const mockSharedUsers: SharedUser[] = [
  { id: "1", name: "Sarah Chen", email: "sarah@figma.com", accessLevel: "edit" },
  { id: "2", name: "Michael Torres", email: "michael@figma.com", accessLevel: "comment" },
]

export function ShareDialog({ experimentId, experimentName, trigger }: ShareDialogProps) {
  const [open, setOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const [linkVisibility, setLinkVisibility] = useState<LinkVisibility>("team")
  const [emailInput, setEmailInput] = useState("")
  const [sharedUsers, setSharedUsers] = useState<SharedUser[]>(mockSharedUsers)
  const [removeConfirmOpen, setRemoveConfirmOpen] = useState(false)
  const [userToRemove, setUserToRemove] = useState<SharedUser | null>(null)

  const shareableLink = `https://figlab.figma.com/share/${experimentId}?token=abc123`

  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(shareableLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleInvite = () => {
    if (!emailInput.trim()) return

    const newUser: SharedUser = {
      id: `user-${Date.now()}`,
      name: emailInput.split("@")[0],
      email: emailInput,
      accessLevel: "view",
    }
    setSharedUsers([...sharedUsers, newUser])
    setEmailInput("")
  }

  const updateAccessLevel = (userId: string, level: AccessLevel) => {
    setSharedUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, accessLevel: level } : u))
    )
  }

  const confirmRemoveUser = (user: SharedUser) => {
    setUserToRemove(user)
    setRemoveConfirmOpen(true)
  }

  const removeUser = () => {
    if (userToRemove) {
      setSharedUsers((prev) => prev.filter((u) => u.id !== userToRemove.id))
      setUserToRemove(null)
    }
  }

  const visibilityOptions: { value: LinkVisibility; label: string; icon: React.ElementType; description: string }[] = [
    { value: "private", label: "Private", icon: Lock, description: "Only invited people can access" },
    { value: "team", label: "Team", icon: Users, description: "Anyone in the Growth team can access" },
    { value: "public", label: "Public", icon: Globe, description: "Anyone with the link can view" },
  ]

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm">
            <Link2 className="w-4 h-4 mr-2" />
            Share
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Share "{experimentName}"</DialogTitle>
          <DialogDescription>
            Invite team members or create a shareable link for stakeholders
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 pt-4">
          {/* Invite by email */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Invite people</Label>
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Enter email address"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  className="pl-9"
                  onKeyDown={(e) => e.key === "Enter" && handleInvite()}
                />
              </div>
              <Button onClick={handleInvite} disabled={!emailInput.trim()}>
                Invite
              </Button>
            </div>
          </div>

          {/* Shared users list */}
          {sharedUsers.length > 0 && (
            <div className="space-y-3">
              <Label className="text-sm font-medium">People with access</Label>
              <div className="space-y-2 max-h-[180px] overflow-y-auto">
                {sharedUsers.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between p-2 rounded-lg bg-muted/50"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-xs font-medium text-primary-foreground">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">{user.name}</p>
                        <p className="text-xs text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <select
                        value={user.accessLevel}
                        onChange={(e) => updateAccessLevel(user.id, e.target.value as AccessLevel)}
                        className="text-xs bg-transparent border border-border rounded px-2 py-1"
                      >
                        <option value="view">Can view</option>
                        <option value="comment">Can comment</option>
                        <option value="edit">Can edit</option>
                      </select>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive"
                        onClick={() => confirmRemoveUser(user)}
                      >
                        ×
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Link visibility */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Link access</Label>
            <div className="grid grid-cols-3 gap-2">
              {visibilityOptions.map((option) => {
                const Icon = option.icon
                const isSelected = linkVisibility === option.value
                return (
                  <button
                    key={option.value}
                    onClick={() => setLinkVisibility(option.value)}
                    className={cn(
                      "flex flex-col items-center gap-2 p-3 rounded-lg border transition-colors",
                      isSelected
                        ? "border-primary bg-primary/5"
                        : "border-border hover:bg-muted/50"
                    )}
                  >
                    <Icon className={cn("w-5 h-5", isSelected ? "text-primary" : "text-muted-foreground")} />
                    <span className={cn("text-xs font-medium", isSelected ? "text-primary" : "text-foreground")}>
                      {option.label}
                    </span>
                  </button>
                )
              })}
            </div>
            <p className="text-xs text-muted-foreground">
              {visibilityOptions.find((o) => o.value === linkVisibility)?.description}
            </p>
          </div>

          {/* Copy link */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Shareable link</Label>
            <div className="flex gap-2">
              <Input
                value={shareableLink}
                readOnly
                className="font-mono text-xs bg-muted"
              />
              <Button onClick={handleCopyLink} variant="outline">
                {copied ? (
                  <>
                    <Check className="w-4 h-4 mr-2 text-chart-3" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 mr-2" />
                    Copy
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Stakeholder view info */}
          <div className="p-3 rounded-lg bg-muted/50 border border-border">
            <div className="flex items-start gap-2">
              <Eye className="w-4 h-4 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-xs font-medium text-foreground">Stakeholder View</p>
                <p className="text-xs text-muted-foreground mt-1">
                  External viewers see a read-only summary with key metrics, hypothesis, and current status.
                  No account required.
                </p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>

      {/* Remove user confirmation */}
      <ConfirmDialog
        open={removeConfirmOpen}
        onOpenChange={setRemoveConfirmOpen}
        title="Remove access"
        description={`Are you sure you want to remove ${userToRemove?.name}'s access to this experiment?`}
        confirmLabel="Remove"
        variant="destructive"
        onConfirm={removeUser}
      />
    </Dialog>
  )
}

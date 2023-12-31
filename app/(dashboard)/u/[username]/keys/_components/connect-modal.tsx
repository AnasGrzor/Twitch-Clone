"use client";

import { AlertTriangle } from "lucide-react";
import { IngressInput } from "livekit-server-sdk";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Select,SelectItem,SelectTrigger,SelectContent,SelectValue } from "@/components/ui/select";
import { ElementRef, useRef, useState, useTransition } from "react";
import { createIngress } from "@/actions/ingress";
import { toast } from "sonner";

const RTMP = String(IngressInput.RTMP_INPUT);
const WHIP = String(IngressInput.WHIP_INPUT);

type IngressType = typeof RTMP | typeof WHIP

export const ConnectModal = () => {
  const closeRef = useRef<ElementRef<"button">>(null)
  const [isPending, startTransition] = useTransition();
  const [IngressType, setIngressType] = useState<IngressType>(RTMP);

  const onSubmit = () => {
    startTransition(() => {
      createIngress(parseInt(IngressType))
        .then(() => {
          toast.success("Ingress Created")
          closeRef?.current?.click()
        })
        .catch(() => {
          toast.error("Something went wrong")
        })
    })
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="primary">Generate Connection</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Generate Connection</DialogTitle>
        </DialogHeader>
        <Select 
        disabled={isPending}
        value={IngressType} 
        onValueChange={((value) => setIngressType(value))}
        >
            <SelectTrigger className="w-full">
                <SelectValue placeholder="Ingress Type" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value={RTMP}>RTMP</SelectItem>
                <SelectItem value={WHIP}>WHIP</SelectItem>
            </SelectContent>
        </Select>
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Warning</AlertTitle>
          <AlertDescription>
            This action will reset all active streams using the current
            connection
          </AlertDescription>
        </Alert>
        <div className="flex justify-between">
          <DialogClose ref={closeRef} asChild>
            <Button variant="ghost">Cancel</Button>
          </DialogClose>
          <Button
            disabled={isPending}
            variant="primary"
            onClick={onSubmit}
          >
            Generate
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

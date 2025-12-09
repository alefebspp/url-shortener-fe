import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { env } from '@/env'

type Props = {
  code: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function CopyCodeDialog({ code, open, onOpenChange }: Props) {
  const handleCopy = async () => {
    try {
      const url = `${env.VITE_SERVER_URL}/api/links/redirect/${code}`
      await navigator.clipboard.writeText(url)

      toast('Código copiado com sucesso!')
    } catch (err) {
      console.error('Falha ao copiar', err)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Link encurtado com sucesso!</DialogTitle>
          <DialogDescription>
            Compartilhe seu link com seu público.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4"></div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Fechar</Button>
          </DialogClose>
          <Button onClick={handleCopy}>Copiar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

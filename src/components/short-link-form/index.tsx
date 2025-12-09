import { useState } from 'react'
import { Link } from 'lucide-react'
import z from 'zod'
import { revalidateLogic } from '@tanstack/react-form'
import { toast } from 'sonner'

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

import { useAppForm } from '@/hooks/form'
import CopyCodeDialog from './copy-code-dialog'
import { createShortLink } from '@/services/short-link'
import { isAxiosError } from 'axios'

export const createShortLinkSchema = z.object({
  destination: z.url('Insira uma URL válida'),
  customAlias: z
    .string()
    .max(30, 'Máximo de 30 caracteres')
    .regex(
      /^[a-zA-Z0-9_-]*$/,
      'Caracteres inválidos. Use apenas letras e números sem espaços',
    )
    .optional(),
  title: z
    .string('Título deve ser uma string')
    .max(30, 'Máximo de 30 caracteres')
    .optional(),
  expiresAt: z.string().optional(),
  maxClicks: z
    .number('Máximo de cliques deve ser maior ou igual a 0')
    .optional(),
})

export default function ShortLinkForm() {
  const [dialogIsOpen, setDialogIsOpen] = useState(false)
  const [code, setCode] = useState('')

  const form = useAppForm({
    validationLogic: revalidateLogic({
      mode: 'submit',
      modeAfterSubmission: 'change',
    }),
    defaultValues: {
      destination: '',
      customAlias: '',
      title: '',
      maxClicks: 0,
      expiresAt: '',
    } as z.infer<typeof createShortLinkSchema>,
    validators: {
      onDynamic: createShortLinkSchema,
    },
    onSubmit: async ({ value, formApi }) => {
      try {
        const { maxClicks, expiresAt, ...values } = value

        const body = values

        if (maxClicks && maxClicks > 0) {
          Object.assign(body, { maxClicks })
        }

        if (expiresAt) {
          Object.assign(body, { expiresAt: `${expiresAt}:00.000Z` })
        }

        const { data } = await createShortLink(body)

        if (data) {
          formApi.reset({
            destination: '',
            customAlias: '',
            title: '',
            maxClicks: 0,
            expiresAt: '',
          })

          setCode(data.code)
          setDialogIsOpen(true)
        }
      } catch (error) {
        if (isAxiosError(error)) {
          if (error.response) {
            return toast.error(error.response.data.message)
          }
        }
        toast.error('Erro no servidor. Por favor, tente novamente.')
      }
    },
  })

  return (
    <Card className="w-full flex items-center md:max-w-lg bg-background border-0! md:border! border-gray-300 dark:border-border shadow-md rounded-none py-8">
      <CopyCodeDialog
        open={dialogIsOpen}
        onOpenChange={setDialogIsOpen}
        code={code}
      />
      <form
        className="w-md"
        onSubmit={(e) => {
          e.preventDefault()
          form.handleSubmit()
        }}
      >
        <CardHeader className="justify-center">
          <CardTitle className="flex items-center justify-center gap-2 text-center">
            Encurtador de Link <Link className="w-4 h-4 text-main-blue" />
          </CardTitle>
          <CardDescription className="text-center">
            Crie links curtos com controle total.
          </CardDescription>
          <CardDescription className="text-center">
            Campos marcados com <span className="font-bold">*</span> são
            obrigatórios.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-6 py-6">
            <form.AppField
              name="destination"
              children={(field) => (
                <field.FormField
                  label="Link *"
                  placeholder="Ex: https://google.com"
                />
              )}
            />
            <form.AppField
              name="customAlias"
              children={(field) => (
                <field.FormField
                  label="Código customizado"
                  placeholder="Ex: meuCodigo"
                />
              )}
            />
            <form.AppField
              name="title"
              children={(field) => <field.FormField label="Título" />}
            />
            <form.AppField
              name="maxClicks"
              children={(field) => (
                <field.FormField label="Máximo de cliques" type="number" />
              )}
            />
            <form.AppField
              name="expiresAt"
              children={(field) => (
                <field.FormField
                  label="Data de expiração"
                  type="datetime-local"
                />
              )}
            />
          </div>
        </CardContent>
        <CardFooter className="flex-col gap-2">
          <form.AppForm>
            <form.SubmitButton
              className="w-full uppercase bg-main-blue hover:bg-dark-blue text-white"
              label="Criar link curto"
            />
          </form.AppForm>
        </CardFooter>
      </form>
    </Card>
  )
}

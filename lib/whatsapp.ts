type WhatsAppTextResult = {
  ok: boolean
  providerId?: string
  error?: string
}

export async function sendWhatsAppText({
  to,
  body,
  accessToken,
  phoneNumberId,
}: {
  to: string
  body: string
  accessToken?: string | null
  phoneNumberId?: string | null
}): Promise<WhatsAppTextResult> {
  if (!accessToken || !phoneNumberId) {
    return {
      ok: false,
      error:
        'Esta empresa todavia no conecto su WhatsApp Business.',
    }
  }

  const response = await fetch(
    `https://graph.facebook.com/v21.0/${phoneNumberId}/messages`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        recipient_type: 'individual',
        to: to.replace(/[^\d]/g, ''),
        type: 'text',
        text: {
          preview_url: false,
          body,
        },
      }),
    },
  )

  const data = await response.json().catch(() => ({}))

  if (!response.ok) {
    return {
      ok: false,
      error:
        data?.error?.message ||
        'WhatsApp rechazo el mensaje. Revisa permisos, ventana de conversacion o plantilla.',
    }
  }

  return {
    ok: true,
    providerId: data?.messages?.[0]?.id,
  }
}

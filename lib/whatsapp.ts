type WhatsAppTextResult = {
  ok: boolean
  providerId?: string
  error?: string
}

function getWhatsAppConfig() {
  return {
    accessToken: process.env.WHATSAPP_ACCESS_TOKEN,
    phoneNumberId: process.env.WHATSAPP_PHONE_NUMBER_ID,
  }
}

export function isWhatsAppConfigured() {
  const config = getWhatsAppConfig()

  return Boolean(config.accessToken && config.phoneNumberId)
}

export async function sendWhatsAppText({
  to,
  body,
}: {
  to: string
  body: string
}): Promise<WhatsAppTextResult> {
  const config = getWhatsAppConfig()

  if (!config.accessToken || !config.phoneNumberId) {
    return {
      ok: false,
      error:
        'WhatsApp Business no esta configurado. Faltan WHATSAPP_ACCESS_TOKEN y WHATSAPP_PHONE_NUMBER_ID.',
    }
  }

  const response = await fetch(
    `https://graph.facebook.com/v21.0/${config.phoneNumberId}/messages`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${config.accessToken}`,
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

export const WHATSAPP_PHONE = "5511989916903";

export function buildWhatsAppUrl(message: string): string {
  return `https://api.whatsapp.com/send?phone=${WHATSAPP_PHONE}&text=${encodeURIComponent(message)}`;
}

export function buildLeadWhatsAppMessage(lead: {
  nome: string;
  empresa: string;
  vertical: string;
}): string {
  return `Olá! Sou ${lead.nome} da ${lead.empresa} (${lead.vertical}). Vim pelo site da Moonrock Labs e quero conversar sobre software sob medida.`;
}

export function buildContactWhatsAppMessage(context: string): string {
  return `Olá! Vim pelo site da Moonrock Labs e quero falar com um especialista sobre ${context}.`;
}

export function openWhatsAppInNewTab(url: string): void {
  if (typeof window === "undefined") return;
  const popup = window.open(url, "_blank", "noopener,noreferrer");
  if (popup) popup.opener = null;
}

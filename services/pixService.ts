import QRCode from 'qrcode';
import { PIX_KEY, MERCHANT_NAME, MERCHANT_CITY } from '../constants';

// CRC-16-CCITT (0x1021) calculation
function crc16ccitt(str: string): string {
  let crc = 0xFFFF;
  for (let i = 0; i < str.length; i++) {
    let c = str.charCodeAt(i);
    crc ^= c << 8;
    for (let j = 0; j < 8; j++) {
      if ((crc & 0x8000) !== 0) {
        crc = (crc << 1) ^ 0x1021;
      } else {
        crc = crc << 1;
      }
    }
  }
  return (crc & 0xFFFF).toString(16).toUpperCase().padStart(4, '0');
}

function formatField(id: string, value: string): string {
  const len = value.length.toString().padStart(2, '0');
  return `${id}${len}${value}`;
}

// Remove accents for EMV compatibility
function normalizeText(text: string): string {
  return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

interface PixPaymentResponse {
  pixCopiaCola: string;
  pixQrCodeBase64: string;
  txid: string;
}

/**
 * Gera PIX Copia e Cola e QR Code automaticamente com base no valor total.
 * Chave PIX: 49999825638
 */
export const generatePixPayment = async (amount: number, orderId: string): Promise<PixPaymentResponse> => {
  // Validate minimum amount
  if (amount < 0.01) {
    throw new Error("O valor deve ser maior ou igual a R$ 0,01");
  }

  const amountStr = amount.toFixed(2);
  const merchantName = normalizeText(MERCHANT_NAME).substring(0, 25);
  const merchantCity = normalizeText(MERCHANT_CITY).substring(0, 15);
  const txIdClean = orderId.replace(/[^a-zA-Z0-9]/g, ''); // TxID must be alphanumeric
  const description = "Compra Esportiva";

  // --- Build EMV Payload ---
  
  // 00 - Payload Format Indicator
  let payload = formatField('00', '01');
  
  // 26 - Merchant Account Information
  const gui = formatField('00', 'br.gov.bcb.pix');
  const key = formatField('01', PIX_KEY);
  const desc = formatField('02', normalizeText(description)); // Added Field 02
  payload += formatField('26', gui + key + desc);
  
  // 52 - Merchant Category Code
  payload += formatField('52', '0000');
  
  // 53 - Transaction Currency (986 = BRL)
  payload += formatField('53', '986');
  
  // 54 - Transaction Amount
  payload += formatField('54', amountStr);
  
  // 58 - Country Code
  payload += formatField('58', 'BR');
  
  // 59 - Merchant Name
  payload += formatField('59', merchantName);
  
  // 60 - Merchant City
  payload += formatField('60', merchantCity);
  
  // 62 - Additional Data Field Template (TxID)
  const txIdField = formatField('05', txIdClean || '***'); // TxID is mandatory
  payload += formatField('62', txIdField);
  
  // 63 - CRC16 (Init)
  payload += '6304';
  
  // Calculate CRC
  const crc = crc16ccitt(payload);
  const pixCopiaCola = payload + crc;

  // Generate QR Code in Base64
  let pixQrCodeBase64 = '';
  try {
    pixQrCodeBase64 = await QRCode.toDataURL(pixCopiaCola, {
      width: 300,
      margin: 2,
      color: {
        dark: '#000000FF',
        light: '#FFFFFFFF'
      }
    });
  } catch (err) {
    console.error("Erro ao gerar QR Code:", err);
    // Fallback or empty string, handled by UI
  }

  return {
    pixCopiaCola,
    pixQrCodeBase64,
    txid: txIdClean
  };
};
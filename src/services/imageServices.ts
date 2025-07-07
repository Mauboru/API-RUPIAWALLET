import fs from "fs";
import path from "path";

/**
 * Salva uma imagem base64 em disco e retorna o nome do arquivo salvo.
 * @param image - Imagem em formato base64 (data:image/...).
 * @param name - nome (usado para nomear o arquivo).
 * @returns Nome do arquivo salvo ou uma mensagem de erro.
 */
export function submitImage(image: string, identificador: string): { success: boolean; fileName?: string; error?: string } {
  if (!image || !image.startsWith("data:image")) {
    return { success: false, error: "Formato de imagem inválido." };
  }

  const matches = image.match(/^data:image\/([a-zA-Z]+);base64,(.+)$/);
  if (!matches || matches.length !== 3) {
    return { success: false, error: "Formato de imagem inválido." };
  }

  const ext = matches[1];
  const base64Data = matches[2];
  const fileName = `icone_${identificador}_${Date.now()}.${ext}`;

  const profilesDir = path.join(__dirname, "..", "uploads", "icone");
  if (!fs.existsSync(profilesDir)) fs.mkdirSync(profilesDir, { recursive: true });

  const filePath = path.join(profilesDir, fileName);
  fs.writeFileSync(filePath, Buffer.from(base64Data, "base64"));

  return { success: true, fileName };
}

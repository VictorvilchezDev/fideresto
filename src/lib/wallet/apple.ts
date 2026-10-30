import { PKPass, PassType } from "passkit-generator";
import type { WalletSnapshot } from "./model";
import { walletIdentity, walletBarcode, walletSnapshotSchema } from "./model";
import type { AppleCredentials } from "./config";
import { appleImages } from "./assets";
export async function createApplePass(input: WalletSnapshot, credentials: AppleCredentials) {
  const s = walletSnapshotSchema.parse(input);
  const pass = new PKPass(
    await appleImages(s),
    {
      signerCert: credentials.signerCert,
      signerKey: credentials.signerKey,
      wwdr: credentials.wwdr,
      signerKeyPassphrase: credentials.signerKeyPassphrase,
    },
    {
      formatVersion: 1,
      passTypeIdentifier: credentials.passTypeId,
      teamIdentifier: credentials.teamId,
      serialNumber: walletIdentity(s),
      organizationName: s.merchantName,
      description: `Tarjeta de fidelidad de ${s.merchantName}${s.sample ? " · PRUEBA" : ""}`,
      logoText: s.merchantName,
      backgroundColor: "rgb(237, 243, 255)",
      foregroundColor: "rgb(24, 37, 61)",
      labelColor: "rgb(49, 95, 231)",
      sharingProhibited: true,
    },
  );
  const type = new PassType("storeCard");
  type.primaryFields.push({
    key: "stamps",
    label: "SELLOS",
    value: `${s.stamps} / ${s.target}`,
    changeMessage: "Tus sellos: %@",
  });
  type.secondaryFields.push({ key: "reward", label: "PRÓXIMO PREMIO", value: s.rewardText });
  type.auxiliaryFields.push({
    key: "rewards",
    label: "PREMIOS DISPONIBLES",
    value: String(s.availableRewards),
  });
  type.backFields.push({
    key: "rules",
    label: "Tu tarjeta",
    value: s.sample
      ? "Tarjeta de prueba con datos ficticios. No otorga premios reales."
      : "Un sello por cuenta confirmada por el personal. Los premios obtenidos se conservan según las condiciones del establecimiento.",
  });
  pass.types.push(type);
  pass.setBarcodes({
    format: "PKBarcodeFormatQR",
    message: walletBarcode(s),
    messageEncoding: "iso-8859-1",
    altText: "Tarjeta de fidelidad",
  });
  return pass.getAsBuffer();
}

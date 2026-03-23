/**
 * WooCommerce Store API amounts are in the currency's minor units (e.g. cents).
 */
export function formatMinorAmount(amountStr, currencyMeta) {
    if (amountStr == null || !currencyMeta) return "";
    const minor = Number(currencyMeta.currency_minor_unit ?? 2);
    const n = Number(amountStr) / 10 ** minor;
    const prefix = currencyMeta.currency_prefix || "";
    const suffix = currencyMeta.currency_suffix || "";
    return `${prefix}${n.toFixed(minor)}${suffix}`;
}

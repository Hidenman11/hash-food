import { randomBytes } from "crypto";
import { config } from "../config.js";
import type { PaymentProvider } from "@prisma/client";

export type InitiatePaymentInput = {
  amountTzs: number;
  currency: string;
  provider: PaymentProvider;
  msisdn: string;
  orderId: string;
  customerEmail?: string;
};

export type InitiatePaymentResult = {
  externalRef: string;
  status: "PENDING" | "PROCESSING";
  /** USSD push, redirect URL, or instructions */
  instructions?: string;
  raw?: unknown;
};

/**
 * Tanzania mobile money integration layer.
 *
 * - `mock`: instant pending reference for local dev (confirm via webhook simulator).
 * - `flutterwave`: server-side charge initiation (TZ mobile money rails when enabled on account).
 * - `http`: POST to `MOBILE_MONEY_HTTP_INIT_URL` with JSON body for custom gateways (Selcom, AzamPay, etc.).
 */
export async function initiateMobileMoneyPayment(
  input: InitiatePaymentInput,
): Promise<InitiatePaymentResult> {
  const ref = `HF-${randomBytes(6).toString("hex").toUpperCase()}`;
  const mode = config.mobileMoney.provider;

  if (mode === "mock") {
    return {
      externalRef: ref,
      status: "PENDING",
      instructions:
        "Mock mode: no carrier push sent. POST /v1/payments/webhook/mobile-money with this reference to complete.",
    };
  }

  if (mode === "flutterwave" && config.mobileMoney.flutterwaveSecret) {
    return initiateFlutterwaveMobileMoney(input, ref);
  }

  if (mode === "http" && config.mobileMoney.httpInitUrl) {
    const res = await fetch(config.mobileMoney.httpInitUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        reference: ref,
        amount: input.amountTzs,
        currency: input.currency,
        provider: input.provider,
        msisdn: normalizeMsisdn(input.msisdn),
        orderId: input.orderId,
      }),
    });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Gateway error: ${res.status} ${text}`);
    }
    const raw = (await res.json()) as Record<string, unknown>;
    return {
      externalRef: String(raw.reference ?? ref),
      status: "PROCESSING",
      instructions: typeof raw.message === "string" ? raw.message : undefined,
      raw,
    };
  }

  return {
    externalRef: ref,
    status: "PENDING",
    instructions:
      "Configure MOBILE_MONEY_PROVIDER and gateway keys. Using fallback mock reference only.",
  };
}

function normalizeMsisdn(raw: string): string {
  const d = raw.replace(/\D/g, "");
  if (d.startsWith("0")) return `255${d.slice(1)}`;
  if (d.startsWith("255")) return d;
  if (d.length === 9) return `255${d}`;
  return d;
}

async function initiateFlutterwaveMobileMoney(
  input: InitiatePaymentInput,
  reference: string,
): Promise<InitiatePaymentResult> {
  const payload = {
    tx_ref: reference,
    amount: input.amountTzs,
    currency: input.currency,
    email: input.customerEmail ?? "customer@hashfood.local",
    phone_number: normalizeMsisdn(input.msisdn),
    payment_type: "mobilemoney",
    country: "TZ",
    meta: { orderId: input.orderId, provider: input.provider },
  };

  const res = await fetch("https://api.flutterwave.com/v3/charges?type=mobile_money", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${config.mobileMoney.flutterwaveSecret}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const raw = (await res.json()) as Record<string, unknown>;
  if (!res.ok) {
    throw new Error(`Flutterwave error: ${JSON.stringify(raw)}`);
  }

  return {
    externalRef: reference,
    status: "PROCESSING",
    instructions:
      typeof raw.message === "string"
        ? raw.message
        : "Check handset for M-Pesa / Airtel prompt.",
    raw,
  };
}

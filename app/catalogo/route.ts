import { NextResponse, type NextRequest } from "next/server";
import { enderecoDoCatalogo } from "../v2/_dados/catalogo";

// resolve na hora: o PDF trocado no admin de Links vale sem precisar publicar o site
export const dynamic = "force-dynamic";

/** /catalogo → a revista ativa (/catalogo/<id>?origem=site), que volta para o site e não para a /links. */
export async function GET(request: NextRequest) {
  return NextResponse.redirect(new URL(await enderecoDoCatalogo(), request.url), 307);
}

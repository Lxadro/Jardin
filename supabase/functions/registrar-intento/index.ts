const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function jsonResponse(body: Record<string, unknown>, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

Deno.serve(async (request: Request) => {
  if (request.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }
  if (request.method !== "POST") return jsonResponse({ error: "Método no permitido." }, 405);

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  const claveSecreta = Deno.env.get("CLAVE_SECRETA");
  if (!supabaseUrl || !serviceRoleKey || !claveSecreta) {
    return jsonResponse({ error: "La función no está configurada." }, 500);
  }

  let body: { respuesta?: unknown };
  try {
    body = await request.json();
  } catch {
    return jsonResponse({ error: "Solicitud inválida." }, 400);
  }

  if (typeof body.respuesta !== "string" || body.respuesta.length > 2000) {
    return jsonResponse({ error: "La respuesta no es válida." }, 400);
  }

  const respuesta = body.respuesta;
  const acertado = respuesta.trim().toLowerCase() === claveSecreta.trim().toLowerCase();
  const insertResponse = await fetch(`${supabaseUrl}/rest/v1/intentos_contrasena`, {
    method: "POST",
    headers: {
      apikey: serviceRoleKey,
      Authorization: `Bearer ${serviceRoleKey}`,
      "Content-Type": "application/json",
      Prefer: "return=minimal",
    },
    body: JSON.stringify({ respuesta, acertado }),
  });

  if (!insertResponse.ok) {
    console.error("No se pudo insertar el intento:", insertResponse.status);
    return jsonResponse({ error: "No se pudo guardar el intento." }, 500);
  }

  return jsonResponse({ acertado });
});

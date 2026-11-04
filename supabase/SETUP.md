# Configuración de Supabase

1. Crea un proyecto de Supabase y ejecuta la migración `migrations/20261103000000_create_intentos_contrasena.sql` desde el SQL Editor.
2. Instala y autentica Supabase CLI, enlaza este directorio con el proyecto y guarda la clave en el servidor:

   ```powershell
   supabase link --project-ref TU_PROJECT_REF
   supabase secrets set CLAVE_SECRETA="TU_CLAVE_ACTUAL"
   supabase functions deploy registrar-intento
   ```

   Usa como `TU_CLAVE_ACTUAL` la clave que antes estaba en `js/flores.js` (`06/09/2026`), o la nueva clave que quieras usar. Supabase proporciona `SUPABASE_URL` y `SUPABASE_SERVICE_ROLE_KEY` a la función.

3. En `js/supabase-config.js`, configura el Project URL y la clave `anon` del proyecto. Esa clave es pública y solo permite invocar la función; nunca pongas la clave `service_role` ahí.
4. Abre `flores.html`, envía una respuesta incorrecta y otra correcta. Revisa ambas filas desde **Table Editor → intentos_contrasena**.

Las respuestas enviadas quedan visibles en el panel hasta que las borres. No se guardan IP, dispositivo ni texto escrito que no se haya enviado.

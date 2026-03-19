const btn = document.getElementById('btnBuscar');
        const resDiv = document.getElementById('resultado');

        btn.addEventListener('click', async () => {
            const origen = document.getElementById('origen').value.trim();
            const destino = document.getElementById('destino').value.trim();

            if (!origen || !destino) {
                mostrarError("Por favor, llena ambos campos.");
                return;
            }

            btn.disabled = true;
            btn.textContent = "Calculando...";
            resDiv.innerHTML = "";

            try {
                const response = await fetch('https://vuelos-bfs.onrender.com/api/buscar/', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ origen, destino })
                });

                const data = await response.json();

                if (response.ok && data.ruta) {
                    const rutaFormateada = data.ruta.join(' <span style="color:#94a3b8">→</span> ');
                    resDiv.innerHTML = `
                    <div class="ruta-exitosa">
                        <strong>Ruta sugerida:</strong><br>
                        <div style="margin-top:0.5rem; font-size:1.1rem;">${rutaFormateada}</div>
                    </div>
                `;
                } else {
                    mostrarError(data.error || "No existe una ruta disponible.");
                }
            } catch (error) {
                mostrarError("Error de conexión. Verifica que el servidor Django en Arch esté activo.");
            } finally {
                btn.disabled = false;
                btn.textContent = "Buscar Ruta Óptima";
            }
        });

        function mostrarError(mensaje) {
            resDiv.innerHTML = `
            <div class="error-msj">
                <strong>Aviso:</strong> ${mensaje}
            </div>
        `;
        }

        async function cargarCiudades() {
            try {
                const response = await fetch('https://vuelos-bfs.onrender.com/api/ciudades/');
                const data = await response.json();
                const contenedor = document.getElementById('lista-tags');

                contenedor.innerHTML = "";

                data.ciudades.forEach(ciudad => {
                    const span = document.createElement('span');
                    span.textContent = ciudad;
                    span.style.cssText = "background: #e2e8f0; padding: 2px 8px; border-radius: 4px; cursor: pointer;";

                    

                    contenedor.appendChild(span);
                });
            } catch (error) {
                console.error("Error cargando ciudades:", error);
            }
        }

        cargarCiudades();
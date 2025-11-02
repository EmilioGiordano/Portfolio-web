// ⚙️ CONFIGURACIÓN: Cambia esto por tu usuario de GitHub
const GITHUB_USERNAME = 'EmilioGiordano';

// Esperar a que el DOM esté cargado
document.addEventListener('DOMContentLoaded', function() {
    if (GITHUB_USERNAME && GITHUB_USERNAME.trim() !== '') {
        const contributionsImg = document.getElementById('github-contributions-img');
        const contributionsCount = document.querySelector('.contributions-count');
        
        if (contributionsImg) {
            // Usar un servicio que genere el gráfico directamente en escala de grises o modo oscuro
            // Servicio alternativo que genera gráficos más personalizables
            contributionsImg.src = `https://ghchart.rshah.org/${GITHUB_USERNAME}?scheme=dark`;
            contributionsImg.style.display = 'block';
            
            // Obtener el total de contribuciones usando múltiples servicios
            const fetchContributions = async () => {
                const countNumber = document.querySelector('.count-number');
                if (!countNumber) return;
                
                // Servicio 1: github-readme-stats API (puede incluir contribuciones)
                try {
                    const response = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}/events/public?per_page=1`);
                    // Este no da contribuciones directamente, pero intentemos otros servicios
                } catch (e) {
                    // Ignorar
                }
                
                // Servicio principal: github-contributions-api
                try {
                    const response = await fetch(`https://github-contributions-api.deno.dev/${GITHUB_USERNAME}.json`);
                    if (response.ok) {
                        const data = await response.json();
                        // El formato puede variar, intentemos diferentes propiedades
                        const total = data.totalContributions || data.contributions?.total || data.total;
                        if (total !== undefined) {
                            countNumber.textContent = total.toLocaleString();
                            return;
                        }
                    }
                } catch (e) {
                    // Continuar con otros servicios
                }
                
                // Servicio alternativo: Intentar obtener desde GitHub directamente usando SVG parsing
                try {
                    // Nota: Para obtener el número real necesitarías usar GitHub GraphQL API
                    // con un token, pero podemos intentar parsear el SVG del gráfico
                    const svgResponse = await fetch(`https://github.com/users/${GITHUB_USERNAME}/contributions`);
                    if (svgResponse.ok) {
                        const svgText = await svgResponse.text();
                        // Parsear el SVG para obtener contribuciones (complejo, mejor usar API)
                    }
                } catch (e) {
                    // Ignorar
                }
                
                // Si todos fallan, dejar mensaje en consola
                console.warn('⚠️ No se pudo obtener el número de contribuciones automáticamente.');
                console.info('💡 Actualiza manualmente el número en index.html línea ~73');
                console.info('   Cambia: <span class="count-number">0</span>');
                console.info('   Por ejemplo: <span class="count-number">878</span>');
            };
            
            // Ejecutar después de que la imagen se cargue
            fetchContributions();
        }
    } else {
        // Si no hay usuario configurado, ocultar el widget
        const githubSection = document.querySelector('.github-section');
        if (githubSection) {
            githubSection.style.display = 'none';
        }
    }
});
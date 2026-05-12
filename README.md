# 🌤️ Weather App - Ciudad de México

Aplicación web moderna para monitorear el clima en tiempo real en la Ciudad de México.

## Características

✨ **Funcionalidades Principales:**
- 🌡️ Temperatura actual, "sensible" y extremas
- 💨 Velocidad del viento y dirección
- 💧 Humedad y presión atmosférica
- 🌧️ Probabilidad de precipitación
- ⏰ Pronóstico por horas (24h)
- 📈 Gráficos interactivos de temperatura
- 🌅 Hora de salida y puesta del sol
- 📱 Diseño 100% responsivo
- 🎨 Interfaz moderna con Tailwind CSS
- 🔄 Actualización automática cada 10 minutos
- 🌙 Tema oscuro profesional

## Tecnologías Utilizadas

- **HTML5** - Estructura semántica
- **CSS3** - Tailwind CSS framework
- **JavaScript Vanilla** - Sin dependencias externas
- **OpenWeatherMap API** - Datos climáticos en tiempo real
- **Chart.js** - Gráficos interactivos

## Requisitos

1. Una API Key gratuita de [OpenWeatherMap](https://openweathermap.org/api)
   - Ir a https://openweathermap.org/api
   - Crear cuenta gratuita
   - Obtener tu API Key

2. Servidor web (local o en línea)

## Instalación y Uso

### Opción 1: Local (Sin servidor)

1. Clona este repositorio:
```bash
git clone https://github.com/tokiosan075577-wq/weather-app-cdmx.git
cd weather-app-cdmx
```

2. Abre `index.html` directamente en tu navegador

3. Ingresa tu API Key de OpenWeatherMap cuando se te pida

### Opción 2: Con servidor local (Recomendado)

```bash
# Con Python 3
python -m http.server 8000

# Con Node.js
npx http-server

# Con PHP
php -S localhost:8000
```

Luego accede a `http://localhost:8000`

### Opción 3: Desplegar en GitHub Pages

1. Ve a Settings > Pages
2. Selecciona `main` como rama fuente
3. La app estará disponible en `https://tokiosan075577-wq.github.io/weather-app-cdmx`

## Estructura del Proyecto

```
weather-app-cdmx/
├── index.html          # Página principal
├── styles/
│   └── style.css       # Estilos personalizados
├── js/
│   ├── weather.js      # Lógica principal
│   ├── ui.js           # Funciones de UI
│   └── storage.js      # Gestión de datos locales
└── README.md           # Este archivo
```

## Uso

1. Al abrir la app, introduce tu API Key de OpenWeatherMap
2. La clave se guardará en localStorage (local de tu navegador)
3. La app se actualizará automáticamente cada 10 minutos
4. Haz clic en "Actualizar Ahora" para forzar una actualización manual

## Cómo obtener API Key

1. Ve a https://openweathermap.org/api
2. Haz clic en "Sign Up"
3. Completa el registro (es gratis)
4. Ve a tu perfil > API Keys
5. Copia tu API Key predeterminada
6. ¡Úsala en la app!

## Características Avanzadas (Roadmap)

- [ ] Búsqueda de otras ciudades
- [ ] Historial de datos climáticos
- [ ] Notificaciones de alertas climáticas
- [ ] Integración con redes sociales
- [ ] Soporte offline (Service Workers)
- [ ] App instalable (PWA)
- [ ] Múltiples idiomas

## Contribuir

Las contribuciones son bienvenidas. Para cambios importantes, abre un issue primero.

## Licencia

MIT License - Libre para uso personal y comercial

## Autor

Creado por [tokiosan075577-wq](https://github.com/tokiosan075577-wq)

## Soporte

Si encuentras problemas:
1. Verifica tu API Key de OpenWeatherMap
2. Abre la consola del navegador (F12) para ver errores
3. Crea un issue en el repositorio

---

**Nota:** Esta aplicación utiliza datos de OpenWeatherMap.

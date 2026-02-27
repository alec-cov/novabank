🏦 NovaBank - Prototipo Fintech de Alta Fidelidad
NovaBank es una aplicación móvil de servicios financieros desarrollada con React Native y Expo, diseñada para simular una experiencia bancaria completa, inmersiva y segura. El proyecto se centra en la gestión de estado global, interfaces de usuario dinámicas y la integración de servicios simulados de alta complejidad.

🛠 Tech Stack
Core: React Native, Expo SDK 52.
Lenguaje: TypeScript / JavaScript.
Navegación: Expo Router (Stack Navigation).
Estado: React Context API (Gestión global de saldos, transacciones y seguridad).
Mapas: React Native Maps (Google Maps Provider).
UI/UX: Animated API (Transiciones complejas), Linear Gradient, Modals nativos.

✨ Funcionalidades Clave

1. Seguridad Biométrica Simulada:

- Login con animación de "escaneo FaceID" y transición de apertura (Splash reveal).
- Persistencia de la última hora de acceso en el Dashboard.

2. Gestión de Cuentas en Tiempo Real:

- Dashboard Vivo: Actualización instantánea de saldos tras operaciones.
- Bloqueo de Tarjetas: Toggle persistente que cambia el estado y la UI (color rojo/alerta) de las tarjetas de crédito.
- Historial Transaccional: Lista dinámica (FlatList) con inyección de movimientos nuevos.

3. Operaciones Financieras:

- Pagos Inteligentes: Cálculo de deuda y abono a capital en tarjetas de crédito.

- Retiros sin Tarjeta: Generación de códigos temporales de retiro.

- Validaciones: Lógica de negocio para prevenir transferencias con fondos insuficientes.

4. Geolocalización Avanzada:

- Mapa interactivo con marcadores (Pines) personalizados con diseño CSS-in-JS y logotipos de marca.

# Boutique OS Landing

Landing separado para vender Boutique OS sin mezclar marketing con el panel SaaS.

## Estructura

- `index.html`: pagina principal
- `demo.html`, `planes.html`, `recorrido.html`: paginas secundarias del landing
- `assets/css/styles.css`: estilos compartidos
- `assets/js/script.js`: animaciones del landing principal
- `assets/js/recorrido.js`: interaccion del recorrido
- `assets/img/logo.png`: logotipo
- `assets/img/screens/`: capturas del sistema

## Probar local

```bash
cd /home/osmariqv/BoutiqueOs-Landing
python -m http.server 8081
```

Luego abre `http://localhost:8081`.

Demo publicada del sistema:

- `https://boutique-e1ayjuswh-osmarquinteros-projects.vercel.app`

## Siguiente paso recomendado

- conectar dominio principal aqui
- dejar el panel en `app.tudominio.com`
- revisar que los CTAs del landing sigan apuntando a la URL final publicada

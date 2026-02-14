# Laudo Médico — App (React + Vite)

Pequeno app para visualizar e compartilhar laudos médicos.

Setup rápido:

1. Instale dependências:

```bash
cd "c:/Users/DJWOM/Desktop/LAUDO MEDICO"
npm install
```

2. Rodar em desenvolvimento:

```bash
npm run dev
```

3. Build:

```bash
npm run build
npm run preview
```

Notas:
- O PDF `laudo.pdf` deve estar na mesma pasta `public` ou na raiz do projeto para que o iframe e o botão de download funcionem. No modo de desenvolvimento, copie `laudo.pdf` para a pasta do projeto raiz.
- Você pode editar os arrays em `src/App.jsx` para ajustar medicamenots permitidos/proibidos.

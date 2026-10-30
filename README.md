# 🍔 EasyFood

> Portal web interativo e moderno para gestão e consulta de restaurantes, desenvolvido como projeto acadêmico para a faculdade **FECAF**, na disciplina de **Arquitetura de Software e Design Patterns**.

---

## 🚀 Sobre o Projeto

O **EasyFood** simula um ecossistema de delivery (estilo dashboard corporativo/iFood) que permite aos usuários consultarem estabelecimentos em destaque, realizarem autenticação segura e gerenciarem o catálogo de restaurantes de forma dinâmica e assíncrona.

---

## 🛠️ Tecnologias Utilizadas

Este projeto foi construído utilizando a seguinte pilha tecnológica:

- **Frontend:** HTML5, CSS3 Moderno (CSS Custom Properties, Grid, Flexbox e Design Responsivo), JavaScript Vanilla (ES6+).
- **Backend:** Node.js com Express (API REST).
- **Banco de Dados:** PostgreSQL.
- **ORM:** Prisma.
- **Autenticação:** JSON Web Token (JWT) com persistência de sessão via `localStorage`.
- **Upload de Arquivos:** Multer.
- **Controle de Versão:** Git e GitHub.

---

## ✨ Funcionalidades

- **Consulta Pública de Restaurantes:** Listagem de estabelecimentos com indicação de notas avaliativas e emojis dinâmicos categorizados automaticamente.
- **Autenticação de Usuários:** Sistema de Login e Registro com ocultação inteligente de formulários e exibição de cartão de sessão ativa.
- **Painel Administrativo Protegido:** Operações de cadastro, edição e exclusão de restaurantes e pratos restritas a usuários autenticados via Token.
- **Interface Otimizada:** Layout moderno com rolagem controlada e feedback visual em tempo real.

---

## ⚙️ Como Executar o Projeto Localmente

Siga os passos abaixo para clonar e rodar a aplicação na sua máquina:

1. **Clone o repositório:**
   ```bash
   git clone [https://github.com/Igorfalvess/easy-food.git](https://github.com/Igorfalvess/easy-food.git)
   cd easy-food


2. Instale as dependências:
- **Bash:** npm install

3.  Configure as Variáveis de Ambiente:
Crie um arquivo .env na raiz do projeto com base na sua configuração do PostgreSQL e defina sua chave secreta para o JWT:
- **Snippet de código:** DATABASE_URL="postgresql://seu_usuario:sua_senha@localhost:5432/easyfood?schema=public"
JWT_SECRET="sua_chave_secreta_super_segura"

4.  Execute as Migrations do Banco de Dados:
- **Bash:** npx prisma migrate dev

5.  Inicie o servidor:
- **Bash:** npm start
O servidor estará rodando localmente.

---
## 🖼️ Upload e disponibilização de imagens
- **O backend utiliza o middleware express.static para disponibilizar as imagens enviadas durante o cadastro de pratos e restaurantes.:** 
*  Diretório de armazenamento: uploads/, localizado na raiz do projeto.
*  Rota pública: /uploads/:nomeDoArquivo.
*  Configuração: O middleware está definido em src/app.js, utilizando path.join(__dirname, "../uploads").
*  Acesso: Após o upload, a imagem pode ser consultada por meio da URL retornada pela API, combinada com o endereço base do servidor.

---

## Validação:
- **A disponibilização dos arquivos foi validada localmente com uma requisição HTTP que retornou 200 OK para uma imagem armazenada no diretório uploads/.:** 

*  Observação: A disponibilização estática dos arquivos não significa, por si só, que o processamento de imagens via FaaS esteja concluído. Essa integração deve ser documentada conforme sua implementação efetiva (vide ADR-001).

---

## Autor:
- **Desenvolvido por Igor F. Alves.** 

---
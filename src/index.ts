import express from "express";
import { ApolloServer } from "apollo-server-express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./config/database";
import { typeDefs } from "./graphql/typeDefs";
import { resolvers } from "./graphql/resolvers";
import { getUser } from "./middleware/auth";

dotenv.config();

const startServer = async () => {
  await connectDB();

  const app = express();

  app.use(cors());
  app.use(express.json());

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => {
      const token = req.headers.authorization || "";
      const user = getUser(token);
      return { user };
    },
    formatError: (error) => {
      console.error("GraphQL Error:", error);
      return error;
    },
  });

  await server.start();
  server.applyMiddleware({ app, path: "/graphql" });

  const PORT = Number(process.env.PORT) || 4000;
  const HOST = process.env.HOST || "127.0.0.1";

  // tryListen: retourne une promesse qui résout l'instance serveur ou rejette l'erreur
  const tryListen = (port: number, host: string) =>
    new Promise<NodeJS.Timer>((resolve, reject) => {
      const inst = app.listen(port, host, () =>
        resolve(inst as unknown as NodeJS.Timer)
      );
      inst.on("error", (err: NodeJS.ErrnoException) => reject(err));
    });

  // tenter plusieurs ports si erreur EACCES/EADDRINUSE
  const listenWithFallback = async () => {
    const candidates = [PORT, PORT + 1, 0]; // 0 => port aléatoire
    for (const p of candidates) {
      try {
        const inst = await tryListen(p, HOST);
        const actualPort = (inst as any).address
          ? (inst as any).address().port
          : p;
        console.log(
          `🚀 Serveur démarré sur http://localhost:${actualPort}${server.graphqlPath}`
        );
        return inst;
      } catch (err: any) {
        console.error(`Échec écoute ${HOST}:${p} ->`, err.code || err.message);
        if (err.code !== "EACCES" && err.code !== "EADDRINUSE") {
          throw err;
        }
      }
    }
    throw new Error(
      `Impossible d'écouter sur les ports candidats (${candidates.join(", ")})`
    );
  };

  try {
    await listenWithFallback();
  } catch (err) {
    console.error("Échec du démarrage du serveur:", err);
    process.exit(1);
  }
};

startServer().catch((error) => {
  console.error("❌ Erreur au démarrage du serveur:", error);
  process.exit(1);
});

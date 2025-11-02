"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const apollo_server_express_1 = require("apollo-server-express");
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const database_1 = require("./config/database");
const typeDefs_1 = require("./graphql/typeDefs");
const resolvers_1 = require("./graphql/resolvers");
const auth_1 = require("./middleware/auth");
dotenv_1.default.config();
const startServer = async () => {
    await (0, database_1.connectDB)();
    const app = (0, express_1.default)();
    app.use((0, cors_1.default)());
    app.use(express_1.default.json());
    const server = new apollo_server_express_1.ApolloServer({
        typeDefs: typeDefs_1.typeDefs,
        resolvers: resolvers_1.resolvers,
        context: ({ req }) => {
            const token = req.headers.authorization || "";
            const user = (0, auth_1.getUser)(token);
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
    const tryListen = (port, host) => new Promise((resolve, reject) => {
        const inst = app.listen(port, host, () => resolve(inst));
        inst.on("error", (err) => reject(err));
    });
    // tenter plusieurs ports si erreur EACCES/EADDRINUSE
    const listenWithFallback = async () => {
        const candidates = [PORT, PORT + 1, 0]; // 0 => port aléatoire
        for (const p of candidates) {
            try {
                const inst = await tryListen(p, HOST);
                const actualPort = inst.address
                    ? inst.address().port
                    : p;
                console.log(`🚀 Serveur démarré sur http://localhost:${actualPort}${server.graphqlPath}`);
                return inst;
            }
            catch (err) {
                console.error(`Échec écoute ${HOST}:${p} ->`, err.code || err.message);
                if (err.code !== "EACCES" && err.code !== "EADDRINUSE") {
                    throw err;
                }
            }
        }
        throw new Error(`Impossible d'écouter sur les ports candidats (${candidates.join(", ")})`);
    };
    try {
        await listenWithFallback();
    }
    catch (err) {
        console.error("Échec du démarrage du serveur:", err);
        process.exit(1);
    }
};
startServer().catch((error) => {
    console.error("❌ Erreur au démarrage du serveur:", error);
    process.exit(1);
});

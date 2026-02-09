import { defineConfig } from 'drizzle-kit';



export default defineConfig({
                                out          : './drizzle',
                                schema       : './src/orm/drizzle/drizzle-sqlite/schema/index.ts',
                                dialect      : 'sqlite',
                                dbCredentials: {
                                    url: (process.env.SQLITE_DATABASE_URL as string) ?? 'file:./local.db',
                                },
                            });

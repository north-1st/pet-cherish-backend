import "@prisma/client";

declare global {
  namespace Express {
    interface User {
      id: string;
    }
  }
}

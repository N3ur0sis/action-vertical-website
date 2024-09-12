-- CreateTable
CREATE TABLE "NavbarItem" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "route" TEXT,
    "order" INTEGER NOT NULL,
    "parentId" INTEGER,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "NavbarItem_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "NavbarItem" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
